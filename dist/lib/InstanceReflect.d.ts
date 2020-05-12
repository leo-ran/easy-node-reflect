import { ClassReflect } from "./ClassReflect";
export declare class InstanceReflect<T extends object> {
    metadata: T;
    parent: ClassReflect<any>;
    protected constructor(metadata: T);
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
     * @param positionalArgumentsCallback 参数
     */
    invoke<K extends keyof T, V>(memberName: K): Promise<void | V>;
    /**
     * 比较实例类型
     * @param other
     */
    instanceOf<T extends Function>(other: T): boolean;
    static create<T extends object>(metadata: T): InstanceReflect<T>;
}
/**
 * 映射实例
 * @param o
 */
export declare function reflectInstance<T extends object>(o: T): InstanceReflect<T> | undefined;
