"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        // 懒加载 缓存处理
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
    static create(parent, type, propertyKey, parameterIndex) {
        const parameterReflectMaps = parameterReflectCache.get(parent) || new Map();
        const parameterReflect = parameterReflectMaps.get(parameterIndex) || new ParameterReflect(parent, type, propertyKey, parameterIndex);
        parameterReflectMaps.set(parameterIndex, parameterReflect);
        parameterReflectCache.set(parent, parameterReflectMaps);
        return parameterReflect;
    }
}
exports.ParameterReflect = ParameterReflect;
/**
 * 参数映射
 * @param methodReflect 方法元数据映射对象
 * @param index 参数的序号
 */
function reflectParameter(methodReflect, index) {
    const maps = parameterReflectCache.get(methodReflect);
    if (maps)
        return maps.get(index);
}
exports.reflectParameter = reflectParameter;
