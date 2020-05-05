"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractMethodMetadata_1 = require("./AbstractMethodMetadata");
const TargetMap_1 = require("./TargetMap");
const MethodSet_1 = require("./MethodSet");
const MethodMap_1 = require("./MethodMap");
/**
 * 抽象方法装饰器类
 */
class AbstractMethodDecorator extends AbstractMethodMetadata_1.AbstractMethodMetadata {
    static create(IDecorator) {
        function decorator(...args) {
            return (target, propertyKey, descriptor) => {
                // 定义元数据
                const metadata = Reflect.construct(IDecorator, args);
                metadata.setPropertyKey(propertyKey);
                metadata.setDescriptor(descriptor);
                AbstractMethodDecorator.defineMetadata(target, metadata, propertyKey);
            };
        }
        decorator.class = IDecorator;
        return decorator;
    }
    /**
     * 根据目标类 定义元数据
     * @param target 目标类
     * @param metadata 元数据
     * @param propertyKey 目标类的成员方法名称
     */
    static defineMetadata(target, metadata, propertyKey) {
        const methodMap = AbstractMethodDecorator._targets.get(target) || new MethodMap_1.MethodMap();
        const methodSet = methodMap.get(propertyKey) || new MethodSet_1.MethodSet();
        methodSet.add(metadata);
        methodMap.set(propertyKey, methodSet);
        AbstractMethodDecorator._targets.set(target, methodMap);
    }
    /**
     * 根据目标类获取 方法装饰器的元数据集合
     * @param target
     * @param propertyKey
     */
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
    /**
     * 根据目标类获取方法装饰器的成员方法名称
     * @param target
     */
    static getPropertyKeys(target) {
        const methodMap = AbstractMethodDecorator._targets.get(target);
        if (methodMap instanceof MethodMap_1.MethodMap) {
            return methodMap.keys();
        }
    }
}
exports.AbstractMethodDecorator = AbstractMethodDecorator;
AbstractMethodDecorator._targets = new TargetMap_1.TargetMap();
