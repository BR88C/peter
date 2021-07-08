"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../config/Constants");
exports.default = {
    command: `clear`,
    interaction: {
        name: `clear`,
        description: `Clears the queue.`
    },
    exec: (ctx) => {
        const player = ctx.worker.lavalink.players.get(ctx.interaction.guild_id);
        if (!player)
            return void ctx.error(`Unable to clear the queue; no music is playing.`);
        player.queue.clear();
        ctx.embed
            .color(Constants_1.Constants.QUEUE_CLEARED_EMBED_COLOR)
            .title(`:broom:  Cleared the queue.`)
            .send()
            .catch((error) => void ctx.error(error));
    }
};
