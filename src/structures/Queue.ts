import { PlaybackActivity } from './PlaybackActivity';
import { Song } from './Song';

// Import modules.
import { AudioPlayerStatus, createAudioPlayer, createAudioResource, DiscordGatewayAdapterImplementerMethods, DiscordGatewayAdapterLibraryMethods, entersState, joinVoiceChannel, StreamType, VoiceConnection, VoiceConnectionStatus } from '@discordjs/voice';
import { GatewayVoiceServerUpdateDispatchData, GatewayVoiceState, Snowflake } from 'discord-api-types';
import { Worker } from 'discord-rose';

/**
 * Queue class - Manages all music / audio for a guild.
 * @class
 */
export class Queue {
    /**
     * The ID of the text channel the queue is bound to.
     */
    public textID: Snowflake
    /**
     * The ID of the text channel the queue is bound to.
     */
    public voiceID: Snowflake
    /**
     * The ID of the guild the queue is bound to.
     */
    public guildID: Snowflake
    /**
     * The queue's voice connection.
     * This is undefined if the bot is not connected to a voice channel.
     */
    public connection: VoiceConnection | undefined

    /**
     * The queue's songs.
     */
    public songs: Song[]
    /**
     * The current song playing, represented as an index of Queue#songs.
     * This value is set to -1 if no songs are playing.
     */
    public playing: number
    /**
     * If the queue is paused.
     */
    public paused: boolean
    /**
     * If the music should be looped.
     */
    public loop: `off` | `queue` | `single`
    /**
     * If the queue should be played 24/7.
     */
    public twentyFourSeven: boolean

    /**
     * The queue's effects.
     */
    public effects: {
        /**
         * Bassboost.
         * Min = 0, Max = 100.
         * @default 0
         */
        bass: number
        /**
         * Flanger.
         * Min = 0, Max = 100.
         * @default 0
         */
        flanger: number
        /**
         * Highpass.
         * Min = 0, Max = 100.
         * @default 0
         */
        highpass: number
        /**
         * Lowpass.
         * Min = 0, Max = 100.
         * @default 0
         */
        lowpass: number
        /**
         * Phaser.
         * Min = 0, Max = 100.
         * @default 0
         */
        phaser: number
        /**
         * Pitch.
         * Min = 25, Max = 250.
         * @default 100
         */
        pitch: number
        /**
         * Speed.
         * Min = 50, Max = 500.
         * This effect is not applied on livestreams.
         * @default 100
         */
        speed: number
        /**
         * Treble.
         * Min = 0, Max = 100.
         * @default 0
         */
        treble: number
        /**
         * Vibrato.
         * Min = 0, Max = 100.
         * @default 0
         */
        vibrato: number
        /**
         * Volume.
         * Min = 0, Max = Number.MAX_SAFE_INTEGER
         * @default 100
         */
        volume: number
    }

    /**
     * Playback data.
     * Used for determining the progress through a song.
     * This is undefined if no song is playing.
     */
    private playbackActivity: PlaybackActivity | undefined
    /**
     * The Worker object the queue is spawned on.
     */
    private worker: Worker

    /**
     * Creates a Queue.
     * @param textID The text channel ID to bind to.
     * @param voiceID The voice channel ID to bind to.
     * @param guildID The guild the queue is bound to.
     * @param worker The Worker object the queue is being spawned on.
     * @constructor
     */
    constructor (textID: Snowflake, voiceID: Snowflake, guildID: Snowflake, worker: Worker) {
        this.textID = textID;
        this.voiceID = voiceID;
        this.guildID = guildID;
        this.connection = undefined;

        this.songs = [];
        this.playing = -1;
        this.paused = false;
        this.loop = `off`;
        this.twentyFourSeven = false;

        this.effects = {
            bass: 0,
            flanger: 0,
            highpass: 0,
            lowpass: 0,
            phaser: 0,
            pitch: 100,
            speed: 100,
            treble: 0,
            vibrato: 0,
            volume: 100
        };

        this.playbackActivity = undefined;
        this.worker = worker;
    }

    /**
     * The progress through a song.
     * Returns time in milliseconds. If a song is not playing, it returns 0.
     *
     * This is raw progress, meaning that the returned value is the time through the song, not scaled to the queue's speed.
     * For example, a returned value of 10,000 would represent that the song is at it's 10 second mark, NOT that it has been playing for 10 seconds.
     */
    public get songProgress (): number {
        if (!this.playbackActivity) return 0;

        let progress: number = this.playbackActivity.startPosition;
        if (this.playbackActivity.segments.length > 1) {
            for (let i = 1; i < this.playbackActivity.segments.length; i++) {
                progress += (this.playbackActivity.segments[i].startedAt - this.playbackActivity.segments[i - 1].startedAt) * (this.playbackActivity.segments[i - 1].speed / 100);
            }
        }
        progress += (Date.now() - this.playbackActivity.segments[this.playbackActivity.segments.length - 1].startedAt) * (this.effects.speed / 100);
        return progress;
    }

    /**
     * The progress through the queue.
     * Returns time in milliseconds. If no song is playing, it returns 0.
     *
     * This is raw progress, meaning that the returned value is the time through the queue, not scaled to the queue's speed.
     */
    public get queueProgress (): number {
        if (this.playing === -1) return 0;

        let progress: number = this.songProgress;
        const completedSongs: Song[] = this.songs.slice(0, this.playing);
        for (const song of completedSongs) progress += song.videoLength;
        return progress;
    }

    /**
     * The queue's total length in milliseconds.
     * This value is not scaled to the queue's speed.
     */
    public get queueLength (): number {
        let length: number = 0;
        for (const song of this.songs) length += song.videoLength;
        return length;
    }

    /**
     * FFMPEG arguments generated from Queue#effects.
     * Returns undefined if there are no active effects to be pushed to FFMPEG.
     */
    public get ffmpegArgs (): string | undefined {
        const activeEffects: string[] = [];
        if (this.effects.bass !== 0) activeEffects.push(`bass=g=${this.effects.bass / 2}`);
        if (this.effects.flanger !== 0) activeEffects.push(`flanger=depth=${this.effects.flanger / 10}`);
        if (this.effects.highpass !== 0) activeEffects.push(`highpass=f=${this.effects.highpass * 25}`);
        if (this.effects.lowpass !== 0) activeEffects.push(`lowpass=f=${2e3 - this.effects.lowpass * 16}`);
        if (this.effects.phaser !== 0) activeEffects.push(`aphaser=decay=${this.effects.phaser / 200}`);
        if (this.effects.pitch !== 100) activeEffects.push(`rubberband=pitch=${this.effects.pitch / 100}`);
        if (this.effects.speed !== 100 && !this.songs[this.playing].livestream) activeEffects.push(`atempo=${this.effects.speed / 100}`);
        if (this.effects.treble !== 0) activeEffects.push(`treble=g=${this.effects.treble / 3}`);
        if (this.effects.vibrato !== 0) activeEffects.push(`vibrato=d=${this.effects.vibrato / 100}`);
        return activeEffects.length > 0 ? activeEffects.join(`, `) : undefined;
    }

    /**
     * A pretty codeblock string generated from Queue#effects.
     */
    public get formattedEffectsString (): string {
        const activeEffects: string[] = [];
        if (this.effects.bass !== 0) activeEffects.push(`Bass = +${this.effects.bass}﹪`);
        if (this.effects.flanger !== 0) activeEffects.push(`Flanger = ${this.effects.flanger}﹪`);
        if (this.effects.lowpass !== 0) activeEffects.push(`Lowpass = +${this.effects.lowpass}﹪`);
        if (this.effects.highpass !== 0) activeEffects.push(`Highpass = +${this.effects.highpass}﹪`);
        if (this.effects.phaser !== 0) activeEffects.push(`Phaser = ${this.effects.phaser}﹪`);
        if (this.effects.pitch !== 100) activeEffects.push(`Pitch = ${this.effects.pitch}﹪`);
        if (this.effects.speed !== 100) activeEffects.push(`Speed = ${this.effects.speed}﹪`);
        if (this.effects.treble !== 0) activeEffects.push(`Treble = +${this.effects.treble}﹪`);
        if (this.effects.vibrato !== 0) activeEffects.push(`Vibrato = ${this.effects.vibrato}﹪`);
        if (this.effects.volume !== 100) activeEffects.push(`Volume = ${this.effects.volume}﹪`);
        return activeEffects.length > 0 ? `\`\`\`prolog\n${activeEffects.join(`, `)}\n\`\`\`` : `\`\`\`diff\n-= No Active effects =-\n\`\`\``;
    }

    /**
     * Gets the time left in the queue or in the song currently playing.
     * @param type If queue or song time left should be retrieved. Defaults to queue.
     * @param includeSpeed If queue speed should be included in the estimation. If false, it returns the raw time left.
     * @returns The time left in milliseconds.
     */
    public getTimeLeft (type: `queue` | `song` = `queue`, includeSpeed: boolean = false): number {
        let timeLeft: number = 0;
        if (type === `queue`) timeLeft = this.queueLength - this.queueProgress;
        else if (type === `song`) timeLeft = this.songs[this.playing].videoLength - this.songProgress;
        return timeLeft * (includeSpeed ? this.effects.speed / 100 : 1);
    }

    /**
     * Changes the speed of the queue, and adds a segment to the queue's playback activity.
     * @param newSpeed The new speed to set the queue to.
     */
    public changeSpeed (newSpeed: number): void {
        this.effects.speed = newSpeed;
        if (this.playbackActivity) this.playbackActivity.addSegment(newSpeed);
    }

    /**
     * Creates a connection to a voice channel.
     */
    public async createConnection (): Promise<void> {
        this.connection = joinVoiceChannel({
            channelId: this.voiceID,
            guildId: this.guildID,
            adapterCreator: (methods: DiscordGatewayAdapterLibraryMethods): DiscordGatewayAdapterImplementerMethods => {
                const voiceServerUpdate = (data: GatewayVoiceServerUpdateDispatchData): void => methods.onVoiceServerUpdate(data);
                const voiceStateUpdate = (data: GatewayVoiceState): void => methods.onVoiceStateUpdate(data);

                this.worker.on(`VOICE_SERVER_UPDATE`, voiceServerUpdate);
                this.worker.on(`VOICE_STATE_UPDATE`, voiceStateUpdate);

                return {
                    sendPayload: (data): void => {
                        // @ts-expect-error ws is a private property
                        return this.worker.guildShard(this.guildID).ws._send(data);
                    },
                    destroy: (): void => {
                        this.worker.off(`VOICE_SERVER_UPDATE`, voiceServerUpdate);
                        this.worker.off(`VOICE_STATE_UPDATE`, voiceStateUpdate);
                    }
                };
            }
        });

        try {
            await entersState(this.connection, VoiceConnectionStatus.Ready, 30e3);
        } catch (error) {
            this.connection.destroy();
            this.worker.log(`\x1b[31mError connecting to Voice Channel | Reason: ${JSON.stringify(error)} | Guild Name: ${this.worker.guilds.get(this.guildID)?.name} | Guild ID: ${this.guildID}`);
            throw new Error(`Error connecting to Voice Channel`);
        }
    }

    /**
     * Plays a song from the queue.
     * @param index The index of Queue#songs to play. This also sets Queue#playing. If it is undefined, it will play the next song based off of Queue#loop.
     */
    public async playSong (index?: number): Promise<void> {
        // --------------- TEMPORARY ---------------
        if (!this.connection) return;

        const resource = createAudioResource(`https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3`, { inputType: StreamType.Arbitrary });

        const player = createAudioPlayer();

        player.play(resource);

        await entersState(player, AudioPlayerStatus.Playing, 5e3).catch((error) => {
            this.worker.log(`\x1b[31mError playing audio | Reason: ${JSON.stringify(error)} | Guild Name: ${this.worker.guilds.get(this.guildID)?.name} | Guild ID: ${this.guildID}`);
            throw new Error(`Error playing music`);
        });
        this.connection?.subscribe(player);
    }
}
