"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const public_1 = require("./funcs/public");
const methodReflectCache = new Map();
class MethodReflect {
    constructor(parent, propertyKey, isStatic = false) {
        this.parent = parent;
        this.propertyKey = propertyKey;
        this.isStatic = isStatic;
        this.isGetter = false;
        this.isSetter = false;
        this.isConstructor = this.propertyKey === 'constructor';
        /**
         * 参数列表
         */
        this.parameters = [];
        const target = this.isStatic ? this.getTarget() : this.getOwnTarget();
        if (!target)
            return;
        public_1.parseMethodReflectParameters(this);
        public_1.parseMethodReflectReturnType(this);
        const descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
        if (descriptor) {
            this.isGetter = typeof descriptor.get === "function";
            this.isSetter = typeof descriptor.set === "function";
        }
    }
    /**
     * 元数据列表
     */
    get metadata() {
        // 懒加载 缓存处理
        if (!this._metadata) {
            this._metadata = [];
            public_1.parseMethodReflectMetadata(this);
        }
        return this._metadata;
    }
    set metadata(value) {
        this._metadata = value;
    }
    getTarget() {
        return this.parent.getTarget();
    }
    getOwnTarget() {
        return this.parent.getOwnTarget();
    }
    static create(parent, propertyKey, isStatic = false) {
        // 添加缓存处理
        const methodReflectMaps = methodReflectCache.get(parent) || new Map();
        const methodReflect = methodReflectMaps.get(propertyKey) || new MethodReflect(parent, propertyKey, isStatic);
        methodReflectMaps.set(propertyKey, methodReflect);
        methodReflectCache.set(parent, methodReflectMaps);
        return methodReflect;
    }
}
exports.MethodReflect = MethodReflect;
/**
 * 映射方法
 * @param classReflect 类映射对象
 * @param key 方法的名称
 */
function reflectMethod(classReflect, key) {
    const maps = methodReflectCache.get(classReflect);
    if (maps)
        return maps.get(key);
}
exports.reflectMethod = reflectMethod;
