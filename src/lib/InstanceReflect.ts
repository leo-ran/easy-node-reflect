import {AbstractClassDecorator} from "./AbstractClassDecorator";
import {AbstractMethodDecorator} from "./AbstractMethodDecorator";
import {AbstractPropertyDecorator} from "./AbstractPropertyDecorator";
import {AbstractParameterDecorator} from "./AbstractParameterDecorator";
import {PositionalArgumentsCallback} from "../interface";
import {ClassReflect} from "./ClassReflect";
import {MethodReflect} from "./MethodReflect";
import {PropertyReflect} from "./PropertyReflect";
import {reflectClass} from "./funcs/reflectClass";

export class InstanceReflect<
  T extends AbstractClassDecorator | AbstractMethodDecorator | AbstractPropertyDecorator | AbstractParameterDecorator | Object
  > {
  public parent: ClassReflect<any>;
  constructor(
    public metadata: T,
  ) {
    // @ts-ignore
    this.parent = reflectClass(metadata.__proto__);
  }

  /**
   * Get metadata member value.
   * @param fieldName
   */
  public getField<K extends keyof  T>(fieldName: K) {
    const {parent} = this;
    let value = this.metadata[fieldName];
    const propertyReflect = parent.instanceMembers.get(fieldName as string) || parent.staticMembers.get(fieldName as string);
    if (propertyReflect instanceof PropertyReflect) {
      const propertyReflectMetadata = propertyReflect.metadata;
      const length = propertyReflectMetadata.length;
      for (let i = 0; i < length; i++) {
        const metadata = propertyReflect.metadata[i].metadata;
        if (typeof metadata.onGetValue === "function") {
          metadata.onGetValue<T[K]>(propertyReflect, value);
        }
      }
    }

    return value;
  }

  /**
   * In metadata member set member value.
   * @param fieldName
   * @param value
   */
  public setField<K extends keyof T>(fieldName: K, value: T[K]) {
    const {parent} = this;
    const propertyReflect = parent.instanceMembers.get(fieldName as string) || parent.staticMembers.get(fieldName as string);
    if (propertyReflect instanceof PropertyReflect) {
      const propertyReflectMetadata = propertyReflect.metadata;
      const length = propertyReflectMetadata.length;
      for (let i = 0; i < length; i++) {
        const metadata = propertyReflect.metadata[i].metadata;
        if (typeof metadata.onSetValue === "function") {
          this.metadata[fieldName] = metadata.onSetValue<T[K]>(propertyReflect, value);
        }
      }
    } else {
      this.metadata[fieldName] = value;
    }
  }

  /**
   * 调用实例方法
   * @param memberName 成员名称
   * @param positionalArguments 参数
   */
  public async invoke<K extends keyof T, V>(memberName: K, positionalArguments: InvokeFunParameters<T[K]> | PositionalArgumentsCallback): Promise<void | V> {
    const {parent} = this;
    const method = this.metadata[memberName];
    if (typeof method === "function") {
      // 如果是由 ClassReflect 创建的实例
      // metadata是一个类的实例
      const methodReflect = parent.instanceMembers.get(memberName as string) || parent.staticMembers.get(memberName as string);
      if (methodReflect instanceof MethodReflect) {
        const methodReflectMetadata = methodReflect.metadata;
        const length = methodReflectMetadata.length;
        if (positionalArguments instanceof Array) {
          if (positionalArguments.length !== methodReflect.parameters.length) {
            throw new Error(`${memberName} function, Expected ${methodReflect.parameters.length} arguments, but got ${positionalArguments.length}.`)
          }

          // 调用参数装饰器钩子
          // @ts-ignore
          positionalArguments = methodReflect.parameters.map((parameterReflect, i) => {
            // @ts-ignore
            let value: T[K] = positionalArguments[i] as T[K];
            parameterReflect.metadata.forEach((instanceReflect) => {
              if (typeof instanceReflect.metadata.onInject === "function") {
                value = instanceReflect.metadata.onInject(parameterReflect, value);
              }
            });
            return value;
          });
        } else {
          // @ts-ignore
          positionalArguments = positionalArguments(parent, methodReflect.parameters);

          methodReflect.parameters.forEach((parameterReflect, i) => {
            // @ts-ignore
            positionalArguments = parameterReflect.metadata.map((instanceReflect) => {
              // @ts-ignore
              let value: T[K] = positionalArguments[i] as T[K];
              parameterReflect.metadata.forEach((instanceReflect) => {
                if (typeof instanceReflect.metadata.onInject === "function") {
                  value = instanceReflect.metadata.onInject(parameterReflect, value);
                }
              });
              return value;
            });
          });
        }
        let result: V = await method.apply(this, positionalArguments);
        // 调用方法上 方法装饰器的钩子
        for (let i = 0; i < length; i++) {
          const {metadata} = methodReflectMetadata[i];
          if (typeof metadata.onInvoked === "function") {
            result = await metadata.onInvoked<V>(methodReflect, result);
          }
        }
        return result;
      }
      return await method.apply(this, positionalArguments);
    }
  }

  /**
   * 比较实例类型
   * @param other
   */
  public instanceOf<T extends Function>(other: T): boolean {
    return this.metadata instanceof other;
  }
}

type InvokeFunParameters<V> = V extends (...args: any[]) => any ? Parameters<V> : never;