/**
 * 抽象参数装饰器元数据类
 */
export declare abstract class AbstractParameterMetadata {
    parameterIndex?: number;
    propertyKey?: string | symbol;
    setPropertyKey(propertyKey: string | symbol): this;
    setParameterIndex(index: number): void;
}
