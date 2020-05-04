import { MethodReflect } from "./MethodReflect";
import { InstanceReflect } from "./InstanceReflect";
import { AbstractPropertyDecorator } from "./AbstractPropertyDecorator";
export declare class ParameterReflect<T = any> {
    parent: MethodReflect;
    type: T;
    propertyKey: string | symbol;
    parameterIndex: number;
    private _metadata?;
    constructor(parent: MethodReflect, type: T, propertyKey: string | symbol, parameterIndex: number);
    set metadata(value: Array<InstanceReflect<AbstractPropertyDecorator>>);
    get metadata(): Array<InstanceReflect<AbstractPropertyDecorator>>;
    getTarget(): any;
    static parseMetadata(parameterReflect: ParameterReflect): void;
}
