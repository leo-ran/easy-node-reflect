import { AbstractClassDecorator } from "./AbstractClassDecorator";
import { AbstractMethodDecorator } from "./AbstractMethodDecorator";
import { AbstractPropertyDecorator } from "./AbstractPropertyDecorator";
import { AbstractParameterDecorator } from "./AbstractParameterDecorator";
import { PositionalArgumentsCallback } from "../interface";
import { ClassReflect } from "./ClassReflect";
export declare class InstanceReflect<T extends AbstractClassDecorator | AbstractMethodDecorator | AbstractPropertyDecorator | AbstractParameterDecorator | Object> {
    metadata: T;
    parent: ClassReflect<any>;
    constructor(metadata: T);
    /**
     * Get metadata member value.
     * @param fieldName
     */
    getField<K extends keyof T>(fieldName: K): T[K];
    /**
     * In metadata member set member value.
     * @param fieldName
     * @param value
     */
    setField<K extends keyof T>(fieldName: K, value: T[K]): void;
    /**
     * 调用实例方法
     * @param memberName 成员名称
     * @param positionalArguments 参数
     */
    invoke<K extends keyof T, V>(memberName: K, positionalArguments: InvokeFunParameters<T[K]> | PositionalArgumentsCallback): Promise<void | V>;
    /**
     * 比较实例类型
     * @param other
     */
    instanceOf<T extends Function>(other: T): boolean;
}
declare type InvokeFunParameters<V> = V extends (...args: any[]) => any ? Parameters<V> : never;
export {};
