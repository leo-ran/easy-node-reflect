import {InstanceReflect} from "./InstanceReflect";
import {AbstractClassDecorator} from "./AbstractClassDecorator";
import {MethodReflect} from "./MethodReflect";
import {PropertyReflect} from "./PropertyReflect";
import {ClassSet} from "./ClassSet";
import {AbstractMethodDecorator} from "./AbstractMethodDecorator";
import {AbstractPropertyDecorator} from "./AbstractPropertyDecorator";
import {AbstractParameterDecorator} from "./AbstractParameterDecorator";
import {BaseConstructor, BaseDecorator, NewInstanceCallback} from "../interface";

/**
 * 类反射
 */
export class ClassReflect<T extends BaseConstructor = any> {
  constructor(
    protected _target: T,
    public parent?: ClassReflect<any>,
  ) {
    // 解析元数据
    ClassReflect.parseMetadata(this);
    // 解析实例成员装饰器
    ClassReflect.parseInstanceMembers(this);
    // 解析静态成员装饰器
    ClassReflect.parseStaticMembers(this);
  }

  /**
   * `_target`类的服务提供映射
   * 用于在实例化 `_target`注入参数的类型=>参数映射关系查找
   */
  public provider: Map<object, object> = new Map();

  /**
   * 获取 `ClassReflect` 的目标
   */
  public getTarget() {
    return this._target.prototype;
  }

  /**
   * 获取 `ClassReflect` 的目标类的 名称
   */
  public getTargetName(): string {
    return this._target.name;
  }

  private _superClass?: ClassReflect<any>;

  /**
   * 元数据列表
   */
  public metadata: InstanceReflect<AbstractClassDecorator>[] = [];

  /**
   * 实例成员映射
   */
  public instanceMembers: Map<string|symbol, MethodReflect | PropertyReflect> = new Map();

  /**
   * 静态成员映射
   */
  public staticMembers: Map<string|symbol, MethodReflect | PropertyReflect> = new Map();

  /**
   * target 实例化
   * @param callback
   */
  public newInstance(callback: NewInstanceCallback): InstanceReflect<InstanceType<T>> {
    let positionalArguments: any[] = [];
    this.metadata.forEach(item => {
      if (typeof item.metadata.onNewInstance === "function") {
        // 实例化前 给装饰器 传递实例
        const methodReflect = this.instanceMembers.get("constructor");
        if (methodReflect instanceof MethodReflect) {
          const injectMap = item.metadata.onNewInstance(methodReflect);
          injectMap.forEach((_obj, key) => {
            this.provider.set(key, _obj);
          });
          positionalArguments = callback(this, methodReflect.parameters);
        }
      }
    });
    const instanceReflect = new InstanceReflect<T>(Reflect.construct(this._target, positionalArguments));
    this.metadata.forEach(item => {
      if (typeof item.metadata.onNewInstanced === "function") {
        // 实例化后 给装饰器 传递实例
        item.metadata.onNewInstanced(instanceReflect as InstanceReflect<BaseDecorator>);
      }
    });
    return instanceReflect as InstanceReflect<InstanceType<T>>;
  }

  /**
   * 父类反射
   */
  public get superClass(): any {
    if (!this._superClass && this._target.__proto__) {
      this._superClass = new ClassReflect<any>(this._target.__proto__);
    }
    return this._superClass;
  }

  /**
   * 解析元数据
   * @param classReflect
   */
  static parseMetadata<T extends BaseConstructor>(classReflect: ClassReflect<T>) {
     const classSet = AbstractClassDecorator.getMetadata(classReflect._target);
     if (classSet instanceof ClassSet) {
     classReflect.metadata = Array.from(classSet).map(metadata => {
         return new InstanceReflect<AbstractClassDecorator>(metadata);
       })
     }

  }

  /**
   * 解析类的 实例成员
   * @param classReflect
   */
  static parseInstanceMembers<T extends BaseConstructor>(classReflect: ClassReflect<T>): void {
    const target = classReflect.getTarget();
    const methodKeys = AbstractMethodDecorator.getPropertyKeys(target);
    const propertyKeys = AbstractPropertyDecorator.getPropertyKeys(target);
    const parameterKeys = AbstractParameterDecorator.getPropertyKeys(target);

    const list: Array<string | symbol> = ['constructor'];

    // 遍历方法列表
    if (methodKeys) {
      list.push(...Array.from(methodKeys));
    }

    // 修复 methodKeys 在没有装饰器的时候不能循环
    list.forEach(key => {
      const methodReflect = new MethodReflect(
        classReflect,
        key
      );
      classReflect.instanceMembers.set(key, methodReflect);
    });

    // 遍历成员列表
    if (propertyKeys) {
      Array.from(propertyKeys).forEach(key => {
        const propertyReflect = new PropertyReflect(
          classReflect,
          key
        );
        classReflect.instanceMembers.set(key, propertyReflect);
      })
    }

    // parameterKeys
    if (parameterKeys) {
      Array.from(parameterKeys).forEach(key => {
        if (!classReflect.instanceMembers.has(key)) {
          const methodReflect = new MethodReflect(
            classReflect,
            key
          );
          classReflect.instanceMembers.set(key, methodReflect);
        }
      })
    }
  }


  /**
   * 解析类的静态成员
   * @param classReflect
   */
  static parseStaticMembers<T extends BaseConstructor>(classReflect: ClassReflect<T>): void {
    const methodKeys = AbstractMethodDecorator.getPropertyKeys(classReflect._target);
    const propertyKeys = AbstractPropertyDecorator.getPropertyKeys(classReflect._target);
    // 遍历方法列表
    if (methodKeys) {
      Array.from(methodKeys).forEach(key => {
        const methodReflect = new MethodReflect(
          classReflect,
          key,
          true,
        );
        classReflect.staticMembers.set(key, methodReflect);
      })
    }

    // 遍历成员列表
    if (propertyKeys) {
      Array.from(propertyKeys).forEach(key => {
        const propertyReflect = new PropertyReflect(
          classReflect,
          key,
          true,
        );
        classReflect.staticMembers.set(key, propertyReflect);
      })
    }
  }
}