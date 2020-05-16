import {InstanceReflect} from "./InstanceReflect";
import {AbstractClassDecorator} from "./AbstractClassDecorator";
import {MethodReflect} from "./MethodReflect";
import {PropertyReflect} from "./PropertyReflect";
import {BaseConstructor, DecoratorFactory} from "../interface";
import {
  parseClassReflectInstanceMembers,
  parseClassReflectMetadata,
  parseClassReflectStaticMembers
} from "./funcs/public";
import {InjectMap} from "./InjectMap";


const classReflectCache: Map<BaseConstructor, ClassReflect<any>> = new Map();

/**
 * 类反射
 */
export class ClassReflect<T extends BaseConstructor = any> {
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
  private get constructorMethodReflect(): MethodReflect {
    return <MethodReflect>(this.instanceMembers.get("constructor"));
  }

  /**
   * @param _target 目标类
   * @param parent 父ClassReflect
   */
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
  }

  /**
   * 提供给子Reflect的服务
   */
  private _provider: Map<object, object> = new Map();

  /**
   * 查找服务
   * @param key 服务的key
   * @param _extends 是否继承父级服务提供
   */
  public getProvider<K extends object, V extends object>(key: K, _extends?: boolean): V | undefined {
    const value: V = this._provider.get(key) as V;
    // 如果继承父级服务提供则 递归父级服务
    if (!value && this.parent && _extends) {
      return this.parent.getProvider<K, V>(key, _extends);
    }
    return value;
  }

  /**
   * 设置服务
   * @param key 服务的key
   */
  public setProvider<K extends object, V extends object>(key: K, value: V): this {
    this._provider.set(key, value)
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

  /**
   * 检测是否包含装饰器
   * @param decorator
   */
  public hasDecorator(decorator: DecoratorFactory<any, any, any>): boolean {
    return Boolean(
      this.metadata.find((d) => {
        if (typeof  decorator === "function") {
          return d === decorator.class
        }
      })
    );
  }

  /**
   * 实例化当前目标类
   * 此方法为异步创建，考虑到同步创建 无法注入一些异步的驱动
   */
  public async newInstance(): Promise<InstanceReflect<InstanceType<T>>> {
    const classDecorators = this.metadata;
    const classDecoratorLength = classDecorators.length;

    // 循环初始依赖
    for (let i = 0; i < classDecoratorLength; i++) {
      const classDecorator = classDecorators[i];
      if (classDecorator instanceof  AbstractClassDecorator && typeof classDecorator.onTargetBeforeInstance === "function") {
        await classDecorator.onTargetBeforeInstance(this);
      }
    }

    const positionalArguments: any[] = [];
    // 获取构造函数反色对象
    const {constructorMethodReflect} = this;
    const parameters = constructorMethodReflect.parameters;
    const parameterLength = parameters.length;
    for (let i = 0; i < parameterLength; i++) {
      const parameterReflect = parameters[i];
      // 获取服务里提供的对应服务作为注入的value值
      // 注入顺序为
      let value = this.getProvider(parameterReflect.type);
      // 使用参数装饰器钩子
      value = await parameterReflect.handlerInject(InjectMap.from(this._provider), value);
      // 注入到参数中
      positionalArguments[parameterReflect.parameterIndex] = value;
    }
    // 得到实例
    const instance = InstanceReflect.create(
      Reflect.construct(this._target, positionalArguments)
    );
    // 通知所有的类装饰器 实例创建完毕
    this.metadata.forEach((classDecorator) => {
      if (typeof classDecorator.onTargetInstanced === "function") classDecorator.onTargetInstanced(this, instance);
    })
    // 返回实例
    return instance;
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