import {
  AbstractClassDecorator,
  BaseConstructor,
  ClassReflect,
  InjectMap,
  InstanceReflect,
  reflectClass
} from "../../src";
import {Application} from "../Application";
import {Route, Router} from "@easy-node/server";

export class EnModuleDecorator extends AbstractClassDecorator {
  constructor(
    public option: EnModuleDecoratorOption
  ) {
    super();
  }

  /**
   * 在这里可以给模块的实例提供注入服务
   * @param classReflect
   */
  public async onTargetBeforeInstance(classReflect: ClassReflect): Promise<void> {
    console.log(`BeforeCreate module ${this.option.path}`)
    const { providers } = this.option;

    console.log(`Init module ${this.option.path} services`);
    if (Array.isArray(providers)) {
      const length = providers.length;
      for (let i = 0; i < length; i++) {
        const Service = providers[i];
        // 实例化服务
        const serviceClassReflect = reflectClass(Service, classReflect);
        // 注入服务
        classReflect.setProvider(Service, serviceClassReflect);
      }
    }
  }

  public onTargetInstanced<T extends object>(classReflect: ClassReflect, instanceReflect: InstanceReflect<T>) {
    // 模块的实例
    const module = instanceReflect.instance;

    console.log(`Created module ${this.option.path}`);

    // 获取Application实例
    const router = classReflect.getProvider<object, Router>(Router);
    if (router instanceof Router) {
      // 创建模块的路由
      const route = Route.create({
        path: this.option.path,
        handler: context => context.response.end(`${this.option.path}`),
      })
      // application实例添加模块路由
      router.addRoute(route);
      // 路由添加到服务列表中
      classReflect.setProvider(Route, route);
    }

    console.log(`Init module ${this.option.path} controllers`)
    // 实例化控制器
    const {controllers} = this.option;
    if (Array.isArray(controllers)) {
      controllers.forEach(Controller => {
        reflectClass(Controller, classReflect).newInstance().then(controllerInstanceReflect => {
          // 得到控制器实例
          // console.log(controllerInstanceReflect);
          // console.log(controllerInstanceReflect);
        })
      })
    }
  }
}

export interface EnModuleDecoratorOption {
  // 模块路由路径
  path: string,
  // 控制器列表
  controllers?: BaseConstructor[];
  // 服务列表
  providers?: BaseConstructor[];
}