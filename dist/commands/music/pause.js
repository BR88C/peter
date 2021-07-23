"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../config/Constants");
const lavalink_1 = require("@discord-rose/lavalink");
exports.default = {
    command: `pause`,
    interaction: {
        name: `pause`,
        description: `Pause the current track.`
    },
    exec: async (ctx) => {
        const player = ctx.worker.lavalink.players.get(ctx.interaction.guild_id);
        if (!player || !player.queue.length)
            return void ctx.error(`Unable to pause; there are no tracks in the queue.`);
        if (player.state === lavalink_1.PlayerState.CONNECTED)
            return void ctx.error(`Unable to pause; there are no tracks playing.`);
        if (player.state === lavalink_1.PlayerState.PAUSED)
            return void ctx.error(`The current track is already paused.`);
        const foundVoiceState = ctx.worker.voiceStates.find((state) => state.guild_id === ctx.interaction.guild_id && state.users.has(ctx.author.id));
        if (foundVoiceState?.channel_id !== player.options.voiceChannelId)
            return void ctx.error(`You must be in the VC to pause the current track.`);
        await player.pause();
        ctx.embed
            .color(Constants_1.Constants.PAUSE_EMBED_COLOR)
            .title(`:pause_button:  Paused the current track`)
            .send()
            .catch((error) => void ctx.error(error));
    }
};
