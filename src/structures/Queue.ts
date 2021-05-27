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
         * Default = 0.
         * Min = 0, Max = 100.
         */
        bass: number
        /**
         * Flanger.
         * Default = 0.
         * Min = 0, Max = 100.
         */
        flanger: number
        /**
         * Highpass.
         * Default = 0.
         * Min = 0, Max = 100.
         */
        highpass: number
        /**
         * Lowpass.
         * Default = 0.
         * Min = 0, Max = 100.
         */
        lowpass: number
        /**
         * Phaser.
         * Default = 0.
         * Min = 0, Max = 100.
         */
        phaser: number
        /**
         * Pitch.
         * Default = 100.
         * Min = 25, Max = 250.
         */
        pitch: number
        /**
         * Speed.
         * Default = 100.
         * Min = 50, Max = 500.
         * This effect is not applied on livestreams.
         */
        speed: number
        /**
         * Treble.
         * Default = 0.
         * Min = 0, Max = 100.
         */
        treble: number
        /**
         * Vibrato.
         * Default = 0.
         * Min = 0, Max = 100.
         */
        vibrato: number
        /**
         * Volume.
         * Default = 100.
         * Min = 0, Max = Number.MAX_SAFE_INTEGER
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
     * Changes the speed of the queue, and adds a segment to the queue's playback activity.
     * @param newSpeed The new speed to set the queue to.
     */
    public changeSpeed (newSpeed: number): void {
        this.effects.speed = newSpeed;
        if (this.playbackActivity) this.playbackActivity.addSegment(newSpeed);
    }
}
