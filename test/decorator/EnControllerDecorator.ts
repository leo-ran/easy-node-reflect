import {AbstractClassDecorator, ClassReflect, InjectMap, InstanceReflect, MethodReflect} from "../../src";
import {HttpContext, HttpPathParam, HttpQueryParam, Route, RouteOption} from "@easy-node/server";
import {EnRequestDecorator} from "./EnRequestDecorator";
import {EnRequest} from "./index";

export class EnControllerDecorator extends AbstractClassDecorator {
  constructor(
    public path: string,
  ) {
    super();
  }

  public async onTargetBeforeInstance(classReflect: ClassReflect): Promise<void> {
    console.log(`BeforeCreate controller ${this.path}.`)
  }

  public onTargetInstanced<T extends object>(classReflect: ClassReflect, instanceReflect: InstanceReflect<T>) {
    console.log(`Created controller ${this.path}`)
    const moduleRoute = classReflect.getProvider<object, Route>(Route);
    if (moduleRoute instanceof Route) {
      const routes: any = {
        path: this.path,
        children: []
      }

      classReflect.instanceMembers.forEach(decorator => {
        if (decorator instanceof MethodReflect) {
          decorator.metadata.forEach(_decorate => {
            if (_decorate instanceof EnRequestDecorator) {
              routes.children.push({
                path: _decorate.path,
                method: _decorate.method,
                handler: async (context: HttpContext, route: Route) => {
                  const injectMap = new InjectMap();
                  injectMap.set(Route, route);
                  injectMap.set(HttpContext, context);
                  injectMap.set(HttpQueryParam, context.request.query);
                  injectMap.set(HttpPathParam, route.getPathParam(context.request.url || ""));
                  const data = await instanceReflect.invoke(<any>_decorate.propertyKey, injectMap);
                  console.log(data);
                  if (data instanceof Buffer) {
                    context.response.end(data);
                  } else if (typeof data === "string" || data instanceof String) {
                    context.response.end(data);
                  } else if (typeof data === "object") {
                    context.response.end(JSON.stringify(data, null, 2));
                  } else if (typeof data === "number" || data instanceof Number) {
                    context.response.end(data.toString());
                  }
                }
              })
            }
          })
        }
      })

      moduleRoute.add(routes);
    }
  }
}