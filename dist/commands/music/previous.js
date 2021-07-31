"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../config/Constants");
const lavalink_1 = require("@discord-rose/lavalink");
exports.default = {
    command: `previous`,
    interaction: {
        name: `previous`,
        description: `Skip to the previous song.`
    },
    exec: async (ctx) => {
        const player = ctx.worker.lavalink.players.get(ctx.interaction.guild_id);
        if (!player || player.state < lavalink_1.PlayerState.CONNECTED)
            return void ctx.error(`Unable to skip to the previous song; the bot is not connected to a voice channel.`);
        if (!player.queue.length)
            return void ctx.error(`Unable to skip to the previous song; there is no music in the queue.`);
        const foundVoiceState = ctx.worker.voiceStates.find((state) => state.guild_id === ctx.interaction.guild_id && state.users.has(ctx.author.id));
        if (foundVoiceState?.channel_id !== player.options.voiceChannelId)
            return void ctx.error(`You must be in the voice channel to skip to the previous song.`);
        await player.skip((player.queuePosition ?? player.queue.length) - 1);
        ctx.embed
            .color(Constants_1.Constants.SKIP_EMBED_COLOR)
            .title(`:track_previous:  Skipped to the previous song`)
            .send()
            .catch(() => void ctx.error(`Unable to send the response message.`));
    }
};
