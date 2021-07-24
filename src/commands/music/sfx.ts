import { Constants } from '../../config/Constants';
import { filtersString } from '../../utils/Lavalink';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { Filters } from '@discord-rose/lavalink';

export default {
    command: `sfx`,
    interaction: {
        name: `sfx`,
        description: `Apply SFX to the music. Note that SFX may take a few seconds to be applied.`,
        options: [
            {
                type: 1,
                name: `bassboost`,
                description: `Bassboost the music.`,
                options: [
                    {
                        type: 4,
                        name: `value`,
                        description: `The value to bassboost at. 0 is normal bass levels.`,
                        required: true
                    }
                ]
            },
            {
                type: 1,
                name: `clear`,
                description: `Clear all SFX.`
            },
            {
                type: 1,
                name: `list`,
                description: `List all SFX.`
            },
            {
                type: 1,
                name: `pitch`,
                description: `Set the pitch of the music.`,
                options: [
                    {
                        type: 4,
                        name: `value`,
                        description: `The pitch to set the music to. 100 is the normal pitch.`,
                        required: true
                    }
                ]
            },
            {
                type: 1,
                name: `rotation`,
                description: `Adds rotation (Audio panning) to the music.`,
                options: [
                    {
                        type: 4,
                        name: `value`,
                        description: `The frequency to rotate at. 0 sets this to off.`,
                        required: true
                    }
                ]
            },
            {
                type: 1,
                name: `speed`,
                description: `Set the speed of the music.`,
                options: [
                    {
                        type: 4,
                        name: `value`,
                        description: `The speed to set the music to. 100 is 1x speed, 200 is 2x speed, etc.`,
                        required: true
                    }
                ]
            },
            {
                type: 1,
                name: `treble`,
                description: `Boost the music's treble.`,
                options: [
                    {
                        type: 4,
                        name: `value`,
                        description: `The value to boost the treble by. 0 is normal treble levels.`,
                        required: true
                    }
                ]
            },
            {
                type: 1,
                name: `tremolo`,
                description: `Add a tremolo effect to the music.`,
                options: [
                    {
                        type: 4,
                        name: `value`,
                        description: `The tremolo level to use. 0 sets tremolo to off. This has a max value of 100.`,
                        required: true
                    }
                ]
            },
            {
                type: 1,
                name: `vibrato`,
                description: `Add a vibrato effect to the music.`,
                options: [
                    {
                        type: 4,
                        name: `value`,
                        description: `The vibrato level to use. 0 sets vibrato to off. This has a max value of 100.`,
                        required: true
                    }
                ]
            },
            {
                type: 1,
                name: `volume`,
                description: `Set the volume of the music.`,
                options: [
                    {
                        type: 4,
                        name: `value`,
                        description: `The value to set the volume to. 100 is normal volume, 200 is 2x volume, etc. Max is 1000.`,
                        required: true
                    }
                ]
            }
        ]
    },
    exec: async (ctx) => {
        const player = ctx.worker.lavalink.players.get(ctx.interaction.guild_id!);
        if (!player) return void ctx.error(`Unable to change SFX; the bot is not connected to the VC.`);

        const foundVoiceState = ctx.worker.voiceStates.find((state) => state.guild_id === ctx.interaction.guild_id && state.users.has(ctx.author.id));
        if (foundVoiceState?.channel_id !== player.options.voiceChannelId) return void ctx.error(`You must be in the VC to change SFX.`);

        if (ctx.options.bassboost) {
            if (ctx.options.bassboost.value < 0) return void ctx.error(`Invalid value. Please specify a value greater than or equal to 0.`);
            if (ctx.options.bassboost.value >= Constants.MAX_SAFE_JAVA_INTEGER) return void ctx.error(`Invalid value. Please specify a lower value.`);

            const newFilters: Filters = Object.assign(player.filters, { equalizer: (player.filters.equalizer?.filter((v) => v.band > 2) ?? []).concat(ctx.options.bassboost.value === 0
                ? []
                : new Array(3).fill(null).map((v, i) => ({
                    band: i, gain: ctx.options.bassboost.value * Constants.BASSBOOST_INTENSITY_MULTIPLIER
                }))) });
            if (!newFilters.equalizer?.length) delete newFilters.equalizer;
            await player.setFilters(newFilters);

            ctx.embed
                .color(Constants.SET_SFX_EMBED_COLOR)
                .title(player.filters.equalizer?.find((v) => v.band === 0) ? `Set the bassboost effect to \`+${Math.round((player.filters.equalizer?.find((v) => v.band === 0)?.gain ?? 0) / Constants.BASSBOOST_INTENSITY_MULTIPLIER)}\`` : `Turned off the bassboost effect.`)
                .send()
                .catch((error) => void ctx.error(error));
        } else if (ctx.options.clear) {
            await player.setFilters({});
            await player.setVolume(100);

            ctx.embed
                .color(Constants.SET_SFX_EMBED_COLOR)
                .title(`Cleared all effects`)
                .send()
                .catch((error) => void ctx.error(error));
        } else if (ctx.options.list) {
            ctx.embed
                .color(Constants.SET_SFX_EMBED_COLOR)
                .title(`Active SFX`)
                .description(filtersString(player))
                .send()
                .catch((error) => void ctx.error(error));
        } else if (ctx.options.pitch) {
            if (ctx.options.pitch.value <= 0) return void ctx.error(`Invalid value. Please specify a value greater than 0.`);
            if (ctx.options.pitch.value >= Constants.MAX_SAFE_JAVA_INTEGER) return void ctx.error(`Invalid value. Please specify a lower value.`);

            const newFilters: Filters = Object.assign(player.filters, { timescale: Object.assign(player.filters.timescale ?? {}, { pitch: ctx.options.pitch.value / 100 }) });
            if (newFilters.timescale?.pitch === 1) delete newFilters.timescale.pitch;
            if (!Object.keys(newFilters.timescale ?? {}).length) delete newFilters.timescale;
            await player.setFilters(newFilters);

            ctx.embed
                .color(Constants.SET_SFX_EMBED_COLOR)
                .title(player.filters.timescale?.pitch ? `Set the pitch to \`${Math.round(player.filters.timescale.pitch * 100)}%\`` : `Turned off the pitch effect.`)
                .send()
                .catch((error) => void ctx.error(error));
        } else if (ctx.options.rotation) {
            if (ctx.options.rotation.value < 0) return void ctx.error(`Invalid value. Please specify a value greater than or equal to 0.`);
            if (ctx.options.rotation.value >= Constants.MAX_SAFE_JAVA_INTEGER) return void ctx.error(`Invalid value. Please specify a lower value.`);

            const newFilters: Filters = Object.assign(player.filters, { rotation: { rotationHz: ctx.options.rotation.value } });
            if (newFilters.rotation?.rotationHz === 0) delete newFilters.rotation;
            await player.setFilters(newFilters);

            ctx.embed
                .color(Constants.SET_SFX_EMBED_COLOR)
                .title(typeof newFilters.rotation?.rotationHz === `number` ? `Set the rotation frequency to \`${newFilters.rotation.rotationHz} Hz\`` : `Turned off the rotation effect.`)
                .send()
                .catch((error) => void ctx.error(error));
        } else if (ctx.options.speed) {
            if (ctx.options.speed.value <= 0) return void ctx.error(`Invalid value. Please specify a value greater than 0.`);
            if (ctx.options.speed.value >= Constants.MAX_SAFE_JAVA_INTEGER) return void ctx.error(`Invalid value. Please specify a lower value.`);

            const newFilters: Filters = Object.assign(player.filters, { timescale: Object.assign(player.filters.timescale ?? {}, { speed: ctx.options.speed.value / 100 }) });
            if (newFilters.timescale?.speed === 1) delete newFilters.timescale.speed;
            if (!Object.keys(newFilters.timescale ?? {}).length) delete newFilters.timescale;
            await player.setFilters(newFilters);

            ctx.embed
                .color(Constants.SET_SFX_EMBED_COLOR)
                .title(player.filters.timescale?.speed ? `Set the speed to \`${Math.round(player.filters.timescale.speed * 100)}%\`` : `Turned off the speed effect.`)
                .send()
                .catch((error) => void ctx.error(error));
        } else if (ctx.options.treble) {
            if (ctx.options.treble.value < 0) return void ctx.error(`Invalid value. Please specify a value greater than or equal to 0.`);
            if (ctx.options.treble.value >= Constants.MAX_SAFE_JAVA_INTEGER) return void ctx.error(`Invalid value. Please specify a lower value.`);

            const newFilters: Filters = Object.assign(player.filters, { equalizer: (player.filters.equalizer?.filter((v) => v.band < Constants.EQ_BAND_COUNT - 3) ?? []).concat(ctx.options.treble.value === 0
                ? []
                : new Array(3).fill(null).map((v, i) => ({
                    band: Constants.EQ_BAND_COUNT - (i + 1), gain: ctx.options.treble.value * Constants.TREBLE_INTENSITY_MULTIPLIER
                }))) });
            if (!newFilters.equalizer?.length) delete newFilters.equalizer;
            await player.setFilters(newFilters);

            ctx.embed
                .color(Constants.SET_SFX_EMBED_COLOR)
                .title(player.filters.equalizer?.find((v) => v.band === Constants.EQ_BAND_COUNT - 1) ? `Set the treble to \`+${Math.round((player.filters.equalizer?.find((v) => v.band === Constants.EQ_BAND_COUNT - 1)?.gain ?? 0) / Constants.TREBLE_INTENSITY_MULTIPLIER)}\`` : `Turned off the treble effect.`)
                .send()
                .catch((error) => void ctx.error(error));
        } else if (ctx.options.tremolo) {
            if (ctx.options.tremolo.value < 0) return void ctx.error(`Invalid value. Please specify a value greater than or equal to 0.`);
            if (ctx.options.tremolo.value > 100) return void ctx.error(`Invalid value. Please specify a value lower than or equal to 100.`);

            const newFilters: Filters = Object.assign(player.filters, { tremolo: {
                depth: ctx.options.tremolo.value / 100, frequency: Constants.TREMOLO_VIBRATO_FREQUENCY
            } });
            if (newFilters.tremolo?.depth === 0) delete newFilters.tremolo;
            await player.setFilters(newFilters);

            ctx.embed
                .color(Constants.SET_SFX_EMBED_COLOR)
                .title(newFilters.tremolo?.depth ? `Set the tremolo to \`${Math.round(newFilters.tremolo.depth * 100)}%\`` : `Turned off the tremolo effect.`)
                .send()
                .catch((error) => void ctx.error(error));
        } else if (ctx.options.vibrato) {
            if (ctx.options.vibrato.value < 0) return void ctx.error(`Invalid value. Please specify a value greater than or equal to 0.`);
            if (ctx.options.vibrato.value > 100) return void ctx.error(`Invalid value. Please specify a value lower than or equal to 100.`);

            const newFilters: Filters = Object.assign(player.filters, { vibrato: {
                depth: ctx.options.vibrato.value / 100, frequency: Constants.TREMOLO_VIBRATO_FREQUENCY
            } });
            if (newFilters.vibrato?.depth === 0) delete newFilters.vibrato;
            await player.setFilters(newFilters);

            ctx.embed
                .color(Constants.SET_SFX_EMBED_COLOR)
                .title(newFilters.vibrato?.depth ? `Set the vibrato to \`${Math.round(newFilters.vibrato.depth * 100)}%\`` : `Turned off the vibrato effect.`)
                .send()
                .catch((error) => void ctx.error(error));
        } else if (ctx.options.volume) {
            if (ctx.options.volume.value < 0) return void ctx.error(`Invalid value. Please specify a value greater than or equal to 0.`);
            if (ctx.options.volume.value > 1e3) return void ctx.error(`Invalid value. Please specify a value lower than or equal to 1000.`);

            await player.setVolume(ctx.options.volume.value);

            ctx.embed
                .color(Constants.SET_SFX_EMBED_COLOR)
                .title(`Set the volume to \`${player.volume}%\``)
                .send()
                .catch((error) => void ctx.error(error));
        }
    }
} as CommandOptions;
