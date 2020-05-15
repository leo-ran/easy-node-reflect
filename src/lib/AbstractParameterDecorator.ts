import {DecoratorFactory} from "../interface";
import {ParameterSet} from "./ParameterSet";
import {TargetMap} from "./TargetMap";
import {ParameterMap} from "./ParameterMap";
import {MethodMap} from "./MethodMap";
import {ParameterReflect} from "./ParameterReflect";
import {ClassReflect} from "./ClassReflect";
import {MethodReflect} from "./MethodReflect";
import {InstanceReflect} from "./InstanceReflect";
import {InjectMap} from "./InjectMap";

/**
 * 抽象参数装饰器类
 */
export abstract class AbstractParameterDecorator {

  /**
   * 注入参数时的回调
   * @param classReflect
   * @param methodReflect
   * @param instanceReflect
   * @param parameterReflect
   * @param value
   */
  public async onInject?<T>(parameterReflect: ParameterReflect, injectMap: InjectMap, value: T): Promise<T>;

  public parameterIndex?: number;
  public propertyKey?: string | symbol;

  public setPropertyKey(propertyKey: string | symbol) {
    this.propertyKey = propertyKey;
    return this;
  }

  public setParameterIndex(index: number) {
    this.parameterIndex = index;
  }

  static create<
    P extends any[],
    T extends ParameterDecoratorConstructor<P>
    >(
    IDecorator: ParameterDecoratorConstructor<P> & T
  ): DecoratorFactory<P, ParameterDecorator, T> {
    function decorator(...args: P) {
      return (target: Object, propertyKey: string | symbol, parameterIndex: number): void => {
        // 定义元数据
        const metadata: AbstractParameterDecorator = Reflect.construct(IDecorator, args);
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
        ParameterSet<AbstractParameterDecorator>
      >
    >
  > = new TargetMap();

  static defineMetadata<
    T extends Object,
    M extends AbstractParameterDecorator,
    P extends string | symbol,
    I extends number
    >(target: T, metadata: M, propertyKey: P, index: I): void {
    const methodMap = AbstractParameterDecorator._targets.get(target) || new MethodMap();
    const parameterMap = methodMap.get(propertyKey) || new ParameterMap();
    const parameterSet = parameterMap.get(index) || new ParameterSet<AbstractParameterDecorator>();

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
  >(target: T, propertyKey: P, index: I): ParameterSet<AbstractParameterDecorator> | undefined;
  /**
   * 根据目标类的成员方法名称 获取所有的参数装饰器 元数据
   * @param target
   * @param propertyKey
   */
  static getMetadata<
    T extends Object,
    P extends string | symbol,
    I extends number
  >(target: T, propertyKey: P): ParameterMap<I, ParameterSet<AbstractParameterDecorator>> | undefined;
  static getMetadata<
    T extends Object,
    P extends string | symbol,
    I extends number
  >(target: T, propertyKey: P, index?: I): ParameterMap<I, ParameterSet<AbstractParameterDecorator>> | ParameterSet<AbstractParameterDecorator> | undefined {
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
        return parameterMap as ParameterMap<I, ParameterSet<AbstractParameterDecorator>>;
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