import {AbstractMethodDecorator, MethodReflect} from "../../src";

export class IMethodDecorator extends AbstractMethodDecorator {
  constructor(public path: string) {
    super();
  }

  public onInvoked<V>(methodReflect: MethodReflect<any>, value: V): Promise<V> | V {
    return value;
  }
}