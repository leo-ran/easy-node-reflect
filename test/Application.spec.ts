import {describe, it} from "mocha";
import {assert} from "chai";
import {ClassReflect, reflectClass} from "../src";
import {Application} from "./Application";

describe("Application.spec.ts", () => {
  const classReflect = reflectClass(Application as any);

  it('classReflect should is ClassReflect Type ', function () {
    assert.instanceOf(classReflect, ClassReflect);
  });

});