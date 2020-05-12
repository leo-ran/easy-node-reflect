import { ClassReflect } from "./ClassReflect";
import { ParameterReflect } from "./ParameterReflect";
import { AbstractMethodDecorator } from "./AbstractMethodDecorator";
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
    static create<R extends Function = any>(parent: ClassReflect<any>, propertyKey: string | symbol, isStatic?: boolean): MethodReflect<R>;
}
/**
 * 映射方法
 * @param classReflect 类映射对象
 * @param key 方法的名称
 */
export declare function reflectMethod<T extends Function = any>(classReflect: ClassReflect, key: string | symbol): MethodReflect<T> | undefined;
