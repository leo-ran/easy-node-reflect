import {DecoratorFactory} from "../interface";
import {TargetMap} from "./TargetMap";
import {MethodSet} from "./MethodSet";
import {MethodMap} from "./MethodMap";
import {MethodReflect} from "./MethodReflect";
/**
 * 抽象方法装饰器类
 */
export abstract class AbstractMethodDecorator<T = any> {

  public descriptor?: TypedPropertyDescriptor<T>;
  public propertyKey?: string | symbol;

  public setDescriptor(descriptor: TypedPropertyDescriptor<T>): this {
    this.descriptor = descriptor;
    return this;
  }

  public setPropertyKey(propertyKey: string | symbol) {
    this.propertyKey = propertyKey;
    return this;
  }

  /**
   * 当此方法装饰器 装饰的方法 被调用后触发
   * 在此处可以针对函数的返回值做类型检测 或返回值更新
   * 支持异步 返回 `Promise`
   * @param methodReflect 方法元数据映射
   * @param value 该方法运行后的返回值
   * @return T 返回新的value
   */
  public onInvoked?<V>(methodReflect: MethodReflect<any> ,value: V): V | Promise<V>;

  static create<
    P extends any[],
    T extends MethodDecoratorConstructor<P>
    >(
    IDecorator: MethodDecoratorConstructor<P> & T
  ): DecoratorFactory<P, MethodDecorator, T> {
    function decorator(...args: P) {
      return <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void => {
        // 定义元数据
        const metadata: AbstractMethodDecorator = Reflect.construct(IDecorator, args);
        metadata.setPropertyKey(propertyKey);
        metadata.setDescriptor(descriptor);
        AbstractMethodDecorator.defineMetadata(target, metadata, propertyKey);
      };
    }
    decorator.class = IDecorator;
    return decorator;
  }

  private static _targets: TargetMap<Object, MethodMap<string | symbol, MethodSet<AbstractMethodDecorator>>> = new TargetMap();

  /**
   * 根据目标类 定义元数据
   * @param target 目标类
   * @param metadata 元数据
   * @param propertyKey 目标类的成员方法名称
   */
  static defineMetadata<
    T extends Object,
    M extends AbstractMethodDecorator,
    P extends string | symbol,
    >(target: T, metadata: M, propertyKey: P) {

    const methodMap = AbstractMethodDecorator._targets.get(target) || new MethodMap();
    const methodSet = methodMap.get(propertyKey) || new MethodSet<AbstractMethodDecorator>();
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
    >(target: T, propertyKey: P): MethodSet<AbstractMethodDecorator> | undefined {
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