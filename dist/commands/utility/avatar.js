"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../config/Constants");
const discord_utils_1 = require("@br88c/discord-utils");
exports.default = {
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
        const user = await ctx.worker.api.users.get(ctx.options.user ?? ctx.author.id).catch((error) => discord_utils_1.logError(error));
        if (!user)
            return void ctx.error(`Unable to get the specified user's avatar. Please try again.`);
        const avatarURL = `${discord_utils_1.DiscordConstants.DISCORD_CDN}/avatars/${user.id}/${user.avatar}.${user.avatar?.startsWith(`a_`) ? `gif` : `png`}`;
        ctx.embed
            .color(Constants_1.Constants.AVATAR_EMBED_COLOR)
            .title(`\`${user.username}#${user.discriminator}\`'s Avatar`)
            .description(`[64](${avatarURL}?size=64) | [128](${avatarURL}?size=128) | [256](${avatarURL}?size=256) | [512](${avatarURL}?size=512) | [1024](${avatarURL}?size=1024) | [2048](${avatarURL}?size=2048) | [4096](${avatarURL}?size=4096)`)
            .image(`${avatarURL}?size=1024`)
            .send()
            .catch((error) => {
            discord_utils_1.logError(error);
            void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
        });
    }
};
