
import { cleanseMarkdown } from '../utils/Cleanse';
import { Format } from './Format';

// Import modules.
import { videoInfo } from 'ytdl-core';

/**
 * Song class - Used for creating song objects to be added to the queue.
 * @class
 */
export class Song {
    /**
     * The song's title.
     */
    public title: string
    /**
     * The song's URL.
     */
    public url: string
    /**
     * The video's thumbnail. Expressed as a URL.
     */
    public thumbnail: string | undefined
    /**
     * The song's length, in milliseconds.
     */
    public videoLength: number
    /**
     * If the song is a livestream.
     */
    public livestream: boolean
    /**
     * Available formats.
     */
    public formats: {
        /**
         * An opus encoded supported format.
         */
        opus: Format
        /**
         * An ffmpef supported format.
         */
        nonOpus: Format
    }

    /**
     * The tag of the person who requested the song.
     */
    public requestedBy: string

    /**
     * Song constructor.
     * @param songInfo Song info from ytdl-core.
     * @param messageAuthorTag Author of the song request.
     * @constructor
     */
    constructor (songInfo: videoInfo, messageAuthorTag: string) {
        this.title = cleanseMarkdown(songInfo.videoDetails.title);
        this.url = songInfo.videoDetails.video_url;
        this.thumbnail = songInfo.videoDetails.thumbnails.pop()?.url;
        this.videoLength = parseInt(songInfo.videoDetails.lengthSeconds) * 1e3;
        this.livestream = songInfo.videoDetails.isLiveContent;
        this.formats = {
            opus: new Format(songInfo.formats, this.videoLength, true, this.livestream),
            nonOpus: new Format(songInfo.formats, this.videoLength, false, this.livestream)
        };
        this.requestedBy = messageAuthorTag;
    }
}
