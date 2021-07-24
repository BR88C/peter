"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../config/Constants");
const lavalink_1 = require("@discord-rose/lavalink");
exports.default = {
    command: `247`,
    interaction: {
        name: `247`,
        description: `Toggle 24/7.`
    },
    exec: (ctx) => {
        const player = ctx.worker.lavalink.players.get(ctx.interaction.guild_id);
        if (!player || player.state < lavalink_1.PlayerState.CONNECTED)
            return void ctx.error(`Unable to set the queue to 24/7; the bot is not connected to a VC.`);
        const foundVoiceState = ctx.worker.voiceStates.find((state) => state.guild_id === ctx.interaction.guild_id && state.users.has(ctx.author.id));
        if (foundVoiceState?.channel_id !== player.options.voiceChannelId)
            return void ctx.error(`You must be in the VC to set the queue to 24/7.`);
        player.twentyfourseven = !player.twentyfourseven;
        ctx.embed
            .color(Constants_1.Constants.TWENTY_FOUR_SEVEN_EMBED_COLOR)
            .title(`:clock2:  24/7 is now \`${player.twentyfourseven ? `On` : `Off`}\``)
            .send()
            .catch((error) => void ctx.error(error));
    }
};
