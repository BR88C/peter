const time = require(`../utils/time.js`);
const cleanseMarkdown = require(`../utils/cleanseMarkdown.js`);
const formats = require(`./functions/formats.js`);

/**
 * Song classs - Used for creating song objects to be added to the queue.
 *
 * @class
 */
class Song {
    /**
     * Song constructor.
     *
     * @param {Object} songInfo Song info from ytdl-core.
     * @param {String} messageAuthorTag Author of the song request.
     */
    constructor (songInfo, messageAuthorTag) {
        this.title = cleanseMarkdown(songInfo.videoDetails.title);
        this.livestream = songInfo.videoDetails.isLiveContent;
        this.opusFormat = formats.getOpusFormat(songInfo);
        this.ffmpegFormat = formats.getFFmpegFormat(songInfo);
        this.url = songInfo.videoDetails.video_url;
        this.thumbnail = songInfo.videoDetails.thumbnails.pop().url;
        this.timestamp = songInfo.videoDetails.isLiveContent ? `LIVE` : time(songInfo.videoDetails.lengthSeconds);
        this.rawTime = parseInt(songInfo.videoDetails.lengthSeconds);
        this.requestedBy = messageAuthorTag;
        this.hidden = false;
        this.startTime = 0;
        this.stream = null;
    }
}

module.exports = Song;
