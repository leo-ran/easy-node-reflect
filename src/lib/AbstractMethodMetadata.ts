/**
 * 抽象方法装饰器元数据类
 */
export abstract class AbstractMethodMetadata<T = any> {
  public descriptor?: TypedPropertyDescriptor<T>;
  public propertyKey?: string | symbol;

  public setDescriptor(descriptor: TypedPropertyDescriptor<T>): this {
    this.descriptor = descriptor;
    return this;
  }

  public setPropertyKey(propertyKey: string | symbol) {
    this.propertyKey = propertyKey;
    return this;
  }
}
