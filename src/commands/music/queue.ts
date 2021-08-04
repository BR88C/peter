import { cleanseMarkdown } from '../../utils/StringUtils';
import { Constants } from '../../config/Constants';
import { filtersString } from '../../utils/Lavalink';
import { timestamp } from '../../utils/Time';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { Track } from '@discord-rose/lavalink';

export default {
    command: `queue`,
    mustHaveConnectedPlayer: true,
    interaction: {
        name: `queue`,
        description: `Get the current queue.`
    },
    exec: async (ctx) => {
        const voiceChannel = await ctx.worker.api.channels.get(ctx.player!.options.voiceChannelId);

        /**
         * Send the quue embed.
         * @param page The queue page to show.
         */
        const sendEmbed = async (page: number): Promise<void> => {
            const trackTitles: string[] = [];
            ctx.player!.queue.forEach((track, i) => trackTitles.push(`${i === ctx.player!.queuePosition ? `↳ ` : ``}**${i + 1}.** ${(track as Track).uri ? `[` : ``}${cleanseMarkdown(track.title)}${(track as Track).uri ? `](${(track as Track).uri})` : ``} ${track.length ? ` - [${timestamp(track.length)}]` : ``}`));
            const pages: string[] = [];
            for (const [i, title] of trackTitles.entries()) pages[Math.floor(i / 10)] = `${pages[Math.floor(i / 10)] ?? ``}${title}\n`;
            const queueLength = ctx.player!.queue.reduce((p, c) => p + (c.length ?? 0), 0);
            const trackTimeLeft = ctx.player!.queuePosition !== null && ctx.player!.queue[ctx.player!.queuePosition] instanceof Track ? (ctx.player!.queue[ctx.player!.queuePosition].length ?? 0) - (ctx.player!.position ?? (ctx.player!.queue[ctx.player!.queuePosition].length ?? 0)) : 0;

            await ctx.embed
                .color(Constants.QUEUE_EMBED_COLOR)
                .title(ctx.player!.queuePosition !== null && ctx.player!.queue[ctx.player!.queuePosition] ? `**Now Playing:** ${ctx.player!.queue[ctx.player!.queuePosition].title} ${ctx.player!.queue[ctx.player!.queuePosition].length ? `[${timestamp(trackTimeLeft)} remaining]` : ``}` : `**No music playing**`)
                .thumbnail(ctx.player!.queuePosition !== null && ctx.player!.queue[ctx.player!.queuePosition] instanceof Track ? (ctx.player!.queue[ctx.player!.queuePosition] as Track).thumbnail(`mqdefault`) ?? `` : ``)
                .description(pages.length ? `${pages[page]}\n*Page ${page + 1}/${pages.length}*` : `**No music in the queue.**`)
                .field(`Queue Size`, `\`${ctx.player!.queue.length}\``, true)
                .field(`Queue Length`, `\`${timestamp(queueLength)}\``, true)
                .field(`Time Left`, `\`${ctx.player!.queuePosition !== null ? timestamp(queueLength - (ctx.player!.queue.slice(0, ctx.player!.queuePosition).reduce((p, c) => p + (c.length ?? 0), 0) + (ctx.player!.position ?? 0))) : `N/A`}\``, true)
                .field(`Voice Channel`, `\`${voiceChannel.name}\`` ?? `N/A`, true)
                .field(`Loop`, `\`${ctx.player!.loop.charAt(0).toUpperCase()}${ctx.player!.loop.slice(1)}\``, true)
                .field(`24/7`, `\`${ctx.player!.twentyfourseven ? `On` : `Off`}\``, true)
                .field(`Active Effects`, filtersString(ctx.player!), false)
                .send()
                .catch(() => void ctx.error(`Unable to send the response message.`));
        };

        await sendEmbed(Math.floor((ctx.player!.queuePosition ?? 0) / 10));
    }
} as CommandOptions;
