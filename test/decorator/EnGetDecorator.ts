import {EnRequestDecorator} from "./EnRequestDecorator";

export class EnGetDecorator extends EnRequestDecorator {
  public constructor(
    path: string,
  ) {
    super(path, "GET");
  }
}