import { Constants } from '../../config/Constants';
import { ExtendedPlayer } from '../../managers/LavalinkManager';

// Import modules.
import { CommandOptions } from 'discord-rose';

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
        const player: ExtendedPlayer | undefined = ctx.worker.lavalink.players.get(ctx.interaction.guild_id) as any;
        if (!player) return void ctx.error(`Unable to change SFX; no music is playing.`);

        const foundVoiceState = ctx.worker.voiceStates.find((state) => state.guild_id === ctx.interaction.guild_id && state.users.has(ctx.interaction.member.user.id));
        if (!foundVoiceState || foundVoiceState.channel_id !== player.voiceChannel) return void ctx.error(`You must be in the VC to change SFX.`);

        if (ctx.options.bassboost) {
            if (ctx.options.bassboost.value < 0) return void ctx.error(`Invalid value. Please specify a value greater than or equal to 0.`);
            if (ctx.options.bassboost.value >= Constants.MAX_SAFE_JAVA_INTEGER) return void ctx.error(`Invalid value. Please specify a lower value.`);

            if (ctx.options.bassboost.value === 0) delete player.effects.bassboost;
            else player.effects.bassboost = ctx.options.bassboost.value;

            ctx.embed
                .color(Constants.SET_SFX_EMBED_COLOR)
                .title(player.effects.bassboost ? `Set the bassboost effect to \`+${player.effects.bassboost}\`` : `Turned off the bassboost effect.`)
                .send()
                .catch((error) => void ctx.error(error));
        } else if (ctx.options.clear) {
            player.effects = {};

            ctx.embed
                .color(Constants.SET_SFX_EMBED_COLOR)
                .title(`Cleared all effects`)
                .send()
                .catch((error) => void ctx.error(error));
        } else if (ctx.options.pitch) {
            if (ctx.options.pitch.value <= 0) return void ctx.error(`Invalid value. Please specify a value greater than 0.`);
            if (ctx.options.pitch.value >= Constants.MAX_SAFE_JAVA_INTEGER) return void ctx.error(`Invalid value. Please specify a lower value.`);

            if (ctx.options.pitch.value === 100) delete player.effects.pitch;
            else player.effects.pitch = ctx.options.pitch.value;

            ctx.embed
                .color(Constants.SET_SFX_EMBED_COLOR)
                .title(player.effects.pitch ? `Set the pitch to \`${player.effects.pitch}%\`` : `Turned off the pitch effect.`)
                .send()
                .catch((error) => void ctx.error(error));
        } else if (ctx.options.rotation) {
            if (ctx.options.rotation.value < 0) return void ctx.error(`Invalid value. Please specify a value greater than or equal to 0.`);
            if (ctx.options.rotation.value >= Constants.MAX_SAFE_JAVA_INTEGER) return void ctx.error(`Invalid value. Please specify a lower value.`);

            if (ctx.options.rotation.value === 0) delete player.effects.rotation;
            else player.effects.rotation = ctx.options.rotation.value;

            ctx.embed
                .color(Constants.SET_SFX_EMBED_COLOR)
                .title(player.effects.rotation ? `Set the rotation frequency to \`${player.effects.rotation} Hz\`` : `Turned off the rotation effect.`)
                .send()
                .catch((error) => void ctx.error(error));
        } else if (ctx.options.speed) {
            if (ctx.options.speed.value <= 0) return void ctx.error(`Invalid value. Please specify a value greater than 0.`);
            if (ctx.options.speed.value >= Constants.MAX_SAFE_JAVA_INTEGER) return void ctx.error(`Invalid value. Please specify a lower value.`);

            if (ctx.options.speed.value === 100) delete player.effects.speed;
            else player.effects.speed = ctx.options.speed.value;

            ctx.embed
                .color(Constants.SET_SFX_EMBED_COLOR)
                .title(player.effects.speed ? `Set the speed to \`${player.effects.speed}%\`` : `Turned off the speed effect.`)
                .send()
                .catch((error) => void ctx.error(error));
        } else if (ctx.options.treble) {
            if (ctx.options.treble.value < 0) return void ctx.error(`Invalid value. Please specify a value greater than or equal to 0.`);
            if (ctx.options.treble.value >= Constants.MAX_SAFE_JAVA_INTEGER) return void ctx.error(`Invalid value. Please specify a lower value.`);

            if (ctx.options.treble.value === 0) delete player.effects.treble;
            else player.effects.treble = ctx.options.treble.value;

            ctx.embed
                .color(Constants.SET_SFX_EMBED_COLOR)
                .title(player.effects.treble ? `Set the treble to \`+${player.effects.treble}\`` : `Turned off the treble effect.`)
                .send()
                .catch((error) => void ctx.error(error));
        } else if (ctx.options.tremolo) {
            if (ctx.options.tremolo.value < 0) return void ctx.error(`Invalid value. Please specify a value greater than or equal to 0.`);
            if (ctx.options.tremolo.value > 100) return void ctx.error(`Invalid value. Please specify a value lower than or equal to 100.`);

            if (ctx.options.tremolo.value === 0) delete player.effects.tremolo;
            else player.effects.tremolo = ctx.options.tremolo.value;

            ctx.embed
                .color(Constants.SET_SFX_EMBED_COLOR)
                .title(player.effects.tremelo ? `Set the tremolo to \`${player.effects.tremelo}%\`` : `Turned off the tremolo effect.`)
                .send()
                .catch((error) => void ctx.error(error));
        } else if (ctx.options.vibrato) {
            if (ctx.options.vibrato.value < 0) return void ctx.error(`Invalid value. Please specify a value greater than or equal to 0.`);
            if (ctx.options.vibrato.value > 100) return void ctx.error(`Invalid value. Please specify a value lower than or equal to 100.`);

            if (ctx.options.vibrato.value === 0) delete player.effects.vibrato;
            else player.effects.vibrato = ctx.options.vibrato.value;

            ctx.embed
                .color(Constants.SET_SFX_EMBED_COLOR)
                .title(player.effects.vibrato ? `Set the vibrato to \`${player.effects.vibrato}%\`` : `Turned off the vibrato effect.`)
                .send()
                .catch((error) => void ctx.error(error));
        } else if (ctx.options.volume) {
            if (ctx.options.volume.value < 0) return void ctx.error(`Invalid value. Please specify a value greater than or equal to 0.`);
            if (ctx.options.volume.value > 1000) return void ctx.error(`Invalid value. Please specify a value lower than or equal to 1000.`);

            player.setVolume(ctx.options.volume.value);

            ctx.embed
                .color(Constants.SET_SFX_EMBED_COLOR)
                .title(`Set the volume to \`${player.volume}%\``)
                .send()
                .catch((error) => void ctx.error(error));
        }

        const sendObj: { [key: string]: any } = {
            op: `filters`,
            guildId: ctx.interaction.guild_id
        };

        if (player.effects.bassboost) sendObj.equalizer = (sendObj.equalizer ?? []).concat(new Array(3).fill(null).map((value, i) => ({
            band: i, gain: player.effects.bassboost / 4
        })));
        if (player.effects.pitch) sendObj.timescale = Object.assign(sendObj.timescale ?? {}, { pitch: player.effects.pitch / 100 });
        if (player.effects.rotation) sendObj.rotation = { rotationHz: player.effects.rotation };
        if (player.effects.speed) sendObj.timescale = Object.assign(sendObj.timescale ?? {}, { speed: player.effects.speed / 100 });
        if (player.effects.treble) sendObj.equalizer = (sendObj.equalizer ?? []).concat(new Array(3).fill(null).map((value, i) => ({
            band: Constants.EQ_BAND_COUNT - (i + 1), gain: player.effects.treble / 4
        })));
        if (player.effects.tremolo) sendObj.tremolo = {
            frequency: Constants.TREMOLO_VIBRATO_FREQUENCY, depth: player.effects.tremolo / 100
        };
        if (player.effects.vibrato) sendObj.vibrato = {
            frequency: Constants.TREMOLO_VIBRATO_FREQUENCY, depth: player.effects.vibrato / 100
        };

        player.node.send(sendObj).catch(() => void ctx.error(`An unknown error occurred when setting SFX.`));
    }
} as CommandOptions;
