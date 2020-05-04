import {AbstractParameterMetadata} from "./AbstractParameterMetadata";
import {DecoratorFactory} from "../interface";
import {ParameterSet} from "./ParameterSet";
import {TargetMap} from "./TargetMap";
import {ParameterMap} from "./ParameterMap";
import {MethodMap} from "./MethodMap";

/**
 * 抽象参数装饰器类
 */
export abstract class AbstractParameterDecorator extends AbstractParameterMetadata {

  static create<
    P extends any[],
    T extends ParameterDecoratorConstructor<P>
    >(
    IDecorator: ParameterDecoratorConstructor<P> & T
  ): DecoratorFactory<P, ParameterDecorator, T> {
    function decorator(...args: P) {
      return (target: Object, propertyKey: string | symbol, parameterIndex: number): void => {
        // 定义元数据
        const metadata: AbstractParameterMetadata = Reflect.construct(IDecorator, args);
        metadata.setParameterIndex(parameterIndex);
        metadata.setPropertyKey(propertyKey);

        AbstractParameterDecorator.defineMetadata(
          target,
          metadata,
          propertyKey,
          parameterIndex
        );
      }
    }
    decorator.class = IDecorator;
    return decorator;
  }

  private static _targets: TargetMap<
    Object,
    MethodMap<
      string | symbol,
      ParameterMap<
        number,
        ParameterSet<AbstractParameterMetadata>
      >
    >
  > = new TargetMap();

  static defineMetadata<
    T extends Object,
    M extends AbstractParameterMetadata,
    P extends string | symbol,
    I extends number
    >(target: T, metadata: M, propertyKey: P, index: I): void {
    const methodMap = AbstractParameterDecorator._targets.get(target) || new MethodMap();
    const parameterMap = methodMap.get(propertyKey) || new ParameterMap();
    const parameterSet = parameterMap.get(index) || new ParameterSet<AbstractParameterMetadata>();

    parameterSet.add(metadata);
    parameterMap.set(index, parameterSet);
    methodMap.set(propertyKey, parameterMap);
    AbstractParameterDecorator._targets.set(target, methodMap);
  }

  /**
   * 根据参数的位置获取 指定下标参数装饰器元数据
   * @param target 目标类
   * @param propertyKey 目标类的成员方法名称
   * @param index 参数的下标位置
   */
  static getMetadata<
    T extends Object,
    P extends string | symbol,
    I extends number
  >(target: T, propertyKey: P, index: I): ParameterSet<AbstractParameterMetadata> | undefined;
  /**
   * 根据目标类的成员方法名称 获取所有的参数装饰器 元数据
   * @param target
   * @param propertyKey
   */
  static getMetadata<
    T extends Object,
    P extends string | symbol,
    I extends number
  >(target: T, propertyKey: P): ParameterMap<I, ParameterSet<AbstractParameterMetadata>> | undefined;
  static getMetadata<
    T extends Object,
    P extends string | symbol,
    I extends number
  >(target: T, propertyKey: P, index?: I): ParameterMap<I, ParameterSet<AbstractParameterMetadata>> | ParameterSet<AbstractParameterMetadata> | undefined {
    const methodMap = AbstractParameterDecorator._targets.get(target);
    if (methodMap instanceof MethodMap) {
      const parameterMap = methodMap.get(propertyKey);
      if (parameterMap instanceof ParameterMap) {


        if (index != undefined && !isNaN(index)) {
          const parameterSet = parameterMap.get(index);
          if (parameterSet instanceof ParameterSet) {
            return parameterSet;
          }
        }
        return parameterMap as ParameterMap<I, ParameterSet<AbstractParameterMetadata>>;
      }
    }
  }

  /**
   * 根据目标类获取拥有参数装饰器的方法成员名称
   * @param target
   */
  static getPropertyKeys<T extends Object>(target: T): IterableIterator<string|symbol> | undefined {
    const methodMap = AbstractParameterDecorator._targets.get(target);
    if (methodMap instanceof MethodMap) {
      return methodMap.keys();
    }
  }
}

export interface ParameterDecoratorConstructor<P extends any[]> {
  new (...args: P): AbstractParameterDecorator;
}