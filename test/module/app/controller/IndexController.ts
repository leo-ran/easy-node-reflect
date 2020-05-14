import {EnController, EnGet, NonNullable} from "../../../decorator";
import {HttpPathParam} from "@easy-node/server";

@EnController("/index")
export class IndexController {

  @EnGet("/list/:id")
  public async list(pathParam: HttpPathParam<any>, @NonNullable index: number) {
    return pathParam.get("id");
  }

  @EnGet("/info")
  public info() {
    return {
      name: "",
      age: ""
    }
  }

}