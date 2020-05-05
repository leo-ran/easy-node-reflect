import { AbstractClassDecorator } from "./AbstractClassDecorator";
import { AbstractMethodDecorator } from "./AbstractMethodDecorator";
import { AbstractPropertyDecorator } from "./AbstractPropertyDecorator";
import { AbstractParameterDecorator } from "./AbstractParameterDecorator";
export declare class InstanceReflect<T extends AbstractClassDecorator | AbstractMethodDecorator | AbstractPropertyDecorator | AbstractParameterDecorator> {
    metadata: T;
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
    invoke<K extends keyof T>(memberName: K, positionalArguments: InvokeFunParameters<T[K]>): void;
    /**
     * 比较实例类型
     * @param other
     */
    instanceOf<T extends Function>(other: T): boolean;
    runtimeType: typeof InstanceReflect;
}
declare type InvokeFunParameters<V> = V extends (...args: any[]) => any ? Parameters<V> : never;
export {};
