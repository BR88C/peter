/**
 * Format class - Used for creating a format to be used with the stream handler.
 * @class
 */
class Format {
    /**
     * Format constructor.
     * @param {object[]} availableFormats The available formats.
     * @param {number} videoLength The video length, in milliseconds.
     * @param {boolean} [opusEncoding] If the format should support only opus encoding.
     * @param {boolean} [livestreamSupport] If the format should support only livestreams.
     * @constructor
     */
    constructor (availableFormats, videoLength, opusEncoding = false, livestreamSupport = false) {
        availableFormats = availableFormats.filter((option) => option.audioBitrate)?.sort((a, b) => b.audioBitrate - a.audioBitrate);
        if (livestreamSupport) availableFormats = availableFormats?.filter((option) => option.isHLS);
        if (opusEncoding) availableFormats = availableFormats?.filter((option) => 
            videoLength !== 0 &&
            option.codecs === `opus` &&
            option.audioCodec === `opus` &&
            option.container === `webm` &&
            parseInt(option.audioSampleRate) === 48e3
        );
        const audioOnlyFormats = availableFormats?.filter((option) => option.hasAudio && !option.hasVideo);
        const format = audioOnlyFormats.length !== 0 ? audioOnlyFormats[0] : availableFormats[0];

        /**
         * The format's itag.
         * @type {string}
         */
        this.itag = format.itag.toString();

        /**
         * The format's bitrate.
         * @type {number}
         */
        this.bitrate = format.audioBitrate;

        /**
         * If the format supports only opus encoding.
         * @type {boolean}
         */
        this.opusEncoding = opusEncoding;

        /**
         * If the format supports only livestreams.
         * @type {boolean}
         */
        this.livestreamSupport = livestreamSupport;
    }
}

module.exports = Format;