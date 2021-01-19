/* Function to get video format */

const ytdl = require(`ytdl-core`);

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

module.exports = getFormat;