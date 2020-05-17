"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractPropertyDecorator = void 0;
const TargetMap_1 = require("./TargetMap");
const PropertySet_1 = require("./PropertySet");
const PropertyMap_1 = require("./PropertyMap");
let AbstractPropertyDecorator = (() => {
    class AbstractPropertyDecorator {
        setPropertyKey(propertyKey) {
            this.propertyKey = propertyKey;
            return this;
        }
        static create(IDecorator) {
            function decorator(...args) {
                return (target, propertyKey) => {
                    const metadata = Reflect.construct(IDecorator, args);
                    metadata.setPropertyKey(propertyKey);
                    AbstractPropertyDecorator.defineMetadata(target, metadata, propertyKey);
                };
            }
            decorator.class = IDecorator;
            return decorator;
        }
        static defineMetadata(target, metadata, propertyKey) {
            const propertyMap = AbstractPropertyDecorator._targets.get(target) || new PropertyMap_1.PropertyMap();
            const propertySet = propertyMap.get(propertyKey) || new PropertySet_1.PropertySet();
            propertySet.add(metadata);
            propertyMap.set(propertyKey, propertySet);
            AbstractPropertyDecorator._targets.set(target, propertyMap);
        }
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
        static getPropertyKeys(target) {
            const propertyMap = AbstractPropertyDecorator._targets.get(target);
            if (propertyMap instanceof PropertyMap_1.PropertyMap) {
                return propertyMap.keys();
            }
            return undefined;
        }
    }
    AbstractPropertyDecorator._targets = new TargetMap_1.TargetMap();
    return AbstractPropertyDecorator;
})();
exports.AbstractPropertyDecorator = AbstractPropertyDecorator;
