import {AbstractParameterDecorator, ParameterReflect} from "../../src";

export class NonNullableDecorator extends  AbstractParameterDecorator {
  onInject<T>(parameterReflect: ParameterReflect<any>, value: T): T {
    const {parent, type} = parameterReflect;
    if (type === undefined) {
      throw new Error(`Class ${parent.parent.getTargetName()} method ${(this.propertyKey||"").toString()}() parameter ${this.parameterIndex} type, Cannot be null or undefined.`);
    }

    if (value === undefined || value === null)  {
      throw new Error(`Class ${parent.parent.getTargetName()} method ${(this.propertyKey||"").toString()}() parameter ${this.parameterIndex} Cannot be null or undefined.`);
    }
    return value;
  }
}