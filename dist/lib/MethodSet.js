"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MethodSet = void 0;
class MethodSet extends Set {
    toArray() {
        return Array.from(this);
    }
    addAll(...members) {
        members.forEach(member => this.add(member));
        return this;
    }
    static create(...members) {
        return new MethodSet(members);
    }
    static from(classSet) {
        return new MethodSet(classSet.toArray());
    }
}
exports.MethodSet = MethodSet;
