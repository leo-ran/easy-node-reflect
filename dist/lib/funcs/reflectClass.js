"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../index");
const classReflects = new Map();
function reflectClass(target) {
    // 添加缓存处理
    return classReflects.get(target) || new index_1.ClassReflect(target);
}
exports.reflectClass = reflectClass;
