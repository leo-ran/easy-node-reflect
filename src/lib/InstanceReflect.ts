import {ClassReflect} from "./ClassReflect";
import {MethodReflect} from "./MethodReflect";
import {PropertyReflect} from "./PropertyReflect";
import {AbstractMethodDecorator} from "./AbstractMethodDecorator";
import {ParameterReflect} from "./ParameterReflect";
import {AbstractParameterDecorator} from "./AbstractParameterDecorator";
import {InjectMap} from "./InjectMap";

const instanceReflectCache: Map<object, InstanceReflect<any>> = new Map();

export class InstanceReflect<T extends object> {
  public parent: ClassReflect<any>;
  protected constructor(
    public instance: T,
  ) {
    // @ts-ignore
    this.parent = ClassReflect.create(instance.__proto__);
  }

  /**
   * Get metadata member value.
   * @param fieldName
   */
  public async getField<K extends keyof T>(fieldName: K): Promise<T[K]> {
    const {parent} = this;
    let value = this.instance[fieldName];
    const propertyReflect = parent.instanceMembers.get(fieldName as string) || parent.staticMembers.get(fieldName as string);
    if (propertyReflect instanceof PropertyReflect) {
      const propertyReflectMetadata = propertyReflect.metadata;
      const length = propertyReflectMetadata.length;
      for (let i = 0; i < length; i++) {
        const metadata = propertyReflect.metadata[i];
        if (typeof metadata.onGetValue === "function") {
          value = await metadata.onGetValue<T[K]>(propertyReflect, value);
        }
      }
    }

    return value;
  }

  /**
   * In metadata member set member value.
   * @param fieldName
   * @param value
   */
  public async setField<K extends keyof T>(fieldName: K, value: T[K]) {
    const {parent} = this;
    const propertyReflect = parent.instanceMembers.get(fieldName as string) || parent.staticMembers.get(fieldName as string);
    if (propertyReflect instanceof PropertyReflect) {
      const propertyReflectMetadata = propertyReflect.metadata;
      const length = propertyReflectMetadata.length;
      for (let i = 0; i < length; i++) {
        const metadata = propertyReflect.metadata[i];
        if (typeof metadata.onSetValue === "function") {
          this.instance[fieldName] = await metadata.onSetValue<T[K]>(propertyReflect, value);
        }
      }
    } else {
      this.instance[fieldName] = value;
    }
  }

  /**
   * 调用实例方法
   * @param memberName 成员名称
   * @param positionalArgumentsCallback 参数
   */
  public async invoke<K extends keyof T, V>(memberName: K, injectMap: InjectMap): Promise<void | V> {
    const func = this.instance[memberName];
    const {parent} = this;

    // 检测是否为函数
    if (typeof func !== "function") throw new Error(`The member "${memberName}", is not function.`);
    // 检测classReflect是否存在
    if (!parent) throw new Error(`This reflect is not parent.`);

    // 获取方法的反射对象
    const methodReflect = parent.instanceMembers.get(<string>memberName) || parent.staticMembers.get(<string>memberName);
    // 判断反射对象是否存在
    if (methodReflect instanceof MethodReflect) {
      // 函数调用时的参数列表
      let args: any[] = [];
      // 函数执行后的返回值
      let value: any = undefined;

      // 方法反射对象上的 参数装饰器列表
      const parameters = methodReflect.parameters;
      const parameterLength = parameters.length;
      for (let i = 0; i < parameterLength; i++) {
        const parameterReflect: ParameterReflect = parameters[i];
        let v: any = undefined;
        if (injectMap instanceof Map) {
          v = injectMap.get(parameterReflect.type);
        }
        const prms = parameterReflect.metadata;
        const prmsLength = prms.length;
        for (let a = 0; a < prmsLength; a++) {
          const ir = prms[a];
          if (ir instanceof AbstractParameterDecorator) {
            // 如果不存在钩子 直接跳出
            if(!(typeof ir.onInject === "function")) return;
            v = await ir.onInject(parameterReflect, v);
          }
        }
        args[parameterReflect.parameterIndex] = v;
      }

      // MethodReflect上的所有装饰器元数据列表
      const methodReflectMetadata = methodReflect.metadata;
      // MethodReflect上的所有装饰器元数据总数
      const mrLength = methodReflectMetadata.length;

      // 方法调用前回调
      for (let i = 0; i < mrLength; i++) {
        const methodDecorator = methodReflectMetadata[i];
        if (methodDecorator instanceof AbstractMethodDecorator) {
          if (typeof methodDecorator.onBeforeInvoke === "function") {
            value = await methodDecorator.onBeforeInvoke(methodReflect, injectMap);
          }
        }
      }

      // 执行函数
      value = func.apply(this.instance, args);

      // 遍历方法包含的装饰器
      for (let i = 0; i < mrLength; i++) {
        const methodDecorator = methodReflectMetadata[i];
        if (methodDecorator instanceof AbstractMethodDecorator) {
          if (typeof methodDecorator.onInvoked === "function") {
            value = await methodDecorator.onInvoked(methodReflect, value);
          }
        }
      }

      return value;
    } else {
      return func.apply(this.instance, []);
    }
  }

  /**
   * 比较实例类型
   * @param other
   */
  public instanceOf<T extends Function>(other: T): boolean {
    return this.instance instanceof other;
  }

  static create<T extends object>(metadata: T): InstanceReflect<T> {
    // 添加缓存处理
    const instance = instanceReflectCache.get(metadata) || new InstanceReflect<T>(metadata);
    instanceReflectCache.set(metadata, instance);
    return instance;
  }
}

/**
 * 映射实例
 * @param o
 */
export function reflectInstance<T extends object>(o: T): InstanceReflect<T> | undefined {
  return instanceReflectCache.get(o);
}