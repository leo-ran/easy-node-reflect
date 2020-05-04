import { ClassReflect } from "../../index";
import { BaseConstructor } from "../../interface";
export declare function reflectClass<T extends BaseConstructor>(target: T): ClassReflect<T>;
