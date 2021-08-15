"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("../../config/Config");
const Constants_1 = require("../../config/Constants");
const discord_utils_1 = require("@br88c/discord-utils");
exports.default = {
    command: `botinfo`,
    allowButton: true,
    interaction: {
        name: `botinfo`,
        description: `Gets information about the bot.`
    },
    exec: (ctx) => {
        ctx.worker.comms.getStats()
            .then((stats) => {
            ctx.embed
                .color(Constants_1.Constants.BOT_INFO_EMBED_COLOR)
                .thumbnail(`${discord_utils_1.DiscordConstants.DISCORD_CDN}/avatars/${ctx.worker.user.id}/${ctx.worker.user.avatar}.png`)
                .title(`Bot Information`)
                .field(`Tag`, `\`${ctx.worker.user.username}#${ctx.worker.user.discriminator}\``, true)
                .field(`Number of Commands`, `\`${ctx.worker.commands.commands?.size ?? 0}\``, true)
                .field(`Version`, `\`${process.env.npm_package_version ?? `Unavailable`}\``, true)
                .field(`Developer${Config_1.Config.devs.IDs.length > 1 ? `s` : ``}`, `\`${Config_1.Config.devs.tags.join(`, `)}\``, true)
                .field(`Ping`, `\`${Math.round(ctx.worker.guildShard(ctx.interaction.guild_id).ping)} ms\``, true)
                .field(`Uptime`, `\`${discord_utils_1.timestamp(stats[ctx.worker.comms.id].cluster.uptime * 1e3)}\``, true)
                .field(`Support Server`, Constants_1.Constants.SUPPORT_SERVER, true)
                .field(`Website`, Constants_1.Constants.WEBSITE, true)
                .send()
                .catch((error) => {
                discord_utils_1.logError(error);
                void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
            });
        })
            .catch((error) => {
            discord_utils_1.logError(error);
            void ctx.error(`Unable to get the bot's stats. Please try again.`);
        });
    }
};
