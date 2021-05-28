import { PlaybackActivity } from './PlaybackActivity';
import { Song } from './Song';

// Import modules.
import { Snowflake } from 'discord-api-types';

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
    private readonly playbackActivity: PlaybackActivity | undefined

    /**
     * Creates a Queue.
     * @param textID The text channel ID to bind to.
     * @param voiceID The voice channel ID to bind to.
     * @param guildID The guild the queue is bound to.
     * @constructor
     */
    constructor (textID: Snowflake, voiceID: Snowflake, guildID: Snowflake) {
        this.textID = textID;
        this.voiceID = voiceID;
        this.guildID = guildID;

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

        let progress = this.playbackActivity.startPosition;
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

        let progress = this.songProgress;
        const completedSongs = this.songs.slice(0, this.playing);
        for (const song of completedSongs) progress += song.videoLength;
        return progress;
    }

    /**
     * The queue's total length in milliseconds.
     * This value is not scaled to the queue's speed.
     */
    public get queueLength (): number {
        let length = 0;
        for (const song of this.songs) length += song.videoLength;
        return length;
    }

    /**
     * Gets the time left in the queue or in the song currently playing.
     * @param type If queue or song time left should be retrieved. Defaults to queue.
     * @param includeSpeed If queue speed should be included in the estimation. If false, it returns the raw time left.
     * @returns The time left in milliseconds.
     */
    public getTimeLeft (type: `queue` | `song` = `queue`, includeSpeed: boolean = false): number {
        let timeLeft = 0;
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
}
