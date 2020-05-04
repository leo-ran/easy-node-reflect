"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 抽象属性装饰器元数据类
 */
class AbstractPropertyMetadata {
    setPropertyKey(propertyKey) {
        this.propertyKey = propertyKey;
        return this;
    }
}
exports.AbstractPropertyMetadata = AbstractPropertyMetadata;
