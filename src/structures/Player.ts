import { checkEnvHeaders, getEnvHeaders } from '../utils/Headers';
import { PlaybackActivity } from './PlaybackActivity';
import { Queue } from './Queue';
import { Song } from './Song';

// Import modules.
import { AudioPlayer, AudioPlayerStatus, AudioResource, createAudioPlayer, createAudioResource, DiscordGatewayAdapterImplementerMethods, DiscordGatewayAdapterLibraryMethods, entersState, joinVoiceChannel, StreamType, VoiceConnection, VoiceConnectionStatus } from '@discordjs/voice';
import { CommandError } from 'discord-rose';
import { FFmpeg, opus } from 'prism-media';
import { GatewayVoiceServerUpdateDispatchData, GatewayVoiceState } from 'discord-api-types';
import { pipeline, Readable } from 'stream';
import ytdl from 'ytdl-core';

/**
 * Player class - manages the bot's connection, as well as the audio player and audio streams.
 * @class
 */
export class Player {
    /**
     * The player's voice connection.
     * this.queue is undefined if the bot is not connected to a voice channel.
     */
    public connection: VoiceConnection | undefined

    /**
     * The player's streams.
     */
    public streams: {
        /**
         * The ytdl read stream.
         */
        ytdl: Readable | undefined
        /**
         * The pipeline stream.
         */
        pipeline: any
        /**
         * The resource to use with Queue#streams#player.
         */
        playerResource: AudioResource | undefined
        /**
         * The AudioPlayer.
         */
        player: AudioPlayer | undefined
    }

    /**
     * The queue the player is bound to.
     */
    public queue: Queue

    /**
     * Create a player class.
     * this.queue does not initialize a connection.
     * @constructor
     */
    constructor (queue: Queue) {
        this.queue = queue;
    }

    /**
     * Creates a connection to a voice channel.
     * @returns A promise that resolves once the bot is connected to the VC.
     */
    public async createConnection (): Promise<void> {
        this.connection = joinVoiceChannel({
            channelId: this.queue.voiceID,
            guildId: this.queue.guildID,
            selfDeaf: true,
            adapterCreator: (methods: DiscordGatewayAdapterLibraryMethods): DiscordGatewayAdapterImplementerMethods => {
                const voiceServerUpdate = (data: GatewayVoiceServerUpdateDispatchData): void => methods.onVoiceServerUpdate(data);
                const voiceStateUpdate = (data: GatewayVoiceState): void => methods.onVoiceStateUpdate(data);

                this.queue.worker.on(`VOICE_SERVER_UPDATE`, voiceServerUpdate);
                this.queue.worker.on(`VOICE_STATE_UPDATE`, voiceStateUpdate);

                return {
                    sendPayload: (data): void => {
                        // @ts-expect-error ws is a private property
                        return this.queue.worker.guildShard(this.queue.guildID).ws._send(data);
                    },
                    destroy: (): void => {
                        this.queue.worker.off(`VOICE_SERVER_UPDATE`, voiceServerUpdate);
                        this.queue.worker.off(`VOICE_STATE_UPDATE`, voiceStateUpdate);
                    }
                };
            }
        });

        try {
            await entersState(this.connection, VoiceConnectionStatus.Ready, 30e3);
            this.queue.worker.log(`\x1b[32mConnected to Voice Channel | Channel ID: ${this.queue.voiceID} | Guild Name: ${this.queue.worker.guilds.get(this.queue.guildID)?.name} | Guild ID: ${this.queue.guildID}`);
            return;
        } catch (error) {
            this.connection.destroy();
            console.log(`\x1b[31m`);
            console.error(error);
            console.log(`\x1b[37m`);
            throw new CommandError(`Error connecting to Voice Channel.`);
        }
    }

    /**
     * Plays a song from the player's queue.
     * @param index The index of Player#queue#songs to play. this.queue also sets Player#queue#playing. If it is undefined, it will play Player#queue#playing.
     * @param startingPosition The position to start at in milliseconds. Does not scale to speed.
     * @returns A promise that resolves once the song has started playing.
     */
    public async playSong (index?: number, startingPosition: number = 0): Promise<void> {
        try {
            if (!this.connection) throw new CommandError(`Internal failure: The bot is not connected to a Voice Channel.`);

            let song: Song;
            if (typeof index === `number`) song = this.queue.songs[index];
            else song = this.queue.songs[this.queue.playing];
            if (!song) throw new CommandError(`Internal failure: No song available to play.`);

            if (startingPosition < 0 || startingPosition > song.videoLength) throw new CommandError(`Internal failure: Invalid song starting position.`);

            const useOpus: boolean = !startingPosition && !!song.formats.opus.itag && !this.queue.ffmpegArgs;

            this.streams.ytdl = ytdl(song.url, {
                highWaterMark: 1 << 19,
                quality: useOpus ? song.formats.opus.itag : song.formats.nonOpus.itag,
                requestOptions: checkEnvHeaders() ? { headers: getEnvHeaders() } : undefined
            });

            if (useOpus) {
                this.streams.pipeline = pipeline([this.streams.ytdl, new opus.WebmDemuxer()], (error) => {
                    if (!error) return;
                    this.cleanupStreams();
                    if (error.message !== `Premature close`) throw Object.assign(new CommandError(`Internal error: ${error?.message.replace(`Error: `, ``)}`), { nonFatal: false });
                });
            } else {
                const ffmpegTranscoder: FFmpeg = new FFmpeg({
                    args: [
                        `-ss`, (Math.round(startingPosition / 1e3)).toString(),
                        `-analyzeduration`, `0`,
                        `-loglevel`, `0`,
                        `-f`, `s16le`,
                        `-ar`, `48000`,
                        `-ac`, `2`
                    ].concat(this.queue.ffmpegArgs ? [`-af`, this.queue.ffmpegArgs] : []),
                    shell: false
                });

                const opusTranscoder: opus.Encoder = new opus.Encoder({
                    rate: 48e3,
                    channels: 2,
                    frameSize: 960
                });

                this.streams.pipeline = pipeline(this.streams.ytdl, ffmpegTranscoder, opusTranscoder, (error) => {
                    if (!error) return;
                    this.cleanupStreams();
                    if (ffmpegTranscoder && typeof ffmpegTranscoder.destroy === `function`) ffmpegTranscoder.destroy();
                    if (opusTranscoder && typeof opusTranscoder.destroy === `function`) opusTranscoder.destroy();
                    if (error.message !== `Premature close`) throw Object.assign(new CommandError(`Internal error: ${error?.message.replace(`Error: `, ``)}`), { nonFatal: false });
                });
            }

            this.streams.playerResource = createAudioResource(this.streams.pipeline, {
                inputType: StreamType.Opus, inlineVolume: false
            });
            const player = createAudioPlayer();
            this.streams.playerResource.playStream.once(`readable`, () => {
                player.play(this.streams.playerResource as AudioResource);
                entersState(player, AudioPlayerStatus.Playing, 5e3).then((audioPlayer) => {
                    if (!this.connection) throw new CommandError(`Internal failure: The bot is not connected to a Voice Channel.`);
                    this.connection.subscribe(audioPlayer);
                    this.queue.playbackActivity = new PlaybackActivity(startingPosition);
                }).catch((error) => { throw new CommandError(error); });
            });
        } catch (error) {
            void this.queue.sendErrorEmbed(error);
        }
    }

    /**
     * Cleans up all of the player's streams.
     */
    cleanupStreams (): void {
        if (typeof this.streams.player?.stop === `function`) this.streams.player.stop();
        if (typeof this.streams.playerResource?.playStream?.destroy === `function`) this.streams.playerResource.playStream.destroy();
        if (typeof this.streams.pipeline?.destroy === `function`) this.streams.pipeline.destroy();
        if (typeof this.streams.ytdl?.destroy === `function`) this.streams.ytdl.destroy();
    }
}
