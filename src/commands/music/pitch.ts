import { Constants } from '../../utils/Constants';

import { ChatCommand, DiscordColors, Embed } from '@distype/cmd';
import { PlayerFilters } from '@distype/lavalink';

export default new ChatCommand()
    .setName(`pitch`)
    .setDescription(`Changes the pitch of the audio`)
    .setDmPermission(false)
    .addIntegerParameter(true, `value`, `The pitch to set the audio to, as a percent; the default is 100`, {
        min: 1,
        max: Constants.DEFAULT_MAX_SFX
    })
    .setExecute(async (ctx) => {
        const player = ctx.client.lavalink.players.get(ctx.guildId);
        if (!player) return ctx.error(`The bot must be connected to a voice channel to use this command`);

        if (player.voiceChannel !== (await ctx.client.getVoiceStateData(ctx.guildId, ctx.user.id, `channel_id`)).channel_id) return ctx.error(`You must be in the same voice channel as the bot to use this command`);

        const newFilters: PlayerFilters = {
            ...player.filters,
            timescale: {
                ...player.filters.timescale,
                pitch: ctx.parameters.value / 100
            }
        };

        if (newFilters.timescale!.pitch === 1) delete newFilters.timescale!.pitch;
        if (!Object.keys(newFilters.timescale!).length) delete newFilters.timescale;

        await player.setFilters(newFilters);

        await ctx.send(
            new Embed()
                .setColor(DiscordColors.ROLE_PURPLE)
                .setTitle(ctx.parameters.value !== 100 ? `Set the pitch to \`${ctx.parameters.value}%\`` : `Turned off the pitch filter`)
        );
    });
