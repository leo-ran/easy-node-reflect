import { DecoratorFactory } from "../interface";
import { ParameterSet } from "./ParameterSet";
import { ParameterMap } from "./ParameterMap";
import { ParameterReflect } from "./ParameterReflect";
import { InjectMap } from "./InjectMap";
export declare abstract class AbstractParameterDecorator {
    onInject?<T>(parameterReflect: ParameterReflect, injectMap: InjectMap, value: T): Promise<T>;
    parameterIndex?: number;
    propertyKey?: string | symbol;
    setPropertyKey(propertyKey: string | symbol): this;
    setParameterIndex(index: number): void;
    static create<P extends any[], T extends ParameterDecoratorConstructor<P>>(IDecorator: ParameterDecoratorConstructor<P> & T): DecoratorFactory<P, ParameterDecorator, T>;
    private static _targets;
    static defineMetadata<T extends Object, M extends AbstractParameterDecorator, P extends string | symbol, I extends number>(target: T, metadata: M, propertyKey: P, index: I): void;
    static getMetadata<T extends Object, P extends string | symbol, I extends number>(target: T, propertyKey: P, index: I): ParameterSet<AbstractParameterDecorator> | undefined;
    static getMetadata<T extends Object, P extends string | symbol, I extends number>(target: T, propertyKey: P): ParameterMap<I, ParameterSet<AbstractParameterDecorator>> | undefined;
    static getPropertyKeys<T extends Object>(target: T): IterableIterator<string | symbol> | undefined;
}
export interface ParameterDecoratorConstructor<P extends any[]> {
    new (...args: P): AbstractParameterDecorator;
}
