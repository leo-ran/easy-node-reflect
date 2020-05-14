import {
  AbstractClassDecorator,
  BaseConstructor,
  ClassReflect,
  InjectMap,
  InstanceReflect,
  reflectClass
} from "../../src";
import {Application} from "../Application";
import {Router} from "@easy-node/server";

export class EnApplicationDecorator extends AbstractClassDecorator {
  constructor(
    public modules: BaseConstructor[]
  ) {
    super();
  }

  /**
   * Application实例创建前的回调
   * 在这里可以Application提供实例化需要的参数注入
   * @param classReflect
   */
  public async onTargetBeforeInstance(classReflect: ClassReflect): Promise<void> {}

  /**
   * Application实例创建后的回调
   * 在这里初始化模块
   * 也可以给模块提供依赖
   * @param classReflect
   * @param instance
   */
  public onTargetInstanced<T extends object>(classReflect: ClassReflect, instanceReflect: InstanceReflect<T>) {
    if (Array.isArray(this.modules)) {
      this.modules.forEach(EnModule => {
        // 把App实例注入到Application的provider中 给模块提供服务
        if (instanceReflect.instance instanceof Application) {
          classReflect.setProvider(classReflect.getTarget(), instanceReflect.instance);
          classReflect.setProvider(Router, instanceReflect.instance.router);
        }
        reflectClass(EnModule, classReflect).newInstance().then(moduleInstanceReflect => {
          // 模块的实例反射对象
        });
      })
    }
  }
}