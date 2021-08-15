"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../config/Constants");
const discord_utils_1 = require("@br88c/discord-utils");
exports.default = {
    command: `sfx`,
    mustHaveConnectedPlayer: true,
    userMustBeInSameVC: true,
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
                        type: 10,
                        name: `value`,
                        description: `The frequency to rotate at. You can specify a decimal for this effect. 0 sets this to off.`,
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
    exec: (ctx) => {
        if (ctx.options.bassboost) {
            if (ctx.options.bassboost.value < 0)
                return void ctx.error(`Invalid value. Please specify a value greater than or equal to 0.`);
            const newFilters = Object.assign(ctx.player.filters, { equalizer: (ctx.player.filters.equalizer?.filter((v) => v.band > 2) ?? []).concat(ctx.options.bassboost.value === 0
                    ? []
                    : new Array(3).fill(null).map((v, i) => ({
                        band: i, gain: ctx.options.bassboost.value * Constants_1.Constants.BASSBOOST_INTENSITY_MULTIPLIER
                    }))) });
            if (!newFilters.equalizer?.length)
                delete newFilters.equalizer;
            ctx.player.setFilters(newFilters)
                .then(() => {
                ctx.embed
                    .color(Constants_1.Constants.SET_SFX_EMBED_COLOR)
                    .title(ctx.player.filters.equalizer?.find((v) => v.band === 0) ? `Set the bassboost effect to \`+${Math.round((ctx.player.filters.equalizer?.find((v) => v.band === 0)?.gain ?? 0) / Constants_1.Constants.BASSBOOST_INTENSITY_MULTIPLIER)}\`` : `Turned off the bassboost effect.`)
                    .send()
                    .catch((error) => {
                    discord_utils_1.logError(error);
                    void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
                });
            })
                .catch((error) => {
                discord_utils_1.logError(error);
                void ctx.error(`An unknown error occurred while setting SFX. Please submit an issue in our support server.`);
            });
        }
        else if (ctx.options.clear) {
            ctx.player.setFilters({})
                .then(() => {
                ctx.player.setVolume(100)
                    .then(() => {
                    ctx.embed
                        .color(Constants_1.Constants.SET_SFX_EMBED_COLOR)
                        .title(`Cleared all effects`)
                        .send()
                        .catch((error) => {
                        discord_utils_1.logError(error);
                        void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
                    });
                })
                    .catch((error) => {
                    discord_utils_1.logError(error);
                    void ctx.error(`An unknown error occurred while setting the volume. Please submit an issue in our support server.`);
                });
            })
                .catch((error) => {
                discord_utils_1.logError(error);
                void ctx.error(`An unknown error occurred while setting SFX. Please submit an issue in our support server.`);
            });
        }
        else if (ctx.options.list) {
            ctx.embed
                .color(Constants_1.Constants.SET_SFX_EMBED_COLOR)
                .title(`Active SFX`)
                .description(ctx.worker.lavalink.filtersString(ctx.player))
                .send()
                .catch((error) => {
                discord_utils_1.logError(error);
                void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
            });
        }
        else if (ctx.options.pitch) {
            if (ctx.options.pitch.value <= 0)
                return void ctx.error(`Invalid value. Please specify a value greater than 0.`);
            const newFilters = Object.assign(ctx.player.filters, { timescale: Object.assign(ctx.player.filters.timescale ?? {}, { pitch: ctx.options.pitch.value / 100 }) });
            if (newFilters.timescale?.pitch === 1)
                delete newFilters.timescale.pitch;
            if (!Object.keys(newFilters.timescale ?? {}).length)
                delete newFilters.timescale;
            ctx.player.setFilters(newFilters)
                .then(() => {
                ctx.embed
                    .color(Constants_1.Constants.SET_SFX_EMBED_COLOR)
                    .title(ctx.player.filters.timescale?.pitch ? `Set the pitch to \`${Math.round(ctx.player.filters.timescale.pitch * 100)}%\`` : `Turned off the pitch effect.`)
                    .send()
                    .catch((error) => {
                    discord_utils_1.logError(error);
                    void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
                });
            })
                .catch((error) => {
                discord_utils_1.logError(error);
                void ctx.error(`An unknown error occurred while setting SFX. Please submit an issue in our support server.`);
            });
        }
        else if (ctx.options.rotation) {
            if (ctx.options.rotation.value < 0)
                return void ctx.error(`Invalid value. Please specify a value greater than or equal to 0.`);
            const newFilters = Object.assign(ctx.player.filters, { rotation: { rotationHz: ctx.options.rotation.value } });
            if (newFilters.rotation?.rotationHz === 0)
                delete newFilters.rotation;
            ctx.player.setFilters(newFilters)
                .then(() => {
                ctx.embed
                    .color(Constants_1.Constants.SET_SFX_EMBED_COLOR)
                    .title(typeof newFilters.rotation?.rotationHz === `number` ? `Set the rotation frequency to \`${newFilters.rotation.rotationHz} Hz\`` : `Turned off the rotation effect.`)
                    .send()
                    .catch((error) => {
                    discord_utils_1.logError(error);
                    void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
                });
            })
                .catch((error) => {
                discord_utils_1.logError(error);
                void ctx.error(`An unknown error occurred while setting SFX. Please submit an issue in our support server.`);
            });
        }
        else if (ctx.options.speed) {
            if (ctx.options.speed.value <= 0)
                return void ctx.error(`Invalid value. Please specify a value greater than 0.`);
            const newFilters = Object.assign(ctx.player.filters, { timescale: Object.assign(ctx.player.filters.timescale ?? {}, { speed: ctx.options.speed.value / 100 }) });
            if (newFilters.timescale?.speed === 1)
                delete newFilters.timescale.speed;
            if (!Object.keys(newFilters.timescale ?? {}).length)
                delete newFilters.timescale;
            ctx.player.setFilters(newFilters)
                .then(() => {
                ctx.embed
                    .color(Constants_1.Constants.SET_SFX_EMBED_COLOR)
                    .title(ctx.player.filters.timescale?.speed ? `Set the speed to \`${Math.round(ctx.player.filters.timescale.speed * 100)}%\`` : `Turned off the speed effect.`)
                    .send()
                    .catch((error) => {
                    discord_utils_1.logError(error);
                    void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
                });
            })
                .catch((error) => {
                discord_utils_1.logError(error);
                void ctx.error(`An unknown error occurred while setting SFX. Please submit an issue in our support server.`);
            });
        }
        else if (ctx.options.treble) {
            if (ctx.options.treble.value < 0)
                return void ctx.error(`Invalid value. Please specify a value greater than or equal to 0.`);
            const newFilters = Object.assign(ctx.player.filters, { equalizer: (ctx.player.filters.equalizer?.filter((v) => v.band < Constants_1.Constants.EQ_BAND_COUNT - 3) ?? []).concat(ctx.options.treble.value === 0
                    ? []
                    : new Array(3).fill(null).map((v, i) => ({
                        band: Constants_1.Constants.EQ_BAND_COUNT - (i + 1), gain: ctx.options.treble.value * Constants_1.Constants.TREBLE_INTENSITY_MULTIPLIER
                    }))) });
            if (!newFilters.equalizer?.length)
                delete newFilters.equalizer;
            ctx.player.setFilters(newFilters)
                .then(() => {
                ctx.embed
                    .color(Constants_1.Constants.SET_SFX_EMBED_COLOR)
                    .title(ctx.player.filters.equalizer?.find((v) => v.band === Constants_1.Constants.EQ_BAND_COUNT - 1) ? `Set the treble to \`+${Math.round((ctx.player.filters.equalizer?.find((v) => v.band === Constants_1.Constants.EQ_BAND_COUNT - 1)?.gain ?? 0) / Constants_1.Constants.TREBLE_INTENSITY_MULTIPLIER)}\`` : `Turned off the treble effect.`)
                    .send()
                    .catch((error) => {
                    discord_utils_1.logError(error);
                    void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
                });
            })
                .catch((error) => {
                discord_utils_1.logError(error);
                void ctx.error(`An unknown error occurred while setting SFX. Please submit an issue in our support server.`);
            });
        }
        else if (ctx.options.tremolo) {
            if (ctx.options.tremolo.value < 0)
                return void ctx.error(`Invalid value. Please specify a value greater than or equal to 0.`);
            if (ctx.options.tremolo.value > 100)
                return void ctx.error(`Invalid value. Please specify a value lower than or equal to 100.`);
            const newFilters = Object.assign(ctx.player.filters, { tremolo: {
                    depth: ctx.options.tremolo.value / 100, frequency: Constants_1.Constants.TREMOLO_VIBRATO_FREQUENCY
                } });
            if (newFilters.tremolo?.depth === 0)
                delete newFilters.tremolo;
            ctx.player.setFilters(newFilters)
                .then(() => {
                ctx.embed
                    .color(Constants_1.Constants.SET_SFX_EMBED_COLOR)
                    .title(newFilters.tremolo?.depth ? `Set the tremolo to \`${Math.round(newFilters.tremolo.depth * 100)}%\`` : `Turned off the tremolo effect.`)
                    .send()
                    .catch((error) => {
                    discord_utils_1.logError(error);
                    void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
                });
            })
                .catch((error) => {
                discord_utils_1.logError(error);
                void ctx.error(`An unknown error occurred while setting SFX. Please submit an issue in our support server.`);
            });
        }
        else if (ctx.options.vibrato) {
            if (ctx.options.vibrato.value < 0)
                return void ctx.error(`Invalid value. Please specify a value greater than or equal to 0.`);
            if (ctx.options.vibrato.value > 100)
                return void ctx.error(`Invalid value. Please specify a value lower than or equal to 100.`);
            const newFilters = Object.assign(ctx.player.filters, { vibrato: {
                    depth: ctx.options.vibrato.value / 100, frequency: Constants_1.Constants.TREMOLO_VIBRATO_FREQUENCY
                } });
            if (newFilters.vibrato?.depth === 0)
                delete newFilters.vibrato;
            ctx.player.setFilters(newFilters)
                .then(() => {
                ctx.embed
                    .color(Constants_1.Constants.SET_SFX_EMBED_COLOR)
                    .title(newFilters.vibrato?.depth ? `Set the vibrato to \`${Math.round(newFilters.vibrato.depth * 100)}%\`` : `Turned off the vibrato effect.`)
                    .send()
                    .catch((error) => {
                    discord_utils_1.logError(error);
                    void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
                });
            })
                .catch((error) => {
                discord_utils_1.logError(error);
                void ctx.error(`An unknown error occurred while setting SFX. Please submit an issue in our support server.`);
            });
        }
        else if (ctx.options.volume) {
            if (ctx.options.volume.value < 0)
                return void ctx.error(`Invalid value. Please specify a value greater than or equal to 0.`);
            if (ctx.options.volume.value > 1e3)
                return void ctx.error(`Invalid value. Please specify a value lower than or equal to 1000.`);
            ctx.player.setVolume(ctx.options.volume.value)
                .then(() => {
                ctx.embed
                    .color(Constants_1.Constants.SET_SFX_EMBED_COLOR)
                    .title(`Set the volume to \`${ctx.player.volume}%\``)
                    .send()
                    .catch((error) => {
                    discord_utils_1.logError(error);
                    void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
                });
            })
                .catch((error) => {
                discord_utils_1.logError(error);
                void ctx.error(`An unknown error occurred while setting the volume. Please submit an issue in our support server.`);
            });
        }
    }
};
