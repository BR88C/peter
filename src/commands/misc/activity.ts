import Constants from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { DiscordConstants, Utils } from '@br88c/discord-utils';

export default {
    command: `activity`,
    interaction: {
        name: `activity`,
        description: `Start a voice channel activity.`,
        options: [
            {
                type: 3,
                name: `type`,
                description: `The activity type to use`,
                choices: [
                    {
                        name: `Betrayal`,
                        value: `${DiscordConstants.ACTIVITY_IDS.BETRAYAL}`
                    },
                    {
                        name: `Chess`,
                        value: `${DiscordConstants.ACTIVITY_IDS.CHESS}`
                    },
                    {
                        name: `Fishing`,
                        value: `${DiscordConstants.ACTIVITY_IDS.FISHING}`
                    },
                    {
                        name: `Poker`,
                        value: `${DiscordConstants.ACTIVITY_IDS.POKER}`
                    },
                    {
                        name: `Youtube Together`,
                        value: `${DiscordConstants.ACTIVITY_IDS.YOUTUBE_TOGETHER}`
                    }
                ],
                required: true
            },
            {
                type: 7,
                name: `channel`,
                description: `The voice channel to start the session in`,
                required: true
            }
        ]
    },
    exec: async (ctx) => {
        const channel = await ctx.worker.api.channels.get(ctx.options.channel).catch((error) => Utils.logError(error));
        if (!channel) return void ctx.error(`Unable to get information about the specified channel. Please try again.`);
        if (channel.type !== 2) return void ctx.error(`You must specify a voice channel.`);
        const invite = await ctx.worker.api.channels.createInvite(channel.id, {
            max_age: 86400,
            max_uses: 0,
            target_application_id: ctx.options.type,
            target_type: 2,
            temporary: false
        }).catch((error) => Utils.logError(error));
        if (!invite) return void ctx.error(`Unable to generate an invite link to start the activity. Make sure to check the bot's permissions.`);
        ctx.embed
            .color(Constants.ACTIVITY_EMBED_COLOR)
            .title(`Click to start the activity`, `https://discord.gg/${invite.code}`)
            .send()
            .catch((error) => {
                Utils.logError(error);
                void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
            });
    }
} as CommandOptions;
