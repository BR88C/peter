"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../config/Constants");
const lavalink_1 = require("@discord-rose/lavalink");
exports.default = {
    command: `pause`,
    interaction: {
        name: `pause`,
        description: `Pause the music.`
    },
    exec: async (ctx) => {
        const player = ctx.worker.lavalink.players.get(ctx.interaction.guild_id);
        if (!player || player.state < lavalink_1.PlayerState.CONNECTED)
            return void ctx.error(`Unable to pause the music; the bot is not connected to a voice channel.`);
        if (!player.queue.length)
            return void ctx.error(`Unable to pause the music; there is no music in the queue.`);
        if (player.queuePosition === null || player.state < lavalink_1.PlayerState.PAUSED)
            return void ctx.error(`Unable to pause the music; there is no music playing.`);
        const foundVoiceState = ctx.worker.voiceStates.find((state) => state.guild_id === ctx.interaction.guild_id && state.users.has(ctx.author.id));
        if (foundVoiceState?.channel_id !== player.options.voiceChannelId)
            return void ctx.error(`You must be in the voice channel to pause the music.`);
        if (player.state === lavalink_1.PlayerState.PAUSED)
            return void ctx.error(`The music is already paused.`);
        await player.pause();
        ctx.embed
            .color(Constants_1.Constants.PAUSE_RESUME_EMBED_COLOR)
            .title(`:pause_button:  Paused the music`)
            .send()
            .catch(() => void ctx.error(`Unable to send the response message.`));
    }
};
