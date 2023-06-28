"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../utils/Constants");
const cmd_1 = require("@distype/cmd");
const distype_1 = require("distype");
exports.default = new cmd_1.ChatCommand()
    .setName(`playfile`)
    .setDescription(`Plays a file`)
    .setGuildOnly(true)
    .addAttachmentOption(true, `file`, `The file to play`)
    .setExecute(async (ctx) => {
    if (!ctx.client.cache.guilds?.has(ctx.guildId) || ctx.client.cache.guilds?.get(ctx.guildId)?.unavailable === true)
        throw new Error(`The bot is starting, or there is a Discord outage; please wait a moment then try again`);
    const voiceState = ctx.client.cache.voiceStates?.get(ctx.guildId)?.get(ctx.user.id);
    if (!voiceState?.channel_id)
        throw new Error(`You must be connected to a voice channel to play a track`);
    await ctx.defer();
    const player = await ctx.client.lavalink.preparePlayer(ctx.guildId, voiceState.channel_id);
    player.lastMessage ??= -1;
    player.messageQueue ??= [];
    player.twentyfourseven ??= false;
    player.voiceTimeout ??= null;
    if (!player.textChannel) {
        const textMissingPerms = distype_1.PermissionsUtils.missingPerms(await ctx.client.getSelfPermissions(ctx.guildId, ctx.channelId), ...Constants_1.Constants.TEXT_PERMISSIONS);
        if (textMissingPerms !== 0n) {
            player.destroy();
            throw new Error(`Missing the following permissions in the text channel: ${distype_1.PermissionsUtils.toReadable(textMissingPerms).join(`, `)}`);
        }
        player.textChannel = ctx.channelId;
    }
    if (player.voiceChannel !== voiceState.channel_id)
        throw new Error(`You must be in the same channel as the bot to play a track`);
    const search = await ctx.client.lavalink.search(ctx.options.file.url, `${ctx.user.username}#${ctx.user.discriminator}`);
    if (search.exception)
        throw new Error(search.exception.message);
    if (!search.tracks[0]) {
        const parts = ctx.options.file.filename.split(`.`);
        throw new Error(`File type "${(0, cmd_1.cleanseMarkdown)(parts[parts.length - 1] ?? `Unknown`)}" not supported`);
    }
    await player.play(search.tracks[0]);
    await ctx.send(new cmd_1.Embed()
        .setColor(cmd_1.DiscordColors.ROLE_GREEN)
        .setTitle(`Added "${(0, cmd_1.cleanseMarkdown)(search.tracks[0].title)}" to the queue`, search.tracks[0].uri)
        .setFooter(`Requested by ${search.tracks[0].requester}`));
});
