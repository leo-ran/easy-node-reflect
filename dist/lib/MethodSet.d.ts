export declare class MethodSet<T> extends Set<T> {
    toArray(): T[];
    /**
     * 添加多个成员
     * @param members
     */
    addAll(...members: T[]): this;
    /**
     * 创建
     * @param members
     */
    static create<T>(...members: T[]): MethodSet<T>;
    /**
     * 克隆
     * @param classSet
     */
    static from<T extends MethodSet<any>>(classSet: T): MethodSet<T>;
}
