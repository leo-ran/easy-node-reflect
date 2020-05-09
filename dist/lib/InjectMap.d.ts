/**
 * 参数注入关系映射map
 */
import { BaseConstructor } from "../interface";
import { InstanceReflect } from "./InstanceReflect";
export declare class InjectMap<K extends BaseConstructor = BaseConstructor, V extends InstanceReflect<any> = InstanceReflect<any>> extends Map<K, V> {
}
