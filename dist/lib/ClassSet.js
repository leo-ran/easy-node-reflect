"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassSet = void 0;
class ClassSet extends Set {
    toArray() {
        return Array.from(this);
    }
    addAll(...members) {
        members.forEach(member => this.add(member));
        return this;
    }
    static create(...members) {
        return new ClassSet(members);
    }
    static from(classSet) {
        return new ClassSet(classSet.toArray());
    }
}
exports.ClassSet = ClassSet;
