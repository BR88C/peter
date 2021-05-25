
import { cleanseMarkdown } from '../Utils'
import { Format } from './Format'

// Import node modules.
import { videoInfo } from 'ytdl-core'

/**
 * Song classs - Used for creating song objects to be added to the queue.
 * @class
 */
export class Song {
    /**
     * The song's title.
     */
    title: string
    /**
     * The song's URL.
     */
    url: string
    /**
     * The video's thumbnail. Expressed as a URL.
     */
    thumbnail: string | undefined
    /**
     * The song's length, in milliseconds.
     */
    videoLength: number
    /**
     * If the song is a livestream.
     */
    livestream: boolean
    /**
     * Available formats.
     */
    formats: {
        /**
         * An opus encoded supported format.
         */
        opus: Format | undefined
        /**
         * An ffmpef supported format.
         */
        nonOpus: Format | undefined
    }

    /**
     * The tag of the person who requested the song.
     */
    requestedBy: string

    /**
     * Song constructor.
     * @param songInfo Song info from ytdl-core.
     * @param messageAuthorTag Author of the song request.
     * @constructor
     */
    constructor (songInfo: videoInfo, messageAuthorTag: string) {
        this.title = cleanseMarkdown(songInfo.videoDetails.title)
        this.url = songInfo.videoDetails.video_url
        this.thumbnail = songInfo.videoDetails.thumbnails.pop()?.url
        this.videoLength = parseInt(songInfo.videoDetails.lengthSeconds) * 1e3
        this.livestream = songInfo.videoDetails.isLiveContent
        this.formats = {
            opus: new Format(songInfo.formats, this.videoLength, true, this.livestream),
            nonOpus: new Format(songInfo.formats, this.videoLength, false, this.livestream)
        };
        this.requestedBy = messageAuthorTag
    }
}
