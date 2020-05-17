import { BaseConstructor } from "../../interface";
import { MethodReflect } from "../MethodReflect";
import { PropertyReflect } from "../PropertyReflect";
import { ClassReflect } from "../ClassReflect";
import { ParameterReflect } from "../ParameterReflect";
export declare function parseClassReflectMetadata<T extends BaseConstructor>(classReflect: ClassReflect<T>): void;
export declare function parseClassReflectInstanceMembers<T extends BaseConstructor>(classReflect: ClassReflect<T>): void;
export declare function parseClassReflectStaticMembers<T extends BaseConstructor>(classReflect: ClassReflect<T>): void;
export declare function parseMethodReflectMetadata(methodReflect: MethodReflect): void;
export declare function parseMethodReflectParameters(methodReflect: MethodReflect): void;
export declare function parseMethodReflectReturnType(methodReflect: MethodReflect): void;
export declare function parseParameterMetadata(parameterReflect: ParameterReflect): void;
export declare function parsePropertyReflectMetadata(propertyReflect: PropertyReflect): void;
export declare function parsePropertyReflectType(propertyReflect: PropertyReflect): void;
