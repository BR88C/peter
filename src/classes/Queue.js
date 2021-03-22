const effectsString = require(`./functions/effectsString.js`);
const queueSong = require(`./functions/queueSong.js`);
const queuePlaylist = require(`./functions/queuePlaylist.js`);

/**
 * Queue Class - Creates a queue for a server and creates functions to modify the queue.
 *
 * @class
 */
class Queue {
    /**
     * Queue constructor.
     *
     * @param {Object} textChannel Text channel to bind the queue to.
     * @param {Object} voiceChannel Voice channel to bind the queue to.
     * @param {Object} connection Voice connection object.
     */
    constructor (textChannel, voiceChannel, connection) {
        this.textChannel = textChannel;
        this.channel = voiceChannel;
        this.connection = connection;
        this.bitrate = voiceChannel.bitrate / 1000 || 128;
        this.songs = [];
        this.currentSong = 0;
        this.volume = 100;
        this.playing = true;
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
            vibrato: 0
        };

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
        return effectsString(type, this);
    }
}

module.exports = Queue;
