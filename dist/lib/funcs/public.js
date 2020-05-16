"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePropertyReflectType = exports.parsePropertyReflectMetadata = exports.parseParameterMetadata = exports.parseMethodReflectReturnType = exports.parseMethodReflectParameters = exports.parseMethodReflectMetadata = exports.parseClassReflectStaticMembers = exports.parseClassReflectInstanceMembers = exports.parseClassReflectMetadata = void 0;
const AbstractClassDecorator_1 = require("../AbstractClassDecorator");
const ClassSet_1 = require("../ClassSet");
const AbstractMethodDecorator_1 = require("../AbstractMethodDecorator");
const AbstractPropertyDecorator_1 = require("../AbstractPropertyDecorator");
const AbstractParameterDecorator_1 = require("../AbstractParameterDecorator");
const MethodReflect_1 = require("../MethodReflect");
const PropertyReflect_1 = require("../PropertyReflect");
const MethodSet_1 = require("../MethodSet");
const SystemReflectKeys_1 = require("../SystemReflectKeys");
const ParameterReflect_1 = require("../ParameterReflect");
const ParameterSet_1 = require("../ParameterSet");
const PropertySet_1 = require("../PropertySet");
/**
 * 解析类的 元数据
 * @param classReflect
 */
function parseClassReflectMetadata(classReflect) {
    const classSet = AbstractClassDecorator_1.AbstractClassDecorator.getMetadata(classReflect.getTarget());
    if (classSet instanceof ClassSet_1.ClassSet) {
        classReflect.metadata = Array.from(classSet);
    }
}
exports.parseClassReflectMetadata = parseClassReflectMetadata;
/**
 * 解析类的 实例成员
 * @param classReflect
 */
function parseClassReflectInstanceMembers(classReflect) {
    const target = classReflect.getOwnTarget();
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
        const methodReflect = MethodReflect_1.MethodReflect.create(classReflect, key);
        classReflect.instanceMembers.set(key, methodReflect);
    });
    // 遍历成员列表
    if (propertyKeys) {
        Array.from(propertyKeys).forEach(key => {
            const propertyReflect = PropertyReflect_1.PropertyReflect.create(classReflect, key);
            classReflect.instanceMembers.set(key, propertyReflect);
        });
    }
    // parameterKeys
    if (parameterKeys) {
        Array.from(parameterKeys).forEach(key => {
            if (!classReflect.instanceMembers.has(key)) {
                const methodReflect = MethodReflect_1.MethodReflect.create(classReflect, key);
                classReflect.instanceMembers.set(key, methodReflect);
            }
        });
    }
}
exports.parseClassReflectInstanceMembers = parseClassReflectInstanceMembers;
/**
 * 解析类的 静态成员
 * @param classReflect
 */
function parseClassReflectStaticMembers(classReflect) {
    const methodKeys = AbstractMethodDecorator_1.AbstractMethodDecorator.getPropertyKeys(classReflect.getTarget());
    const propertyKeys = AbstractPropertyDecorator_1.AbstractPropertyDecorator.getPropertyKeys(classReflect.getTarget());
    // 遍历方法列表
    if (methodKeys) {
        Array.from(methodKeys).forEach(key => {
            const methodReflect = MethodReflect_1.MethodReflect.create(classReflect, key, true);
            classReflect.staticMembers.set(key, methodReflect);
        });
    }
    // 遍历成员列表
    if (propertyKeys) {
        Array.from(propertyKeys).forEach(key => {
            const propertyReflect = PropertyReflect_1.PropertyReflect.create(classReflect, key, true);
            classReflect.staticMembers.set(key, propertyReflect);
        });
    }
}
exports.parseClassReflectStaticMembers = parseClassReflectStaticMembers;
/**
 * 解析方法装饰器的 所有装饰器
 * @param methodReflect
 */
function parseMethodReflectMetadata(methodReflect) {
    // @ts-ignore
    const target = methodReflect.isStatic ? methodReflect.getTarget() : methodReflect.getOwnTarget();
    const methodSet = AbstractMethodDecorator_1.AbstractMethodDecorator.getMetadata(target, methodReflect.propertyKey);
    if (methodSet instanceof MethodSet_1.MethodSet) {
        methodSet.forEach(metadata => {
            methodReflect.metadata.push(metadata);
        });
    }
}
exports.parseMethodReflectMetadata = parseMethodReflectMetadata;
/**
 * 解析方法装饰器的所有元数据参数
 * @param methodReflect
 */
function parseMethodReflectParameters(methodReflect) {
    const target = methodReflect.isStatic ? methodReflect.getTarget() : methodReflect.getOwnTarget();
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
        methodReflect.getTarget());
    }
    if (paramTypes) {
        paramTypes.map((type, index) => {
            methodReflect.parameters[index] = new ParameterReflect_1.ParameterReflect(methodReflect, type, propertyKey, index);
        });
    }
}
exports.parseMethodReflectParameters = parseMethodReflectParameters;
/**
 * 解析方法装饰器的 返回类型
 * @param methodReflect
 */
function parseMethodReflectReturnType(methodReflect) {
    const target = methodReflect.isStatic ? methodReflect.getTarget() : methodReflect.getOwnTarget();
    const returnType = Reflect.getMetadata(SystemReflectKeys_1.SystemReflectKeys.ReturnType, target, methodReflect.propertyKey);
    if (returnType) {
        methodReflect.returnType = returnType;
    }
}
exports.parseMethodReflectReturnType = parseMethodReflectReturnType;
/**
 * 解析参数的装饰器列表
 * @param parameterReflect
 */
function parseParameterMetadata(parameterReflect) {
    const parameterSet = AbstractParameterDecorator_1.AbstractParameterDecorator.getMetadata(parameterReflect.getTarget(), parameterReflect.propertyKey, parameterReflect.parameterIndex);
    if (parameterSet instanceof ParameterSet_1.ParameterSet) {
        parameterReflect.metadata = Array.from(parameterSet);
    }
}
exports.parseParameterMetadata = parseParameterMetadata;
/**
 * 解析属性的元数据反射
 * @param propertyReflect
 */
function parsePropertyReflectMetadata(propertyReflect) {
    const target = propertyReflect.isStatic ? propertyReflect.getTarget() : propertyReflect.getOwnTarget();
    const propertySet = AbstractPropertyDecorator_1.AbstractPropertyDecorator.getMetadata(target, propertyReflect.propertyKey);
    if (propertySet instanceof PropertySet_1.PropertySet) {
        propertyReflect.metadata = Array.from(propertySet);
    }
}
exports.parsePropertyReflectMetadata = parsePropertyReflectMetadata;
/**
 * 解析属性的元数据反射 属性值类型
 * @param propertyReflect
 */
function parsePropertyReflectType(propertyReflect) {
    const target = propertyReflect.isStatic ? propertyReflect.getTarget() : propertyReflect.getOwnTarget();
    if (!target)
        return;
    const type = Reflect.getMetadata(SystemReflectKeys_1.SystemReflectKeys.Type, target, propertyReflect.propertyKey);
    if (type) {
        propertyReflect.type = type;
    }
}
exports.parsePropertyReflectType = parsePropertyReflectType;
