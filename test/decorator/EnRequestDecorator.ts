import {AbstractMethodDecorator, InjectMap, MethodReflect} from "../../src";

export class EnRequestDecorator extends AbstractMethodDecorator {
  public constructor(
    public path: string,
    public method: string,
  ) {
    super();
  }

  async onBeforeInvoke(methodReflect: MethodReflect, injectMap: InjectMap): Promise<void> {
    console.log(injectMap);
  }

  async onInvoked<V>(methodReflect: MethodReflect<any>, value: V): Promise<V> {
    console.log(value);
    return value;
  }
}