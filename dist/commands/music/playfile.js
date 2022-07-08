"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cmd_1 = require("@distype/cmd");
exports.default = new cmd_1.ChatCommand()
    .setName(`playfile`)
    .setDescription(`Plays a file`)
    .setDmPermission(false)
    .addAttachmentParameter(true, `file`, `The file to play`)
    .setExecute(async (ctx) => {
    if (!ctx.client.cache.guilds?.has(ctx.guildId) || ctx.client.cache.guilds?.get(ctx.guildId)?.unavailable === true)
        return ctx.error(`The bot is starting, or there is a Discord outage; please wait a moment then try again`);
    const voiceState = ctx.client.cache.voiceStates?.get(ctx.guildId)?.get(ctx.user.id);
    if (!voiceState?.channel_id)
        return ctx.error(`You must be connected to a voice channel to play a track`);
    await ctx.defer();
    const player = await ctx.client.lavalink.preparePlayer(ctx.guildId, voiceState.channel_id);
    player.textChannel ??= ctx.channelId;
    player.twentyfourseven = false;
    player.voiceTimeout ??= null;
    if (player.voiceChannel !== voiceState.channel_id)
        return ctx.error(`You must be in the same channel as the bot to play a track`);
    const search = await ctx.client.lavalink.search(ctx.parameters.file.url, `${ctx.user.username}#${ctx.user.discriminator}`);
    if (search.exception)
        return ctx.error(search.exception.message);
    if (!search.tracks[0]) {
        const parts = ctx.parameters.file.filename.split(`.`);
        return ctx.error(`File type "${(0, cmd_1.cleanseMarkdown)(parts[parts.length - 1] ?? `Unknown`)}" not supported`);
    }
    await player.play(search.tracks[0]);
    await ctx.send(new cmd_1.Embed()
        .setColor(cmd_1.DiscordColors.ROLE_GREEN)
        .setTitle(`Added "${(0, cmd_1.cleanseMarkdown)(search.tracks[0].title)}" to the queue`)
        .setURL(search.tracks[0].uri)
        .setFooter(`Requested by ${search.tracks[0].requester}`));
});
