import { MethodReflect } from "./MethodReflect";
import { AbstractParameterDecorator } from "./AbstractParameterDecorator";
import { DecoratorFactory } from "../interface";
import { InjectMap } from "./InjectMap";
export declare class ParameterReflect<T = any> {
    parent: MethodReflect;
    type: T;
    propertyKey: string | symbol;
    parameterIndex: number;
    private _metadata?;
    constructor(parent: MethodReflect, type: T, propertyKey: string | symbol, parameterIndex: number);
    set metadata(value: Array<AbstractParameterDecorator>);
    get metadata(): Array<AbstractParameterDecorator>;
    getTarget(): any;
    getOwnTarget(): unknown;
    handlerInject<T>(injectMap: InjectMap, value: T): Promise<T>;
    hasDecorator<T extends AbstractParameterDecorator>(decorator: T | DecoratorFactory<any, any, any>): boolean;
    static create<T = any>(parent: MethodReflect, type: T, propertyKey: string | symbol, parameterIndex: number): ParameterReflect<T>;
}
export declare function reflectParameter<T = any>(methodReflect: MethodReflect, index: number): ParameterReflect<T> | undefined;
export interface MapParameterDecoratorCallback {
    (parameterReflect: ParameterReflect): void;
}
