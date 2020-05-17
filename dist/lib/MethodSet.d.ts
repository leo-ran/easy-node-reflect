export declare class MethodSet<T> extends Set<T> {
    toArray(): T[];
    addAll(...members: T[]): this;
    static create<T>(...members: T[]): MethodSet<T>;
    static from<T extends MethodSet<any>>(classSet: T): MethodSet<T>;
}
