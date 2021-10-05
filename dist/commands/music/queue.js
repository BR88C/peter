"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = __importDefault(require("../../config/Constants"));
const lavalink_1 = require("@discord-rose/lavalink");
const discord_utils_1 = require("@br88c/discord-utils");
exports.default = {
    command: `queue`,
    mustHaveConnectedPlayer: true,
    interaction: {
        name: `queue`,
        description: `Get the current queue.`
    },
    exec: async (ctx) => {
        const voiceChannel = await ctx.worker.api.channels.get(ctx.player.options.voiceChannelId).catch((error) => discord_utils_1.Utils.logError(error));
        if (!voiceChannel)
            return void ctx.error(`Unable to get information about the queue. Please try again.`);
        const sendEmbed = async (page) => {
            const trackTitles = [];
            ctx.player.queue.forEach((track, i) => trackTitles.push(`${i === ctx.player.queuePosition ? `↳ ` : ``}**${i + 1}.** ${track.uri ? `[` : ``}${discord_utils_1.Utils.cleanseMarkdown(track.title)}${track.uri ? `](${track.uri})` : ``} ${track.length ? ` - [${discord_utils_1.Utils.timestamp(track.length)}]` : ``}`));
            const pages = [];
            for (const [i, title] of trackTitles.entries())
                pages[Math.floor(i / 10)] = `${pages[Math.floor(i / 10)] ?? ``}${title}\n`;
            const queueLength = ctx.player.queue.reduce((p, c) => p + (c.length ?? 0), 0);
            const trackTimeLeft = ctx.player.currentTrack instanceof lavalink_1.Track ? (ctx.player.currentTrack.length ?? 0) - (ctx.player.position ?? (ctx.player.currentTrack.length ?? 0)) : 0;
            await ctx.embed
                .color(Constants_1.default.QUEUE_EMBED_COLOR)
                .title(ctx.player.currentTrack ? `**Now Playing:** ${ctx.player.currentTrack.title} ${ctx.player.currentTrack.length ? `[${discord_utils_1.Utils.timestamp(trackTimeLeft)} remaining]` : ``}` : `**No music playing**`)
                .thumbnail(ctx.player.currentTrack instanceof lavalink_1.Track ? ctx.player.currentTrack.thumbnail(`mqdefault`) ?? `` : ``)
                .description(pages.length ? `${pages[page]}\n*Page ${page + 1}/${pages.length}*` : `**No music in the queue.**`)
                .field(`Queue Size`, `\`${ctx.player.queue.length}\``, true)
                .field(`Queue Length`, `\`${discord_utils_1.Utils.timestamp(queueLength)}\``, true)
                .field(`Time Left`, `\`${ctx.player.queuePosition !== null ? discord_utils_1.Utils.timestamp(queueLength - (ctx.player.queue.slice(0, ctx.player.queuePosition).reduce((p, c) => p + (c.length ?? 0), 0) + (ctx.player.position ?? 0))) : `N/A`}\``, true)
                .field(`Voice Channel`, `\`${voiceChannel.name}\`` ?? `N/A`, true)
                .field(`Loop`, `\`${ctx.player.loop.charAt(0).toUpperCase()}${ctx.player.loop.slice(1)}\``, true)
                .field(`24/7`, `\`${ctx.player.twentyfourseven ? `On` : `Off`}\``, true)
                .field(`Active Effects`, ctx.worker.lavalink.filtersString(ctx.player), false)
                .send()
                .catch((error) => {
                discord_utils_1.Utils.logError(error);
                void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
            });
        };
        await sendEmbed(Math.floor((ctx.player.queuePosition ?? 0) / 10));
    }
};