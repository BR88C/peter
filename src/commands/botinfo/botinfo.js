const config = require(`../../config/config.js`);
const constants = require(`../../config/constants.js`);
const pjson = require(`../../../package.json`);
const timestamp = require(`../../utils/timestamp.js`);

module.exports = {
    command: `botinfo`,
    interaction: {},
    exec: async (ctx) => {
        const stats = await ctx.worker.comms.getStats();
        ctx.embed
            .color(constants.BOT_INFO_EMBED_COLOR)
            .thumbnail(`https://cdn.discordapp.com/avatars/${ctx.worker.user.id}/${ctx.worker.user.avatar}.png`)
            .title(`Bot Information`)
            .field(`**Tag**`, `${ctx.worker.user.username}#${ctx.worker.user.discriminator}`, true)
            .field(`**Number of Commands**`, ctx.worker.commands.commands.size, true)
            .field(`**Version**`, pjson.version, true)
            .field(`**Developer${config.devs.IDs.length > 1 ? `s` : ``}**`, config.devs.tags.join(`, `), true)
            .field(`**Ping**`, `\`${ctx.worker.shards.find((shard) => shard.worker.guilds.has(ctx.message.guild_id)).ping} ms\``, true)
            .field(`**Uptime**`, timestamp(stats[ctx.worker.comms.id].cluster.uptime * 1e3), true)
            .field(`**Support Server**`, constants.SUPPORT_SERVER, true)
            .field(`**Website**`, constants.WEBSITE, true)
            .send();
    }
};
