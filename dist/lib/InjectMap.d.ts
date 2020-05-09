/**
 * 参数注入关系映射map
 */
import { BaseConstructor } from "../interface";
export declare class InjectMap<K extends BaseConstructor = BaseConstructor, V extends object = object> extends Map<K, V> {
}
