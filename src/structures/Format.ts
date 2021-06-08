// Import modules.
import { videoFormat } from 'ytdl-core';

/**
 * Format class - Used for creating a format to be used with the stream handler.
 * @class
 */
export class Format {
    /**
     * The format's itag.
     */
    public readonly itag: string | undefined
    /**
     * The format's bitrate.
     */
    public readonly bitrate: number | undefined
    /**
     * If the format supports only opus encoding.
     */
    public readonly opusEncoding: boolean | undefined
    /**
     * If the format supports only livestreams.
     */
    public readonly livestreamSupport: boolean | undefined

    /**
     * Format constructor.
     * @param availableFormats The available formats.
     * @param videoLength The video length, in milliseconds.
     * @param opusEncoding If the format should support only opus encoding.
     * @param livestreamSupport If the format should support only livestreams.
     * @constructor
     */
    constructor (availableFormats: videoFormat[], videoLength: number, opusEncoding: boolean = false, livestreamSupport: boolean = false) {
        availableFormats = availableFormats.filter((option) => option.audioBitrate)?.sort((a, b) => (b.audioBitrate ?? 0) - (a.audioBitrate ?? 0));
        if (livestreamSupport) availableFormats = availableFormats?.filter((option) => option.isHLS);
        if (opusEncoding) availableFormats = availableFormats?.filter((option) =>
            videoLength !== 0 &&
            option.codecs === `opus` &&
            option.audioCodec === `opus` &&
            option.container === `webm` &&
            parseInt(option.audioSampleRate ?? `0`) === 48e3
        );
        const audioOnlyFormats: videoFormat[] | undefined = availableFormats?.filter((option) => option.hasAudio && !option.hasVideo);
        const format: videoFormat | undefined = audioOnlyFormats.length !== 0 ? audioOnlyFormats[0] : (availableFormats.length !== 0 ? availableFormats[0] : undefined);

        if (format != null) {
            this.itag = format.itag.toString();
            this.bitrate = format.audioBitrate;
            this.opusEncoding = opusEncoding;
            this.livestreamSupport = livestreamSupport;
        }
    }
};
