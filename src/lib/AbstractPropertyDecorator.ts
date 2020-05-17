import {DecoratorFactory} from "../interface";
import {TargetMap} from "./TargetMap";
import {PropertySet} from "./PropertySet";
import {PropertyMap} from "./PropertyMap";
import {PropertyReflect} from "./PropertyReflect";

/**
 * 抽象属性装饰器类
 */
export abstract class AbstractPropertyDecorator  {

  /**
   * 当此属性装饰器 被装饰的属性设置属性值时 触发
   * @param propertyReflect 属性元数据映射
   * @param value 设置的值
   */
  public onSetValue?<T>(propertyReflect: PropertyReflect<any> ,value: T): Promise<T>;

  /**
   * 当此属性装饰器 被装饰的属性获取属性值时 触发
   * @param propertyReflect 属性元数据映射
   * @param value 设置的值
   */
  public async onGetValue?<T>(propertyReflect: PropertyReflect<any>, value: T): Promise<T>;

  public propertyKey?: string | symbol;

  public setPropertyKey(propertyKey: string | symbol) {
    this.propertyKey = propertyKey;
    return this;
  }

  static create<
    P extends any[],
    T extends PropertyDecoratorConstructor<P>
    >(
    IDecorator: PropertyDecoratorConstructor<P> & T
  ): DecoratorFactory<P, PropertyDecorator, T> {
    function decorator(...args: P) {
      return (target: Object, propertyKey: string | symbol):void => {
        // 定义元数据
        const metadata: AbstractPropertyDecorator = Reflect.construct(IDecorator, args);
        metadata.setPropertyKey(propertyKey);

        AbstractPropertyDecorator.defineMetadata(target, metadata, propertyKey);
      }
    }
    decorator.class = IDecorator;
    return decorator;
  }

  private static _targets: TargetMap<Object, PropertyMap<string | symbol, PropertySet<AbstractPropertyDecorator>>> = new TargetMap();

  /**
   * 根据目标类 定义元数据
   * @param target 目标类
   * @param metadata 元数据
   * @param propertyKey 目标类成员名称
   */
  static defineMetadata<
    T extends Object,
    M extends AbstractPropertyDecorator,
    P extends string | symbol,
    >(target: T, metadata: M, propertyKey: P) {

    const propertyMap = AbstractPropertyDecorator._targets.get(target) || new PropertyMap();
    const propertySet = propertyMap.get(propertyKey) || new PropertySet<AbstractPropertyDecorator>();
    propertySet.add(metadata);
    propertyMap.set(propertyKey, propertySet);
    AbstractPropertyDecorator._targets.set(target, propertyMap);
  }

  /**
   * 根据目标类获取 成员的装饰器元数据
   * @param target 目标类
   * @param propertyKey 目标类的成员名称
   */
  static getMetadata<
    T extends Object,
    P extends string | symbol,
    >(target: T, propertyKey: P): PropertySet<AbstractPropertyDecorator> | undefined {
    const propertyMap = AbstractPropertyDecorator._targets.get(target);
    if (propertyMap instanceof PropertyMap) {
      const propertySet = propertyMap.get(propertyKey);
      if (propertySet instanceof PropertySet) {
        return propertySet;
      }
    }
    return undefined;
  }

  /**
   * 根据目标类 获取包含属性装饰器的成员 名称列表
   * @param target
   */
   static getPropertyKeys<T extends Object>(target: T): IterableIterator<string|symbol> | undefined {
    const propertyMap = AbstractPropertyDecorator._targets.get(target);
    if (propertyMap instanceof PropertyMap) {
      return propertyMap.keys();
    }
  }
}

export interface PropertyDecoratorConstructor<P extends any[]> {
  new (...args: P): AbstractPropertyDecorator;
}