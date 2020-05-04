import { ClassReflect } from "./ClassReflect";
import { InstanceReflect } from "./InstanceReflect";
import { ParameterReflect } from "./ParameterReflect";
import { AbstractMethodDecorator } from "./AbstractMethodDecorator";
export declare class MethodReflect<R extends Function = any> {
    parent: ClassReflect<any>;
    propertyKey: string | symbol;
    isStatic: boolean;
    private _metadata?;
    /**
     * 元数据列表
     */
    get metadata(): Array<InstanceReflect<AbstractMethodDecorator>>;
    set metadata(value: Array<InstanceReflect<AbstractMethodDecorator>>);
    isGetter: boolean;
    isSetter: boolean;
    isConstructor: boolean;
    /**
     * 参数列表
     */
    parameters: Array<ParameterReflect>;
    returnType: R;
    constructor(parent: ClassReflect<any>, propertyKey: string | symbol, isStatic?: boolean);
    getTarget(): any;
    static parseMetadata(methodReflect: MethodReflect): void;
    static parseParameters(methodReflect: MethodReflect): void;
    static parseReturnType(methodReflect: MethodReflect): void;
}
