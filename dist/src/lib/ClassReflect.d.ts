import { InstanceReflect } from "./InstanceReflect";
import { AbstractClassDecorator } from "./AbstractClassDecorator";
import { MethodReflect } from "./MethodReflect";
import { PropertyReflect } from "./PropertyReflect";
import { BaseConstructor } from "../interface";
/**
 * 类反射
 */
export declare class ClassReflect<T extends BaseConstructor> {
    protected _target: T;
    constructor(_target: T);
    /**
     * 获取 `ClassReflect` 的目标
     */
    getTarget(): any;
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
     * @param positionalArguments
     */
    newInstance(positionalArguments: ConstructorParameters<T>): InstanceReflect<T>;
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
    /**
     * 运行时类型
     */
    runtimeType: typeof ClassReflect;
}
