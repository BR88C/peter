"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../config/Constants");
const Time_1 = require("../../utils/Time");
const StringUtils_1 = require("../../utils/StringUtils");
exports.default = {
    command: `nowplaying`,
    interaction: {
        name: `nowplaying`,
        description: `Get information on the current song playing.`
    },
    exec: (ctx) => {
        const player = ctx.worker.lavalink.players.get(ctx.interaction.guild_id);
        if (!player || !player.queue.length)
            return void ctx.error(`Unable to get the current song; there is no music in the queue.`);
        if (!player.queue.current)
            return void ctx.error(`Unable to get the current song; there is no music playing.`);
        let description;
        if (player.queue.current.isStream)
            description = `🔴  **LIVE**`;
        else
            description = `\`\`\`\n${player.paused ? `⏸` : `▶`} ${Time_1.timestamp(player.position)} ${Time_1.progressBar(player.position / (player.queue.current.duration ?? player.position), 25)} ${Time_1.timestamp(player.queue.current.duration ?? player.position)}\n\`\`\``;
        ctx.embed
            .color(Constants_1.Constants.NOW_PLAYING_EMBED_COLOR)
            .author(`Currently playing:`)
            .title(StringUtils_1.cleanseMarkdown(player.queue.current.title), player.queue.current.uri)
            .thumbnail(player.queue.current.displayThumbnail ? (player.queue.current.displayThumbnail(`mqdefault`) ?? ``) : ``)
            .description(description)
            .footer(`Requested by ${player.queue.current.requester}`)
            .send()
            .catch((error) => void ctx.error(error));
    }
};
