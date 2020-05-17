import { MethodReflect } from "./MethodReflect";
import { AbstractParameterDecorator } from "./AbstractParameterDecorator";
import { DecoratorFactory } from "../interface";
import { InjectMap } from "./InjectMap";
export declare class ParameterReflect<T = any> {
    parent: MethodReflect;
    type: T;
    propertyKey: string | symbol;
    parameterIndex: number;
    private _metadata?;
    constructor(parent: MethodReflect, type: T, propertyKey: string | symbol, parameterIndex: number);
    set metadata(value: Array<AbstractParameterDecorator>);
    get metadata(): Array<AbstractParameterDecorator>;
    getTarget(): any;
    getOwnTarget(): unknown;
    /**
     * 处理注入钩子回调
     * @param injectMap
     * @param value
     */
    handlerInject<T>(injectMap: InjectMap, value: T): Promise<T>;
    /**
     * 检测是否包含装饰器
     * @param decorator
     */
    hasDecorator<T extends AbstractParameterDecorator>(decorator: T | DecoratorFactory<any, any, any>): boolean;
    static create<T = any>(parent: MethodReflect, type: T, propertyKey: string | symbol, parameterIndex: number): ParameterReflect<T>;
}
/**
 * 参数映射
 * @param methodReflect 方法元数据映射对象
 * @param index 参数的序号
 */
export declare function reflectParameter<T = any>(methodReflect: MethodReflect, index: number): ParameterReflect<T> | undefined;
export interface MapParameterDecoratorCallback {
    <T>(parameterReflect: ParameterReflect): void;
}
