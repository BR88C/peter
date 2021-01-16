/* Song Class - Creates a song to be pushed to the queue based off of songInfo */

const ytdl = require(`discord-ytdl-core`);
const time = require(`../utils/time.js`);

/* Function to get video format */
const getFormat = (songInfo) => {
    let format;
    if (songInfo.videoDetails.isLiveContent) {
        format = ytdl.chooseFormat(songInfo.formats, {
            isHLS: true
        }).itag.toString();
    } else {
        format = ytdl.filterFormats(songInfo.formats, `audioonly`);
        if (!format[0]) format = songInfo.formats;
        if (!format[0]) return;
        format = ytdl.chooseFormat(format, {
            quality: `highestaudio`
        }).itag.toString();
    }
    return format;
};

/* Song Class */
class Song {
    constructor(songInfo, messageAuthorTag) {
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