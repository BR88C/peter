"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    command: `echo`,
    exec: (ctx) => {
        ctx.delete().catch(() => { });
        ctx.send(ctx.args.join(` `)).catch((error) => void ctx.error(error));
    }
};