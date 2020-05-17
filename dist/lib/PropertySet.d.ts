export declare class PropertySet<T> extends Set<T> {
    toArray(): T[];
    addAll(...members: T[]): this;
    static create<T>(...members: T[]): PropertySet<T>;
    static from<T extends PropertySet<any>>(classSet: T): PropertySet<T>;
}
