import {AbstractClassDecorator} from "./AbstractClassDecorator";
import {AbstractMethodDecorator} from "./AbstractMethodDecorator";
import {AbstractPropertyDecorator} from "./AbstractPropertyDecorator";
import {AbstractParameterDecorator} from "./AbstractParameterDecorator";

export class InstanceReflect<
  T extends AbstractClassDecorator | AbstractMethodDecorator | AbstractPropertyDecorator | AbstractParameterDecorator
  > {
  constructor(
    public metadata: T,
  ) {}

  /**
   * Get metadata member value.
   * @param fieldName
   */
  public getField<K extends keyof  T>(fieldName: K) {
    return this.metadata[fieldName];
  }

  /**
   * In metadata member set member value.
   * @param fieldName
   * @param value
   */
  public setField<K extends keyof T>(fieldName: K, value: T[K]) {
    this.metadata[fieldName] = value;
  }

  /**
   * 调用实例方法
   * @param memberName 成员名称
   * @param positionalArguments 参数
   */
  public invoke<K extends keyof T>(memberName: K, positionalArguments: InvokeFunParameters<T[K]>) {
    const method = this.metadata[memberName];
    if (typeof method === "function") {
      method.apply(this, positionalArguments);
    }
  }

  /**
   * 比较实例类型
   * @param other
   */
  public instanceOf<T extends Function>(other: T): boolean {
    return this.metadata instanceof other;
  }

  // 运行时类型
  public runtimeType = InstanceReflect;
}

type InvokeFunParameters<V> = V extends (...args: any[]) => any ? Parameters<V> : never;