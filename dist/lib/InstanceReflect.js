"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MethodReflect_1 = require("./MethodReflect");
const PropertyReflect_1 = require("./PropertyReflect");
const reflectClass_1 = require("./funcs/reflectClass");
class InstanceReflect {
    constructor(metadata) {
        this.metadata = metadata;
        // @ts-ignore
        this.parent = reflectClass_1.reflectClass(metadata.__proto__);
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
                const metadata = propertyReflect.metadata[i].metadata;
                if (typeof metadata.onGetValue === "function") {
                    metadata.onGetValue(propertyReflect, value);
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
                const metadata = propertyReflect.metadata[i].metadata;
                if (typeof metadata.onSetValue === "function") {
                    this.metadata[fieldName] = metadata.onSetValue(propertyReflect, value);
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
     * @param positionalArguments 参数
     */
    async invoke(memberName, positionalArguments) {
        const { parent } = this;
        const method = this.metadata[memberName];
        if (typeof method === "function") {
            // 如果是由 ClassReflect 创建的实例
            // metadata是一个类的实例
            const methodReflect = parent.instanceMembers.get(memberName) || parent.staticMembers.get(memberName);
            if (methodReflect instanceof MethodReflect_1.MethodReflect) {
                const methodReflectMetadata = methodReflect.metadata;
                const length = methodReflectMetadata.length;
                if (positionalArguments instanceof Array) {
                    if (positionalArguments.length !== methodReflect.parameters.length) {
                        throw new Error(`${memberName} function, Expected ${methodReflect.parameters.length} arguments, but got ${positionalArguments.length}.`);
                    }
                    // 调用参数装饰器钩子
                    // @ts-ignore
                    positionalArguments = methodReflect.parameters.map((parameterReflect, i) => {
                        // @ts-ignore
                        let value = positionalArguments[i];
                        parameterReflect.metadata.forEach((instanceReflect) => {
                            if (typeof instanceReflect.metadata.onInject === "function") {
                                value = instanceReflect.metadata.onInject(parameterReflect, value);
                            }
                        });
                        return value;
                    });
                }
                else {
                    // @ts-ignore
                    positionalArguments = positionalArguments(parent, methodReflect.parameters);
                    methodReflect.parameters.forEach((parameterReflect, i) => {
                        // @ts-ignore
                        positionalArguments = parameterReflect.metadata.map((instanceReflect) => {
                            // @ts-ignore
                            let value = positionalArguments[i];
                            parameterReflect.metadata.forEach((instanceReflect) => {
                                if (typeof instanceReflect.metadata.onInject === "function") {
                                    value = instanceReflect.metadata.onInject(parameterReflect, value);
                                }
                            });
                            return value;
                        });
                    });
                }
                let result = await method.apply(this, positionalArguments);
                // 调用方法上 方法装饰器的钩子
                for (let i = 0; i < length; i++) {
                    const { metadata } = methodReflectMetadata[i];
                    if (typeof metadata.onInvoked === "function") {
                        result = await metadata.onInvoked(methodReflect, result);
                    }
                }
                return result;
            }
            return await method.apply(this, positionalArguments);
        }
    }
    /**
     * 比较实例类型
     * @param other
     */
    instanceOf(other) {
        return this.metadata instanceof other;
    }
}
exports.InstanceReflect = InstanceReflect;
