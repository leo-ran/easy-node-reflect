"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const InstanceReflect_1 = require("./InstanceReflect");
const AbstractPropertyDecorator_1 = require("./AbstractPropertyDecorator");
const PropertySet_1 = require("./PropertySet");
const SystemReflectKeys_1 = require("./SystemReflectKeys");
class PropertyReflect {
    constructor(parent, propertyKey, isStatic = false) {
        this.parent = parent;
        this.propertyKey = propertyKey;
        this.isStatic = isStatic;
        PropertyReflect.parseType(this);
    }
    set metadata(value) {
        this._metadata = value;
    }
    get metadata() {
        if (!this._metadata) {
            this._metadata = [];
            PropertyReflect.parseMetadata(this);
        }
        return this._metadata;
    }
    getTarget() {
        return this.parent.getTarget();
    }
    static parseMetadata(propertyReflect) {
        // @ts-ignore
        const target = propertyReflect.isStatic ? propertyReflect.parent._target : propertyReflect.getTarget();
        const propertySet = AbstractPropertyDecorator_1.AbstractPropertyDecorator.getMetadata(target, propertyReflect.propertyKey);
        if (propertySet instanceof PropertySet_1.PropertySet) {
            propertyReflect.metadata = Array.from(propertySet).map(item => {
                return new InstanceReflect_1.InstanceReflect(item);
            });
        }
    }
    static parseType(propertyReflect) {
        // @ts-ignore
        const target = propertyReflect.isStatic ? propertyReflect.parent._target : propertyReflect.getTarget();
        if (!target)
            return;
        const type = Reflect.getMetadata(SystemReflectKeys_1.SystemReflectKeys.Type, target, propertyReflect.propertyKey);
        if (type) {
            propertyReflect.type = type;
        }
    }
}
exports.PropertyReflect = PropertyReflect;
