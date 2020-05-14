import {EnModule} from "../../decorator";
import {IndexController} from "./controller/IndexController";

@EnModule({
  path: "/app",
  controllers: [
    IndexController,
  ]
})
export class AppModule {

}