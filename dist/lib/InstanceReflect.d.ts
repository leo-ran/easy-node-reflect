import { ClassReflect } from "./ClassReflect";
import { InjectMap } from "./InjectMap";
export declare class InstanceReflect<T extends object> {
    instance: T;
    parent: ClassReflect<any>;
    protected constructor(instance: T);
    getField<K extends keyof T>(fieldName: K): Promise<T[K]>;
    setField<K extends keyof T>(fieldName: K, value: T[K]): Promise<void>;
    invoke<K extends keyof T, V>(memberName: K, injectMap: InjectMap, memberType?: "static" | "instance"): Promise<void | V>;
    instanceOf<T extends Function>(other: T): boolean;
    static create<T extends object>(metadata: T): InstanceReflect<T>;
}
export declare function reflectInstance<T extends object>(o: T): InstanceReflect<T> | undefined;
