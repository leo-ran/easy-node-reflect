import {AbstractMethodMetadata} from "./AbstractMethodMetadata";
import {DecoratorFactory} from "../interface";
import {TargetMap} from "./TargetMap";
import {MethodSet} from "./MethodSet";
import {MethodMap} from "./MethodMap";
/**
 * 抽象方法装饰器类
 */
export abstract class AbstractMethodDecorator extends AbstractMethodMetadata{
  static create<
    P extends any[],
    T extends MethodDecoratorConstructor<P>
    >(
    IDecorator: MethodDecoratorConstructor<P> & T
  ): DecoratorFactory<P, MethodDecorator, T> {
    function decorator(...args: P) {
      return <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void => {
        // 定义元数据
        const metadata: AbstractMethodMetadata = Reflect.construct(IDecorator, args);
        metadata.setPropertyKey(propertyKey);
        metadata.setDescriptor(descriptor);

        AbstractMethodDecorator.defineMetadata(target, metadata, propertyKey);
      };
    }
    decorator.class = IDecorator;
    return decorator;
  }

  private static _targets: TargetMap<Object, MethodMap<string | symbol, MethodSet<AbstractMethodMetadata>>> = new TargetMap();

  /**
   * 根据目标类 定义元数据
   * @param target 目标类
   * @param metadata 元数据
   * @param propertyKey 目标类的成员方法名称
   */
  static defineMetadata<
    T extends Object,
    M extends AbstractMethodMetadata,
    P extends string | symbol,
    >(target: T, metadata: M, propertyKey: P) {

    const methodMap = AbstractMethodDecorator._targets.get(target) || new MethodMap();
    const methodSet = methodMap.get(propertyKey) || new MethodSet<AbstractMethodMetadata>();
    methodSet.add(metadata);
    methodMap.set(propertyKey, methodSet);
    AbstractMethodDecorator._targets.set(target, methodMap);
  }

  /**
   * 根据目标类获取 方法装饰器的元数据集合
   * @param target
   * @param propertyKey
   */
  static getMetadata<
    T extends Object,
    P extends string | symbol,
    >(target: T, propertyKey: P): MethodSet<AbstractMethodMetadata> | undefined {
    const methodMap = AbstractMethodDecorator._targets.get(target);
    if (methodMap instanceof MethodMap) {
      const methodSet = methodMap.get(propertyKey);
      if (methodSet instanceof MethodSet) {
        return methodSet;
      }
    }
    return undefined;
  }

  /**
   * 根据目标类获取方法装饰器的成员方法名称
   * @param target
   */
  static getPropertyKeys<T extends Object>(target: T): IterableIterator<string|symbol> | undefined {
    const methodMap = AbstractMethodDecorator._targets.get(target);
    if (methodMap instanceof MethodMap) {
      return methodMap.keys();
    }
  }
}


export interface MethodDecoratorConstructor<P extends any[]> {
  new (...args: P): AbstractMethodDecorator;
}