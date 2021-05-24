module.exports = {
    command: `echo`,
    exec: (ctx) => {
        ctx.delete().catch(() => {});
        ctx.send(ctx.args.join(` `));
    }
};
