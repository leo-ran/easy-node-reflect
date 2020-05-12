import { AbstractClassDecorator } from "./lib/AbstractClassDecorator";
import { AbstractParameterDecorator } from "./lib/AbstractParameterDecorator";
import { AbstractPropertyDecorator } from "./lib/AbstractPropertyDecorator";
import { AbstractMethodDecorator } from "./lib/AbstractMethodDecorator";
import { ClassReflect } from "./lib/ClassReflect";
import { MethodReflect } from "./lib/MethodReflect";
import { PropertyReflect } from "./lib/PropertyReflect";
import { ParameterReflect } from "./lib/ParameterReflect";
import { InstanceReflect } from "./lib/InstanceReflect";
export interface DecoratorFactory<P extends any[], D extends ClassDecorator | MethodDecorator | PropertyDecorator | ParameterDecorator, T> {
    (...args: P): D;
    class: T;
}
export interface BaseConstructor {
    new (...args: any[]): any;
    __proto__?: BaseConstructor;
}
export declare type BaseDecorator = AbstractClassDecorator | AbstractParameterDecorator | AbstractMethodDecorator | AbstractPropertyDecorator;
export declare type BaseReflect = ClassReflect | MethodReflect | PropertyReflect | ParameterReflect;
export declare type NewInstanceCallback = <T extends BaseConstructor>(classReflect: ClassReflect<T>, parameters: ParameterReflect<any>[]) => any[];
export declare type PositionalArgumentsCallback = <T extends BaseConstructor>(classReflect: ClassReflect<T>, methodReflect: MethodReflect, instanceReflect: InstanceReflect<any>, parameters: ParameterReflect<any>) => any[];
