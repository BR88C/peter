module.exports = {
    command: `echo`,
    aliases: [`say`],
    exec: (ctx) => {
        ctx.delete().catch(() => {});
        ctx.send(ctx.args.join(` `));
    }
};
