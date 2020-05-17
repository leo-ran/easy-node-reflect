import { ClassReflect } from "./ClassReflect";
import { AbstractPropertyDecorator } from "./AbstractPropertyDecorator";
import { DecoratorFactory } from "../interface";
export declare class PropertyReflect<T extends Function = any> {
    parent: ClassReflect<any>;
    propertyKey: string | symbol;
    isStatic: boolean;
    _metadata?: Array<AbstractPropertyDecorator>;
    type: T;
    protected constructor(parent: ClassReflect<any>, propertyKey: string | symbol, isStatic?: boolean);
    set metadata(value: AbstractPropertyDecorator[]);
    get metadata(): AbstractPropertyDecorator[];
    getTarget(): any;
    getOwnTarget(): unknown;
    hasDecorator(decorator: DecoratorFactory<any, any, any>): boolean;
    static create<R extends Function = any>(parent: ClassReflect<any>, propertyKey: string | symbol, isStatic?: boolean): PropertyReflect<R>;
}
export declare function reflectProperty<T extends Function = any>(classReflect: ClassReflect, key: string | symbol): PropertyReflect<T> | undefined;
