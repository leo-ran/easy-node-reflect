/**
 * 抽象属性装饰器元数据类
 */
export abstract class AbstractPropertyMetadata {

  public propertyKey?: string | symbol;

  public setPropertyKey(propertyKey: string | symbol) {
    this.propertyKey = propertyKey;
    return this;
  }
}