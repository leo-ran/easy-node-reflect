import {EnApplication} from "./decorator";
import {AppModule} from "./module/app/AppModule";
import {HttpContext, HttpServer} from "@easy-node/server";
import {reflectClass} from "../src";

@EnApplication([
  AppModule
])
export class Application extends HttpServer {
  public async handlerResponse(context: HttpContext): Promise<void> {
    await this.router.onResponse(context);
  }
}

const applicationClassReflect =  reflectClass(Application);

applicationClassReflect.newInstance().then(res => {
  res.instance.listen(3000);
});