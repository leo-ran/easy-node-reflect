import { MethodReflect } from "./MethodReflect";
import { InstanceReflect } from "./InstanceReflect";
import { AbstractParameterDecorator } from "./AbstractParameterDecorator";
export declare class ParameterReflect<T = any> {
    parent: MethodReflect;
    type: T;
    propertyKey: string | symbol;
    parameterIndex: number;
    private _metadata?;
    constructor(parent: MethodReflect, type: T, propertyKey: string | symbol, parameterIndex: number);
    set metadata(value: Array<InstanceReflect<AbstractParameterDecorator>>);
    get metadata(): Array<InstanceReflect<AbstractParameterDecorator>>;
    getTarget(): any;
    static parseMetadata(parameterReflect: ParameterReflect): void;
}
