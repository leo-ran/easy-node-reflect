export declare class ClassSet<T> extends Set<T> {
    toArray(): T[];
    addAll(...members: T[]): this;
    static create<T>(...members: T[]): ClassSet<T>;
    static from<T extends ClassSet<any>>(classSet: T): ClassSet<T>;
}
