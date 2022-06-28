import { Constants } from '../../utils/Constants';

import { ChatCommand, DiscordColors, Embed } from '@distype/cmd';
import { PlayerFilters } from '@distype/lavalink';

export default new ChatCommand()
    .setName(`vibrato`)
    .setDescription(`Adds a vibrato filter to the audio`)
    .setDmPermission(false)
    .addIntegerParameter(true, `value`, `The vibrato depth (the amount of pitch to fluctuate), as a percent; the default is 0`, {
        min: 0,
        max: 100
    })
    .addNumberParameter(false, `frequency`, `The frequency to fluctuate the pitch at; the default is ${Constants.TREMOLO_VIBRATO_FREQUENCY}`, {
        min: 0.001,
        max: 14
    })
    .setExecute(async (ctx) => {
        const player = ctx.client.lavalink.players.get(ctx.guildId);
        if (!player) return ctx.error(`The bot must be connected to a voice channel to use this command`);

        if (player.voiceChannel !== (await ctx.client.getVoiceStateData(ctx.guildId, ctx.user.id, `channel_id`)).channel_id) return ctx.error(`You must be in the same voice channel as the bot to use this command`);

        const newFilters: PlayerFilters = {
            ...player.filters,
            vibrato: {
                depth: ctx.parameters.value / 100,
                frequency: (ctx.parameters.frequency ?? player.filters.vibrato?.frequency) ?? Constants.TREMOLO_VIBRATO_FREQUENCY
            }
        };

        if (newFilters.vibrato!.depth === 0) delete newFilters.vibrato;

        await player.setFilters(newFilters);

        await ctx.send(
            new Embed()
                .setColor(DiscordColors.ROLE_PURPLE)
                .setTitle(ctx.parameters.value !== 0 ? `Set vibrato to \`${ctx.parameters.value}%\`${typeof ctx.parameters.frequency === `number` ? ` with a frequency of \`${ctx.parameters.frequency} Hz\`` : ``}` : `Turned off the vibrato filter`)
        );
    });
