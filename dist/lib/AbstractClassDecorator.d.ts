import { BaseConstructor, DecoratorFactory } from "../interface";
import { ClassSet } from "./ClassSet";
import { InstanceReflect } from "./InstanceReflect";
import { ClassReflect } from "./ClassReflect";
import { AbstractParameterDecorator } from "./AbstractParameterDecorator";
import { AbstractMethodDecorator } from "./AbstractMethodDecorator";
/**
 * 抽象类装饰器类
 */
export declare abstract class AbstractClassDecorator<P extends AbstractParameterDecorator = AbstractParameterDecorator, M extends AbstractMethodDecorator = AbstractMethodDecorator> {
    /**
     * 当被此装饰器装饰的类实例化前触发
     * 此方法为异步方法 必须返回Promise
     * 要在这个阶段给子ClassReflect添加好依赖关系，否则子ClassReflect无法得到依赖注入， 使用 `classReflect.provider.set()` 来
     * 完成提供。
     *
     * 要获取到父ClassReflect提供的依赖， 可以使用classReflect.parent来获取，
     * 不过先要检测 `ClassReflect` 是否存在 parent
     */
    onTargetBeforeInstance?(classReflect: ClassReflect): Promise<void>;
    /**
     * 当被此装饰器装饰的类实例化后触发
     * @param classReflect 当前类的 类映射对象
     * @param instanceReflect 类实例化后的 实例反射对象
     */
    onTargetInstanced?<T extends object>(classReflect: ClassReflect, instanceReflect: InstanceReflect<T>): void | Promise<void>;
    static create<P extends any[], T extends ClassDecoratorConstructor<P>>(IDecorator: ClassDecoratorConstructor<P> & T): DecoratorFactory<P, ClassDecorator, T>;
    private static _targets;
    /**
     * 定义类装饰器元数据
     * @param target
     * @param metadata
     */
    static defineMetadata<T extends Object, M extends AbstractClassDecorator>(target: T, metadata: M): void;
    /**
     * 获取类装饰器元数据
     */
    static getMetadata<T extends Object>(target: T): ClassSet<AbstractClassDecorator> | undefined;
}
export interface ClassDecoratorConstructor<P extends any[]> {
    new (...args: P): AbstractClassDecorator;
}
export declare function reflectClass<T extends BaseConstructor>(target: T, parent?: ClassReflect): ClassReflect<T>;
