"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const src_1 = require("../src");
const src_2 = require("../src");
const utils_1 = require("../src/utils");
const InstanceReflect_1 = require("../src/lib/InstanceReflect");
const Controller = src_1.AbstractClassDecorator.create(class extends src_1.AbstractClassDecorator {
    constructor(path) {
        super();
        this.path = path;
    }
});
const Get = src_1.AbstractMethodDecorator.create(class extends src_1.AbstractMethodDecorator {
    constructor(path) {
        super();
        this.path = path;
    }
});
const NotNull = src_1.AbstractPropertyDecorator.create(class extends src_1.AbstractPropertyDecorator {
});
const Required = src_1.AbstractParameterDecorator.create(class extends src_1.AbstractParameterDecorator {
});
const Required2 = src_1.AbstractParameterDecorator.create(class extends src_1.AbstractParameterDecorator {
});
let ITest = class ITest {
    constructor(a) { }
    test(index, aa) {
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
    static test() {
    }
};
__decorate([
    Get("/aa"),
    Get("/test"),
    __param(0, Required()), __param(0, Required2()), __param(1, Required()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", String)
], ITest.prototype, "test", null);
__decorate([
    Get("/"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ITest, "test", null);
__decorate([
    NotNull(),
    __metadata("design:type", String)
], ITest, "v", void 0);
ITest = __decorate([
    Controller("/"),
    __metadata("design:paramtypes", [String])
], ITest);
mocha_1.describe("AbstractClassDecorator", () => {
    const classReflect = src_1.reflectClass(ITest);
    mocha_1.it('classReflect should instanceOf ClassReflect', function () {
        chai_1.assert.instanceOf(classReflect, src_2.ClassReflect);
    });
    mocha_1.it('classReflect.metadata should instanceOf Array', function () {
        chai_1.assert.instanceOf(classReflect.metadata, Array);
    });
    mocha_1.it('classReflect.metadata members should instanceOf InstanceReflect', function () {
        classReflect.metadata.map((metadata) => chai_1.assert.instanceOf(metadata, InstanceReflect_1.InstanceReflect));
    });
    class B {
        constructor() { }
    }
    class A extends B {
    }
    // iDebuglog(classReflect.staticMembers, module, "staticMembers");
    // iDebuglog(classReflect.instanceMembers, module, "instanceMembers");
    utils_1.iDebuglog(classReflect.superClass, module);
});
