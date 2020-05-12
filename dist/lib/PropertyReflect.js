"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const public_1 = require("./funcs/public");
const propertyReflectCache = new Map();
class PropertyReflect {
    constructor(parent, propertyKey, isStatic = false) {
        this.parent = parent;
        this.propertyKey = propertyKey;
        this.isStatic = isStatic;
        public_1.parsePropertyReflectType(this);
    }
    set metadata(value) {
        this._metadata = value;
    }
    get metadata() {
        if (!this._metadata) {
            this._metadata = [];
            public_1.parsePropertyReflectMetadata(this);
        }
        return this._metadata;
    }
    getTarget() {
        return this.parent.getTarget();
    }
    getOwnTarget() {
        return this.parent.getOwnTarget();
    }
    static create(parent, propertyKey, isStatic = false) {
        // 添加缓存处理
        const propertyReflectMaps = propertyReflectCache.get(parent) || new Map();
        const propertyReflect = propertyReflectMaps.get(propertyKey) || new PropertyReflect(parent, propertyKey, isStatic);
        propertyReflectMaps.set(propertyKey, propertyReflect);
        propertyReflectCache.set(parent, propertyReflectMaps);
        return propertyReflect;
    }
}
exports.PropertyReflect = PropertyReflect;
/**
 * 属性映射
 * @param classReflect 类元数据映射对象
 * @param key 属性的名称
 */
function reflectProperty(classReflect, key) {
    const maps = propertyReflectCache.get(classReflect);
    if (maps)
        return maps.get(key);
}
exports.reflectProperty = reflectProperty;
