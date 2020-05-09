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
/**
 * 类反射
 */
class ClassReflect {
    constructor(_target, parent) {
        this._target = _target;
        this.parent = parent;
        /**
         * `_target`类的服务提供映射
         * 用于在实例化 `_target`注入参数的类型=>参数映射关系查找
         */
        this.provider = new Map();
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
        // 解析元数据
        ClassReflect.parseMetadata(this);
        // 解析实例成员装饰器
        ClassReflect.parseInstanceMembers(this);
        // 解析静态成员装饰器
        ClassReflect.parseStaticMembers(this);
    }
    /**
     * 获取 `ClassReflect` 的目标
     */
    getTarget() {
        return this._target.prototype;
    }
    /**
     * 获取 `ClassReflect` 的目标类的 名称
     */
    getTargetName() {
        return this._target.name;
    }
    /**
     * target 实例化
     * @param callback
     */
    newInstance(callback) {
        let positionalArguments = [];
        this.metadata.forEach(item => {
            if (typeof item.metadata.onNewInstance === "function") {
                // 实例化前 给装饰器 传递实例
                const methodReflect = this.instanceMembers.get("constructor");
                if (methodReflect instanceof MethodReflect_1.MethodReflect) {
                    const injectMap = item.metadata.onNewInstance(methodReflect);
                    injectMap.forEach((_obj, key) => {
                        const sets = this.provider.get(key) || new Set();
                        sets.add(_obj);
                        this.provider.set(key, sets);
                    });
                    positionalArguments = callback(this, methodReflect.parameters);
                }
            }
        });
        const instanceReflect = new InstanceReflect_1.InstanceReflect(Reflect.construct(this._target, positionalArguments));
        this.metadata.forEach(item => {
            if (typeof item.metadata.onNewInstanced === "function") {
                // 实例化后 给装饰器 传递实例
                item.metadata.onNewInstanced(instanceReflect);
            }
        });
        return instanceReflect;
    }
    /**
     * 父类反射
     */
    get superClass() {
        if (!this._superClass && this._target.__proto__) {
            this._superClass = new ClassReflect(this._target.__proto__);
        }
        return this._superClass;
    }
    /**
     * 解析元数据
     * @param classReflect
     */
    static parseMetadata(classReflect) {
        const classSet = AbstractClassDecorator_1.AbstractClassDecorator.getMetadata(classReflect._target);
        if (classSet instanceof ClassSet_1.ClassSet) {
            classReflect.metadata = Array.from(classSet).map(metadata => {
                return new InstanceReflect_1.InstanceReflect(metadata);
            });
        }
    }
    /**
     * 解析类的 实例成员
     * @param classReflect
     */
    static parseInstanceMembers(classReflect) {
        const target = classReflect.getTarget();
        const methodKeys = AbstractMethodDecorator_1.AbstractMethodDecorator.getPropertyKeys(target);
        const propertyKeys = AbstractPropertyDecorator_1.AbstractPropertyDecorator.getPropertyKeys(target);
        const parameterKeys = AbstractParameterDecorator_1.AbstractParameterDecorator.getPropertyKeys(target);
        const list = ['constructor'];
        // 遍历方法列表
        if (methodKeys) {
            list.push(...Array.from(methodKeys));
        }
        // 修复 methodKeys 在没有装饰器的时候不能循环
        list.forEach(key => {
            const methodReflect = new MethodReflect_1.MethodReflect(classReflect, key);
            classReflect.instanceMembers.set(key, methodReflect);
        });
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
    /**
     * 解析类的静态成员
     * @param classReflect
     */
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
