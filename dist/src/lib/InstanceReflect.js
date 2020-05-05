"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InstanceReflect {
    constructor(metadata) {
        this.metadata = metadata;
        // 运行时类型
        this.runtimeType = InstanceReflect;
    }
    /**
     * Get metadata member value.
     * @param fieldName
     */
    getField(fieldName) {
        return this.metadata[fieldName];
    }
    /**
     * In metadata member set member value.
     * @param fieldName
     * @param value
     */
    setField(fieldName, value) {
        this.metadata[fieldName] = value;
    }
    /**
     * 调用实例方法
     * @param memberName 成员名称
     * @param positionalArguments 参数
     */
    invoke(memberName, positionalArguments) {
        const method = this.metadata[memberName];
        if (typeof method === "function") {
            method.apply(this, positionalArguments);
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
