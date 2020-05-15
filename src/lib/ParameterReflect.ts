import {MethodReflect} from "./MethodReflect";
import {AbstractParameterDecorator} from "./AbstractParameterDecorator";
import {parseParameterMetadata} from "./funcs/public";
import {DecoratorFactory} from "../interface";
import {InjectMap} from "./InjectMap";

const parameterReflectCache: Map<MethodReflect, Map<number, ParameterReflect>> = new Map();

export class ParameterReflect<T = any> {
  private _metadata?: Array<AbstractParameterDecorator>;
  public constructor(
    public parent: MethodReflect,
    public type: T,
    public propertyKey: string | symbol,
    public parameterIndex: number,
  ) {}

  public set metadata(value) {
    this._metadata = value;
  }

  public get metadata(): Array<AbstractParameterDecorator> {
    // 懒加载 缓存处理
    if (!this._metadata) {
      this._metadata = [];
      parseParameterMetadata(this)
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
   * 处理注入钩子回调
   * @param classReflect
   * @param methodReflect
   * @param instanceReflect
   * @param parameterReflect
   * @param value
   */
  public async handlerInject<T>(injectMap: InjectMap, value: T): Promise<T> {
    const length = this.metadata.length;
    const metadata = this.metadata;
    for (let i = 0; i < length; i++) {
      const parameterDecorator = metadata[i]
      if (parameterDecorator instanceof AbstractParameterDecorator && typeof parameterDecorator.onInject === "function") {
        value = await parameterDecorator.onInject<T>(this, injectMap, value);
      }
    }
    return value;
  }

  /**
   * 检测是否包含装饰器
   * @param decorator
   */
  public hasDecorator<T extends AbstractParameterDecorator>(decorator: T | DecoratorFactory<any, any, any>): boolean {
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

  static create<T = any>(
    parent: MethodReflect,
    type: T,
    propertyKey: string | symbol,
    parameterIndex: number
  ): ParameterReflect<T> {
    const parameterReflectMaps = parameterReflectCache.get(parent) || new Map();
    const parameterReflect = parameterReflectMaps.get(parameterIndex) || new ParameterReflect<T>(parent, type, propertyKey, parameterIndex);
    parameterReflectMaps.set(parameterIndex, parameterReflect);
    parameterReflectCache.set(parent, parameterReflectMaps);
    return parameterReflect;
  }
}

/**
 * 参数映射
 * @param methodReflect 方法元数据映射对象
 * @param index 参数的序号
 */
export function reflectParameter<T = any>(methodReflect: MethodReflect, index: number): ParameterReflect<T> | undefined {
  const maps = parameterReflectCache.get(methodReflect);
  if (maps) return maps.get(index);
}

export interface MapParameterDecoratorCallback {
  <T>(parameterReflect: ParameterReflect): void;
}