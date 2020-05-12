"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ClassReflect_1 = require("./ClassReflect");
const MethodReflect_1 = require("./MethodReflect");
const PropertyReflect_1 = require("./PropertyReflect");
const AbstractMethodDecorator_1 = require("./AbstractMethodDecorator");
const AbstractParameterDecorator_1 = require("./AbstractParameterDecorator");
const instanceReflectCache = new Map();
class InstanceReflect {
    constructor(metadata) {
        this.metadata = metadata;
        // @ts-ignore
        this.parent = ClassReflect_1.ClassReflect.create(metadata.__proto__);
    }
    /**
     * Get metadata member value.
     * @param fieldName
     */
    getField(fieldName) {
        const { parent } = this;
        let value = this.metadata[fieldName];
        const propertyReflect = parent.instanceMembers.get(fieldName) || parent.staticMembers.get(fieldName);
        if (propertyReflect instanceof PropertyReflect_1.PropertyReflect) {
            const propertyReflectMetadata = propertyReflect.metadata;
            const length = propertyReflectMetadata.length;
            for (let i = 0; i < length; i++) {
                const metadata = propertyReflect.metadata[i];
                if (typeof metadata.onGetValue === "function") {
                    metadata.onGetValue(parent, propertyReflect, value);
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
    setField(fieldName, value) {
        const { parent } = this;
        const propertyReflect = parent.instanceMembers.get(fieldName) || parent.staticMembers.get(fieldName);
        if (propertyReflect instanceof PropertyReflect_1.PropertyReflect) {
            const propertyReflectMetadata = propertyReflect.metadata;
            const length = propertyReflectMetadata.length;
            for (let i = 0; i < length; i++) {
                const metadata = propertyReflect.metadata[i];
                if (typeof metadata.onSetValue === "function") {
                    this.metadata[fieldName] = metadata.onSetValue(parent, propertyReflect, value);
                }
            }
        }
        else {
            this.metadata[fieldName] = value;
        }
    }
    /**
     * 调用实例方法
     * @param memberName 成员名称
     * @param positionalArgumentsCallback 参数
     */
    async invoke(memberName) {
        const func = this.metadata[memberName];
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
                let v = undefined;
                const parameterReflect = parameters[i];
                const prms = parameterReflect.metadata;
                const prmsLength = prms.length;
                for (let a = 0; a < prmsLength; a++) {
                    const ir = prms[a];
                    if (ir instanceof AbstractParameterDecorator_1.AbstractParameterDecorator) {
                        // 如果不存在钩子 直接跳出
                        if (!(typeof ir.onInject === "function"))
                            return;
                        v = await ir.onInject(parent, methodReflect, this, parameterReflect, v);
                    }
                }
                args[i] = v;
            }
            // 执行所有函数
            value = func.apply(this.metadata, args);
            // MethodReflect上的所有装饰器元数据列表
            const methodReflectMetadata = methodReflect.metadata;
            // MethodReflect上的所有装饰器元数据总数
            const mrLength = methodReflectMetadata.length;
            // 遍历方法包含的装饰器
            for (let i = 0; i < mrLength; i++) {
                const methodDecorator = methodReflectMetadata[i];
                if (methodDecorator instanceof AbstractMethodDecorator_1.AbstractMethodDecorator) {
                    if (typeof methodDecorator.onInvoked === "function") {
                        value = await methodDecorator.onInvoked(parent, methodReflect, this, value);
                    }
                }
            }
        }
        return func.apply(this.metadata, []);
    }
    /**
     * 比较实例类型
     * @param other
     */
    instanceOf(other) {
        return this.metadata instanceof other;
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
