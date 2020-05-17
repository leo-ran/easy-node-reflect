import { ClassReflect } from "./ClassReflect";
import { ParameterReflect } from "./ParameterReflect";
import { AbstractMethodDecorator } from "./AbstractMethodDecorator";
import { DecoratorFactory } from "../interface";
import { InjectMap } from "./InjectMap";
export declare class MethodReflect<R extends Function = any> {
    parent: ClassReflect<any>;
    propertyKey: string | symbol;
    isStatic: boolean;
    private _metadata?;
    get metadata(): Array<AbstractMethodDecorator>;
    set metadata(value: Array<AbstractMethodDecorator>);
    isGetter: boolean;
    isSetter: boolean;
    isConstructor: boolean;
    parameters: Array<ParameterReflect>;
    returnType: R;
    protected constructor(parent: ClassReflect<any>, propertyKey: string | symbol, isStatic?: boolean);
    getTarget(): any;
    getOwnTarget(): unknown;
    hasDecorator(decorator: DecoratorFactory<any, any, any>): boolean;
    hasType(type: object): boolean;
    hasParameterDecorator(decorator: DecoratorFactory<any, any, any>): boolean;
    handlerBeforeInvoke(injectMap: InjectMap): Promise<void>;
    handlerReturn<T>(value: T): Promise<T>;
    static create<R extends Function = any>(parent: ClassReflect<any>, propertyKey: string | symbol, isStatic?: boolean): MethodReflect<R>;
}
export interface MethodReflectMapParameterCallback<T = any> {
    async(): Promise<T>;
}
export declare function reflectMethod<T extends Function = any>(classReflect: ClassReflect, key: string | symbol): MethodReflect<T> | undefined;
