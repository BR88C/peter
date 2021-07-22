"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../config/Constants");
exports.default = {
    command: `skip`,
    interaction: {
        name: `skip`,
        description: `Skip to the next track, or to a specified track.`,
        options: [
            {
                type: 4,
                name: `index`,
                description: `The index of the queue to skip to.`,
                required: false
            }
        ]
    },
    exec: async (ctx) => {
        const player = ctx.worker.lavalink.players.get(ctx.interaction.guild_id);
        if (!player || !player.queue.length)
            return void ctx.error(`Unable to skip; there are no tracks in the queue.`);
        const foundVoiceState = ctx.worker.voiceStates.find((state) => state.guild_id === ctx.interaction.guild_id && state.users.has(ctx.author.id));
        if (!foundVoiceState || foundVoiceState.channel_id !== player.options.voiceChannelId)
            return void ctx.error(`You must be in the VC to skip.`);
        const index = typeof ctx.options.index === `number` ? ctx.options.index - 1 : undefined;
        if (index && (index < 0 || index >= player.queue.length))
            return void ctx.error(`Invalid index`);
        await player.skip(index);
        ctx.embed
            .color(Constants_1.Constants.SKIP_EMBED_COLOR)
            .title(`:track_next:  Skipped to ${typeof index === `number` ? `track ${index + 1}` : `the next track`}`)
            .send()
            .catch((error) => void ctx.error(error));
    }
};
