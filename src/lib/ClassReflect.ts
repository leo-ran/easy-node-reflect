import {InstanceReflect} from "./InstanceReflect";
import {AbstractClassDecorator} from "./AbstractClassDecorator";
import {MethodReflect} from "./MethodReflect";
import {PropertyReflect} from "./PropertyReflect";
import {BaseConstructor} from "../interface";
import {
  parseClassReflectInstanceMembers,
  parseClassReflectMetadata,
  parseClassReflectStaticMembers
} from "./funcs/public";
import {ParameterReflect} from "./ParameterReflect";


const classReflectCache: Map<BaseConstructor, ClassReflect<any>> = new Map();

/**
 * 类反射
 */
export class ClassReflect<T extends BaseConstructor = any> {
  protected constructor(
    protected _target: T,
    public parent?: ClassReflect<any>,
  ) {
    // 解析元数据
    parseClassReflectMetadata(this);
    // 解析实例成员装饰器
    parseClassReflectInstanceMembers(this);
    // 解析静态成员装饰器
    parseClassReflectStaticMembers(this);

    /**
     * 继承父类提供的服务
     */
    if (parent &&  parent instanceof ClassReflect) {
      parent._publicProvider.forEach((value, key) => {
        this._publicProvider.set(key, value);
      })
    }
  }

  /**
   * 公开提供的服务
   * 公开提供的服务子ClassReflect可以直接访问和继承
   */
  private _publicProvider: Map<object, object> = new Map();

  /**
   * 私有提供服务
   * 私有提供服务只提供给当前ClassReflect 子ClassReflect不能访问和继承
   */
  private _privateProvider: Map<object, object> = new Map();

  /**
   * 根据命名空间来提供依赖
   */
  private _namespaceProvider:  Map<object, object> = new Map();


  /**
   * 获取公共服务
   * @param key
   */
  public getPublicProvider<V extends object> (key: object): V | undefined {
    return this._publicProvider.get(key) as V;
  }

  /**
   * 获取私有服务
   * @param key
   */
  public getPrivateProvider<V extends object>(key: object): V | undefined {
    return this._publicProvider.get(key) as V;
  }

  /**
   * 设置公共服务
   * @param key
   * @param value
   */
  public setPublicProvider<K extends object, V extends object>(key: K, value: V): this {
    this._publicProvider.set(key, value);
    return this;
  }

  /**
   * 设置私有服务
   * @param key
   * @param value
   */
  public setPrivateProvider<K extends object, V extends object>(key: K, value: V): this {
    this._publicProvider.set(key, value);
    return this;
  }


  /**
   * 获取 `ClassReflect` 的目标
   */
  public getTarget(): T {
    return this._target;
  }

  /**
   * 获取 `ClassReflect` 的目标类的 名称
   */
  public getTargetName(): string {
    return this._target.name;
  }

  /**
   * 获取 `ClassReflect` 的原型链
   */
  public getOwnTarget<T>(): T {
    return this._target.prototype;
  }

  /**
   * 获取 `ClassReflect` 的原型链
   */
  public getOwnTargetName(): string {
    return this._target.prototype.name;
  }

  private _superClass?: ClassReflect<any>;

  /**
   * 元数据列表
   */
  public metadata: AbstractClassDecorator[] = [];

  /**
   * 实例成员映射
   */
  public instanceMembers: Map<string|symbol, MethodReflect | PropertyReflect> = new Map();

  /**
   * 静态成员映射
   */
  public staticMembers: Map<string|symbol, MethodReflect | PropertyReflect> = new Map();

  /**
   * 获取构造函数的reflect
   */
  public get constructorMethodReflect(): MethodReflect {
    return <MethodReflect>(this.instanceMembers.get("constructor"));
  }

  /**
   * target 实例化
   * @param callback
   */
  public async newInstance(positionalArguments: any[]): Promise<InstanceReflect<InstanceType<T>>> {

    positionalArguments = positionalArguments  = [];

    // 类的装饰器列表
    const metadata = this.metadata;
    const length = metadata.length;

    // 获取类的构造函数 反射对象
    const methodReflect = this.constructorMethodReflect;
    if (methodReflect instanceof MethodReflect) {
      // 获取methodReflect中的所有参数元数据
      const parameters = methodReflect.parameters;
      // 参数的个数
      const parametersLength = parameters.length;
      // 循环所有参数 得到参数的装饰器列表
      // 一个参数可以有多个装饰器
      for (let p = 0; p < parametersLength; p++) {
        const parameterReflect = parameters[p];
        let value = positionalArguments[parameterReflect.parameterIndex] =  this._privateProvider.get(parameterReflect.type) || this._privateProvider.get(parameterReflect.type);
        positionalArguments[parameterReflect.parameterIndex] = await parameterReflect.handlerInject(this, methodReflect, null, value);
      }
    }

    const instanceReflect = Reflect.construct(this._target, positionalArguments);

    // 循环所有类装饰器
    for (let i = 0; i < length; i++) {
      const classDecorator = metadata[i];
      if (typeof classDecorator.onNewInstanced === "function") {
        classDecorator.onNewInstanced(this, instanceReflect);
      }
    }

    return instanceReflect;
  }

  /**
   * 便利构造函数
   * @param callback
   */
  public mapConstructorParameter(callback: (parameterReflect: ParameterReflect) => void): void {
    // 获取类的构造函数 反射对象
    const methodReflect = this.constructorMethodReflect;
    if (methodReflect instanceof MethodReflect && typeof callback === "function") {
      methodReflect.parameters.map((v) => callback(v));
    }
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
   * 创建ClassReflect实例
   * @param target 目标类
   */
  static create<T extends BaseConstructor>(target: T, parent?: ClassReflect<any>): ClassReflect<T> {
    // 添加缓存处理
    const classReflect = classReflectCache.get(target) || (parent ? new ClassReflect<T>(target, parent) : new ClassReflect<T>(target));
    classReflectCache.set(target, classReflect);
    return classReflect;
  }
}