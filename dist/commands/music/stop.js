"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../config/Constants");
const lavalink_1 = require("@discord-rose/lavalink");
exports.default = {
    command: `stop`,
    interaction: {
        name: `stop`,
        description: `Stop the music.`
    },
    exec: async (ctx) => {
        const player = ctx.worker.lavalink.players.get(ctx.interaction.guild_id);
        if (!player)
            return void ctx.error(`Unable to stop the music; the bot is not connected to the VC.`);
        if (player.state === lavalink_1.PlayerState.CONNECTED)
            return void ctx.error(`Unable to stop the music; the music is already stopped.`);
        const foundVoiceState = ctx.worker.voiceStates.find((state) => state.guild_id === ctx.interaction.guild_id && state.users.has(ctx.author.id));
        if (foundVoiceState?.channel_id !== player.options.voiceChannelId)
            return void ctx.error(`You must be in the VC to stop the music.`);
        await player.stop();
        ctx.embed
            .color(Constants_1.Constants.STOP_EMBED_COLOR)
            .title(`:octagonal_sign:  Stopped the music`)
            .send()
            .catch((error) => void ctx.error(error));
    }
};
