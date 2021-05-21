const config = require(`../../config/config.js`);
const constants = require(`../../config/constants.js`);
const pjson = require(`../../../package.json`);

module.exports = {
    command: `botinfo`,
    aliases: [`about`],
    exec: (ctx) => {
        console.log()
        ctx.embed
            .color(constants.BOT_INFO_COLOR)
            .thumbnail(`https://cdn.discordapp.com/avatars/${ctx.worker.user.id}/${ctx.worker.user.avatar}.png`)
            .title(`Bot Information`)
            .field(`**Tag**`, `${ctx.worker.user.username}#${ctx.worker.user.discriminator}`, true)
            .field(`**Number of Commands**`, ctx.worker.commands.commands.size, true)
            .field(`**Prefix**`, `\`${ctx.prefix}\``, true)
            .field(`**Developer${config.devs.IDs.length > 1 ? `s` : ``}**`,  config.devs.tags.join(`, `), true)
            .field(`**Ping**`, `${ctx.worker.shards.find((shard) => shard.worker.guilds.has(ctx.message.guild_id)).ping}ms`, true)
            .field(`**Uptime**`, `undefine`, true)
            .field(`**Support Server**`, constants.SUPPORT_SERVER, true)
            .field(`**Website**`, constants.WEBSITE, true)
            .field(`**Version**`, pjson.version, true)
            .send();
    }
}