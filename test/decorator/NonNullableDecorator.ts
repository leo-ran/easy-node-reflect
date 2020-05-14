import {AbstractParameterDecorator, ParameterReflect} from "../../src";

export class NonNullableDecorator extends AbstractParameterDecorator {
  public async onInject<T>(parameterReflect: ParameterReflect, value: T): Promise<T> {
    if (value === null || value === undefined) {
      throw new Error(`${parameterReflect.propertyKey.toString()}() parameter index ${parameterReflect.parameterIndex} is NonNullable.`)
    }
    return value;``
  }
}