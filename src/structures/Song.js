const cleanseMarkdown = require(`../utils/cleanseMarkdown.js`);
const Format = require(`./Format.js`);

/**
 * Song classs - Used for creating song objects to be added to the queue.
 * @class
 */
class Song {
    /**
     * Song constructor.
     * @param {object} songInfo Song info from ytdl-core.
     * @param {string} messageAuthorTag Author of the song request.
     * @constructor
     */
    constructor (songInfo, messageAuthorTag) {
        /**
         * The song's title.
         * @type {string}
         */
        this.title = cleanseMarkdown(songInfo.videoDetails.title);

        /**
         * The song's URL.
         * @type {string}
         */
        this.url = songInfo.videoDetails.video_url;

        /**
         * The video's thumbnail. Expressed as a URL.
         * @type {string}
         */
        this.thumbnail = songInfo.videoDetails.thumbnails.pop().url;

        /**
         * The song's length, in milliseconds.
         * @type {number}
         */
        this.videoLength = parseInt(songInfo.videoDetails.lengthSeconds) * 1e3;

        /**
         * If the song is a livestream.
         * @type {boolean}
         */
        this.livestream = songInfo.videoDetails.isLiveContent;

        /**
         * Available formats.
         * @type {object[]}
         */
        this.formats = {
            opus: new Format(songInfo.formats, this.videoLength, true, this.livestream),
            nonOpus: new Format(songInfo.formats, this.videoLength, false, this.livestream)
        }

        /**
         * The tag of the person who requested the song.
         * @type {string}
         */
        this.requestedBy = messageAuthorTag;
    }
}

module.exports = Song;