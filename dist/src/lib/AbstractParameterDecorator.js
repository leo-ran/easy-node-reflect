"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractParameterMetadata_1 = require("./AbstractParameterMetadata");
const ParameterSet_1 = require("./ParameterSet");
const TargetMap_1 = require("./TargetMap");
const ParameterMap_1 = require("./ParameterMap");
const MethodMap_1 = require("./MethodMap");
/**
 * 抽象参数装饰器类
 */
class AbstractParameterDecorator extends AbstractParameterMetadata_1.AbstractParameterMetadata {
    static create(IDecorator) {
        function decorator(...args) {
            return (target, propertyKey, parameterIndex) => {
                // 定义元数据
                const metadata = Reflect.construct(IDecorator, args);
                metadata.setParameterIndex(parameterIndex);
                metadata.setPropertyKey(propertyKey);
                AbstractParameterDecorator.defineMetadata(target, metadata, propertyKey, parameterIndex);
            };
        }
        decorator.class = IDecorator;
        return decorator;
    }
    static defineMetadata(target, metadata, propertyKey, index) {
        const methodMap = AbstractParameterDecorator._targets.get(target) || new MethodMap_1.MethodMap();
        const parameterMap = methodMap.get(propertyKey) || new ParameterMap_1.ParameterMap();
        const parameterSet = parameterMap.get(index) || new ParameterSet_1.ParameterSet();
        parameterSet.add(metadata);
        parameterMap.set(index, parameterSet);
        methodMap.set(propertyKey, parameterMap);
        AbstractParameterDecorator._targets.set(target, methodMap);
    }
    static getMetadata(target, propertyKey, index) {
        const methodMap = AbstractParameterDecorator._targets.get(target);
        if (methodMap instanceof MethodMap_1.MethodMap) {
            const parameterMap = methodMap.get(propertyKey);
            if (parameterMap instanceof ParameterMap_1.ParameterMap) {
                if (index != undefined && !isNaN(index)) {
                    const parameterSet = parameterMap.get(index);
                    if (parameterSet instanceof ParameterSet_1.ParameterSet) {
                        return parameterSet;
                    }
                }
                return parameterMap;
            }
        }
    }
    /**
     * 根据目标类获取拥有参数装饰器的方法成员名称
     * @param target
     */
    static getPropertyKeys(target) {
        const methodMap = AbstractParameterDecorator._targets.get(target);
        if (methodMap instanceof MethodMap_1.MethodMap) {
            return methodMap.keys();
        }
    }
}
exports.AbstractParameterDecorator = AbstractParameterDecorator;
AbstractParameterDecorator._targets = new TargetMap_1.TargetMap();
