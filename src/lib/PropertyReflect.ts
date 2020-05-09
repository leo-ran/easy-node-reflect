import {ClassReflect} from "./ClassReflect";
import {InstanceReflect} from "./InstanceReflect";
import {AbstractPropertyDecorator} from "./AbstractPropertyDecorator";
import {PropertySet} from "./PropertySet";
import {SystemReflectKeys} from "./SystemReflectKeys";

export class PropertyReflect<T extends Function = any> {
  public _metadata?: Array<InstanceReflect<AbstractPropertyDecorator>>;
  public type: T;
  constructor(
    public parent: ClassReflect<any>,
    public propertyKey: string | symbol,
    public isStatic: boolean = false,
  ) {PropertyReflect.parseType(this)}


  public set metadata(value) {
      this._metadata = value;
  }

  public get metadata(): Array<InstanceReflect<AbstractPropertyDecorator>> {
    if (!this._metadata) {
      this._metadata = [];
      PropertyReflect.parseMetadata(this)
    }

    return this._metadata;
  }

  public getTarget() {
    return this.parent.getTarget();
  }

  static parseMetadata(propertyReflect: PropertyReflect): void {
    // @ts-ignore
    const target =  propertyReflect.isStatic ? propertyReflect.parent._target : propertyReflect.getTarget();
    const propertySet = AbstractPropertyDecorator.getMetadata(target, propertyReflect.propertyKey);
    if (propertySet instanceof PropertySet) {
      propertyReflect.metadata = Array.from(propertySet).map(item => {
        return new InstanceReflect<AbstractPropertyDecorator>(item);
      })
    }
  }

  static parseType(propertyReflect: PropertyReflect): void {
    // @ts-ignore
    const target =  propertyReflect.isStatic ? propertyReflect.parent._target : propertyReflect.getTarget();
    if (!target) return;
    const type = Reflect.getMetadata(SystemReflectKeys.Type, target, propertyReflect.propertyKey);
    if (type) {
      propertyReflect.type = type;
    }
  }
}