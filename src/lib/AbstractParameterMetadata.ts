/**
 * 抽象参数装饰器元数据类
 */
export abstract class AbstractParameterMetadata {
  public parameterIndex?: number;
  public propertyKey?: string | symbol;

  public setPropertyKey(propertyKey: string | symbol) {
    this.propertyKey = propertyKey;
    return this;
  }

  public setParameterIndex(index: number) {
    this.parameterIndex = index;
  }
}