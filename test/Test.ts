import {IMethod, IModule, IProperty, nonNullable} from "./decorator";

@IModule("/")
export class Test {

  @IProperty()
  public a: string;

  @IMethod("/")
  public test(@nonNullable test: string) {
    return true;
  }
}