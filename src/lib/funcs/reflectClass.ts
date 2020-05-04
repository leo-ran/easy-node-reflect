import {ClassReflect} from "../../index";
import {BaseConstructor} from "../../interface";

export function reflectClass<T extends BaseConstructor>(target: T): ClassReflect<T> {
  return new ClassReflect<T>(target);
}