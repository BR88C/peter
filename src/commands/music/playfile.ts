import { Constants } from '../../utils/Constants';

import { ChatCommand, cleanseMarkdown, DiscordColors, Embed } from '@distype/cmd';
import { PermissionsUtils } from 'distype';

export default new ChatCommand()
    .setName(`playfile`)
    .setDescription(`Plays a file`)
    .setDmPermission(false)
    .addAttachmentParameter(true, `file`, `The file to play`)
    .setExecute(async (ctx) => {
        if (!ctx.client.cache.guilds?.has(ctx.guildId) || ctx.client.cache.guilds?.get(ctx.guildId)?.unavailable === true) return ctx.error(`The bot is starting, or there is a Discord outage; please wait a moment then try again`);

        const voiceState = ctx.client.cache.voiceStates?.get(ctx.guildId)?.get(ctx.user.id);
        if (!voiceState?.channel_id) return ctx.error(`You must be connected to a voice channel to play a track`);

        await ctx.defer();

        const player = await ctx.client.lavalink.preparePlayer(ctx.guildId, voiceState.channel_id);
        player.twentyfourseven ??= false;
        player.voiceTimeout ??= null;

        if (!player.textChannel) {
            const textMissingPerms = PermissionsUtils.missingPerms(await ctx.client.getSelfPermissions(ctx.guildId, ctx.channelId), ...Constants.TEXT_PERMISSIONS);
            if (textMissingPerms !== 0n) {
                player.destroy();
                return ctx.error(`Missing the following permissions in the text channel: ${PermissionsUtils.toReadable(textMissingPerms).join(`, `)}`);
            }

            player.textChannel = ctx.channelId;
        }

        if (player.voiceChannel !== voiceState.channel_id) return ctx.error(`You must be in the same channel as the bot to play a track`);

        const search = await ctx.client.lavalink.search(ctx.parameters.file.url, `${ctx.user.username}#${ctx.user.discriminator}`);
        if (search.exception) return ctx.error(search.exception.message);

        if (!search.tracks[0]) {
            const parts = ctx.parameters.file.filename.split(`.`);
            return ctx.error(`File type "${cleanseMarkdown(parts[parts.length - 1] ?? `Unknown`)}" not supported`);
        }

        await player.play(search.tracks[0]);

        await ctx.send(
            new Embed()
                .setColor(DiscordColors.ROLE_GREEN)
                .setTitle(`Added "${cleanseMarkdown(search.tracks[0].title)}" to the queue`)
                .setURL(search.tracks[0].uri)
                .setFooter(`Requested by ${search.tracks[0].requester}`)
        );
    });
