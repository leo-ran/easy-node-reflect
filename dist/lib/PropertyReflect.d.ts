import { ClassReflect } from "./ClassReflect";
import { InstanceReflect } from "./InstanceReflect";
import { AbstractPropertyDecorator } from "./AbstractPropertyDecorator";
export declare class PropertyReflect<T extends Function = any> {
    parent: ClassReflect<any>;
    propertyKey: string | symbol;
    isStatic: boolean;
    _metadata?: Array<InstanceReflect<AbstractPropertyDecorator>>;
    type: T;
    constructor(parent: ClassReflect<any>, propertyKey: string | symbol, isStatic?: boolean);
    set metadata(value: Array<InstanceReflect<AbstractPropertyDecorator>>);
    get metadata(): Array<InstanceReflect<AbstractPropertyDecorator>>;
    getTarget(): any;
    static parseMetadata(propertyReflect: PropertyReflect): void;
    static parseType(propertyReflect: PropertyReflect): void;
}
