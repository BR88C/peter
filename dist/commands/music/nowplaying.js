"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StringUtils_1 = require("../../utils/StringUtils");
const Constants_1 = require("../../config/Constants");
const lavalink_1 = require("@discord-rose/lavalink");
const Time_1 = require("../../utils/Time");
exports.default = {
    command: `nowplaying`,
    mustHaveConnectedPlayer: true,
    mustHaveTracksInQueue: true,
    mustBePausedOrPlaying: true,
    interaction: {
        name: `nowplaying`,
        description: `Get the current music playing.`
    },
    exec: (ctx) => {
        let description;
        if (ctx.player.currentTrack.isStream)
            description = `🔴  **LIVE**`;
        else
            description = `\`\`\`\n${ctx.player.state === lavalink_1.PlayerState.PAUSED ? `⏸` : `▶`} ${Time_1.timestamp(ctx.player.position ?? 0)} ${Time_1.progressBar((ctx.player.position ?? 0) / (ctx.player.currentTrack.length ?? (ctx.player.position ?? 0)), 25)} ${Time_1.timestamp(ctx.player.currentTrack.length ?? (ctx.player.position ?? 0))}\n\`\`\``;
        ctx.embed
            .color(Constants_1.Constants.NOW_PLAYING_EMBED_COLOR)
            .author(`Currently playing:`)
            .title(StringUtils_1.cleanseMarkdown(ctx.player.currentTrack.title), ctx.player.currentTrack.uri)
            .thumbnail(ctx.player.currentTrack.thumbnail(`mqdefault`) ?? ``)
            .description(description)
            .footer(`Requested by ${ctx.player.currentTrack.requester}`)
            .send()
            .catch(() => void ctx.error(`Unable to send the response message.`));
    }
};
