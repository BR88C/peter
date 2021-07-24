import { cleanseMarkdown } from '../../utils/StringUtils';
import { Constants } from '../../config/Constants';
import { filtersString } from '../../utils/Lavalink';
import { timestamp } from '../../utils/Time';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { PlayerState, Track } from '@discord-rose/lavalink';

export default {
    command: `queue`,
    interaction: {
        name: `queue`,
        description: `Get the current queue.`
    },
    exec: async (ctx) => {
        const player = ctx.worker.lavalink.players.get(ctx.interaction.guild_id!);
        if (!player || player.state < PlayerState.CONNECTED) return void ctx.error(`Unable to get the queue; the bot is not connected to a VC.`);

        const voiceChannel = await ctx.worker.api.channels.get(player.options.voiceChannelId);

        /**
         * Send the quue embed.
         * @param page The queue page to show.
         */
        const sendEmbed = async (page: number): Promise<void> => {
            const trackTitles: string[] = [];
            player.queue.forEach((track, i) => trackTitles.push(`${i === player.queuePosition ? `↳ ` : ``}**${i + 1}.** ${(track as Track).uri ? `[` : ``}${cleanseMarkdown(track.title)}${(track as Track).uri ? `](${(track as Track).uri})` : ``} ${track.length ? ` - [${timestamp(track.length)}]` : ``}`));
            const pages: string[] = [];
            for (const [i, title] of trackTitles.entries()) pages[Math.floor(i / 10)] = `${pages[Math.floor(i / 10)] ?? ``}${title}\n`;
            const queueLength = player.queue.reduce((p, c) => p + (c.length ?? 0), 0);
            const trackTimeLeft = player.queuePosition !== null && player.queue[player.queuePosition] instanceof Track ? (player.queue[player.queuePosition].length ?? 0) - (player.position ?? (player.queue[player.queuePosition].length ?? 0)) : 0;

            await ctx.embed
                .color(Constants.QUEUE_EMBED_COLOR)
                .title(player.queuePosition !== null && player.queue[player.queuePosition] ? `**Now Playing:** ${player.queue[player.queuePosition].title} ${player.queue[player.queuePosition].length ? `[${timestamp(trackTimeLeft)} remaining]` : ``}` : `**No music playing**`)
                .thumbnail(player.queuePosition !== null && player.queue[player.queuePosition] instanceof Track ? (player.queue[player.queuePosition] as Track).thumbnail(`mqdefault`) ?? `` : ``)
                .description(pages.length ? `${pages[page]}\n*Page ${page + 1}/${pages.length}*` : `**No music in the queue.**`)
                .field(`Queue Size`, `\`${player.queue.length}\``, true)
                .field(`Queue Length`, `\`${timestamp(queueLength)}\``, true)
                .field(`Time Left`, `\`${player.queuePosition !== null ? timestamp(queueLength - (player.queue.slice(0, player.queuePosition).reduce((p, c) => p + (c.length ?? 0), 0) + (player.position ?? 0))) : `N/A`}\``, true)
                .field(`Voice Channel`, `\`${voiceChannel.name}\`` ?? `N/A`, true)
                .field(`Loop`, `\`${player.loop.charAt(0).toUpperCase()}${player.loop.slice(1)}\``, true)
                .field(`24/7`, `\`${player.twentyfourseven ? `On` : `Off`}\``, true)
                .field(`Active Effects`, filtersString(player), false)
                .send()
                .catch((error) => void ctx.error(error));
        };

        await sendEmbed(Math.floor((player.queuePosition ?? 0) / 10));
    }
} as CommandOptions;
