"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParameterSet = void 0;
class ParameterSet extends Set {
    toArray() {
        return Array.from(this);
    }
    addAll(...members) {
        members.forEach(member => this.add(member));
        return this;
    }
    static create(...members) {
        return new ParameterSet(members);
    }
    static from(classSet) {
        return new ParameterSet(classSet.toArray());
    }
}
exports.ParameterSet = ParameterSet;
