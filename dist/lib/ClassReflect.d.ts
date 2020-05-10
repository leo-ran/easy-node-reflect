import { InstanceReflect } from "./InstanceReflect";
import { AbstractClassDecorator } from "./AbstractClassDecorator";
import { MethodReflect } from "./MethodReflect";
import { PropertyReflect } from "./PropertyReflect";
import { BaseConstructor, NewInstanceCallback } from "../interface";
/**
 * 类反射
 */
export declare class ClassReflect<T extends BaseConstructor = any> {
    protected _target: T;
    parent?: ClassReflect<any> | undefined;
    constructor(_target: T, parent?: ClassReflect<any> | undefined);
    /**
     * `_target`类的服务提供映射
     * 用于在实例化 `_target`注入参数的类型=>参数映射关系查找
     */
    provider: Map<object, object>;
    /**
     * 获取 `ClassReflect` 的目标
     */
    getTarget(): any;
    /**
     * 获取 `ClassReflect` 的目标类的 名称
     */
    getTargetName(): string;
    private _superClass?;
    /**
     * 元数据列表
     */
    metadata: InstanceReflect<AbstractClassDecorator>[];
    /**
     * 实例成员映射
     */
    instanceMembers: Map<string | symbol, MethodReflect | PropertyReflect>;
    /**
     * 静态成员映射
     */
    staticMembers: Map<string | symbol, MethodReflect | PropertyReflect>;
    /**
     * target 实例化
     * @param callback
     */
    newInstance(callback: NewInstanceCallback): InstanceReflect<InstanceType<T>>;
    /**
     * 父类反射
     */
    get superClass(): any;
    /**
     * 解析元数据
     * @param classReflect
     */
    static parseMetadata<T extends BaseConstructor>(classReflect: ClassReflect<T>): void;
    /**
     * 解析类的 实例成员
     * @param classReflect
     */
    static parseInstanceMembers<T extends BaseConstructor>(classReflect: ClassReflect<T>): void;
    /**
     * 解析类的静态成员
     * @param classReflect
     */
    static parseStaticMembers<T extends BaseConstructor>(classReflect: ClassReflect<T>): void;
}
