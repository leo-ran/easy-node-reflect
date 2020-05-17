"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reflectInstance = exports.InstanceReflect = void 0;
const ClassReflect_1 = require("./ClassReflect");
const MethodReflect_1 = require("./MethodReflect");
const PropertyReflect_1 = require("./PropertyReflect");
const instanceReflectCache = new Map();
class InstanceReflect {
    constructor(instance) {
        this.instance = instance;
        this.parent = ClassReflect_1.ClassReflect.create(instance.constructor);
    }
    async getField(fieldName) {
        const { parent } = this;
        let value = this.instance[fieldName];
        const propertyReflect = parent.instanceMembers.get(fieldName) || parent.staticMembers.get(fieldName);
        if (propertyReflect instanceof PropertyReflect_1.PropertyReflect) {
            const propertyReflectMetadata = propertyReflect.metadata;
            const length = propertyReflectMetadata.length;
            for (let i = 0; i < length; i++) {
                const metadata = propertyReflect.metadata[i];
                if (typeof metadata.onGetValue === "function") {
                    value = await metadata.onGetValue(propertyReflect, value);
                }
            }
        }
        return value;
    }
    async setField(fieldName, value) {
        const { parent } = this;
        const propertyReflect = parent.instanceMembers.get(fieldName) || parent.staticMembers.get(fieldName);
        if (propertyReflect instanceof PropertyReflect_1.PropertyReflect) {
            const propertyReflectMetadata = propertyReflect.metadata;
            const length = propertyReflectMetadata.length;
            for (let i = 0; i < length; i++) {
                const metadata = propertyReflect.metadata[i];
                if (typeof metadata.onSetValue === "function") {
                    this.instance[fieldName] = await metadata.onSetValue(propertyReflect, value);
                }
            }
        }
        else {
            this.instance[fieldName] = value;
        }
    }
    async invoke(memberName, injectMap, memberType = "instance") {
        const func = this.instance[memberName];
        const { parent } = this;
        if (typeof func !== "function")
            throw new Error(`The member "${memberName}", is not function.`);
        if (!parent)
            throw new Error(`This reflect is not parent.`);
        const methodReflect = memberType === "instance" ? parent.instanceMembers.get(memberName) : parent.staticMembers.get(memberName);
        if (methodReflect instanceof MethodReflect_1.MethodReflect) {
            let args = [];
            let value = undefined;
            const parameters = methodReflect.parameters;
            const parameterLength = parameters.length;
            for (let i = 0; i < parameterLength; i++) {
                const parameterReflect = parameters[i];
                let v = undefined;
                if (injectMap instanceof Map) {
                    v = injectMap.get(parameterReflect.type) || parent.getProvider(parameterReflect.type);
                }
                args[parameterReflect.parameterIndex] = await parameterReflect.handlerInject(injectMap, v) || v;
            }
            await methodReflect.handlerBeforeInvoke(injectMap);
            value = func.apply(this.instance, args);
            value = await methodReflect.handlerReturn(value);
            return value;
        }
        else {
            return func.apply(this.instance, []);
        }
    }
    instanceOf(other) {
        return this.instance instanceof other;
    }
    static create(metadata) {
        const instance = instanceReflectCache.get(metadata) || new InstanceReflect(metadata);
        instanceReflectCache.set(metadata, instance);
        return instance;
    }
}
exports.InstanceReflect = InstanceReflect;
function reflectInstance(o) {
    return instanceReflectCache.get(o);
}
exports.reflectInstance = reflectInstance;
