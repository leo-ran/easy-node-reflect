import {ClassReflect} from "./ClassReflect";
import {ParameterReflect} from "./ParameterReflect";
import {AbstractMethodDecorator} from "./AbstractMethodDecorator";
import {parseMethodReflectMetadata, parseMethodReflectParameters, parseMethodReflectReturnType} from "./funcs/public";
import {InstanceReflect} from "./InstanceReflect";
import {BaseDecorator, DecoratorFactory} from "../interface";
import {InjectMap} from "./InjectMap";

const methodReflectCache: Map<ClassReflect, Map<string|symbol, MethodReflect>> = new Map();

export class MethodReflect<R extends Function = any> {

  private _metadata?: Array<AbstractMethodDecorator>;

  /**
   * 元数据列表
   */
  public get metadata(): Array<AbstractMethodDecorator> {
    // 懒加载 缓存处理
    if (!this._metadata) {
      this._metadata = [];
      parseMethodReflectMetadata(this);
    }
    return this._metadata;
  }
  public set metadata(value) {
    this._metadata = value;
  }

  public isGetter: boolean = false;
  public isSetter: boolean = false;

  public isConstructor: boolean = this.propertyKey === 'constructor';

  /**
   * 参数列表
   */
  public parameters: Array<ParameterReflect> = [];

  public returnType: R;

  protected constructor(
    public parent: ClassReflect<any>,
    public propertyKey: string | symbol,
    public isStatic: boolean = false
  ) {
    const target =  this.isStatic ? this.getTarget() : this.getOwnTarget();
    if (!target) return;
    parseMethodReflectParameters(this);
    parseMethodReflectReturnType(this);
    const descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
    if (descriptor) {
      this.isGetter = typeof descriptor.get === "function";
      this.isSetter = typeof descriptor.set === "function";
    }
  }

  public getTarget() {
    return this.parent.getTarget();
  }

  public getOwnTarget() {
    return this.parent.getOwnTarget();
  }

  /**
   * 检测是否包含装饰器
   * @param decorator
   */
  public hasDecorator(decorator: DecoratorFactory<any, any, any>): boolean {
    return Boolean(
      this.metadata.find((d) => {
        return d instanceof decorator.class
      })
    );
  }

  /**
   * 查找是否有包含 `type` 的参数
   * @param type
   */
  public hasType(type: object): boolean {
    return Boolean(
      this.parameters.find(item => item.type === type)
    );
  }

  /**
   * 查找是否包含 `decorator` 装饰器
   * @param decorator
   */
  public hasParameterDecorator(decorator: DecoratorFactory<any, any, any>): boolean {
    return Boolean(
      this.parameters.find((p) => {
        return p.metadata.find(d => d instanceof decorator.class)
      })
    );
  }

  public async handlerBeforeInvoke(injectMap: InjectMap) {
    const metadata = this.metadata;
    const length = metadata.length;
    for (let i = 0; i < length; i++) {
      const methodDecorator = metadata[i];
      if (methodDecorator instanceof  AbstractMethodDecorator && typeof methodDecorator.onBeforeInvoke === "function") {
        await methodDecorator.onBeforeInvoke(this, injectMap);
      }
    }
  }

  /**
   * 处理函数调用后的元数据回调
   * @param classReflect
   * @param instanceReflect
   * @param value
   */
  public async handlerReturn<T>(value: T): Promise<T> {
    const metadata = this.metadata;
    const length = metadata.length;
    for (let i = 0; i < length; i++) {
      const methodDecorator = metadata[i];
      if (methodDecorator instanceof  AbstractMethodDecorator && typeof methodDecorator.onInvoked === "function") {
        value = await methodDecorator.onInvoked<T>(this, value);
      }
    }
    return value;
  }

  static create<R extends Function = any>(parent: ClassReflect<any>, propertyKey: string | symbol, isStatic: boolean = false): MethodReflect<R> {
    // 添加缓存处理
    const methodReflectMaps = methodReflectCache.get(parent) || new Map<string|symbol, MethodReflect>();
    const methodReflect = methodReflectMaps.get(propertyKey) || new MethodReflect<any>(parent, propertyKey, isStatic);
    methodReflectMaps.set(propertyKey, methodReflect);
    methodReflectCache.set(parent, methodReflectMaps);
    return methodReflect;
  }
}

export interface MethodReflectMapParameterCallback<T = any> {
  async (): Promise<T>;
}

/**
 * 映射方法
 * @param classReflect 类映射对象
 * @param key 方法的名称
 */
export function reflectMethod<T extends Function = any>(classReflect: ClassReflect, key: string | symbol): MethodReflect<T> | undefined {
  const maps = methodReflectCache.get(classReflect);
  if (maps) return maps.get(key);
}