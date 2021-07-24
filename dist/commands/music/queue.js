"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StringUtils_1 = require("../../utils/StringUtils");
const Constants_1 = require("../../config/Constants");
const Lavalink_1 = require("../../utils/Lavalink");
const Time_1 = require("../../utils/Time");
const lavalink_1 = require("@discord-rose/lavalink");
exports.default = {
    command: `queue`,
    interaction: {
        name: `queue`,
        description: `Get the current queue.`
    },
    exec: async (ctx) => {
        const player = ctx.worker.lavalink.players.get(ctx.interaction.guild_id);
        if (!player)
            return void ctx.error(`Unable to get the queue; the bot is not connected to the VC.`);
        const voiceChannel = await ctx.worker.api.channels.get(player.options.voiceChannelId);
        const sendEmbed = async (page) => {
            const trackTitles = [];
            player.queue.forEach((track, i) => trackTitles.push(`${i === player.queuePosition ? `↳ ` : ``}**${i + 1}.** ${track.uri ? `[` : ``}${StringUtils_1.cleanseMarkdown(track.title)}${track.uri ? `](${track.uri})` : ``} ${track.length ? ` - [${Time_1.timestamp(track.length)}]` : ``}`));
            const pages = [];
            for (const [i, title] of trackTitles.entries())
                pages[Math.floor(i / 10)] = `${pages[Math.floor(i / 10)] ?? ``}${title}\n`;
            const queueLength = player.queue.reduce((p, c) => p + (c.length ?? 0), 0);
            const trackTimeLeft = player.queuePosition !== null && player.queue[player.queuePosition] instanceof lavalink_1.Track ? (player.queue[player.queuePosition].length ?? 0) - (player.position ?? (player.queue[player.queuePosition].length ?? 0)) : 0;
            await ctx.embed
                .color(Constants_1.Constants.QUEUE_EMBED_COLOR)
                .title(player.queuePosition !== null && player.queue[player.queuePosition] ? `**Now Playing:** ${player.queue[player.queuePosition].title} ${player.queue[player.queuePosition].length ? `[${Time_1.timestamp(trackTimeLeft)} remaining]` : ``}` : `**No track playing**`)
                .thumbnail(player.queuePosition !== null && player.queue[player.queuePosition] instanceof lavalink_1.Track ? player.queue[player.queuePosition].thumbnail(`mqdefault`) ?? `` : ``)
                .description(pages.length ? `${pages[page]}\n*Page ${page + 1}/${pages.length}*` : `**No tracks in the queue.**`)
                .field(`Queue Size`, `\`${player.queue.length}\``, true)
                .field(`Queue Length`, `\`${Time_1.timestamp(queueLength)}\``, true)
                .field(`Time Left`, `\`${player.queuePosition !== null ? Time_1.timestamp(queueLength - (player.queue.slice(0, player.queuePosition).reduce((p, c) => p + (c.length ?? 0), 0) + (player.position ?? 0))) : `N/A`}\``, true)
                .field(`Voice Channel`, `\`${voiceChannel.name}\`` ?? `N/A`, true)
                .field(`Loop`, `\`${player.loop.charAt(0).toUpperCase()}${player.loop.slice(1)}\``, true)
                .field(`24/7`, `\`${player.twentyfourseven ? `On` : `Off`}\``, true)
                .field(`Active Effects`, Lavalink_1.filtersString(player), false)
                .send()
                .catch((error) => void ctx.error(error));
        };
        await sendEmbed(Math.floor((player.queuePosition ?? 0) / 10));
    }
};
