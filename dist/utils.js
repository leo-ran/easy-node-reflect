"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function iDebuglog(value, module, title) {
    console.log(`--------------------DEBUG-----------------------`);
    if (title) {
        console.log(`========${title}`);
    }
    console.log(value);
    console.log(`at ${module.id}`);
    console.log(`--------------------DEBUG-----------------------`);
}
exports.iDebuglog = iDebuglog;
