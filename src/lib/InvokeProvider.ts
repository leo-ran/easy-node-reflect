/**
 * 调用实例的成员方法是 提供的依赖映射
 *
 */
export class InvokeProvider {
  protected provider: Map<object, object>  = new Map();

  public set<K extends object, V extends object>(providerKey: K, service: V) {
    this.provider.set(providerKey, service);
    return this;
  }

  public get<K extends object, V extends object = any>(providerKey: K): V | undefined {
    return this.provider.get(providerKey) as any;
  }
}