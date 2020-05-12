import {describe, it} from "mocha";
import {assert} from "chai";
import {ClassReflect, InstanceReflect, reflectClass} from "../src";
import {Test} from "./Test";
import {iDebuglog} from "../src/utils";

describe("Test.spec.ts", () => {
  const classReflect = reflectClass(Test);

  it('classReflect should is ClassReflect Type ', function () {
    assert.instanceOf(classReflect, ClassReflect);
  });

  it('classReflect.superClass should is ClassReflect Type ', function () {
    assert.instanceOf(classReflect.superClass, ClassReflect);
  });

  it('classReflect.staticMembers should Map Type', function () {
    assert.instanceOf(classReflect.staticMembers, Map);
  });

  it('classReflect.instanceMembers should Map Type', function () {
    assert.instanceOf(classReflect.instanceMembers, Map);
  });

  it('classReflect.instanceMembers should Array Type', function () {
    assert.instanceOf(classReflect.metadata, Array);
  });

  const test = classReflect.newInstance((classReflect,parameters) => {
    return parameters.map(item => {
      return item.type;
    });
  });

  it('test instance should InstanceReflect<Test> Type', function () {
    assert.instanceOf(test, InstanceReflect);
  });


  test.setField("a", "1");

  it('test.getField("a") should is "1".', function () {
    assert.strictEqual(test.getField("a"), "1");
  });

});