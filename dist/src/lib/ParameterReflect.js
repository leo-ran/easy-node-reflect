"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const InstanceReflect_1 = require("./InstanceReflect");
const AbstractParameterDecorator_1 = require("./AbstractParameterDecorator");
const ParameterSet_1 = require("./ParameterSet");
class ParameterReflect {
    constructor(parent, type, propertyKey, parameterIndex) {
        this.parent = parent;
        this.type = type;
        this.propertyKey = propertyKey;
        this.parameterIndex = parameterIndex;
    }
    set metadata(value) {
        this._metadata = value;
    }
    get metadata() {
        // 懒加载 缓存处理
        if (!this._metadata) {
            this._metadata = [];
            ParameterReflect.parseMetadata(this);
        }
        return this._metadata;
    }
    getTarget() {
        return this.parent.getTarget();
    }
    static parseMetadata(parameterReflect) {
        const parameterSet = AbstractParameterDecorator_1.AbstractParameterDecorator.getMetadata(parameterReflect.getTarget(), parameterReflect.propertyKey, parameterReflect.parameterIndex);
        if (parameterSet instanceof ParameterSet_1.ParameterSet) {
            parameterReflect.metadata = Array.from(parameterSet).map((item) => {
                return new InstanceReflect_1.InstanceReflect(item);
            });
        }
    }
}
exports.ParameterReflect = ParameterReflect;
