import { InstanceReflect } from "./InstanceReflect";
import { AbstractClassDecorator } from "./AbstractClassDecorator";
import { MethodReflect } from "./MethodReflect";
import { PropertyReflect } from "./PropertyReflect";
import { BaseConstructor, DecoratorFactory } from "../interface";
/**
 * 类反射
 */
export declare class ClassReflect<T extends BaseConstructor = any> {
    protected _target: T;
    parent?: ClassReflect<any> | undefined;
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
     * 获取构造函数的reflect
     */
    private get constructorMethodReflect();
    /**
     * @param _target 目标类
     * @param parent 父ClassReflect
     */
    protected constructor(_target: T, parent?: ClassReflect<any> | undefined);
    /**
     * 提供给子Reflect的服务
     */
    private _publicProvider;
    /**
     * 提供给当前类的服务
     */
    private _privateProvider;
    /**
     * 查找服务
     * @param key 服务的key
     * @param type 'private' | 'public'
     * 'private' 能查找自己的服务/私有服务，和从父ClassReflect的_publicProvider中查找依赖
     */
    getProvider<K extends object, V extends object>(key: K, type?: 'private' | 'public'): V | undefined;
    /**
     * 设置服务
     * @param key 服务的key
     * @param value 'private' | 'public'
     * 设置为 private 只能提供给当前类 不能提供给子ClassReflect
     */
    setProvider<K extends object, V extends object>(key: K, value: V, type?: 'private' | 'public'): this;
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
    /**
     * 检测是否包含装饰器
     * @param decorator
     */
    hasDecorator<T extends AbstractClassDecorator>(decorator: T | DecoratorFactory<any, any, any>): boolean;
    /**
     * 实例化当前目标类
     * 此方法为异步创建，考虑到同步创建 无法注入一些异步的驱动
     */
    newInstance(): Promise<InstanceReflect<InstanceType<T>>>;
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
