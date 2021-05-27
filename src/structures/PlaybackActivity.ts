/**
 * PlaybackActivity class - Used for determining the progress through a song, using PlaybackActivitySegments.
 * @class
 */
export class PlaybackActivity {
    /**
     * The starting position of the playback.
     */
    public startPosition: number
    /**
     * Playback segments.
     */
    public segments: PlaybackActivitySegment[]

    /**
     * Create a PlaybackActivity class for a song.
     * @param startPosition The song's starting position in milliseconds. Defaults to 0.
     */
    constructor (startPosition: number = 0) {
        this.startPosition = startPosition;
        this.segments = [];
    }

    /**
     * Add a segment.
     * @param queueSpeed The queue's speed during the segment.
     */
    public addSegment (queueSpeed: number): void {
        this.segments.push(new PlaybackActivitySegment(queueSpeed));
    }
}

/**
 * PlaybackActivitySegement class - Represents a segment of queue playback.
 * @class
 */
export class PlaybackActivitySegment {
    /**
     * When the playback segment started.
     */
    public startedAt: number
    /**
     * The queue's speed during the segment.
     */
    public speed: number

    /**
     * Creates a playback activity segment.
     * @param queueSpeed The queue's speed during the segment.
     * @constructor
     */
    constructor (queueSpeed: number) {
        this.startedAt = Date.now();
        this.speed = queueSpeed;
    }
}
