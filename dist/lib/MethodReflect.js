"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const InstanceReflect_1 = require("./InstanceReflect");
const ParameterReflect_1 = require("./ParameterReflect");
const SystemReflectKeys_1 = require("./SystemReflectKeys");
const AbstractMethodDecorator_1 = require("./AbstractMethodDecorator");
const MethodSet_1 = require("./MethodSet");
class MethodReflect {
    constructor(parent, propertyKey, isStatic = false) {
        this.parent = parent;
        this.propertyKey = propertyKey;
        this.isStatic = isStatic;
        this.isGetter = false;
        this.isSetter = false;
        this.isConstructor = this.propertyKey === 'constructor';
        /**
         * 参数列表
         */
        this.parameters = [];
        // @ts-ignore
        const target = this.isStatic ? this.parent._target : this.getTarget();
        if (!target)
            return;
        MethodReflect.parseParameters(this);
        MethodReflect.parseReturnType(this);
        const descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
        if (descriptor) {
            this.isGetter = typeof descriptor.get === "function";
            this.isSetter = typeof descriptor.set === "function";
        }
    }
    /**
     * 元数据列表
     */
    get metadata() {
        // 懒加载 缓存处理
        if (!this._metadata) {
            this._metadata = [];
            MethodReflect.parseMetadata(this);
        }
        return this._metadata;
    }
    set metadata(value) {
        this._metadata = value;
    }
    getTarget() {
        return this.parent.getTarget();
    }
    static parseMetadata(methodReflect) {
        // @ts-ignore
        const target = methodReflect.isStatic ? methodReflect.parent._target : methodReflect.getTarget();
        const methodSet = AbstractMethodDecorator_1.AbstractMethodDecorator.getMetadata(target, methodReflect.propertyKey);
        if (methodSet instanceof MethodSet_1.MethodSet) {
            methodSet.forEach(metadata => {
                methodReflect.metadata.push(new InstanceReflect_1.InstanceReflect(metadata));
            });
        }
    }
    static parseParameters(methodReflect) {
        // @ts-ignore
        const target = methodReflect.isStatic ? methodReflect.parent._target : methodReflect.getTarget();
        const propertyKey = methodReflect.propertyKey;
        let paramTypes = [];
        // 如果不是构造函数
        if (!methodReflect.isConstructor) {
            paramTypes = Reflect.getMetadata(SystemReflectKeys_1.SystemReflectKeys.ParamTypes, target, propertyKey);
        }
        else {
            // 构造函数 不需要 propertyKey
            // 构造函数  target 不能用 `prototype`
            paramTypes = Reflect.getMetadata(SystemReflectKeys_1.SystemReflectKeys.ParamTypes, 
            // @ts-ignore
            methodReflect.parent._target);
        }
        if (paramTypes) {
            paramTypes.map((type, index) => {
                methodReflect.parameters[index] = new ParameterReflect_1.ParameterReflect(methodReflect, type, propertyKey, index);
            });
        }
    }
    static parseReturnType(methodReflect) {
        // @ts-ignore
        const target = methodReflect.isStatic ? methodReflect.parent._target : methodReflect.getTarget();
        const returnType = Reflect.getMetadata(SystemReflectKeys_1.SystemReflectKeys.ReturnType, target, methodReflect.propertyKey);
        if (returnType) {
            methodReflect.returnType = returnType;
        }
    }
}
exports.MethodReflect = MethodReflect;
