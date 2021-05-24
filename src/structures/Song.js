const cleanseMarkdown = require(`../utils/cleanseMarkdown.js`);

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
         * If the "now playing" embed should be hidden when playing the song.
         * @type {boolean}
         */
        this.hidden = false;

        /**
         * Available formats.
         * @type {object[]}
         */
        this.formats = songInfo.formats;

        /**
         * The tag of the person who requested the song.
         * @type {string}
         */
        this.requestedBy = messageAuthorTag;
    }

    /**
     * Get the song's opus format, if it supports opus encoding.
     * @returns {string | undefined}
     */
    get opusFormat () {
        const formats = (this.livestream ? this.formats.filter((option) => option.isHLS) : this.formats)?.filter((option) =>
            this.videoLength !== 0 &&
            option.audioBitrate &&
            option.codecs === `opus` &&
            option.audioCodec === `opus` &&
            option.container === `webm` &&
            parseInt(option.audioSampleRate) === 48e3
        );
        if (formats?.length !== 0) return formats.sort((a, b) => b.audioBitrate - a.audioBitrate)[0].itag.toString();
        else return undefined;
    }

    /**
     * Get the song's ffmpeg format, if it supports ffmpeg encoding.
     * @returns {string | undefined}
     */
    get ffmpegFormat () {
        const formats = (this.livestream ? this.formats.filter((option) => option.isHLS) : this.formats)?.filter((option) => option.audioBitrate);
        const audioOnlyFormats = formats?.filter((option) => option.hasAudio && !option.hasVideo);
        if (audioOnlyFormats?.length !== 0) return audioOnlyFormats.sort((a, b) => b.audioBitrate - a.audioBitrate)[0].itag.toString();
        else if (formats?.length !== 0) return formats.sort((a, b) => b.audioBitrate - a.audioBitrate)[0].itag.toString();
        else return undefined;
    }
}

module.exports = Song;