import {ClassReflect} from "./ClassReflect";
import {AbstractPropertyDecorator} from "./AbstractPropertyDecorator";
import {parsePropertyReflectMetadata, parsePropertyReflectType} from "./funcs/public";
import {DecoratorFactory} from "../interface";

const propertyReflectCache: Map<ClassReflect, Map<string|symbol, PropertyReflect>> = new Map();

export class PropertyReflect<T extends Function = any> {
  public _metadata?: Array<AbstractPropertyDecorator>;
  public type: T;
  protected constructor(
    public parent: ClassReflect<any>,
    public propertyKey: string | symbol,
    public isStatic: boolean = false,
  ) {parsePropertyReflectType(this)}


  public set metadata(value) {
      this._metadata = value;
  }

  public get metadata(): AbstractPropertyDecorator[] {
    if (!this._metadata) {
      this._metadata = [];
      parsePropertyReflectMetadata(this)
    }

    return this._metadata;
  }

  public getTarget() {
    return this.parent.getTarget();
  }

  public getOwnTarget() {
    return this.parent.getOwnTarget();
  }

  /**
   * 检测是否包含装饰器
   * @param decorator
   */
  public hasDecorator<T extends AbstractPropertyDecorator>(decorator: T | DecoratorFactory<any, any, any>): boolean {
    return Boolean(
      this.metadata.find((d) => {
        if (typeof  decorator === "function") {
          return d === decorator.class
        } else {
          return  d === decorator
        }
      })
    );
  }

  static create<R extends Function = any>(parent: ClassReflect<any>, propertyKey: string | symbol, isStatic: boolean = false): PropertyReflect<R> {
    // 添加缓存处理
    const propertyReflectMaps = propertyReflectCache.get(parent) || new Map<string|symbol, PropertyReflect>();
    const propertyReflect = propertyReflectMaps.get(propertyKey) || new PropertyReflect<any>(parent, propertyKey, isStatic);
    propertyReflectMaps.set(propertyKey, propertyReflect);
    propertyReflectCache.set(parent, propertyReflectMaps);
    return propertyReflect;
  }

}

/**
 * 属性映射
 * @param classReflect 类元数据映射对象
 * @param key 属性的名称
 */
export function reflectProperty<T extends Function = any>(classReflect: ClassReflect, key: string | symbol): PropertyReflect<T> | undefined {
  const maps = propertyReflectCache.get(classReflect);
  if (maps) return maps.get(key);
}