"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InjectMap extends Map {
    mergeInTarget(target) {
        this.forEach((v, k) => target.set(k, v));
    }
    static from(map) {
        const injectMap = new InjectMap();
        map.forEach((value, key) => {
            injectMap.set(key, value);
        });
        return injectMap;
    }
}
exports.InjectMap = InjectMap;
