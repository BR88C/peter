/* Song Class - Creates a song to be pushed to the queue based off of songInfo */

const time = require(`../utils/time.js`);
const cleanseMarkdown = require(`../utils/cleanseMarkdown.js`);
const getFormat = require(`./functions/getFormat.js`);

/* Song Class */
class Song {
    /**
     * Song constructor
     *
     * @param {Object} songInfo Song info from ytdl-core
     * @param {String} messageAuthorTag Author of the song request
     */
    constructor (songInfo, messageAuthorTag) {
        this.title = cleanseMarkdown(songInfo.videoDetails.title);
        this.livestream = songInfo.videoDetails.isLiveContent;
        this.format = getFormat(songInfo);
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
