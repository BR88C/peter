const ytdl = require(`discord-ytdl-core`);
const time = require(`../utils/time.js`);

const getFormat = (songInfo) => {
    let format;
    if (songInfo.videoDetails.isLive) {
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
};

class Song {
    constructor(songInfo, messageAuthor) {
        this.title = songInfo.videoDetails.title.replace(/-|\*|_|\|/g, ` `);
        this.livestream = songInfo.videoDetails.isLive;
        this.format = getFormat(songInfo);
        this.url = songInfo.videoDetails.video_url;
        this.thumbnail = songInfo.videoDetails.thumbnails.pop().url;
        this.timestamp = songInfo.videoDetails.isLive ? `LIVE` : time(songInfo.videoDetails.lengthSeconds);
        this.rawTime = parseInt(songInfo.videoDetails.lengthSeconds);
        this.requestedBy = messageAuthor;
        this.hidden = false;
        this.startTime = this.startTime;
    }
};

module.exports = Song;