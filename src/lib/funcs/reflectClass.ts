import {ClassReflect} from "../../index";
import {BaseConstructor} from "../../interface";

const classReflects = new Map<BaseConstructor, ClassReflect<any>>();

export function reflectClass<T extends BaseConstructor>(target: T): ClassReflect<T> {
  // 添加缓存处理
  return classReflects.get(target) || new ClassReflect<T>(target);
}