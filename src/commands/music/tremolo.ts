import { Constants } from '../../utils/Constants';

import { ChatCommand, DiscordColors, Embed } from '@distype/cmd';
import { PlayerFilters } from '@distype/lavalink';

export default new ChatCommand()
    .setName(`tremolo`)
    .setDescription(`Adds a tremolo filter to the audio`)
    .setGuildOnly(true)
    .addIntegerOption(true, `value`, `The tremolo depth (the amount of volume to fluctuate), as a percent; the default is 0`, {
        min_value: 0,
        max_value: 100
    })
    .addNumberOption(false, `frequency`, `The frequency to fluctuate the volume at; the default is ${Constants.TREMOLO_VIBRATO_FREQUENCY}`, {
        min_value: 0.001,
        max_value: Constants.DEFAULT_MAX_SFX
    })
    .setExecute(async (ctx) => {
        const player = ctx.client.lavalink.players.get(ctx.guildId);
        if (!player) throw new Error(`The bot must be connected to a voice channel to use this command`);

        if (player.voiceChannel !== ctx.client.getVoiceStateData(ctx.guildId, ctx.user.id, `channel_id`).channel_id) throw new Error(`You must be in the same voice channel as the bot to use this command`);

        const newFilters: PlayerFilters = {
            ...player.filters,
            tremolo: {
                depth: ctx.options.value / 100,
                frequency: (ctx.options.frequency ?? player.filters.tremolo?.frequency) ?? Constants.TREMOLO_VIBRATO_FREQUENCY
            }
        };

        if (newFilters.tremolo!.depth === 0) delete newFilters.tremolo;

        await player.setFilters(newFilters);

        await ctx.send(
            new Embed()
                .setColor(DiscordColors.ROLE_PURPLE)
                .setTitle(ctx.options.value !== 0 ? `Set tremolo to \`${ctx.options.value}%\`${typeof ctx.options.frequency === `number` ? ` with a frequency of \`${ctx.options.frequency} Hz\`` : ``}` : `Turned off the tremolo filter`)
        );
    });
