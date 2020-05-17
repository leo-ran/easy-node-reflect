import { InstanceReflect } from "./InstanceReflect";
import { AbstractClassDecorator } from "./AbstractClassDecorator";
import { MethodReflect } from "./MethodReflect";
import { PropertyReflect } from "./PropertyReflect";
import { BaseConstructor, DecoratorFactory } from "../interface";
export declare class ClassReflect<T extends BaseConstructor = any> {
    protected _target: T;
    parent?: ClassReflect<any> | undefined;
    private _superClass?;
    metadata: AbstractClassDecorator[];
    instanceMembers: Map<string | symbol, MethodReflect | PropertyReflect>;
    staticMembers: Map<string | symbol, MethodReflect | PropertyReflect>;
    private get constructorMethodReflect();
    protected constructor(_target: T, parent?: ClassReflect<any> | undefined);
    private _provider;
    getProvider<K extends object, V extends object>(key: K, _extends?: boolean): V | undefined;
    setProvider<K extends object, V extends object>(key: K, value: V): this;
    getTarget(): T;
    getTargetName(): string;
    getOwnTarget<T>(): T;
    getOwnTargetName(): string;
    hasDecorator(decorator: DecoratorFactory<any, any, any>): boolean;
    newInstance(): Promise<InstanceReflect<InstanceType<T>>>;
    get superClass(): any;
    static create<T extends BaseConstructor>(target: T, parent?: ClassReflect<any>): ClassReflect<T>;
}
