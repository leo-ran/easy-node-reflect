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
    protected constructor(_target: T, parent?: ClassReflect<any> | undefined);
    /**
     * 公开提供的服务
     * 公开提供的服务子ClassReflect可以直接访问和继承
     */
    private _publicProvider;
    /**
     * 私有提供服务
     * 私有提供服务只提供给当前ClassReflect 子ClassReflect不能访问和继承
     */
    private _privateProvider;
    /**
     * 获取公共服务
     * @param key
     */
    getPublicProvider<V extends object>(key: object): V | undefined;
    /**
     * 获取私有服务
     * @param key
     */
    getPrivateProvider<V extends object>(key: object): V | undefined;
    /**
     * 设置公共服务
     * @param key
     * @param value
     */
    setPublicProvider<K extends object, V extends object>(key: K, value: V): this;
    /**
     * 设置私有服务
     * @param key
     * @param value
     */
    setPrivateProvider<K extends object, V extends object>(key: K, value: V): this;
    /**
     * 获取 `ClassReflect` 的目标
     */
    getTarget(): T;
    /**
     * 获取 `ClassReflect` 的目标类的 名称
     */
    getTargetName(): string;
    /**
     * 获取 `ClassReflect` 的原型链
     */
    getOwnTarget<T>(): T;
    /**
     * 获取 `ClassReflect` 的原型链
     */
    getOwnTargetName(): string;
    private _superClass?;
    /**
     * 元数据列表
     */
    metadata: AbstractClassDecorator[];
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
     * 创建ClassReflect实例
     * @param target 目标类
     */
    static create<T extends BaseConstructor>(target: T, parent?: ClassReflect<any>): ClassReflect<T>;
}
