/**
 * 参数注入关系映射map
 */
import {BaseConstructor} from "../interface";
import {InstanceReflect} from "./InstanceReflect";

export class InjectMap<
  K extends BaseConstructor = BaseConstructor,
  V extends object = object
  > extends Map<K, V> {}