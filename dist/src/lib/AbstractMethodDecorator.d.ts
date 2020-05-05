import { AbstractMethodMetadata } from "./AbstractMethodMetadata";
import { DecoratorFactory } from "../interface";
import { MethodSet } from "./MethodSet";
/**
 * 抽象方法装饰器类
 */
export declare abstract class AbstractMethodDecorator extends AbstractMethodMetadata {
    static create<P extends any[], T extends MethodDecoratorConstructor<P>>(IDecorator: MethodDecoratorConstructor<P> & T): DecoratorFactory<P, MethodDecorator, T>;
    private static _targets;
    /**
     * 根据目标类 定义元数据
     * @param target 目标类
     * @param metadata 元数据
     * @param propertyKey 目标类的成员方法名称
     */
    static defineMetadata<T extends Object, M extends AbstractMethodMetadata, P extends string | symbol>(target: T, metadata: M, propertyKey: P): void;
    /**
     * 根据目标类获取 方法装饰器的元数据集合
     * @param target
     * @param propertyKey
     */
    static getMetadata<T extends Object, P extends string | symbol>(target: T, propertyKey: P): MethodSet<AbstractMethodMetadata> | undefined;
    /**
     * 根据目标类获取方法装饰器的成员方法名称
     * @param target
     */
    static getPropertyKeys<T extends Object>(target: T): IterableIterator<string | symbol> | undefined;
}
export interface MethodDecoratorConstructor<P extends any[]> {
    new (...args: P): AbstractMethodDecorator;
}
