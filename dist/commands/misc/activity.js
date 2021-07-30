"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../config/Constants");
exports.default = {
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
                        value: `${Constants_1.Constants.BETRAYAL_ACTIVITY_ID}`
                    },
                    {
                        name: `Chess`,
                        value: `${Constants_1.Constants.CHESS_ACTIVITY_ID}`
                    },
                    {
                        name: `Fishing`,
                        value: `${Constants_1.Constants.FISHING_ACTIVITY_ID}`
                    },
                    {
                        name: `Poker`,
                        value: `${Constants_1.Constants.POKER_ACTIVITY_ID}`
                    },
                    {
                        name: `Youtube Together`,
                        value: `${Constants_1.Constants.YOUTUBE_ACTIVITY_ID}`
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
        const channel = await ctx.worker.api.channels.get(ctx.options.channel);
        if (channel.type !== 2)
            return void ctx.error(`You must specify a voice channel.`);
        const invite = await ctx.worker.api.channels.createInvite(channel.id, {
            max_age: 86400,
            max_uses: 0,
            target_application_id: ctx.options.type,
            target_type: 2,
            temporary: false
        });
        ctx.embed
            .color(Constants_1.Constants.ACTIVITY_EMBED_COLOR)
            .title(`Click to start the activity`, `https://discord.gg/${invite.code}`)
            .send()
            .catch(() => void ctx.error(`Unable to send the response message.`));
    }
};
