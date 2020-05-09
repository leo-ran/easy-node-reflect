import {IModuleDecorator} from "./IModuleDecorator";
import {
  AbstractClassDecorator,
  AbstractMethodDecorator,
  AbstractParameterDecorator,
  AbstractPropertyDecorator
} from "../../src";
import {IMethodDecorator} from "./IMethodDecorator";
import {NonNullableDecorator} from "./NonNullableDecorator";
import {IPropertyDecorator} from "./IPropertyDecorator";

export const IModule = AbstractClassDecorator.create(IModuleDecorator);
export const IMethod = AbstractMethodDecorator.create(IMethodDecorator);
export const IProperty = AbstractPropertyDecorator.create(IPropertyDecorator);
export const nonNullable = AbstractParameterDecorator.create(NonNullableDecorator)();