import { DecoratorFactory } from "../interface";
import { ClassSet } from "./ClassSet";
import { InstanceReflect } from "./InstanceReflect";
import { MethodReflect } from "./MethodReflect";
import { InjectMap } from "./InjectMap";
import { ClassReflect } from "./ClassReflect";
/**
 * 抽象类装饰器类
 */
export declare abstract class AbstractClassDecorator {
    /**
     * 当被此装饰器装饰的类实例化后 触发
     * @param instanceReflect 类实例化后的 实例反射对象
     * @param classReflect 当前类的 类映射对象
     */
    onNewInstanced?<T extends object>(instance: InstanceReflect<T>, classReflect: ClassReflect): void;
    /**
     * 当被此装饰器装饰的类实例化时 触发
     * 不支持异步
     * @param methodReflect 构造函数的函数反射对象
     * @param classReflect 当前类的 类映射对象
     * @return InjectMap 返回构造函数的注入映射关系map
     */
    onNewInstance?<R extends Function>(methodReflect: MethodReflect<R>, classReflect: ClassReflect): InjectMap;
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
