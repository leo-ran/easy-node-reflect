"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reflectParameter = exports.ParameterReflect = void 0;
const AbstractParameterDecorator_1 = require("./AbstractParameterDecorator");
const public_1 = require("./funcs/public");
const parameterReflectCache = new Map();
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
        if (!this._metadata) {
            this._metadata = [];
            public_1.parseParameterMetadata(this);
        }
        return this._metadata;
    }
    getTarget() {
        return this.parent.getTarget();
    }
    getOwnTarget() {
        return this.parent.getOwnTarget();
    }
    async handlerInject(injectMap, value) {
        const length = this.metadata.length;
        const metadata = this.metadata;
        for (let i = 0; i < length; i++) {
            const parameterDecorator = metadata[i];
            if (parameterDecorator instanceof AbstractParameterDecorator_1.AbstractParameterDecorator && typeof parameterDecorator.onInject === "function") {
                value = await parameterDecorator.onInject(this, injectMap, value);
            }
        }
        if (typeof this.type === "function" && typeof this.type.__transform === "function") {
            value = this.type.__transform(value);
        }
        return value;
    }
    hasDecorator(decorator) {
        return Boolean(this.metadata.find((d) => {
            if (typeof decorator === "function") {
                return d instanceof decorator.class;
            }
            return undefined;
        }));
    }
    static create(parent, type, propertyKey, parameterIndex) {
        const parameterReflectMaps = parameterReflectCache.get(parent) || new Map();
        const parameterReflect = parameterReflectMaps.get(parameterIndex) || new ParameterReflect(parent, type, propertyKey, parameterIndex);
        parameterReflectMaps.set(parameterIndex, parameterReflect);
        parameterReflectCache.set(parent, parameterReflectMaps);
        return parameterReflect;
    }
}
exports.ParameterReflect = ParameterReflect;
function reflectParameter(methodReflect, index) {
    const maps = parameterReflectCache.get(methodReflect);
    if (maps)
        return maps.get(index);
    return undefined;
}
exports.reflectParameter = reflectParameter;
