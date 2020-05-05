"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 抽象参数装饰器元数据类
 */
class AbstractParameterMetadata {
    setPropertyKey(propertyKey) {
        this.propertyKey = propertyKey;
        return this;
    }
    setParameterIndex(index) {
        this.parameterIndex = index;
    }
}
exports.AbstractParameterMetadata = AbstractParameterMetadata;
