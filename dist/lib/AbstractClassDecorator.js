"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reflectClass = exports.AbstractClassDecorator = void 0;
const TargetMap_1 = require("./TargetMap");
const ClassSet_1 = require("./ClassSet");
const ClassReflect_1 = require("./ClassReflect");
let AbstractClassDecorator = (() => {
    class AbstractClassDecorator {
        static create(IDecorator) {
            function decorator(...args) {
                return (target) => {
                    const metadata = Reflect.construct(IDecorator, args);
                    AbstractClassDecorator.defineMetadata(target, metadata);
                    return target;
                };
            }
            decorator.class = IDecorator;
            return decorator;
        }
        static defineMetadata(target, metadata) {
            const classSet = AbstractClassDecorator._targets.get(target) || new ClassSet_1.ClassSet();
            classSet.add(metadata);
            AbstractClassDecorator._targets.set(target, classSet);
        }
        static getMetadata(target) {
            return AbstractClassDecorator._targets.get(target);
        }
    }
    AbstractClassDecorator._targets = new TargetMap_1.TargetMap();
    return AbstractClassDecorator;
})();
exports.AbstractClassDecorator = AbstractClassDecorator;
function reflectClass(target, parent) {
    return ClassReflect_1.ClassReflect.create(target, parent);
}
exports.reflectClass = reflectClass;
