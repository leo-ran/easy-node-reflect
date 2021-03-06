"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractParameterDecorator = void 0;
const ParameterSet_1 = require("./ParameterSet");
const TargetMap_1 = require("./TargetMap");
const ParameterMap_1 = require("./ParameterMap");
const MethodMap_1 = require("./MethodMap");
let AbstractParameterDecorator = (() => {
    class AbstractParameterDecorator {
        setPropertyKey(propertyKey) {
            this.propertyKey = propertyKey;
            return this;
        }
        setParameterIndex(index) {
            this.parameterIndex = index;
        }
        static create(IDecorator) {
            function decorator(...args) {
                return (target, propertyKey, parameterIndex) => {
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
            return undefined;
        }
        static getPropertyKeys(target) {
            const methodMap = AbstractParameterDecorator._targets.get(target);
            if (methodMap instanceof MethodMap_1.MethodMap) {
                return methodMap.keys();
            }
            return undefined;
        }
    }
    AbstractParameterDecorator._targets = new TargetMap_1.TargetMap();
    return AbstractParameterDecorator;
})();
exports.AbstractParameterDecorator = AbstractParameterDecorator;
