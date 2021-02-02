/* Queue Class - Create a queue for a server and create functions to modify the queue */

const effectsArray = require(`./functions/effectsArray.js`);
const queueSong = require(`./functions/queueSong.js`);
const queuePlaylist = require(`./functions/queuePlaylist.js`);

class Queue {
    /**
     * Queue constructor
     * 
     * @param {Object} textChannel Text channel to bind the queue to
     * @param {Object} voiceChannel Voice channel to bind the queue to
     */
    constructor (textChannel, voiceChannel) {
        this.textChannel = textChannel;
        this.channel = voiceChannel;
        this.connection = null;
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
    }


    /**
     * Adds a song to the queue
     * 
     * @param {Object} song A song object
     * @param {Object} message The message that requested the song
     * @param {boolean} hidden If the queued song embed should be sent
     */
    queueSong (song, message, hidden) {
        queueSong(song, message, hidden, this);
    }


    /**
     * Adds songs within a playlist to the queue
     * 
     * @param {Object} playlist Playlist object from ytpl to queue
     * @param {Object} message The message that requested the playlist
     */
    queuePlaylist (playlist, message) {
        queuePlaylist(playlist, message, this);
    }


    /**
     * Generates a string based off of active effects
     * 
     * @param {string} type The type of array to request
     * @returns {string} The generated effects string based on type
     */
    effectsArray (type) {
        return effectsArray(type, this);
    }
};

module.exports = Queue;