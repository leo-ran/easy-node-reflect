"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractMethodDecorator = void 0;
const TargetMap_1 = require("./TargetMap");
const MethodSet_1 = require("./MethodSet");
const MethodMap_1 = require("./MethodMap");
let AbstractMethodDecorator = (() => {
    class AbstractMethodDecorator {
        setDescriptor(descriptor) {
            this.descriptor = descriptor;
            return this;
        }
        setPropertyKey(propertyKey) {
            this.propertyKey = propertyKey;
            return this;
        }
        static create(IDecorator) {
            function decorator(...args) {
                return (target, propertyKey, descriptor) => {
                    const metadata = Reflect.construct(IDecorator, args);
                    metadata.setPropertyKey(propertyKey);
                    metadata.setDescriptor(descriptor);
                    AbstractMethodDecorator.defineMetadata(target, metadata, propertyKey);
                };
            }
            decorator.class = IDecorator;
            return decorator;
        }
        static defineMetadata(target, metadata, propertyKey) {
            const methodMap = AbstractMethodDecorator._targets.get(target) || new MethodMap_1.MethodMap();
            const methodSet = methodMap.get(propertyKey) || new MethodSet_1.MethodSet();
            methodSet.add(metadata);
            methodMap.set(propertyKey, methodSet);
            AbstractMethodDecorator._targets.set(target, methodMap);
        }
        static getMetadata(target, propertyKey) {
            const methodMap = AbstractMethodDecorator._targets.get(target);
            if (methodMap instanceof MethodMap_1.MethodMap) {
                const methodSet = methodMap.get(propertyKey);
                if (methodSet instanceof MethodSet_1.MethodSet) {
                    return methodSet;
                }
            }
            return undefined;
        }
        static getPropertyKeys(target) {
            const methodMap = AbstractMethodDecorator._targets.get(target);
            if (methodMap instanceof MethodMap_1.MethodMap) {
                return methodMap.keys();
            }
            return undefined;
        }
    }
    AbstractMethodDecorator._targets = new TargetMap_1.TargetMap();
    return AbstractMethodDecorator;
})();
exports.AbstractMethodDecorator = AbstractMethodDecorator;
