import { AbstractParameterMetadata } from "./AbstractParameterMetadata";
import { DecoratorFactory } from "../interface";
import { ParameterSet } from "./ParameterSet";
import { ParameterMap } from "./ParameterMap";
/**
 * 抽象参数装饰器类
 */
export declare abstract class AbstractParameterDecorator extends AbstractParameterMetadata {
    static create<P extends any[], T extends ParameterDecoratorConstructor<P>>(IDecorator: ParameterDecoratorConstructor<P> & T): DecoratorFactory<P, ParameterDecorator, T>;
    private static _targets;
    static defineMetadata<T extends Object, M extends AbstractParameterMetadata, P extends string | symbol, I extends number>(target: T, metadata: M, propertyKey: P, index: I): void;
    /**
     * 根据参数的位置获取 指定下标参数装饰器元数据
     * @param target 目标类
     * @param propertyKey 目标类的成员方法名称
     * @param index 参数的下标位置
     */
    static getMetadata<T extends Object, P extends string | symbol, I extends number>(target: T, propertyKey: P, index: I): ParameterSet<AbstractParameterMetadata> | undefined;
    /**
     * 根据目标类的成员方法名称 获取所有的参数装饰器 元数据
     * @param target
     * @param propertyKey
     */
    static getMetadata<T extends Object, P extends string | symbol, I extends number>(target: T, propertyKey: P): ParameterMap<I, ParameterSet<AbstractParameterMetadata>> | undefined;
    /**
     * 根据目标类获取拥有参数装饰器的方法成员名称
     * @param target
     */
    static getPropertyKeys<T extends Object>(target: T): IterableIterator<string | symbol> | undefined;
}
export interface ParameterDecoratorConstructor<P extends any[]> {
    new (...args: P): AbstractParameterDecorator;
}