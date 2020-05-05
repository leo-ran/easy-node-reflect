/**
 * 抽象方法装饰器元数据类
 */
export declare abstract class AbstractMethodMetadata<T = any> {
    descriptor?: TypedPropertyDescriptor<T>;
    propertyKey?: string | symbol;
    setDescriptor(descriptor: TypedPropertyDescriptor<T>): this;
    setPropertyKey(propertyKey: string | symbol): this;
}
