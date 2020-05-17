import {BaseConstructor} from "../../interface";
import {AbstractClassDecorator} from "../AbstractClassDecorator";
import {ClassSet} from "../ClassSet";
import {AbstractMethodDecorator} from "../AbstractMethodDecorator";
import {AbstractPropertyDecorator} from "../AbstractPropertyDecorator";
import {AbstractParameterDecorator} from "../AbstractParameterDecorator";
import {MethodReflect} from "../MethodReflect";
import {PropertyReflect} from "../PropertyReflect";
import {ClassReflect} from "../ClassReflect";
import {MethodSet} from "../MethodSet";
import {SystemReflectKeys} from "../SystemReflectKeys";
import {ParameterReflect} from "../ParameterReflect";
import {ParameterSet} from "../ParameterSet";
import {PropertySet} from "../PropertySet";


/**
 * 解析类的 元数据
 * @param classReflect
 */
export function parseClassReflectMetadata<T extends BaseConstructor>(classReflect: ClassReflect<T>) {
  const classSet = AbstractClassDecorator.getMetadata(classReflect.getTarget());
  if (classSet instanceof ClassSet) {
    classReflect.metadata = Array.from(classSet);
  }
}

/**
 * 解析类的 实例成员
 * @param classReflect
 */
export function parseClassReflectInstanceMembers<T extends BaseConstructor>(classReflect: ClassReflect<T>): void {
  const target = classReflect.getOwnTarget<BaseConstructor>();
  const methodKeys = AbstractMethodDecorator.getPropertyKeys(target);
  const propertyKeys = AbstractPropertyDecorator.getPropertyKeys(target);
  const parameterKeys = AbstractParameterDecorator.getPropertyKeys(target);

  const list: Array<string | symbol> = ['constructor'];

// 遍历方法列表
  if (methodKeys) {
    list.push(...Array.from(methodKeys));
  }

// 修复 methodKeys 在没有装饰器的时候不能循环
  list.forEach(key => {
    const methodReflect = MethodReflect.create(
      classReflect,
      key
    );
    classReflect.instanceMembers.set(key, methodReflect);
  });

// 遍历成员列表
  if (propertyKeys) {
    Array.from(propertyKeys).forEach(key => {
      const propertyReflect = PropertyReflect.create(
        classReflect,
        key
      );
      classReflect.instanceMembers.set(key, propertyReflect);
    })
  }

// parameterKeys
  if (parameterKeys) {
    Array.from(parameterKeys).forEach(key => {
      if (!classReflect.instanceMembers.has(key)) {
        const methodReflect = MethodReflect.create(
          classReflect,
          key
        );
        classReflect.instanceMembers.set(key, methodReflect);
      }
    })
  }
}


/**
 * 解析类的 静态成员
 * @param classReflect
 */
export function parseClassReflectStaticMembers<T extends BaseConstructor>(classReflect: ClassReflect<T>): void {
  const methodKeys = AbstractMethodDecorator.getPropertyKeys(classReflect.getTarget());
  const propertyKeys = AbstractPropertyDecorator.getPropertyKeys(classReflect.getTarget());
  // 遍历方法列表
  if (methodKeys) {
    Array.from(methodKeys).forEach(key => {
      const methodReflect = MethodReflect.create(
        classReflect,
        key,
        true,
      );
      classReflect.staticMembers.set(key, methodReflect);
    })
  }

  // 遍历成员列表
  if (propertyKeys) {
    Array.from(propertyKeys).forEach(key => {
      const propertyReflect = PropertyReflect.create(
        classReflect,
        key,
        true,
      );
      classReflect.staticMembers.set(key, propertyReflect);
    })
  }
}


/**
 * 解析方法装饰器的 所有装饰器
 * @param methodReflect
 */
export function parseMethodReflectMetadata(methodReflect: MethodReflect): void {
  // @ts-ignore
  const target = methodReflect.isStatic ? methodReflect.getTarget() : methodReflect.getOwnTarget();
  const methodSet = AbstractMethodDecorator.getMetadata(target, methodReflect.propertyKey);
  if (methodSet instanceof MethodSet) {
    methodSet.forEach(metadata => {
      methodReflect.metadata.push(metadata);
    });
  }
}

/**
 * 解析方法装饰器的所有元数据参数
 * @param methodReflect
 */
export function parseMethodReflectParameters(methodReflect: MethodReflect): void {
  const target = methodReflect.isStatic ? methodReflect.getTarget() : methodReflect.getOwnTarget();
  const propertyKey = methodReflect.propertyKey;
  let paramTypes: Function[] = [];

// 如果不是构造函数
  if (!methodReflect.isConstructor) {
    paramTypes = Reflect.getMetadata(
      SystemReflectKeys.ParamTypes,
      target,
      propertyKey,
    );

  } else {
    // 构造函数 不需要 propertyKey
    // 构造函数  target 不能用 `prototype`
    paramTypes = Reflect.getMetadata(
      SystemReflectKeys.ParamTypes,
      // @ts-ignore
      methodReflect.getTarget(),
    );
  }
  if (paramTypes) {
    paramTypes.map((type, index) => {
      methodReflect.parameters[index] = new ParameterReflect(
        methodReflect,
        type,
        propertyKey,
        index,
      );
    })
  }
}

/**
 * 解析方法装饰器的 返回类型
 * @param methodReflect
 */
export function parseMethodReflectReturnType(methodReflect: MethodReflect): void {
  const target = methodReflect.isStatic ? methodReflect.getTarget() : methodReflect.getOwnTarget();
  const returnType = Reflect.getMetadata(SystemReflectKeys.ReturnType, target, methodReflect.propertyKey);
  if (returnType) {
    methodReflect.returnType = returnType;
  }
}


/**
 * 解析参数的装饰器列表
 * @param parameterReflect
 */
export function parseParameterMetadata(parameterReflect: ParameterReflect) {
  const parameterSet = AbstractParameterDecorator.getMetadata(
    <object>parameterReflect.getOwnTarget(),
    parameterReflect.propertyKey,
    parameterReflect.parameterIndex,
  );
  if (parameterSet instanceof ParameterSet) {
    parameterReflect.metadata = Array.from(parameterSet);
  }
}

/**
 * 解析属性的元数据反射
 * @param propertyReflect
 */
export function parsePropertyReflectMetadata(propertyReflect: PropertyReflect): void {
  const target = propertyReflect.isStatic ? propertyReflect.getTarget() : propertyReflect.getOwnTarget();
  const propertySet = AbstractPropertyDecorator.getMetadata(target, propertyReflect.propertyKey);
  if (propertySet instanceof PropertySet) {
    propertyReflect.metadata = Array.from(propertySet);
  }
}


/**
 * 解析属性的元数据反射 属性值类型
 * @param propertyReflect
 */
export function parsePropertyReflectType(propertyReflect: PropertyReflect): void {
  const target = propertyReflect.isStatic ? propertyReflect.getTarget() : propertyReflect.getOwnTarget();
  if (!target) return;
  const type = Reflect.getMetadata(SystemReflectKeys.Type, target, propertyReflect.propertyKey);
  if (type) {
    propertyReflect.type = type;
  }
}