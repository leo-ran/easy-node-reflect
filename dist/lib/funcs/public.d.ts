import { BaseConstructor } from "../../interface";
import { MethodReflect } from "../MethodReflect";
import { PropertyReflect } from "../PropertyReflect";
import { ClassReflect } from "../ClassReflect";
import { ParameterReflect } from "../ParameterReflect";
/**
 * 解析类的 元数据
 * @param classReflect
 */
export declare function parseClassReflectMetadata<T extends BaseConstructor>(classReflect: ClassReflect<T>): void;
/**
 * 解析类的 实例成员
 * @param classReflect
 */
export declare function parseClassReflectInstanceMembers<T extends BaseConstructor>(classReflect: ClassReflect<T>): void;
/**
 * 解析类的 静态成员
 * @param classReflect
 */
export declare function parseClassReflectStaticMembers<T extends BaseConstructor>(classReflect: ClassReflect<T>): void;
/**
 * 解析方法装饰器的 所有装饰器
 * @param methodReflect
 */
export declare function parseMethodReflectMetadata(methodReflect: MethodReflect): void;
/**
 * 解析方法装饰器的所有元数据参数
 * @param methodReflect
 */
export declare function parseMethodReflectParameters(methodReflect: MethodReflect): void;
/**
 * 解析方法装饰器的 返回类型
 * @param methodReflect
 */
export declare function parseMethodReflectReturnType(methodReflect: MethodReflect): void;
/**
 * 解析参数的装饰器列表
 * @param parameterReflect
 */
export declare function parseParameterMetadata(parameterReflect: ParameterReflect): void;
/**
 * 解析属性的元数据反射
 * @param propertyReflect
 */
export declare function parsePropertyReflectMetadata(propertyReflect: PropertyReflect): void;
/**
 * 解析属性的元数据反射 属性值类型
 * @param propertyReflect
 */
export declare function parsePropertyReflectType(propertyReflect: PropertyReflect): void;
