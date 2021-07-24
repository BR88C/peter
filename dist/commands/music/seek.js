"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../config/Constants");
const Time_1 = require("../../utils/Time");
const lavalink_1 = require("@discord-rose/lavalink");
exports.default = {
    command: `seek`,
    interaction: {
        name: `seek`,
        description: `Seek to a position in the song.`,
        options: [
            {
                type: 4,
                name: `time`,
                description: `The time in seconds to seek to.`,
                required: true
            }
        ]
    },
    exec: async (ctx) => {
        const player = ctx.worker.lavalink.players.get(ctx.interaction.guild_id);
        if (!player || player.state < lavalink_1.PlayerState.CONNECTED)
            return void ctx.error(`Unable to seek; the bot is not connected to a VC.`);
        if (!player.queue.length)
            return void ctx.error(`Unable to seek; there is no music in the queue.`);
        if (player.queuePosition === null || player.state < lavalink_1.PlayerState.PAUSED)
            return void ctx.error(`Unable to seek; there is no music playing.`);
        const foundVoiceState = ctx.worker.voiceStates.find((state) => state.guild_id === ctx.interaction.guild_id && state.users.has(ctx.author.id));
        if (foundVoiceState?.channel_id !== player.options.voiceChannelId)
            return void ctx.error(`You must be in the VC to seek.`);
        if (!player.queue[player.queuePosition].isSeekable || player.queue[player.queuePosition].isStream)
            return void ctx.error(`The current song does not support seeking.`);
        if (ctx.options.time < 0 || ctx.options.time > Constants_1.Constants.MAX_SAFE_JAVA_INTEGER)
            return void ctx.error(`Invalid value to seek to.`);
        await player.seek(ctx.options.time * 1e3);
        ctx.embed
            .color(Constants_1.Constants.SEEK_EMBED_COLOR)
            .title(`:fast_forward:  Seeked to ${Time_1.timestamp(ctx.options.time * 1e3)}`)
            .send()
            .catch((error) => void ctx.error(error));
    }
};
