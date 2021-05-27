import { Config } from '../../config/Config';
import { Constants } from '../../config/Constants';
import * as pjson from '../../../package.json';
import { timestamp } from '../../Utils';

// Import modules.
import {
    ClusterStats, CommandOptions
} from 'discord-rose';

export default {
    command: `botinfo`,
    interaction: {
        name: `botinfo`,
        description: `Gets information about the bot.`
    },
    exec: async (ctx) => {
        const stats: ClusterStats[] | undefined = await ctx.worker.comms.getStats().catch((error) => void ctx.error(error));
        ctx.embed
            .color(Constants.BOT_INFO_EMBED_COLOR)
            .thumbnail(`${Constants.DISCORD_CDN}/avatars/${ctx.worker.user.id}/${ctx.worker.user.avatar}.png`)
            .title(`Bot Information`)
            .field(`Tag`, `${ctx.worker.user.username}#${ctx.worker.user.discriminator}`, true)
            .field(`Number of Commands`, ctx.worker.commands.commands?.size.toString() ?? `0`, true)
            .field(`Version`, pjson.version, true)
            .field(`Developer${Config.devs.IDs.length > 1 ? `s` : ``}`, Config.devs.tags.join(`, `), true)
            .field(`Ping`, `\`${ctx.worker.shards.find((shard) => shard.worker.guilds.has(ctx.interaction.guild_id))?.ping} ms\``, true)
            .field(`Uptime`, (stats ? timestamp(stats[ctx.worker.comms.id].cluster.uptime * 1e3) : `N/A`), true)
            .field(`Support Server`, Constants.SUPPORT_SERVER, true)
            .field(`Website`, Constants.WEBSITE, true)
            .send()
            .catch(async (error) => await ctx.error(error));
    }
} as CommandOptions;
