import { BaseConstructor, DecoratorFactory } from "../interface";
import { ClassSet } from "./ClassSet";
import { InstanceReflect } from "./InstanceReflect";
import { ClassReflect } from "./ClassReflect";
export declare abstract class AbstractClassDecorator {
    onTargetBeforeInstance?(classReflect: ClassReflect): Promise<void>;
    onTargetInstanced?<T extends object>(classReflect: ClassReflect, instanceReflect: InstanceReflect<T>): void | Promise<void>;
    static create<P extends any[], T extends ClassDecoratorConstructor<P>>(IDecorator: ClassDecoratorConstructor<P> & T): DecoratorFactory<P, ClassDecorator, T>;
    private static _targets;
    static defineMetadata<T extends Object, M extends AbstractClassDecorator>(target: T, metadata: M): void;
    static getMetadata<T extends Object>(target: T): ClassSet<AbstractClassDecorator> | undefined;
}
export interface ClassDecoratorConstructor<P extends any[]> {
    new (...args: P): AbstractClassDecorator;
}
export declare function reflectClass<T extends BaseConstructor>(target: T, parent?: ClassReflect): ClassReflect<T>;
