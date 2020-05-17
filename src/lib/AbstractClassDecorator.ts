import {BaseConstructor, DecoratorFactory} from "../interface";
import {TargetMap} from "./TargetMap";
import {MethodSet} from "./MethodSet";
import {ClassSet} from "./ClassSet";
import {InstanceReflect} from "./InstanceReflect";
import {ClassReflect} from "./ClassReflect";

/**
 * 抽象类装饰器类
 */
export abstract class AbstractClassDecorator {

  /**
   * 当被此装饰器装饰的类实例化前触发
   * 此方法为异步方法 必须返回Promise
   * 要在这个阶段给子ClassReflect添加好依赖关系，否则子ClassReflect无法得到依赖注入， 使用 `classReflect.provider.set()` 来
   * 完成提供。
   *
   * 要获取到父ClassReflect提供的依赖， 可以使用classReflect.parent来获取，
   * 不过先要检测 `ClassReflect` 是否存在 parent
   */
  public async onTargetBeforeInstance?(classReflect: ClassReflect): Promise<void>;

  /**
   * 当被此装饰器装饰的类实例化后触发
   * @param classReflect 当前类的 类映射对象
   * @param instanceReflect 类实例化后的 实例反射对象
   */
  public onTargetInstanced?<T extends object>(classReflect: ClassReflect, instanceReflect: InstanceReflect<T>): void | Promise<void>;

  static create<
    P extends any[],
    T extends ClassDecoratorConstructor<P>
    >(
      IDecorator: ClassDecoratorConstructor<P> & T
    ): DecoratorFactory<P, ClassDecorator, T> {
      function decorator(...args: P) {
        return <TFunc extends Function>(target: TFunc): TFunc => {
          const metadata = Reflect.construct(IDecorator, args);
          AbstractClassDecorator.defineMetadata(target, metadata);
          return target;
        }
      }
      decorator.class = IDecorator;
      return decorator;
  }

  private static _targets: TargetMap<Object, MethodSet<AbstractClassDecorator>> = new TargetMap();

  /**
   * 定义类装饰器元数据
   * @param target
   * @param metadata
   */
  static defineMetadata<
    T extends Object,
    M extends AbstractClassDecorator,
    >(target: T, metadata: M) {
    const classSet = AbstractClassDecorator._targets.get(target) || new ClassSet();
    classSet.add(metadata);
    AbstractClassDecorator._targets.set(target, classSet);
  }

  /**
   * 获取类装饰器元数据
   */
  static getMetadata<T extends Object>(target: T): ClassSet<AbstractClassDecorator> | undefined {
    return AbstractClassDecorator._targets.get(target);
  }
}

export interface ClassDecoratorConstructor<P extends any[]> {
  new (...args: P): AbstractClassDecorator;
}

export function reflectClass<T extends BaseConstructor>(target: T, parent?: ClassReflect): ClassReflect<T> {
  return  ClassReflect.create<T>(target, parent);
}