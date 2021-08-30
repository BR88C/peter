import Constants from '../../config/Constants';

// Import modules.
import { cleanseMarkdown, logError, timestamp } from '@br88c/discord-utils';
import { CommandOptions } from 'discord-rose';
import { Track } from '@discord-rose/lavalink';

export default {
    command: `queue`,
    allowButton: true,
    mustHaveConnectedPlayer: true,
    interaction: {
        name: `queue`,
        description: `Get the current queue.`
    },
    exec: async (ctx) => {
        const voiceChannel = await ctx.worker.api.channels.get(ctx.player!.options.voiceChannelId).catch((error) => logError(error));
        if (!voiceChannel) return void ctx.error(`Unable to get information about the queue. Please try again.`);

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
            const trackTimeLeft = ctx.player!.currentTrack instanceof Track ? (ctx.player!.currentTrack.length ?? 0) - (ctx.player!.position ?? (ctx.player!.currentTrack.length ?? 0)) : 0;

            await ctx.embed
                .color(Constants.QUEUE_EMBED_COLOR)
                .title(ctx.player!.currentTrack ? `**Now Playing:** ${ctx.player!.currentTrack.title} ${ctx.player!.currentTrack.length ? `[${timestamp(trackTimeLeft)} remaining]` : ``}` : `**No music playing**`)
                .thumbnail(ctx.player!.currentTrack instanceof Track ? ctx.player!.currentTrack.thumbnail(`mqdefault`) ?? `` : ``)
                .description(pages.length ? `${pages[page]}\n*Page ${page + 1}/${pages.length}*` : `**No music in the queue.**`)
                .field(`Queue Size`, `\`${ctx.player!.queue.length}\``, true)
                .field(`Queue Length`, `\`${timestamp(queueLength)}\``, true)
                .field(`Time Left`, `\`${ctx.player!.queuePosition !== null ? timestamp(queueLength - (ctx.player!.queue.slice(0, ctx.player!.queuePosition).reduce((p, c) => p + (c.length ?? 0), 0) + (ctx.player!.position ?? 0))) : `N/A`}\``, true)
                .field(`Voice Channel`, `\`${voiceChannel.name}\`` ?? `N/A`, true)
                .field(`Loop`, `\`${ctx.player!.loop.charAt(0).toUpperCase()}${ctx.player!.loop.slice(1)}\``, true)
                .field(`24/7`, `\`${ctx.player!.twentyfourseven ? `On` : `Off`}\``, true)
                .field(`Active Effects`, ctx.worker.lavalink.filtersString(ctx.player!), false)
                .send()
                .catch((error) => {
                    logError(error);
                    void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
                });
        };

        await sendEmbed(Math.floor((ctx.player!.queuePosition ?? 0) / 10));
    }
} as CommandOptions;
