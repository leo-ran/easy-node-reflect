import {it, describe} from "mocha";
import {assert} from "chai";
import {
  AbstractClassDecorator,
  AbstractMethodDecorator,
  AbstractParameterDecorator,
  AbstractPropertyDecorator,
  reflectClass
} from "../src";
import {ClassReflect} from "../src";
import {iDebuglog} from "../src/utils";
import {InstanceReflect} from "../src/lib/InstanceReflect";
import {SystemReflectKeys} from "../src/lib/SystemReflectKeys";
import {MethodReflect} from "../src/lib/MethodReflect";

const Controller = AbstractClassDecorator.create(class extends AbstractClassDecorator {
  constructor(
    public path: string
  ) {super();}
});

const Get = AbstractMethodDecorator.create(class extends AbstractMethodDecorator {
    constructor(
      public path: string,
    ) {
      super();
    }
});

const NotNull = AbstractPropertyDecorator.create(class extends AbstractPropertyDecorator {

});

const Required = AbstractParameterDecorator.create(class extends AbstractParameterDecorator {

});

const Required2 = AbstractParameterDecorator.create(class extends AbstractParameterDecorator {

});

@Controller("/")
class ITest {

  constructor(a: string) {}

  @Get("/aa")
  @Get("/test")
  public test(@Required() @Required2() index: number, @Required() aa: string): string {
    return "";
  }


  // @Get("/")
  // public tt() {
  //
  // }
  //
  // @NotNull()
  // public value: string;
  //
  // public active(@Required() index: number, @Required() name: number) {}

  @Get("/")
  static test() {

  }

  @NotNull()
  static v: string;
}

describe("AbstractClassDecorator", () => {

  const classReflect = reflectClass(ITest);

  it('classReflect should instanceOf ClassReflect', function () {
    assert.instanceOf(classReflect, ClassReflect);
  });

  it('classReflect.metadata should instanceOf Array', function () {
    assert.instanceOf(classReflect.metadata, Array);
  });

  it('classReflect.metadata members should instanceOf InstanceReflect', function () {
    classReflect.metadata.map((metadata) => assert.instanceOf(metadata, InstanceReflect));
  });


  class B {
    constructor() {}
  }

  class A extends B{}



  // iDebuglog(classReflect.staticMembers, module, "staticMembers");
  // iDebuglog(classReflect.instanceMembers, module, "instanceMembers");
  iDebuglog(classReflect.superClass, module);
});