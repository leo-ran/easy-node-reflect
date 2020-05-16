"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassSet = void 0;
class ClassSet extends Set {
    toArray() {
        return Array.from(this);
    }
    /**
     * 添加多个成员
     * @param members
     */
    addAll(...members) {
        members.forEach(member => this.add(member));
        return this;
    }
    /**
     * 创建
     * @param members
     */
    static create(...members) {
        return new ClassSet(members);
    }
    /**
     * 克隆
     * @param classSet
     */
    static from(classSet) {
        return new ClassSet(classSet.toArray());
    }
}
exports.ClassSet = ClassSet;
