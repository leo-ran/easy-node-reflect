"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassReflect = void 0;
const InstanceReflect_1 = require("./InstanceReflect");
const AbstractClassDecorator_1 = require("./AbstractClassDecorator");
const public_1 = require("./funcs/public");
const InjectMap_1 = require("./InjectMap");
const classReflectCache = new Map();
/**
 * 类反射
 */
class ClassReflect {
    /**
     * @param _target 目标类
     * @param parent 父ClassReflect
     */
    constructor(_target, parent) {
        this._target = _target;
        this.parent = parent;
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
        /**
         * 提供给子Reflect的服务
         */
        this._provider = new Map();
        // 解析元数据
        public_1.parseClassReflectMetadata(this);
        // 解析实例成员装饰器
        public_1.parseClassReflectInstanceMembers(this);
        // 解析静态成员装饰器
        public_1.parseClassReflectStaticMembers(this);
    }
    /**
     * 获取构造函数的reflect
     */
    get constructorMethodReflect() {
        return (this.instanceMembers.get("constructor"));
    }
    /**
     * 查找服务
     * @param key 服务的key
     * @param _extends 是否继承父级服务提供
     */
    getProvider(key, _extends) {
        const value = this._provider.get(key);
        // 如果继承父级服务提供则 递归父级服务
        if (!value && this.parent && _extends) {
            return this.parent.getProvider(key, _extends);
        }
        return value;
    }
    /**
     * 设置服务
     * @param key 服务的key
     */
    setProvider(key, value) {
        this._provider.set(key, value);
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
     * 检测是否包含装饰器
     * @param decorator
     */
    hasDecorator(decorator) {
        return Boolean(this.metadata.find((d) => {
            if (typeof decorator === "function") {
                return d instanceof decorator.class;
            }
        }));
    }
    /**
     * 实例化当前目标类
     * 此方法为异步创建，考虑到同步创建 无法注入一些异步的驱动
     */
    async newInstance() {
        const classDecorators = this.metadata;
        const classDecoratorLength = classDecorators.length;
        // 循环初始依赖
        for (let i = 0; i < classDecoratorLength; i++) {
            const classDecorator = classDecorators[i];
            if (classDecorator instanceof AbstractClassDecorator_1.AbstractClassDecorator && typeof classDecorator.onTargetBeforeInstance === "function") {
                await classDecorator.onTargetBeforeInstance(this);
            }
        }
        const positionalArguments = [];
        // 获取构造函数反色对象
        const { constructorMethodReflect } = this;
        const parameters = constructorMethodReflect.parameters;
        const parameterLength = parameters.length;
        for (let i = 0; i < parameterLength; i++) {
            const parameterReflect = parameters[i];
            // 获取服务里提供的对应服务作为注入的value值
            // 注入顺序为
            let value = this.getProvider(parameterReflect.type);
            // 使用参数装饰器钩子
            value = await parameterReflect.handlerInject(InjectMap_1.InjectMap.from(this._provider), value);
            // 注入到参数中
            positionalArguments[parameterReflect.parameterIndex] = value;
        }
        // 得到实例
        const instance = InstanceReflect_1.InstanceReflect.create(Reflect.construct(this._target, positionalArguments));
        // 通知所有的类装饰器 实例创建完毕
        for (let i = 0; i < classDecoratorLength; i++) {
            const classDecorator = classDecorators[i];
            if (classDecorator instanceof AbstractClassDecorator_1.AbstractClassDecorator && typeof classDecorator.onTargetInstanced === "function") {
                await classDecorator.onTargetInstanced(this, instance);
            }
        }
        // 返回实例
        return instance;
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
