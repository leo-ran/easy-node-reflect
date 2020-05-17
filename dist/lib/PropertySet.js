"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertySet = void 0;
class PropertySet extends Set {
    toArray() {
        return Array.from(this);
    }
    addAll(...members) {
        members.forEach(member => this.add(member));
        return this;
    }
    static create(...members) {
        return new PropertySet(members);
    }
    static from(classSet) {
        return new PropertySet(classSet.toArray());
    }
}
exports.PropertySet = PropertySet;
