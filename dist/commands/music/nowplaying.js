"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StringUtils_1 = require("../../utils/StringUtils");
const Constants_1 = require("../../config/Constants");
const lavalink_1 = require("@discord-rose/lavalink");
const Time_1 = require("../../utils/Time");
exports.default = {
    command: `nowplaying`,
    interaction: {
        name: `nowplaying`,
        description: `Get the current music playing.`
    },
    exec: (ctx) => {
        const player = ctx.worker.lavalink.players.get(ctx.interaction.guild_id);
        if (!player || player.state < lavalink_1.PlayerState.CONNECTED)
            return void ctx.error(`Unable to get the current music playing; the bot is not connected to a voice channel.`);
        if (!player.queue.length)
            return void ctx.error(`Unable to get the current music playing; there is no music in the queue.`);
        if (player.queuePosition === null || player.state < lavalink_1.PlayerState.PAUSED)
            return void ctx.error(`Unable to get the current music playing; there is no music playing.`);
        let description;
        if (player.queue[player.queuePosition].isStream)
            description = `🔴  **LIVE**`;
        else
            description = `\`\`\`\n${player.state === lavalink_1.PlayerState.PAUSED ? `⏸` : `▶`} ${Time_1.timestamp(player.position ?? 0)} ${Time_1.progressBar((player.position ?? 0) / (player.queue[player.queuePosition].length ?? (player.position ?? 0)), 25)} ${Time_1.timestamp(player.queue[player.queuePosition].length ?? (player.position ?? 0))}\n\`\`\``;
        ctx.embed
            .color(Constants_1.Constants.NOW_PLAYING_EMBED_COLOR)
            .author(`Currently playing:`)
            .title(StringUtils_1.cleanseMarkdown(player.queue[player.queuePosition].title), player.queue[player.queuePosition].uri)
            .thumbnail(player.queue[player.queuePosition].thumbnail(`mqdefault`) ?? ``)
            .description(description)
            .footer(`Requested by ${player.queue[player.queuePosition].requester}`)
            .send()
            .catch(() => void ctx.error(`Unable to send the response message.`));
    }
};
