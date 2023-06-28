import { Constants } from '../../utils/Constants';

import { cleanseMarkdown, MessageCommand, DiscordColors, Embed } from '@distype/cmd';
import { PermissionsUtils } from 'distype';

export default new MessageCommand()
    .setName(`Play`)
    .setGuildOnly(true)
    .setExecute(async (ctx) => {
        if (!ctx.client.cache.guilds?.has(ctx.guildId) || ctx.client.cache.guilds?.get(ctx.guildId)?.unavailable === true) throw new Error(`The bot is starting, or there is a Discord outage; please wait a moment then try again`);

        const voiceState = ctx.client.cache.voiceStates?.get(ctx.guildId)?.get(ctx.user.id);
        if (!voiceState?.channel_id) throw new Error(`You must be connected to a voice channel to play a track`);

        await ctx.defer();

        const player = await ctx.client.lavalink.preparePlayer(ctx.guildId, voiceState.channel_id);
        player.lastMessage ??= -1;
        player.messageQueue ??= [];
        player.twentyfourseven ??= false;
        player.voiceTimeout ??= null;

        if (!player.textChannel) {
            const textMissingPerms = PermissionsUtils.missingPerms(await ctx.client.getSelfPermissions(ctx.guildId, ctx.channelId), ...Constants.TEXT_PERMISSIONS);
            if (textMissingPerms !== 0n) {
                player.destroy();
                throw new Error(`Missing the following permissions in the text channel: ${PermissionsUtils.toReadable(textMissingPerms).join(`, `)}`);
            }

            player.textChannel = ctx.channelId;
        }

        if (player.voiceChannel !== voiceState.channel_id) throw new Error(`You must be in the same channel as the bot to play a track`);

        const query = ctx.target.attachments.length ? ctx.target.attachments[0].url : ctx.target.content;
        if (!query.length) throw new Error(`Unable to find content in the targeted message`);

        const search = await ctx.client.lavalink.search(query, `${ctx.user.username}#${ctx.user.discriminator}`);
        if (search.exception) throw new Error(search.exception.message);

        if (!search.tracks.length) throw new Error(`No tracks found for query "${cleanseMarkdown(query)}"`);

        await player.play(search.loadType === `PLAYLIST_LOADED` ? search.tracks : search.tracks[0]);

        if (search.loadType === `PLAYLIST_LOADED`) {
            await ctx.send(
                new Embed()
                    .setColor(DiscordColors.ROLE_GREEN)
                    .setTitle(`Successfully queued ${search.tracks.length} track${search.tracks.length > 1 ? `s` : ``}`)
                    .setDescription(`**Link:** ${cleanseMarkdown(query)}\n\`\`\`\n${search.tracks.slice(0, 8).map((track, i) => `${i + 1}. ${cleanseMarkdown(track.title)}`).join(`\n`)}${search.tracks.length > 8 ? `\n\n${search.tracks.length - 8} more...` : ``}\n\`\`\``)
                    .setFooter(`Requested by ${search.tracks[0].requester}`)
            );
        } else {
            await ctx.send(
                new Embed()
                    .setColor(DiscordColors.ROLE_GREEN)
                    .setTitle(`Added "${cleanseMarkdown(search.tracks[0].title)}" to the queue`, search.tracks[0].uri)
                    .setFooter(`Requested by ${search.tracks[0].requester}`)
            );
        }
    });
