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