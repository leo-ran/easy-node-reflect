import { DecoratorFactory } from "../interface";
import { ClassSet } from "./ClassSet";
/**
 * 抽象类装饰器类
 */
export declare abstract class AbstractClassDecorator {
    static create<P extends any[], T extends ClassDecoratorConstructor<P>>(IDecorator: ClassDecoratorConstructor<P> & T): DecoratorFactory<P, ClassDecorator, T>;
    private static _targets;
    /**
     * 定义类装饰器元数据
     * @param target
     * @param metadata
     */
    static defineMetadata<T extends Object, M extends AbstractClassDecorator>(target: T, metadata: M): void;
    /**
     * 获取类装饰器元数据
     */
    static getMetadata<T extends Object>(target: T): ClassSet<AbstractClassDecorator> | undefined;
}
export interface ClassDecoratorConstructor<P extends any[]> {
    new (...args: P): AbstractClassDecorator;
}
