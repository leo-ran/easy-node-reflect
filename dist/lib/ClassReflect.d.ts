import { InstanceReflect } from "./InstanceReflect";
import { AbstractClassDecorator } from "./AbstractClassDecorator";
import { MethodReflect } from "./MethodReflect";
import { PropertyReflect } from "./PropertyReflect";
import { BaseConstructor } from "../interface";
export declare class ClassReflect<T extends BaseConstructor> {
    protected _target: T;
    constructor(_target: T);
    getTarget(): any;
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
    newInstance(positionalArguments: ConstructorParameters<T>): InstanceType<T>;
    /**
     * 父类反射
     */
    superClass?: ClassReflect<any>;
    static parseMetadata<T extends BaseConstructor>(classReflect: ClassReflect<T>): void;
    static parseInstanceMembers<T extends BaseConstructor>(classReflect: ClassReflect<T>): void;
    static parseStaticMembers<T extends BaseConstructor>(classReflect: ClassReflect<T>): void;
    /**
     * 运行时类型
     */
    runtimeType: typeof ClassReflect;
}
