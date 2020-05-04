/**
 * 抽象属性装饰器元数据类
 */
export declare abstract class AbstractPropertyMetadata {
    propertyKey?: string | symbol;
    setPropertyKey(propertyKey: string | symbol): this;
}
