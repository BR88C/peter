const constants = require(`../../config/constants.js`);

module.exports = {
    command: `status`,
    exec: async (ctx) => {
        if (!constants.STATUS_TYPES.includes(ctx.args[0])) ctx.error(`Invalid status type`);
        else {
            await ctx.worker.setStatus(ctx.args[0], ctx.args.slice(1).join(` `), `online`);
            ctx.embed
                .color(constants.STATUS_EMBED_COLOR)
                .title(`Updated status successfully`)
                .send();
        }
    }
};
