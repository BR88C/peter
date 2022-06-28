import { Constants } from '../../utils/Constants';

import { ChatCommand, DiscordColors, Embed } from '@distype/cmd';
import { PlayerFilters } from '@distype/lavalink';

export default new ChatCommand()
    .setName(`rotation`)
    .setDescription(`Adds a rotation (audio panning) filter to the audio`)
    .setDmPermission(false)
    .addNumberParameter(true, `value`, `The frequency to rotate at (small values like 0.1 create an "8D audio" effect); the default is 0`, {
        min: 0,
        max: Constants.DEFAULT_MAX_SFX
    })
    .setExecute(async (ctx) => {
        const player = ctx.client.lavalink.players.get(ctx.guildId);
        if (!player) return ctx.error(`The bot must be connected to a voice channel to use this command`);

        if (player.voiceChannel !== ctx.client.getVoiceStateData(ctx.guildId, ctx.user.id, `channel_id`).channel_id) return ctx.error(`You must be in the same voice channel as the bot to use this command`);

        const newFilters: PlayerFilters = {
            ...player.filters,
            rotation: { rotationHz: ctx.parameters.value }
        };

        if (newFilters.rotation!.rotationHz === 0) delete newFilters.rotation;

        await player.setFilters(newFilters);

        await ctx.send(
            new Embed()
                .setColor(DiscordColors.ROLE_PURPLE)
                .setTitle(ctx.parameters.value !== 0 ? `Set the rotation frequency to \`${ctx.parameters.value} Hz\`` : `Turned off the rotation filter`)
        );
    });
