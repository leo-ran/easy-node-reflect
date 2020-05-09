import {MethodReflect} from "./MethodReflect";
import {InstanceReflect} from "./InstanceReflect";
import {AbstractParameterDecorator} from "./AbstractParameterDecorator";
import {ParameterSet} from "./ParameterSet";

export class ParameterReflect<T = any> {
  private _metadata?: Array<InstanceReflect<AbstractParameterDecorator>>;
  public constructor(
    public parent: MethodReflect,
    public type: T,
    public propertyKey: string | symbol,
    public parameterIndex: number,
  ) {}

  public set metadata(value) {
    this._metadata = value;
  }

  public get metadata(): Array<InstanceReflect<AbstractParameterDecorator>> {
    // 懒加载 缓存处理
    if (!this._metadata) {
      this._metadata = [];
      ParameterReflect.parseMetadata(this)
    }
    return this._metadata;
  }

  public getTarget() {
    return this.parent.getTarget();
  }

  static parseMetadata(parameterReflect: ParameterReflect) {
    const parameterSet = AbstractParameterDecorator.getMetadata(
      parameterReflect.getTarget(),
      parameterReflect.propertyKey,
      parameterReflect.parameterIndex,
    );
    if (parameterSet instanceof ParameterSet) {
      parameterReflect.metadata = Array.from(parameterSet).map((item) => {
        return new InstanceReflect<AbstractParameterDecorator>(item);
      })
    }
  }
}