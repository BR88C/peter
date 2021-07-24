import { Constants } from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';

export default {
    command: `activity`,
    interaction: {
        name: `activity`,
        description: `Start a VC activity.`,
        options: [
            {
                type: 3,
                name: `type`,
                description: `The activity type to use`,
                choices: [
                    {
                        name: `Betrayal`,
                        value: `${Constants.BETRAYAL_ACTIVITY_ID}`
                    },
                    {
                        name: `Chess`,
                        value: `${Constants.CHESS_ACTIVITY_ID}`
                    },
                    {
                        name: `Fishing`,
                        value: `${Constants.FISHING_ACTIVITY_ID}`
                    },
                    {
                        name: `Poker`,
                        value: `${Constants.POKER_ACTIVITY_ID}`
                    },
                    {
                        name: `Youtube Together`,
                        value: `${Constants.YOUTUBE_ACTIVITY_ID}`
                    }
                ],
                required: true
            },
            {
                type: 7,
                name: `channel`,
                description: `The VC to start the session in`,
                required: true
            }
        ]
    },
    exec: async (ctx) => {
        const channel = await ctx.worker.api.channels.get(ctx.options.channel);
        if (channel.type !== 2) return void ctx.error(`You must specify a VC.`);
        const invite = await ctx.worker.api.channels.createInvite(channel.id, {
            max_age: 86400,
            max_uses: 0,
            target_application_id: ctx.options.type,
            target_type: 2,
            temporary: false
        });
        ctx.embed
            .color(Constants.ACTIVITY_EMBED_COLOR)
            .title(`Click to start the activity`, `https://discord.gg/${invite.code}`)
            .send()
            .catch((error) => void ctx.error(error));
    }
} as CommandOptions;
