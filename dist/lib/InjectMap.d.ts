export declare class InjectMap<K extends object = object, V = any> extends Map<K, V> {
    mergeInTarget(target: Map<any, any>): void;
    static from<K extends object = object, V = any>(map: Map<K, V>): InjectMap<K, V>;
}
