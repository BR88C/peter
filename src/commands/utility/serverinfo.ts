import { Constants } from '../../config/Constants';

// Import modules.
import {
    CommandOptions, GuildsResource, UsersResource
} from 'discord-rose';

export default {
    command: `serverinfo`,
    interaction: {
        name: `serverinfo`,
        description: `Get information about the server.`
    },
    exec: async (ctx) => {
        const guild = await new GuildsResource(ctx.worker.api).get(ctx.interaction.guild_id, true);
        const owner = await new UsersResource(ctx.worker.api).get(guild.owner_id);
        const iconURL = `${Constants.DISCORD_CDN}/icons/${guild.id}/${guild.icon}.${guild.icon?.startsWith(`a_`) ? `gif` : `png`}`;
        ctx.embed
            .color(Constants.SERVER_INFO_EMBED_COLOR)
            .title(guild.name)
            .description(`ID: \`${guild.id}\``)
            .field(`Owner`, `${owner.username}#${owner.discriminator}`, true)
            .field(`Members`, `Total: ${guild.approximate_member_count}\nOnline: ${guild.approximate_presence_count}`, true)
            .field(`Icon`, `[64](${iconURL}?size=64) | [128](${iconURL}?size=128) | [256](${iconURL}?size=256) | [512](${iconURL}?size=512)\n[1024](${iconURL}?size=1024) | [2048](${iconURL}?size=2048) | [4096](${iconURL}?size=4096)`, true)
            .field(`Emojis`, `Number of emojis: ${guild.emojis.length}`, true)
            .field(`Roles`, `Number of roles: ${guild.roles.length}`, true)
            .field(`Boosts`, `Number of boosts: ${guild.premium_subscription_count}\nServer Level: ${guild.premium_tier}`, true)
            .thumbnail(iconURL)
            .send();
    }
} as CommandOptions;
