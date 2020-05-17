"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassReflect = void 0;
const InstanceReflect_1 = require("./InstanceReflect");
const AbstractClassDecorator_1 = require("./AbstractClassDecorator");
const public_1 = require("./funcs/public");
const InjectMap_1 = require("./InjectMap");
const classReflectCache = new Map();
class ClassReflect {
    constructor(_target, parent) {
        this._target = _target;
        this.parent = parent;
        this.metadata = [];
        this.instanceMembers = new Map();
        this.staticMembers = new Map();
        this._provider = new Map();
        public_1.parseClassReflectMetadata(this);
        public_1.parseClassReflectInstanceMembers(this);
        public_1.parseClassReflectStaticMembers(this);
    }
    get constructorMethodReflect() {
        return (this.instanceMembers.get("constructor"));
    }
    getProvider(key, _extends) {
        const value = this._provider.get(key);
        if (!value && this.parent && _extends) {
            return this.parent.getProvider(key, _extends);
        }
        return value;
    }
    setProvider(key, value) {
        this._provider.set(key, value);
        return this;
    }
    getTarget() {
        return this._target;
    }
    getTargetName() {
        return this._target.name;
    }
    getOwnTarget() {
        return this._target.prototype;
    }
    getOwnTargetName() {
        return this._target.prototype.name;
    }
    hasDecorator(decorator) {
        return Boolean(this.metadata.find((d) => {
            if (typeof decorator === "function") {
                return d instanceof decorator.class;
            }
            return undefined;
        }));
    }
    async newInstance() {
        const classDecorators = this.metadata;
        const classDecoratorLength = classDecorators.length;
        for (let i = 0; i < classDecoratorLength; i++) {
            const classDecorator = classDecorators[i];
            if (classDecorator instanceof AbstractClassDecorator_1.AbstractClassDecorator && typeof classDecorator.onTargetBeforeInstance === "function") {
                await classDecorator.onTargetBeforeInstance(this);
            }
        }
        const positionalArguments = [];
        const { constructorMethodReflect } = this;
        const parameters = constructorMethodReflect.parameters;
        const parameterLength = parameters.length;
        for (let i = 0; i < parameterLength; i++) {
            const parameterReflect = parameters[i];
            let value = this.getProvider(parameterReflect.type);
            value = await parameterReflect.handlerInject(InjectMap_1.InjectMap.from(this._provider), value);
            positionalArguments[parameterReflect.parameterIndex] = value;
        }
        const instance = InstanceReflect_1.InstanceReflect.create(Reflect.construct(this._target, positionalArguments));
        for (let i = 0; i < classDecoratorLength; i++) {
            const classDecorator = classDecorators[i];
            if (classDecorator instanceof AbstractClassDecorator_1.AbstractClassDecorator && typeof classDecorator.onTargetInstanced === "function") {
                await classDecorator.onTargetInstanced(this, instance);
            }
        }
        return instance;
    }
    get superClass() {
        if (!this._superClass && this._target.__proto__) {
            this._superClass = new ClassReflect(this._target.__proto__);
        }
        return this._superClass;
    }
    static create(target, parent) {
        const classReflect = classReflectCache.get(target) || (parent ? new ClassReflect(target, parent) : new ClassReflect(target));
        classReflectCache.set(target, classReflect);
        return classReflect;
    }
}
exports.ClassReflect = ClassReflect;
