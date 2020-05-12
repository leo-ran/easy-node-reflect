"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const InstanceReflect_1 = require("./InstanceReflect");
const MethodReflect_1 = require("./MethodReflect");
const public_1 = require("./funcs/public");
const classReflectCache = new Map();
/**
 * 类反射
 */
class ClassReflect {
    constructor(_target, parent) {
        this._target = _target;
        this.parent = parent;
        /**
         * 公开提供的服务
         * 公开提供的服务子ClassReflect可以直接访问和继承
         */
        this._publicProvider = new Map();
        /**
         * 私有提供服务
         * 私有提供服务只提供给当前ClassReflect 子ClassReflect不能访问和继承
         */
        this._privateProvider = new Map();
        /**
         * 元数据列表
         */
        this.metadata = [];
        /**
         * 实例成员映射
         */
        this.instanceMembers = new Map();
        /**
         * 静态成员映射
         */
        this.staticMembers = new Map();
        // 解析元数据
        public_1.parseClassReflectMetadata(this);
        // 解析实例成员装饰器
        public_1.parseClassReflectInstanceMembers(this);
        // 解析静态成员装饰器
        public_1.parseClassReflectStaticMembers(this);
        /**
         * 继承父类提供的服务
         */
        if (parent && parent instanceof ClassReflect) {
            parent._publicProvider.forEach((value, key) => {
                this._publicProvider.set(key, value);
            });
        }
    }
    /**
     * 获取公共服务
     * @param key
     */
    getPublicProvider(key) {
        return this._publicProvider.get(key);
    }
    /**
     * 获取私有服务
     * @param key
     */
    getPrivateProvider(key) {
        return this._publicProvider.get(key);
    }
    /**
     * 设置公共服务
     * @param key
     * @param value
     */
    setPublicProvider(key, value) {
        this._publicProvider.set(key, value);
        return this;
    }
    /**
     * 设置私有服务
     * @param key
     * @param value
     */
    setPrivateProvider(key, value) {
        this._publicProvider.set(key, value);
        return this;
    }
    /**
     * 获取 `ClassReflect` 的目标
     */
    getTarget() {
        return this._target;
    }
    /**
     * 获取 `ClassReflect` 的目标类的 名称
     */
    getTargetName() {
        return this._target.name;
    }
    /**
     * 获取 `ClassReflect` 的原型链
     */
    getOwnTarget() {
        return this._target.prototype;
    }
    /**
     * 获取 `ClassReflect` 的原型链
     */
    getOwnTargetName() {
        return this._target.prototype.name;
    }
    /**
     * target 实例化
     * @param callback
     */
    newInstance(callback) {
        let positionalArguments = [];
        this.metadata.forEach(item => {
            if (typeof item.onNewInstance === "function") {
                // 实例化前 给装饰器 传递实例
                const methodReflect = this.instanceMembers.get("constructor");
                if (methodReflect instanceof MethodReflect_1.MethodReflect) {
                    // 执行实例前的钩子
                    item.onNewInstance(this, methodReflect);
                    positionalArguments = callback(this, methodReflect.parameters);
                }
            }
        });
        const instanceReflect = InstanceReflect_1.InstanceReflect.create(Reflect.construct(this._target, positionalArguments));
        this.metadata.forEach(item => {
            if (typeof item.onNewInstanced === "function") {
                // 实例化后 给装饰器 传递实例
                item.onNewInstanced(this, instanceReflect);
            }
        });
        return instanceReflect;
    }
    /**
     * 父类反射
     */
    get superClass() {
        if (!this._superClass && this._target.__proto__) {
            this._superClass = new ClassReflect(this._target.__proto__);
        }
        return this._superClass;
    }
    /**
     * 创建ClassReflect实例
     * @param target 目标类
     */
    static create(target, parent) {
        // 添加缓存处理
        const classReflect = classReflectCache.get(target) || (parent ? new ClassReflect(target, parent) : new ClassReflect(target));
        classReflectCache.set(target, classReflect);
        return classReflect;
    }
}
exports.ClassReflect = ClassReflect;
