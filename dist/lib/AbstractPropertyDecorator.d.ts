import { DecoratorFactory } from "../interface";
import { PropertySet } from "./PropertySet";
import { PropertyReflect } from "./PropertyReflect";
export declare abstract class AbstractPropertyDecorator {
    onSetValue?<T>(propertyReflect: PropertyReflect<any>, value: T): Promise<T>;
    onGetValue?<T>(propertyReflect: PropertyReflect<any>, value: T): Promise<T>;
    propertyKey?: string | symbol;
    setPropertyKey(propertyKey: string | symbol): this;
    static create<P extends any[], T extends PropertyDecoratorConstructor<P>>(IDecorator: PropertyDecoratorConstructor<P> & T): DecoratorFactory<P, PropertyDecorator, T>;
    private static _targets;
    static defineMetadata<T extends Object, M extends AbstractPropertyDecorator, P extends string | symbol>(target: T, metadata: M, propertyKey: P): void;
    static getMetadata<T extends Object, P extends string | symbol>(target: T, propertyKey: P): PropertySet<AbstractPropertyDecorator> | undefined;
    static getPropertyKeys<T extends Object>(target: T): IterableIterator<string | symbol> | undefined;
}
export interface PropertyDecoratorConstructor<P extends any[]> {
    new (...args: P): AbstractPropertyDecorator;
}
