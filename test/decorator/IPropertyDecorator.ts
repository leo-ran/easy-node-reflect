import {AbstractPropertyDecorator, PropertyReflect} from "../../src";
import {iDebuglog} from "../../src/utils";

export class IPropertyDecorator extends AbstractPropertyDecorator {
  onSetValue<T>(propertyReflect: PropertyReflect<any>, value: T): T {
    return value;
  }

  onGetValue<T>(propertyReflect: PropertyReflect<any>, value: T): void {
  }
}