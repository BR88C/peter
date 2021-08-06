import { Config } from '../../config/Config';
import { Constants } from '../../config/Constants';

// Import modules.
import { ClusterStats, CommandOptions } from 'discord-rose';
import { timestamp } from '@br88c/discord-utils';

export default {
    command: `botinfo`,
    interaction: {
        name: `botinfo`,
        description: `Gets information about the bot.`
    },
    exec: async (ctx) => {
        const stats: ClusterStats[] | undefined = await ctx.worker.comms.getStats().catch(() => void ctx.error(`Unable to get the bot's stats.`));
        ctx.embed
            .color(Constants.BOT_INFO_EMBED_COLOR)
            .thumbnail(`${Constants.DISCORD_CDN}/avatars/${ctx.worker.user.id}/${ctx.worker.user.avatar}.png`)
            .title(`Bot Information`)
            .field(`Tag`, `\`${ctx.worker.user.username}#${ctx.worker.user.discriminator}\``, true)
            .field(`Number of Commands`, `\`${ctx.worker.commands.commands?.size ?? 0}\``, true)
            .field(`Version`, `\`${process.env.npm_package_version ?? `Unavailable`}\``, true)
            .field(`Developer${Config.devs.IDs.length > 1 ? `s` : ``}`, `\`${Config.devs.tags.join(`, `)}\``, true)
            .field(`Ping`, `\`${Math.round(ctx.worker.guildShard(ctx.interaction.guild_id!).ping)} ms\``, true)
            .field(`Uptime`, `\`${stats ? timestamp(stats[ctx.worker.comms.id].cluster.uptime * 1e3) : `N/A`}\``, true)
            .field(`Support Server`, Constants.SUPPORT_SERVER, true)
            .field(`Website`, Constants.WEBSITE, true)
            .send()
            .catch(() => void ctx.error(`Unable to send the response message.`));
    }
} as CommandOptions;
