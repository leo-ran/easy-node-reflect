import {InstanceReflect} from "./InstanceReflect";
import {AbstractClassDecorator} from "./AbstractClassDecorator";
import {MethodReflect} from "./MethodReflect";
import {PropertyReflect} from "./PropertyReflect";
import {ClassSet} from "./ClassSet";
import {AbstractMethodDecorator} from "./AbstractMethodDecorator";
import {AbstractPropertyDecorator} from "./AbstractPropertyDecorator";
import {AbstractParameterDecorator} from "./AbstractParameterDecorator";
import {BaseConstructor} from "../interface";
import Base = Mocha.reporters.Base;

/**
 * 类反射
 */
export class ClassReflect<T extends BaseConstructor> {
  constructor(
    protected _target: T,
  ) {
    // 解析元数据
    ClassReflect.parseMetadata(this);
    // 解析实例成员装饰器
    ClassReflect.parseInstanceMembers(this);
    // 解析静态成员装饰器
    ClassReflect.parseStaticMembers(this);
  }

  /**
   * 获取 `ClassReflect` 的目标
   */
  public getTarget() {
    return this._target.prototype;
  }

  private _superClass?:  ClassReflect<any>;

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
   * @param positionalArguments
   */
  public newInstance(positionalArguments: ConstructorParameters<T>): InstanceReflect<T> {
    return new InstanceReflect<T>(Reflect.construct(this._target, positionalArguments));
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
      list.forEach(key => {
        const methodReflect = new MethodReflect(
          classReflect,
          key
        );
        classReflect.instanceMembers.set(key, methodReflect);
      })
    }

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

  /**
   * 运行时类型
   */
  public runtimeType = ClassReflect;
}