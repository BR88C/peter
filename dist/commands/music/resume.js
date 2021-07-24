"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../config/Constants");
const lavalink_1 = require("@discord-rose/lavalink");
exports.default = {
    command: `resume`,
    interaction: {
        name: `resume`,
        description: `Resume the current track.`
    },
    exec: async (ctx) => {
        const player = ctx.worker.lavalink.players.get(ctx.interaction.guild_id);
        if (!player || player.state < lavalink_1.PlayerState.CONNECTED)
            return void ctx.error(`Unable to resume; the bot is not connected to the VC.`);
        if (!player.queue.length)
            return void ctx.error(`Unable to resume; there are no tracks in the queue.`);
        if (player.queuePosition === null || player.state < lavalink_1.PlayerState.PAUSED)
            return void ctx.error(`Unable to resume; there are no tracks playing.`);
        const foundVoiceState = ctx.worker.voiceStates.find((state) => state.guild_id === ctx.interaction.guild_id && state.users.has(ctx.author.id));
        if (foundVoiceState?.channel_id !== player.options.voiceChannelId)
            return void ctx.error(`You must be in the VC to resume the current track.`);
        if (player.state === lavalink_1.PlayerState.PLAYING)
            return void ctx.error(`The current track is already resumed.`);
        await player.resume();
        ctx.embed
            .color(Constants_1.Constants.PAUSE_EMBED_COLOR)
            .title(`:pause_button:  Paused the current track`)
            .send()
            .catch((error) => void ctx.error(error));
    }
};
