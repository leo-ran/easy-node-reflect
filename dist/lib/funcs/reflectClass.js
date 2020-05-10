"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../index");
const classReflects = new Map();
function reflectClass(target, parent) {
    // 添加缓存处理
    const classReflect = classReflects.get(target) || parent ? new index_1.ClassReflect(target, parent) : new index_1.ClassReflect(target);
    classReflects.set(target, classReflect);
    return classReflect;
}
exports.reflectClass = reflectClass;
