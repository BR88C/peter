import { Constants } from '../../utils/Constants';

import { ChatCommand, DiscordColors, Embed } from '@distype/cmd';
import { PlayerFilters } from '@distype/lavalink';

export default new ChatCommand()
    .setName(`bassboost`)
    .setDescription(`Bassboosts the audio`)
    .addIntegerOption(true, `value`, `The value to bassboost by; the default is 0`, {
        min_value: 0,
        max_value: Constants.DEFAULT_MAX_SFX
    })
    .setExecute(async (ctx) => {
        if (!ctx.guildId) throw new Error(`This command only works in servers`);

        const player = ctx.client.lavalink.players.get(ctx.guildId);
        if (!player) throw new Error(`The bot must be connected to a voice channel to use this command`);

        if (player.voiceChannel !== ctx.client.getVoiceStateData(ctx.guildId, ctx.user.id, `channel_id`).channel_id) throw new Error(`You must be in the same voice channel as the bot to use this command`);

        const newFilters: PlayerFilters = {
            ...player.filters,
            equalizer: (player.filters.equalizer?.filter((v) => v.band > 2) ?? []).concat(ctx.options.value === 0 ? [] : new Array(3).fill(null).map((_, i) => ({
                band: i,
                gain: ctx.options.value * Constants.BASSBOOST_INTENSITY_MULTIPLIER
            })))
        };

        if (!newFilters.equalizer!.length) delete newFilters.equalizer;

        await player.setFilters(newFilters);

        await ctx.send(
            new Embed()
                .setColor(DiscordColors.ROLE_PURPLE)
                .setTitle(ctx.options.value !== 0 ? `Set bassboost to \`+${ctx.options.value}\`` : `Turned off the bassboost filter`)
        );
    });
