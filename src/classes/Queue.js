/* Queue Class - Create a queue for a server and create functions to modify the queue */

const effectsArray = require(`./functions/effectsArray.js`);
const queueSong = require(`./functions/queueSong.js`);
const queuePlaylist = require(`./functions/queuePlaylist.js`);

class Queue {
    constructor(textChannel, voiceChannel) {
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

    queueSong(song, message) {
        queueSong(song, message, this);
    }

    queuePlaylist(playlist, message) {
        queuePlaylist(playlist, message, this);
    }

    effectsArray(type) {
        return effectsArray(type, this);
    }
};

module.exports = Queue;