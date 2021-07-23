"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../config/Constants");
exports.default = {
    command: `leave`,
    interaction: {
        name: `leave`,
        description: `Disconnect the bot and destroy the queue.`
    },
    exec: (ctx) => {
        const player = ctx.worker.lavalink.players.get(ctx.interaction.guild_id);
        if (!player)
            return void ctx.error(`Unable to disconnect the bot; the bot is not connected to a VC.`);
        const foundVoiceState = ctx.worker.voiceStates.find((state) => state.guild_id === ctx.interaction.guild_id && state.users.has(ctx.author.id));
        if (foundVoiceState?.channel_id !== player.options.voiceChannelId)
            return void ctx.error(`You must be in the VC to make the bot leave.`);
        player.destroy();
        ctx.embed
            .color(Constants_1.Constants.LEAVE_EMBED_COLOR)
            .title(`:wave:  Left the VC`)
            .send()
            .catch((error) => void ctx.error(error));
    }
};
