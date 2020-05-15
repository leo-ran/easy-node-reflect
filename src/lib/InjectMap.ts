export class InjectMap<K extends object = object, V = any> extends Map<K, V> {
  public mergeInTarget(target: Map<any, any>) {
    this.forEach((v, k) => target.set(k, v));
  }

  static from<K extends object = object, V = any>(map: Map<K, V>): InjectMap<K, V> {
    const injectMap = new InjectMap<K, V>();
    map.forEach((value, key) => {
      injectMap.set(key, value);
    })
    return injectMap;
  }
}