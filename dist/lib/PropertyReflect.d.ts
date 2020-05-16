import { ClassReflect } from "./ClassReflect";
import { AbstractPropertyDecorator } from "./AbstractPropertyDecorator";
import { DecoratorFactory } from "../interface";
export declare class PropertyReflect<T extends Function = any> {
    parent: ClassReflect<any>;
    propertyKey: string | symbol;
    isStatic: boolean;
    _metadata?: Array<AbstractPropertyDecorator>;
    type: T;
    protected constructor(parent: ClassReflect<any>, propertyKey: string | symbol, isStatic?: boolean);
    set metadata(value: AbstractPropertyDecorator[]);
    get metadata(): AbstractPropertyDecorator[];
    getTarget(): any;
    getOwnTarget(): unknown;
    /**
     * 检测是否包含装饰器
     * @param decorator
     */
    hasDecorator(decorator: DecoratorFactory<any, any, any>): boolean;
    static create<R extends Function = any>(parent: ClassReflect<any>, propertyKey: string | symbol, isStatic?: boolean): PropertyReflect<R>;
}
/**
 * 属性映射
 * @param classReflect 类元数据映射对象
 * @param key 属性的名称
 */
export declare function reflectProperty<T extends Function = any>(classReflect: ClassReflect, key: string | symbol): PropertyReflect<T> | undefined;
