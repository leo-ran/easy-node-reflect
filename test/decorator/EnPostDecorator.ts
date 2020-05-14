import {EnRequestDecorator} from "./EnRequestDecorator";

export class EnPostDecorator extends EnRequestDecorator {
  public constructor(
    path: string,
  ) {
    super(path, "GET");
  }
}