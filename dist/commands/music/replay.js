"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../config/Constants");
const lavalink_1 = require("@discord-rose/lavalink");
exports.default = {
    command: `replay`,
    interaction: {
        name: `replay`,
        description: `Seek to the beginning of the song.`
    },
    exec: async (ctx) => {
        const player = ctx.worker.lavalink.players.get(ctx.interaction.guild_id);
        if (!player || player.state < lavalink_1.PlayerState.CONNECTED)
            return void ctx.error(`Unable to seek to the beginning of the song; the bot is not connected to a voice channel.`);
        if (!player.queue.length)
            return void ctx.error(`Unable to seek to the beginning of the song; there is no music in the queue.`);
        if (player.queuePosition === null || player.state < lavalink_1.PlayerState.PAUSED)
            return void ctx.error(`Unable to seek to the beginning of the song; there is no music playing.`);
        const foundVoiceState = ctx.worker.voiceStates.find((state) => state.guild_id === ctx.interaction.guild_id && state.users.has(ctx.author.id));
        if (foundVoiceState?.channel_id !== player.options.voiceChannelId)
            return void ctx.error(`You must be in the voice channel to seek to the beginning of the song.`);
        if (!player.queue[player.queuePosition].isSeekable || player.queue[player.queuePosition].isStream)
            return void ctx.error(`The current song does not support seeking to the beginning of the song.`);
        await player.seek(0);
        ctx.embed
            .color(Constants_1.Constants.SEEK_EMBED_COLOR)
            .title(`:rewind:  Seeked to the beginning of the song`)
            .send()
            .catch(() => void ctx.error(`Unable to send the response message.`));
    }
};
