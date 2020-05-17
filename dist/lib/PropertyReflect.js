"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reflectProperty = exports.PropertyReflect = void 0;
const public_1 = require("./funcs/public");
const propertyReflectCache = new Map();
class PropertyReflect {
    constructor(parent, propertyKey, isStatic = false) {
        this.parent = parent;
        this.propertyKey = propertyKey;
        this.isStatic = isStatic;
        public_1.parsePropertyReflectType(this);
    }
    set metadata(value) {
        this._metadata = value;
    }
    get metadata() {
        if (!this._metadata) {
            this._metadata = [];
            public_1.parsePropertyReflectMetadata(this);
        }
        return this._metadata;
    }
    getTarget() {
        return this.parent.getTarget();
    }
    getOwnTarget() {
        return this.parent.getOwnTarget();
    }
    hasDecorator(decorator) {
        return Boolean(this.metadata.find((d) => {
            if (typeof decorator === "function") {
                return d instanceof decorator.class;
            }
            return undefined;
        }));
    }
    static create(parent, propertyKey, isStatic = false) {
        const propertyReflectMaps = propertyReflectCache.get(parent) || new Map();
        const propertyReflect = propertyReflectMaps.get(propertyKey) || new PropertyReflect(parent, propertyKey, isStatic);
        propertyReflectMaps.set(propertyKey, propertyReflect);
        propertyReflectCache.set(parent, propertyReflectMaps);
        return propertyReflect;
    }
}
exports.PropertyReflect = PropertyReflect;
function reflectProperty(classReflect, key) {
    const maps = propertyReflectCache.get(classReflect);
    if (maps)
        return maps.get(key);
    return undefined;
}
exports.reflectProperty = reflectProperty;
