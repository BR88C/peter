/* Song Class - Creates a song to be pushed to the queue based off of songInfo */

const time = require(`../utils/time.js`);
const getFormat = require(`./functions/getFormat.js`);

/* Song Class */
class Song {
    constructor (songInfo, messageAuthorTag) {
        this.title = songInfo.videoDetails.title.replace(/-|\*|_|\|/g, ` `);
        this.livestream = songInfo.videoDetails.isLiveContent;
        this.format = getFormat(songInfo);
        this.url = songInfo.videoDetails.video_url;
        this.thumbnail = songInfo.videoDetails.thumbnails.pop().url;
        this.timestamp = songInfo.videoDetails.isLiveContent ? `LIVE` : time(songInfo.videoDetails.lengthSeconds);
        this.rawTime = parseInt(songInfo.videoDetails.lengthSeconds);
        this.requestedBy = messageAuthorTag;
        this.hidden = false;
        this.startTime = 0;
    }
};

module.exports = Song;