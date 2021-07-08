"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../config/Constants");
exports.default = {
    command: `pause`,
    interaction: {
        name: `pause`,
        description: `Pause the music.`
    },
    exec: (ctx) => {
        const player = ctx.worker.lavalink.players.get(ctx.interaction.guild_id);
        if (!player || !player.queue?.current)
            return void ctx.error(`Unable to pause the music; no music is playing.`);
        if (player.paused)
            return void ctx.error(`The music is already paused.`);
        player.pause(true);
        ctx.embed
            .color(Constants_1.Constants.PAUSE_EMBED_COLOR)
            .title(`:pause_button:  Paused the music`)
            .send()
            .catch((error) => void ctx.error(error));
    }
};
