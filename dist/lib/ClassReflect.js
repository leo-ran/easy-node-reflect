"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const InstanceReflect_1 = require("./InstanceReflect");
const AbstractClassDecorator_1 = require("./AbstractClassDecorator");
const MethodReflect_1 = require("./MethodReflect");
const PropertyReflect_1 = require("./PropertyReflect");
const ClassSet_1 = require("./ClassSet");
const AbstractMethodDecorator_1 = require("./AbstractMethodDecorator");
const AbstractPropertyDecorator_1 = require("./AbstractPropertyDecorator");
const AbstractParameterDecorator_1 = require("./AbstractParameterDecorator");
class ClassReflect {
    constructor(_target) {
        this._target = _target;
        /**
         * 元数据列表
         */
        this.metadata = [];
        /**
         * 实例成员映射
         */
        this.instanceMembers = new Map();
        /**
         * 静态成员映射
         */
        this.staticMembers = new Map();
        /**
         * 运行时类型
         */
        this.runtimeType = ClassReflect;
        // 解析元数据
        ClassReflect.parseMetadata(this);
        // 解析实例成员装饰器
        ClassReflect.parseInstanceMembers(this);
        // 解析静态成员装饰器
        ClassReflect.parseStaticMembers(this);
    }
    getTarget() {
        return this._target.prototype;
    }
    newInstance(positionalArguments) {
        return Reflect.construct(this._target, positionalArguments);
    }
    static parseMetadata(classReflect) {
        const classSet = AbstractClassDecorator_1.AbstractClassDecorator.getMetadata(classReflect._target);
        if (classSet instanceof ClassSet_1.ClassSet) {
            classReflect.metadata = Array.from(classSet).map(metadata => {
                return new InstanceReflect_1.InstanceReflect(metadata);
            });
        }
    }
    static parseInstanceMembers(classReflect) {
        const target = classReflect.getTarget();
        const methodKeys = AbstractMethodDecorator_1.AbstractMethodDecorator.getPropertyKeys(target);
        const propertyKeys = AbstractPropertyDecorator_1.AbstractPropertyDecorator.getPropertyKeys(target);
        const parameterKeys = AbstractParameterDecorator_1.AbstractParameterDecorator.getPropertyKeys(target);
        const list = ['constructor'];
        // 遍历方法列表
        if (methodKeys) {
            list.push(...Array.from(methodKeys));
            list.forEach(key => {
                const methodReflect = new MethodReflect_1.MethodReflect(classReflect, key);
                classReflect.instanceMembers.set(key, methodReflect);
            });
        }
        // 遍历成员列表
        if (propertyKeys) {
            Array.from(propertyKeys).forEach(key => {
                const propertyReflect = new PropertyReflect_1.PropertyReflect(classReflect, key);
                classReflect.instanceMembers.set(key, propertyReflect);
            });
        }
        // parameterKeys
        if (parameterKeys) {
            Array.from(parameterKeys).forEach(key => {
                if (!classReflect.instanceMembers.has(key)) {
                    const methodReflect = new MethodReflect_1.MethodReflect(classReflect, key);
                    classReflect.instanceMembers.set(key, methodReflect);
                }
            });
        }
    }
    static parseStaticMembers(classReflect) {
        const methodKeys = AbstractMethodDecorator_1.AbstractMethodDecorator.getPropertyKeys(classReflect._target);
        const propertyKeys = AbstractPropertyDecorator_1.AbstractPropertyDecorator.getPropertyKeys(classReflect._target);
        // 遍历方法列表
        if (methodKeys) {
            Array.from(methodKeys).forEach(key => {
                const methodReflect = new MethodReflect_1.MethodReflect(classReflect, key, true);
                classReflect.staticMembers.set(key, methodReflect);
            });
        }
        // 遍历成员列表
        if (propertyKeys) {
            Array.from(propertyKeys).forEach(key => {
                const propertyReflect = new PropertyReflect_1.PropertyReflect(classReflect, key, true);
                classReflect.staticMembers.set(key, propertyReflect);
            });
        }
    }
}
exports.ClassReflect = ClassReflect;
