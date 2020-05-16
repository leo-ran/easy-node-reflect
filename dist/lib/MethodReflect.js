"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reflectMethod = exports.MethodReflect = void 0;
const AbstractMethodDecorator_1 = require("./AbstractMethodDecorator");
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
    /**
     * 检测是否包含装饰器
     * @param decorator
     */
    hasDecorator(decorator) {
        return Boolean(this.metadata.find((d) => {
            return d instanceof decorator.class;
        }));
    }
    /**
     * 查找是否有包含 `type` 的参数
     * @param type
     */
    hasType(type) {
        return Boolean(this.parameters.find(item => item.type === type));
    }
    /**
     * 查找是否包含 `decorator` 装饰器
     * @param decorator
     */
    hasParameterDecorator(decorator) {
        return Boolean(this.parameters.find((p) => {
            return p.metadata.find(d => d instanceof decorator.class);
        }));
    }
    async handlerBeforeInvoke(injectMap) {
        const metadata = this.metadata;
        const length = metadata.length;
        for (let i = 0; i < length; i++) {
            const methodDecorator = metadata[i];
            if (methodDecorator instanceof AbstractMethodDecorator_1.AbstractMethodDecorator && typeof methodDecorator.onBeforeInvoke === "function") {
                await methodDecorator.onBeforeInvoke(this, injectMap);
            }
        }
    }
    /**
     * 处理函数调用后的元数据回调
     * @param classReflect
     * @param instanceReflect
     * @param value
     */
    async handlerReturn(value) {
        const metadata = this.metadata;
        const length = metadata.length;
        for (let i = 0; i < length; i++) {
            const methodDecorator = metadata[i];
            if (methodDecorator instanceof AbstractMethodDecorator_1.AbstractMethodDecorator && typeof methodDecorator.onInvoked === "function") {
                value = await methodDecorator.onInvoked(this, value);
            }
        }
        return value;
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
