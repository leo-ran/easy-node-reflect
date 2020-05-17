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
function parseClassReflectMetadata(classReflect) {
    const classSet = AbstractClassDecorator_1.AbstractClassDecorator.getMetadata(classReflect.getTarget());
    if (classSet instanceof ClassSet_1.ClassSet) {
        classReflect.metadata = Array.from(classSet);
    }
}
exports.parseClassReflectMetadata = parseClassReflectMetadata;
function parseClassReflectInstanceMembers(classReflect) {
    const target = classReflect.getOwnTarget();
    const methodKeys = AbstractMethodDecorator_1.AbstractMethodDecorator.getPropertyKeys(target);
    const propertyKeys = AbstractPropertyDecorator_1.AbstractPropertyDecorator.getPropertyKeys(target);
    const parameterKeys = AbstractParameterDecorator_1.AbstractParameterDecorator.getPropertyKeys(target);
    const list = ['constructor'];
    if (methodKeys) {
        list.push(...Array.from(methodKeys));
    }
    list.forEach(key => {
        const methodReflect = MethodReflect_1.MethodReflect.create(classReflect, key);
        classReflect.instanceMembers.set(key, methodReflect);
    });
    if (propertyKeys) {
        Array.from(propertyKeys).forEach(key => {
            const propertyReflect = PropertyReflect_1.PropertyReflect.create(classReflect, key);
            classReflect.instanceMembers.set(key, propertyReflect);
        });
    }
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
function parseClassReflectStaticMembers(classReflect) {
    const methodKeys = AbstractMethodDecorator_1.AbstractMethodDecorator.getPropertyKeys(classReflect.getTarget());
    const propertyKeys = AbstractPropertyDecorator_1.AbstractPropertyDecorator.getPropertyKeys(classReflect.getTarget());
    if (methodKeys) {
        Array.from(methodKeys).forEach(key => {
            const methodReflect = MethodReflect_1.MethodReflect.create(classReflect, key, true);
            classReflect.staticMembers.set(key, methodReflect);
        });
    }
    if (propertyKeys) {
        Array.from(propertyKeys).forEach(key => {
            const propertyReflect = PropertyReflect_1.PropertyReflect.create(classReflect, key, true);
            classReflect.staticMembers.set(key, propertyReflect);
        });
    }
}
exports.parseClassReflectStaticMembers = parseClassReflectStaticMembers;
function parseMethodReflectMetadata(methodReflect) {
    const target = methodReflect.isStatic ? methodReflect.getTarget() : methodReflect.getOwnTarget();
    const methodSet = AbstractMethodDecorator_1.AbstractMethodDecorator.getMetadata(target, methodReflect.propertyKey);
    if (methodSet instanceof MethodSet_1.MethodSet) {
        methodSet.forEach(metadata => {
            methodReflect.metadata.push(metadata);
        });
    }
}
exports.parseMethodReflectMetadata = parseMethodReflectMetadata;
function parseMethodReflectParameters(methodReflect) {
    const target = methodReflect.isStatic ? methodReflect.getTarget() : methodReflect.getOwnTarget();
    const propertyKey = methodReflect.propertyKey;
    let paramTypes = [];
    if (!methodReflect.isConstructor) {
        paramTypes = Reflect.getMetadata(SystemReflectKeys_1.SystemReflectKeys.ParamTypes, target, propertyKey);
    }
    else {
        paramTypes = Reflect.getMetadata(SystemReflectKeys_1.SystemReflectKeys.ParamTypes, methodReflect.getTarget());
    }
    if (paramTypes) {
        paramTypes.map((type, index) => {
            methodReflect.parameters[index] = new ParameterReflect_1.ParameterReflect(methodReflect, type, propertyKey, index);
        });
    }
}
exports.parseMethodReflectParameters = parseMethodReflectParameters;
function parseMethodReflectReturnType(methodReflect) {
    const target = methodReflect.isStatic ? methodReflect.getTarget() : methodReflect.getOwnTarget();
    const returnType = Reflect.getMetadata(SystemReflectKeys_1.SystemReflectKeys.ReturnType, target, methodReflect.propertyKey);
    if (returnType) {
        methodReflect.returnType = returnType;
    }
}
exports.parseMethodReflectReturnType = parseMethodReflectReturnType;
function parseParameterMetadata(parameterReflect) {
    const parameterSet = AbstractParameterDecorator_1.AbstractParameterDecorator.getMetadata(parameterReflect.getOwnTarget(), parameterReflect.propertyKey, parameterReflect.parameterIndex);
    if (parameterSet instanceof ParameterSet_1.ParameterSet) {
        parameterReflect.metadata = Array.from(parameterSet);
    }
}
exports.parseParameterMetadata = parseParameterMetadata;
function parsePropertyReflectMetadata(propertyReflect) {
    const target = propertyReflect.isStatic ? propertyReflect.getTarget() : propertyReflect.getOwnTarget();
    const propertySet = AbstractPropertyDecorator_1.AbstractPropertyDecorator.getMetadata(target, propertyReflect.propertyKey);
    if (propertySet instanceof PropertySet_1.PropertySet) {
        propertyReflect.metadata = Array.from(propertySet);
    }
}
exports.parsePropertyReflectMetadata = parsePropertyReflectMetadata;
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
