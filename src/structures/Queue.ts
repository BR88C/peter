import { Song } from './Song';

// Import modules.
import { Snowflake } from 'discord-api-types';

class Queue {
    /**
     * The ID of the text channel the queue is bound to.
     */
    public textID: Snowflake
    /**
     * The ID of the text channel the queue is bound to.
     */
    public voiceID: Snowflake
    /**
     * The ID of the guild the queue is bound to.
     */
    public guildID: Snowflake
    /**
     * The queue's songs.
     */
    public songs: Song[]
    /**
     * The current song playing, represented as an index of Queue#songs.
     */
    public playing: number


    /**
     * Creates a Queue.
     * @param textID The text channel ID to bind to.
     * @param voiceID The voice channel ID to bind to.
     * @param guildID The guild the queue is bound to.
     */
    constructor (textID: Snowflake, voiceID: Snowflake, guildID: Snowflake) {
        this.textID = textID;
        this.voiceID = voiceID;
        this.guildID = guildID;

        this.songs = [];
        this.playing = 0;
    }
}
