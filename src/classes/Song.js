const time = require(`../utils/time.js`);
const cleanseMarkdown = require(`../utils/cleanseMarkdown.js`);
const formats = require(`./functions/formats.js`);

/**
 * Song classs - Used for creating song objects to be added to the queue.
 * @class
 */
class Song {
    /**
     * Song constructor.
     * @param {Object} songInfo Song info from ytdl-core.
     * @param {String} messageAuthorTag Author of the song request.
     * @constructor
     */
    constructor (songInfo, messageAuthorTag) {
        /**
         * The song's title.
         * @type {String}
         */
        this.title = cleanseMarkdown(songInfo.videoDetails.title);

        /**
         * The song's URL.
         * @type {String}
         */
        this.url = songInfo.videoDetails.video_url;

        /**
         * The video's thumbnail. Expressed as a URL.
         * @type {String}
         */
        this.thumbnail = songInfo.videoDetails.thumbnails.pop().url;

        /**
         * The song's length, in milliseconds.
         * @type {number}
         */
        this.videoLength = parseInt(songInfo.videoDetails.lengthSeconds) * 1000;

        /**
         * If the song is a livestream.
         * @type {boolean}
         */
        this.livestream = songInfo.videoDetails.isLiveContent;

        /**
         * The tag of the person who requested the song.
         * @type {String}
         */
        this.requestedBy = messageAuthorTag;

        /**
         * The itag for the song to be used when transcoding with demux.
         * This value is undefined if no supported format is found.
         * @type {String | undefined}
         */
        this.opusFormat = formats.getOpusFormat(songInfo);

        /**
         * The itag for the song to be used when transcoding with ffmpeg.
         * This value is undefined if no supported format is found.
         * @type {String | undefined}
         */
        this.ffmpegFormat = formats.getFFmpegFormat(songInfo);

        /**
         * The song's stream.
         * This value is set when the song is played and pushed to the voice dispatcher.
         * @type {Object}
         */
        this.stream = null;
        
        /**
         * The time for the song to start at, in milliseconds.
         * @type {String}
         */
        this.startTime = 0;

        /**
         * If the "now playing" embed should be hidden when playing the song.
         * @type {boolean}
         */
        this.hidden = false;
    }
}

module.exports = Song;
