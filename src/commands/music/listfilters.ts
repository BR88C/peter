import { ChatCommand, DiscordColors, Embed } from '@distype/cmd';

export default new ChatCommand()
    .setName(`listfilters`)
    .setDescription(`Displays the active filters (bassboost, speed, pitch, etc)`)
    .setExecute(async (ctx) => {
        if (!ctx.guildId) return ctx.error(`This command only works in servers`);

        const player = ctx.client.lavalink.players.get(ctx.guildId);
        if (!player) return ctx.error(`The bot must be connected to a voice channel to use this command`);

        await ctx.send(
            new Embed()
                .setColor(DiscordColors.ROLE_SEA_GREEN)
                .setTitle(`Active Filters`)
                .setDescription(ctx.client.lavalink.filtersString(player))
        );
    });
