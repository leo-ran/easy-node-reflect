import { DecoratorFactory } from "../interface";
import { MethodSet } from "./MethodSet";
import { MethodReflect } from "./MethodReflect";
import { InjectMap } from "./InjectMap";
export declare abstract class AbstractMethodDecorator<T = any> {
    descriptor?: TypedPropertyDescriptor<T>;
    propertyKey?: string | symbol;
    setDescriptor(descriptor: TypedPropertyDescriptor<T>): this;
    setPropertyKey(propertyKey: string | symbol): this;
    onBeforeInvoke?(methodReflect: MethodReflect, injectMap: InjectMap): Promise<void>;
    onInvoked?<V>(methodReflect: MethodReflect<any>, value: V): Promise<V>;
    static create<P extends any[], T extends MethodDecoratorConstructor<P>>(IDecorator: MethodDecoratorConstructor<P> & T): DecoratorFactory<P, MethodDecorator, T>;
    private static _targets;
    static defineMetadata<T extends Object, M extends AbstractMethodDecorator, P extends string | symbol>(target: T, metadata: M, propertyKey: P): void;
    static getMetadata<T extends Object, P extends string | symbol>(target: T, propertyKey: P): MethodSet<AbstractMethodDecorator> | undefined;
    static getPropertyKeys<T extends Object>(target: T): IterableIterator<string | symbol> | undefined;
}
export interface MethodDecoratorConstructor<P extends any[]> {
    new (...args: P): AbstractMethodDecorator;
}
