import { DecoratorFactory } from "../interface";
import { MethodSet } from "./MethodSet";
import { MethodReflect } from "./MethodReflect";
/**
 * 抽象方法装饰器类
 */
export declare abstract class AbstractMethodDecorator<T = any> {
    descriptor?: TypedPropertyDescriptor<T>;
    propertyKey?: string | symbol;
    setDescriptor(descriptor: TypedPropertyDescriptor<T>): this;
    setPropertyKey(propertyKey: string | symbol): this;
    /**
     * 当此方法装饰器 装饰的方法 被调用后触发
     * 在此处可以针对函数的返回值做类型检测 或返回值更新
     * 支持异步 返回 `Promise`
     * @param methodReflect 方法元数据映射
     * @param value 该方法运行后的返回值
     * @return T 返回新的value
     */
    onInvoked?<V>(methodReflect: MethodReflect<any>, value: V): V | Promise<V>;
    static create<P extends any[], T extends MethodDecoratorConstructor<P>>(IDecorator: MethodDecoratorConstructor<P> & T): DecoratorFactory<P, MethodDecorator, T>;
    private static _targets;
    /**
     * 根据目标类 定义元数据
     * @param target 目标类
     * @param metadata 元数据
     * @param propertyKey 目标类的成员方法名称
     */
    static defineMetadata<T extends Object, M extends AbstractMethodDecorator, P extends string | symbol>(target: T, metadata: M, propertyKey: P): void;
    /**
     * 根据目标类获取 方法装饰器的元数据集合
     * @param target
     * @param propertyKey
     */
    static getMetadata<T extends Object, P extends string | symbol>(target: T, propertyKey: P): MethodSet<AbstractMethodDecorator> | undefined;
    /**
     * 根据目标类获取方法装饰器的成员方法名称
     * @param target
     */
    static getPropertyKeys<T extends Object>(target: T): IterableIterator<string | symbol> | undefined;
}
export interface MethodDecoratorConstructor<P extends any[]> {
    new (...args: P): AbstractMethodDecorator;
}
