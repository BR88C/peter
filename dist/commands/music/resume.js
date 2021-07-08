"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../config/Constants");
exports.default = {
    command: `resume`,
    interaction: {
        name: `resume`,
        description: `Resume the music.`
    },
    exec: (ctx) => {
        const player = ctx.worker.lavalink.players.get(ctx.interaction.guild_id);
        if (!player || !player.queue?.current)
            return void ctx.error(`Unable to resume the music; there is no music in the queue.`);
        if (!player.paused)
            return void ctx.error(`The music is already resumed.`);
        player.pause(true);
        ctx.embed
            .color(Constants_1.Constants.PAUSE_EMBED_COLOR)
            .title(`:pause_button:  Paused the music`)
            .send()
            .catch((error) => void ctx.error(error));
    }
};
