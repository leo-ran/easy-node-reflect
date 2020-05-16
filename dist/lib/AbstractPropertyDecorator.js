"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractPropertyDecorator = void 0;
const TargetMap_1 = require("./TargetMap");
const PropertySet_1 = require("./PropertySet");
const PropertyMap_1 = require("./PropertyMap");
/**
 * 抽象属性装饰器类
 */
let AbstractPropertyDecorator = /** @class */ (() => {
    class AbstractPropertyDecorator {
        setPropertyKey(propertyKey) {
            this.propertyKey = propertyKey;
            return this;
        }
        static create(IDecorator) {
            function decorator(...args) {
                return (target, propertyKey) => {
                    // 定义元数据
                    const metadata = Reflect.construct(IDecorator, args);
                    metadata.setPropertyKey(propertyKey);
                    AbstractPropertyDecorator.defineMetadata(target, metadata, propertyKey);
                };
            }
            decorator.class = IDecorator;
            return decorator;
        }
        /**
         * 根据目标类 定义元数据
         * @param target 目标类
         * @param metadata 元数据
         * @param propertyKey 目标类成员名称
         */
        static defineMetadata(target, metadata, propertyKey) {
            const propertyMap = AbstractPropertyDecorator._targets.get(target) || new PropertyMap_1.PropertyMap();
            const propertySet = propertyMap.get(propertyKey) || new PropertySet_1.PropertySet();
            propertySet.add(metadata);
            propertyMap.set(propertyKey, propertySet);
            AbstractPropertyDecorator._targets.set(target, propertyMap);
        }
        /**
         * 根据目标类获取 成员的装饰器元数据
         * @param target 目标类
         * @param propertyKey 目标类的成员名称
         */
        static getMetadata(target, propertyKey) {
            const propertyMap = AbstractPropertyDecorator._targets.get(target);
            if (propertyMap instanceof PropertyMap_1.PropertyMap) {
                const propertySet = propertyMap.get(propertyKey);
                if (propertySet instanceof PropertySet_1.PropertySet) {
                    return propertySet;
                }
            }
            return undefined;
        }
        /**
         * 根据目标类 获取包含属性装饰器的成员 名称列表
         * @param target
         */
        static getPropertyKeys(target) {
            const propertyMap = AbstractPropertyDecorator._targets.get(target);
            if (propertyMap instanceof PropertyMap_1.PropertyMap) {
                return propertyMap.keys();
            }
        }
    }
    AbstractPropertyDecorator._targets = new TargetMap_1.TargetMap();
    return AbstractPropertyDecorator;
})();
exports.AbstractPropertyDecorator = AbstractPropertyDecorator;
