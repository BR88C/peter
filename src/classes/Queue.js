const queueSong = require(`./functions/queueSong.js`);
const queuePlaylist = require(`./functions/queuePlaylist.js`);

/**
 * Queue Class - Creates a queue for a server and creates functions to modify the queue.
 * @class
 */
class Queue {
    /**
     * Queue constructor.
     * @param {Object} textChannel Text channel to bind the queue to.
     * @param {Object} voiceChannel Voice channel to bind the queue to.
     * @param {Object} connection Voice connection object.
     * @constructor
     */
    constructor (textChannel, voiceChannel, connection) {
        /**
         * The text channel the queue is bound to.
         * @type {Object}
         */
        this.textChannel = textChannel;

        /**
         * The voice channel the queue is bound to.
         * @type {Object}
         */
        this.voiceChannel = voiceChannel;

        /**
         * The queue's voice connection.
         */
        this.connection = connection;

        /**
         * The bitrate the queue uses.
         * This is the bitrate of Queue#voiceChannel, or 128 if the bitrate cannot be found.
         * @type {number}
         */
        this.bitrate = this.voiceChannel.bitrate / 1e3 || 128;

        /**
         * If the queue is playing.
         * @type {boolean}
         */
        this.playing = true;

        /**
         * If the queue is being looped.
         * This value is either "off", "single", or "queue".
         * @type {String}
         */
        this.loop = `off`;

        /**
         * If the queue is 24/7.
         * @type {boolean}
         */
        this.twentyFourSeven = false;

        /**
         * SFX to be applied to the queue.
         * These values are the default values.
         * @type {Object}
         */
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

        /**
         * The queue's songs.
         * @type {Object[]}
         */
        this.songs = [];

        /**
         * The current song playing, represented as an index of the Queue#songs array.
         * @type {number}
         */
        this.currentSong = 0;

        // Make sure all streams are closed on a disconnect.
        this.connection.on(`disconnect`, () => {
            for (const song of this.songs) {
                if (song.stream) {
                    if (typeof song.stream.destroy === `function`) song.stream.destroy();
                    song.stream = null;
                }
            }
        });
    }

    /**
     * Adds a song to the queue.
     *
     * @param {Object} song A song object.
     * @param {Object} message The message that requested the song.
     * @param {boolean} hidden If the queued song embed should be sent.
     * @returns {Void} Void.
     */
    queueSong (song, message, hidden) {
        queueSong(song, message, hidden, this);
    }

    /**
     * Adds songs within a playlist to the queue.
     *
     * @param {Object} playlist Playlist object from ytpl to queue.
     * @param {Object} message The message that requested the playlist.
     * @returns {Void} Void.
     */
    queuePlaylist (playlist, message) {
        queuePlaylist(playlist, message, this);
    }

    /**
     * Generates a string based off of active effects.
     *
     * @param {String} type The type of string to request (ffmpeg, formatted).
     * @returns {String} The generated effects string based on type.
     */
    effectsString (type) {
        let activeEffects = [];

        if (type === `ffmpeg`) {
            if (this.effects.bass !== 0) activeEffects.push(`bass=g=${this.effects.bass / 2}`);
            if (this.effects.flanger !== 0) activeEffects.push(`flanger=depth=${this.effects.flanger / 10}`);
            if (this.effects.highpass !== 0) activeEffects.push(`highpass=f=${this.effects.highpass * 25}`);
            if (this.effects.lowpass !== 0) activeEffects.push(`lowpass=f=${2e3 - this.effects.lowpass * 16}`);
            if (this.effects.phaser !== 0) activeEffects.push(`aphaser=decay=${this.effects.phaser / 200}`);
            if (this.effects.pitch !== 100) activeEffects.push(`rubberband=pitch=${this.effects.pitch / 100}`);
            if (this.effects.speed !== 100 && !this.songs[this.currentSong].livestream) activeEffects.push(`atempo=${this.effects.speed / 100}`);
            if (this.effects.treble !== 0) activeEffects.push(`treble=g=${this.effects.treble / 3}`);
            if (this.effects.vibrato !== 0) activeEffects.push(`vibrato=d=${this.effects.vibrato / 100}`);
            activeEffects = activeEffects.join(`, `);
        } else if (type === `formatted`) {
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
            activeEffects = activeEffects[0] ? `\`\`\`prolog\n${activeEffects.join(`, `)}\n\`\`\`` : `\`\`\`diff\n-= No Active effects =-\n\`\`\``;
        } else {
            throw new Error(`Invalid effects array type`);
        }

        return activeEffects;
    }
}

module.exports = Queue;
