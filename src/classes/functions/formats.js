/**
 * Checks if a format supports livestreams.
 * @param {Object} format The format to check.
 * @returns {boolean} If the format has livestream support.
 */
const liveFilter = (format) => format.isHLS;

/**
 * Check if a provided format has opus encoding.
 * @param {Object} format The format to check.
 * @returns {boolean} If the format is an opus / webm stream.
 */
const opusFilter = (format) => format.codecs === `opus` && format.audioCodec === `opus` && format.container === `webm` && format.audioSampleRate == 48000;

/**
 * Checks if a format is supported (Checks if audio bitrate is defined, and if it's HLS if it's a livestream).
 * @param {Object} format The format to check.
 * @returns {boolean} If the format is supported.
 */
const supportedStreamFilter = (format) => format.audioBitrate;

/**
 * Checks if a format is audio only.
 * @param {Object} format The format to check.
 * @returns {boolean} If the format is audio only.@param {Object} format The format to check.
 * @returns {boolean} If the format is an opus / webm stream.
 */
const audioOnlyFilter = (format) => !format.hasVideo && format.hasAudio;

/**
 * Gets a format with the best audio bitrate from an array of formats.
 * @param {Object[]} formats The formats to search through.
 * @returns {Object} The best format in terms of audio bitrate.
 */
const bestBitrate = (formats) => formats.sort((a, b) => b.audioBitrate - a.audioBitrate)[0];

/**
 * Checks if a song can be used with webm demuxer, which omits ffmpeg encoding.
 * @param {Object} songInfo Song info from ytdl-core.
 * @returns {boolean} If the song can be demuxed.
 */
const canDemux = (songInfo) => songInfo.formats.filter(supportedStreamFilter)?.find(opusFilter) && songInfo.videoDetails.lengthSeconds !== 0;

/**
 * Returns the opus format for a song.
 * @param {Object} songInfo Song info from ytdl-core.
 * @returns {String | undefined} The found format itag, or undefined if the stream cannot be demuxed.
 */
const getOpusFormat = (songInfo) => {
    const formats = songInfo.videoDetails.isLiveContent ? songInfo.formats.filter(liveFilter) : songInfo.formats;
    const format = formats?.filter(supportedStreamFilter)?.filter(opusFilter);
    if (!format) return undefined;
    if (canDemux(songInfo)) return bestBitrate(format)?.itag.toString();
    else return undefined;
};

/**
 * Gets a forat for a song for ffmpeg.
 * @param {Object} songInfo Song info from ytdl-core.
 * @returns {String | undefined} The found format itag, or undefined if no compatable streams are found.
 */
const getFFmpegFormat = (songInfo) => {
    const formats = songInfo.videoDetails.isLiveContent ? songInfo.formats.filter(liveFilter) : songInfo.formats;
    let format = formats?.filter(supportedStreamFilter)?.filter(audioOnlyFilter);
    if (!format) format = songInfo.formats.filter(supportedStreamFilter);
    if (!format) return undefined;
    else return bestBitrate(format)?.itag.toString();
};

module.exports = {
    liveFilter,
    opusFilter,
    supportedStreamFilter,
    audioOnlyFilter,
    bestBitrate,
    canDemux,
    getOpusFormat,
    getFFmpegFormat
};
