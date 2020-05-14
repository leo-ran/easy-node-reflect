export class InjectMap<K extends object = object, V = any> extends Map<K, V> {
  public mergeInTarget(target: Map<any, any>) {
    this.forEach((v, k) => target.set(k, v));
  }
}