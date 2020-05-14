import {AbstractClassDecorator, AbstractMethodDecorator, AbstractParameterDecorator} from "../../src";
import {EnApplicationDecorator} from "./EnApplicationDecorator";
import {EnControllerDecorator} from "./EnControllerDecorator";
import {EnModuleDecorator} from "./EnModuleDecorator";
import {EnRequestDecorator} from "./EnRequestDecorator";
import {EnGetDecorator} from "./EnGetDecorator";
import {EnPostDecorator} from "./EnPostDecorator";
import {EnServiceDecorator} from "./EnServiceDecorator";
import {NonNullableDecorator} from "./NonNullableDecorator";

export const EnApplication = AbstractClassDecorator.create(EnApplicationDecorator);
export const EnController = AbstractClassDecorator.create(EnControllerDecorator);
export const EnModule = AbstractClassDecorator.create(EnModuleDecorator);
export const EnRequest = AbstractMethodDecorator.create(EnRequestDecorator);
export const EnPost = AbstractMethodDecorator.create(EnPostDecorator);
export const EnService = AbstractClassDecorator.create(EnServiceDecorator);
export const EnGet = AbstractMethodDecorator.create(EnGetDecorator);
export const NonNullable = AbstractParameterDecorator.create(NonNullableDecorator)();
