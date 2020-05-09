import {AbstractClassDecorator} from "./lib/AbstractClassDecorator";
import {AbstractParameterDecorator} from "./lib/AbstractParameterDecorator";
import {AbstractPropertyDecorator} from "./lib/AbstractPropertyDecorator";
import {AbstractMethodDecorator} from "./lib/AbstractMethodDecorator";
import {ClassReflect} from "./lib/ClassReflect";
import {MethodReflect} from "./lib/MethodReflect";
import {PropertyReflect} from "./lib/PropertyReflect";
import {ParameterReflect} from "./lib/ParameterReflect";

export interface DecoratorFactory<
  P extends any[],
  D extends ClassDecorator | MethodDecorator | PropertyDecorator | ParameterDecorator,
  T,
  > {
  (...args: P): D;
  class: T;
}

export interface BaseConstructor {
  new (...args: any[]): any;
  __proto__?: BaseConstructor;
}

export type BaseDecorator = AbstractClassDecorator | AbstractParameterDecorator | AbstractMethodDecorator | AbstractPropertyDecorator;
export type BaseReflect = ClassReflect | MethodReflect | PropertyReflect | ParameterReflect;

export type NewInstanceCallback = <T extends BaseConstructor>(classReflect: ClassReflect<T>, parameters: ParameterReflect<any>[]) => any[];

export type PositionalArgumentsCallback = NewInstanceCallback;