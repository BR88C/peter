"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../config/Constants");
exports.default = {
    command: `remove`,
    interaction: {
        name: `remove`,
        description: `Remove a track from the queue.`,
        options: [
            {
                type: 4,
                name: `index`,
                description: `The track's index in the queue.`,
                required: true
            }
        ]
    },
    exec: async (ctx) => {
        const player = ctx.worker.lavalink.players.get(ctx.interaction.guild_id);
        if (!player || !player.queue.length)
            return void ctx.error(`Unable to remove a track from the queue; there are no tracks in the queue.`);
        const foundVoiceState = ctx.worker.voiceStates.find((state) => state.guild_id === ctx.interaction.guild_id && state.users.has(ctx.author.id));
        if (foundVoiceState?.channel_id !== player.options.voiceChannelId)
            return void ctx.error(`You must be in the VC to remove tracks from the queue.`);
        if (ctx.options.index < 1 || ctx.options.index > player.queue.length)
            return void ctx.error(`Please specify a valid index.`);
        const removedTrack = player.queue.splice(ctx.options.index - 1, 1)[0];
        await ctx.embed
            .color(Constants_1.Constants.REMOVED_TRACK_EMBED_COLOR)
            .title(`:x:  Removed "${removedTrack.title}" from the queue`)
            .send()
            .catch((error) => void ctx.error(error));
        if (ctx.options.index - 1 === player.queuePosition) {
            if (player.queue[player.queuePosition])
                void player.skip(player.queuePosition);
            else
                void player.stop();
        }
    }
};
