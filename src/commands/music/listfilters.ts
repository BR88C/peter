import { ChatCommand, DiscordColors, Embed } from '@distype/cmd';

export default new ChatCommand()
    .setName(`listfilters`)
    .setDescription(`Displays the active filters (bassboost, speed, pitch, etc)`)
    .setGuildOnly(true)
    .setExecute(async (ctx) => {
        const player = ctx.client.lavalink.players.get(ctx.guildId);
        if (!player) throw new Error(`The bot must be connected to a voice channel to use this command`);

        await ctx.send(
            new Embed()
                .setColor(DiscordColors.ROLE_SEA_GREEN)
                .setTitle(`Active Filters`)
                .setDescription(ctx.client.lavalink.filtersString(player))
        );
    });
