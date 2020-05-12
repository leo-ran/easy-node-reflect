import { DecoratorFactory } from "../interface";
import { PropertySet } from "./PropertySet";
import { PropertyReflect } from "./PropertyReflect";
import { ClassReflect } from "./ClassReflect";
/**
 * 抽象属性装饰器类
 */
export declare abstract class AbstractPropertyDecorator {
    /**
     * 当此属性装饰器 被装饰的属性设置属性值时 触发
     * 不支持异步
     * @param classReflect 属性所在类的元数据映射
     * @param propertyReflect 属性元数据映射
     * @param value 设置的值
     * @return T 返回 设置的值 或 更新设置的值
     */
    onSetValue?<T>(classReflect: ClassReflect, propertyReflect: PropertyReflect<any>, value: T): T;
    /**
     * 当此属性装饰器 被装饰的属性获取属性值时 触发
     * 不支持异步
     * @param classReflect 属性所在类的元数据映射
     * @param propertyReflect 属性元数据映射
     * @param value 设置的值
     */
    onGetValue?<T>(classReflect: ClassReflect, propertyReflect: PropertyReflect<any>, value: T): void;
    propertyKey?: string | symbol;
    setPropertyKey(propertyKey: string | symbol): this;
    static create<P extends any[], T extends PropertyDecoratorConstructor<P>>(IDecorator: PropertyDecoratorConstructor<P> & T): DecoratorFactory<P, PropertyDecorator, T>;
    private static _targets;
    /**
     * 根据目标类 定义元数据
     * @param target 目标类
     * @param metadata 元数据
     * @param propertyKey 目标类成员名称
     */
    static defineMetadata<T extends Object, M extends AbstractPropertyDecorator, P extends string | symbol>(target: T, metadata: M, propertyKey: P): void;
    /**
     * 根据目标类获取 成员的装饰器元数据
     * @param target 目标类
     * @param propertyKey 目标类的成员名称
     */
    static getMetadata<T extends Object, P extends string | symbol>(target: T, propertyKey: P): PropertySet<AbstractPropertyDecorator> | undefined;
    /**
     * 根据目标类 获取包含属性装饰器的成员 名称列表
     * @param target
     */
    static getPropertyKeys<T extends Object>(target: T): IterableIterator<string | symbol> | undefined;
}
export interface PropertyDecoratorConstructor<P extends any[]> {
    new (...args: P): AbstractPropertyDecorator;
}
