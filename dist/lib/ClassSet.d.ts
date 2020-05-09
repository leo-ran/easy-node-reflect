export declare class ClassSet<T> extends Set<T> {
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
    static create<T>(...members: T[]): ClassSet<T>;
    /**
     * 克隆
     * @param classSet
     */
    static from<T extends ClassSet<any>>(classSet: T): ClassSet<T>;
}
