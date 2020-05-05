"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 抽象方法装饰器元数据类
 */
class AbstractMethodMetadata {
    setDescriptor(descriptor) {
        this.descriptor = descriptor;
        return this;
    }
    setPropertyKey(propertyKey) {
        this.propertyKey = propertyKey;
        return this;
    }
}
exports.AbstractMethodMetadata = AbstractMethodMetadata;
