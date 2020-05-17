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
        // @ts-ignore
        this.parent = ClassReflect_1.ClassReflect.create(instance.constructor);
    }
    /**
     * Get metadata member value.
     * @param fieldName
     */
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
    /**
     * In metadata member set member value.
     * @param fieldName
     * @param value
     */
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
    /**
     * 调用实例方法
     * @param memberName 成员名称
     */
    async invoke(memberName, injectMap) {
        const func = this.instance[memberName];
        const { parent } = this;
        // 检测是否为函数
        if (typeof func !== "function")
            throw new Error(`The member "${memberName}", is not function.`);
        // 检测classReflect是否存在
        if (!parent)
            throw new Error(`This reflect is not parent.`);
        // 获取方法的反射对象
        const methodReflect = parent.instanceMembers.get(memberName) || parent.staticMembers.get(memberName);
        // 判断反射对象是否存在
        if (methodReflect instanceof MethodReflect_1.MethodReflect) {
            // 函数调用时的参数列表
            let args = [];
            // 函数执行后的返回值
            let value = undefined;
            // 方法反射对象上的 参数装饰器列表
            const parameters = methodReflect.parameters;
            const parameterLength = parameters.length;
            for (let i = 0; i < parameterLength; i++) {
                const parameterReflect = parameters[i];
                let v = undefined;
                if (injectMap instanceof Map) {
                    // 如果injectMap中不存在注入的服务，从classReflect中查找服务
                    v = injectMap.get(parameterReflect.type) || parent.getProvider(parameterReflect.type);
                }
                // 优化代码结构
                args[parameterReflect.parameterIndex] = await parameterReflect.handlerInject(injectMap, v) || v;
            }
            // 处理注入
            await methodReflect.handlerBeforeInvoke(injectMap);
            // 执行函数
            value = func.apply(this.instance, args);
            // 处理返回值
            value = await methodReflect.handlerReturn(value);
            return value;
        }
        else {
            return func.apply(this.instance, []);
        }
    }
    /**
     * 比较实例类型
     * @param other
     */
    instanceOf(other) {
        return this.instance instanceof other;
    }
    static create(metadata) {
        // 添加缓存处理
        const instance = instanceReflectCache.get(metadata) || new InstanceReflect(metadata);
        instanceReflectCache.set(metadata, instance);
        return instance;
    }
}
exports.InstanceReflect = InstanceReflect;
/**
 * 映射实例
 * @param o
 */
function reflectInstance(o) {
    return instanceReflectCache.get(o);
}
exports.reflectInstance = reflectInstance;
