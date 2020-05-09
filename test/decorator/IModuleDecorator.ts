import {AbstractClassDecorator, BaseDecorator, InstanceReflect, MethodReflect} from "../../src";
import {InjectMap} from "../../src/lib/InjectMap";

export class IModuleDecorator extends AbstractClassDecorator {
  constructor(public path: string) {
    super();
  }

  public onNewInstance<R extends Function>(methodReflect: MethodReflect<R>): InjectMap {
    return new InjectMap();
  }

  public onNewInstanced<T extends BaseDecorator>(instance: InstanceReflect<T>): void {
    return;
  }
}