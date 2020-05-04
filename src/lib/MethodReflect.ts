import {ClassReflect} from "./ClassReflect";
import {InstanceReflect} from "./InstanceReflect";
import {ParameterReflect} from "./ParameterReflect";
import {SystemReflectKeys} from "./SystemReflectKeys";
import {AbstractMethodDecorator} from "./AbstractMethodDecorator";
import {MethodSet} from "./MethodSet";

export class MethodReflect<R extends Function = any> {

  private _metadata?: Array<InstanceReflect<AbstractMethodDecorator>>;

  /**
   * 元数据列表
   */
  public get metadata(): Array<InstanceReflect<AbstractMethodDecorator>> {
    // 懒加载 缓存处理
    if (!this._metadata) {
      this._metadata = [];
      MethodReflect.parseMetadata(this);
    }
    return this._metadata;
  }
  public set metadata(value) {
    this._metadata = value;
  }

  public isGetter: boolean = false;
  public isSetter: boolean = false;

  public isConstructor: boolean = this.propertyKey === 'constructor';

  /**
   * 参数列表
   */
  public parameters: Array<ParameterReflect> = [];

  public returnType: R;

  constructor(
    public parent: ClassReflect<any>,
    public propertyKey: string | symbol,
    public isStatic: boolean = false,
  ) {
    MethodReflect.parseParameters(this);
    MethodReflect.parseReturnType(this);
    // @ts-ignore
    const target =  this.isStatic ? this.parent._target : this.getTarget();
    const descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
    if (descriptor) {
      this.isGetter = typeof descriptor.get === "function";
      this.isSetter = typeof descriptor.set === "function";
    }
  }

  public getTarget() {
    return this.parent.getTarget();
  }

  static parseMetadata(methodReflect: MethodReflect): void {
    // @ts-ignore
    const target =  methodReflect.isStatic ? methodReflect.parent._target : methodReflect.getTarget();
    const methodSet = AbstractMethodDecorator.getMetadata(target, methodReflect.propertyKey);
    if (methodSet instanceof MethodSet) {
      methodSet.forEach(metadata => {
        methodReflect.metadata.push(new InstanceReflect<AbstractMethodDecorator>(metadata));
      });
    }
  }

  static parseParameters(methodReflect: MethodReflect): void {
    // @ts-ignore
    const target =  methodReflect.isStatic ? methodReflect.parent._target : methodReflect.getTarget();
    const propertyKey = methodReflect.propertyKey;
    let paramTypes: Function[] = [];

    // 如果不是构造函数
    if (!methodReflect.isConstructor) {
      paramTypes = Reflect.getMetadata(
        SystemReflectKeys.ParamTypes,
        target,
        propertyKey,
      );
    } else {
      // 构造函数 不需要 propertyKey
      // 构造函数  target 不能用 `prototype`
      paramTypes = Reflect.getMetadata(
        SystemReflectKeys.ParamTypes,
        // @ts-ignore
        methodReflect.parent._target,
      );
      // iDebuglog(paramTypes, module, 'paramTypes')
    }
    if (paramTypes) {
      paramTypes.map((type, index) => {
        methodReflect.parameters[index] = new ParameterReflect(
          methodReflect,
          type,
          propertyKey,
          index,
        );
      })
    }
  }

  static parseReturnType(methodReflect: MethodReflect): void {
    // @ts-ignore
    const target =  methodReflect.isStatic ? methodReflect.parent._target : methodReflect.getTarget();
    const returnType = Reflect.getMetadata(SystemReflectKeys.ReturnType, target, methodReflect.propertyKey);
    if (returnType) {
      methodReflect.returnType = returnType;
    }
  }
}