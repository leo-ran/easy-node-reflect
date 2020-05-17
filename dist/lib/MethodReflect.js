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
    get metadata() {
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
    hasDecorator(decorator) {
        return Boolean(this.metadata.find((d) => {
            return d instanceof decorator.class;
        }));
    }
    hasType(type) {
        return Boolean(this.parameters.find(item => item.type === type));
    }
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
        const methodReflectMaps = methodReflectCache.get(parent) || new Map();
        const methodReflect = methodReflectMaps.get(propertyKey) || new MethodReflect(parent, propertyKey, isStatic);
        methodReflectMaps.set(propertyKey, methodReflect);
        methodReflectCache.set(parent, methodReflectMaps);
        return methodReflect;
    }
}
exports.MethodReflect = MethodReflect;
function reflectMethod(classReflect, key) {
    const maps = methodReflectCache.get(classReflect);
    if (maps)
        return maps.get(key);
    return undefined;
}
exports.reflectMethod = reflectMethod;
