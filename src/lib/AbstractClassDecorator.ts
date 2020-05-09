import {BaseConstructor, BaseDecorator, DecoratorFactory} from "../interface";
import {TargetMap} from "./TargetMap";
import {MethodSet} from "./MethodSet";
import {ClassSet} from "./ClassSet";
import {InstanceReflect} from "./InstanceReflect";
import {AbstractMethodDecorator} from "./AbstractMethodDecorator";
import {AbstractPropertyDecorator} from "./AbstractPropertyDecorator";
import {AbstractParameterDecorator} from "./AbstractParameterDecorator";
import {MethodReflect} from "./MethodReflect";
import {InjectMap} from "./InjectMap";

/**
 * 抽象类装饰器类
 */
export abstract class AbstractClassDecorator {

  /**
   * 当被此装饰器装饰的类实例化后 触发
   * @param instance
   */
  public onNewInstanced?<T extends BaseDecorator>(instance: InstanceReflect<T>): void;

  /**
   * 当被此装饰器装饰的类实例化时 触发
   * 不支持异步
   * @param methodReflect
   * @return InjectMap 返回构造函数的注入映射关系map
   */
  public onNewInstance?<R extends Function>(methodReflect: MethodReflect<R>): InjectMap;

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