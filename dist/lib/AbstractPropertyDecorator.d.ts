import { AbstractPropertyMetadata } from "./AbstractPropertyMetadata";
import { DecoratorFactory } from "../interface";
import { PropertySet } from "./PropertySet";
/**
 * 抽象属性装饰器类
 */
export declare abstract class AbstractPropertyDecorator extends AbstractPropertyMetadata {
    static create<P extends any[], T extends PropertyDecoratorConstructor<P>>(IDecorator: PropertyDecoratorConstructor<P> & T): DecoratorFactory<P, PropertyDecorator, T>;
    private static _targets;
    /**
     * 根据目标类 定义元数据
     * @param target 目标类
     * @param metadata 元数据
     * @param propertyKey 目标类成员名称
     */
    static defineMetadata<T extends Object, M extends AbstractPropertyMetadata, P extends string | symbol>(target: T, metadata: M, propertyKey: P): void;
    /**
     * 根据目标类获取 成员的装饰器元数据
     * @param target 目标类
     * @param propertyKey 目标类的成员名称
     */
    static getMetadata<T extends Object, P extends string | symbol>(target: T, propertyKey: P): PropertySet<AbstractPropertyMetadata> | undefined;
    /**
     * 根据目标类 获取包含属性装饰器的成员 名称列表
     * @param target
     */
    static getPropertyKeys<T extends Object>(target: T): IterableIterator<string | symbol> | undefined;
}
export interface PropertyDecoratorConstructor<P extends any[]> {
    new (...args: P): AbstractPropertyDecorator;
}
