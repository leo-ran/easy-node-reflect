import { ClassReflect } from "./ClassReflect";
import { ParameterReflect } from "./ParameterReflect";
import { AbstractMethodDecorator } from "./AbstractMethodDecorator";
import { DecoratorFactory } from "../interface";
import { InjectMap } from "./InjectMap";
export declare class MethodReflect<R extends Function = any> {
    parent: ClassReflect<any>;
    propertyKey: string | symbol;
    isStatic: boolean;
    private _metadata?;
    /**
     * 元数据列表
     */
    get metadata(): Array<AbstractMethodDecorator>;
    set metadata(value: Array<AbstractMethodDecorator>);
    isGetter: boolean;
    isSetter: boolean;
    isConstructor: boolean;
    /**
     * 参数列表
     */
    parameters: Array<ParameterReflect>;
    returnType: R;
    protected constructor(parent: ClassReflect<any>, propertyKey: string | symbol, isStatic?: boolean);
    getTarget(): any;
    getOwnTarget(): unknown;
    /**
     * 检测是否包含装饰器
     * @param decorator
     */
    hasDecorator(decorator: DecoratorFactory<any, any, any>): boolean;
    /**
     * 查找是否有包含 `type` 的参数
     * @param type
     */
    hasType(type: object): boolean;
    /**
     * 查找是否包含 `decorator` 装饰器
     * @param decorator
     */
    hasParameterDecorator(decorator: DecoratorFactory<any, any, any>): boolean;
    handlerBeforeInvoke(injectMap: InjectMap): Promise<void>;
    /**
     * 处理函数调用后的元数据回调
     * @param classReflect
     * @param instanceReflect
     * @param value
     */
    handlerReturn<T>(value: T): Promise<T>;
    static create<R extends Function = any>(parent: ClassReflect<any>, propertyKey: string | symbol, isStatic?: boolean): MethodReflect<R>;
}
export interface MethodReflectMapParameterCallback<T = any> {
    async(): Promise<T>;
}
/**
 * 映射方法
 * @param classReflect 类映射对象
 * @param key 方法的名称
 */
export declare function reflectMethod<T extends Function = any>(classReflect: ClassReflect, key: string | symbol): MethodReflect<T> | undefined;
