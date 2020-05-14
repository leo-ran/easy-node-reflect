"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InjectMap extends Map {
    mergeInTarget(target) {
        this.forEach((v, k) => target.set(k, v));
    }
}
exports.InjectMap = InjectMap;
