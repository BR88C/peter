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
            return void ctx.error(`Unable to disconnect the bot; no music is playing.`);
        player.destroy();
        ctx.embed
            .color(Constants_1.Constants.LEAVE_EMBED_COLOR)
            .title(`:wave:  Left the VC`)
            .send()
            .catch((error) => void ctx.error(error));
    }
};
