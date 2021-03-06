import { Constants } from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';

export default {
    command: `avatar`,
    interaction: {
        name: `avatar`,
        description: `Get your avatar, or someone else's.`,
        options: [
            {
                type: 6,
                name: `user`,
                description: `The user to get an avatar from`,
                required: false
            }
        ]
    },
    exec: async (ctx) => {
        const user = await ctx.worker.api.users.get(ctx.options.user ?? ctx.author.id);
        const avatarURL: string = `${Constants.DISCORD_CDN}/avatars/${user.id}/${user.avatar}.${user.avatar?.startsWith(`a_`) ? `gif` : `png`}`;
        ctx.embed
            .color(Constants.AVATAR_EMBED_COLOR)
            .title(`\`${user.username}#${user.discriminator}\`'s Avatar`)
            .description(`[64](${avatarURL}?size=64) | [128](${avatarURL}?size=128) | [256](${avatarURL}?size=256) | [512](${avatarURL}?size=512) | [1024](${avatarURL}?size=1024) | [2048](${avatarURL}?size=2048) | [4096](${avatarURL}?size=4096)`)
            .image(`${avatarURL}?size=1024`)
            .send()
            .catch((error) => void ctx.error(error));
    }
} as CommandOptions;
