export declare class ParameterSet<T> extends Set<T> {
    toArray(): T[];
    addAll(...members: T[]): this;
    static create<T>(...members: T[]): ParameterSet<T>;
    static from<T extends ParameterSet<any>>(classSet: T): ParameterSet<T>;
}
