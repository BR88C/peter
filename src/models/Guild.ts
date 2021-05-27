import {
    model, Schema
} from 'mongoose';

const GuildSchema = new Schema({
    /**
     * The Guild's ID.
     */
    id: String,
    /**
     * If the Guild is a premium Guild.
     */
    premium: Boolean,
    /**
     * DJ role mode.
     * 0 = No DJ role, use normal behavior.
     * 1 = Non-DJs can only add songs, voteskip, and view the queue and the current song playing.
     * 2 = Non-DJs cannot do anything except view the queue and the current song playing.
     */
    DJMode: Number,
    /**
     * Song skip mode.
     * 0 = Normal skip. If DJMode is 1, non-DJs can only voteskip. If DJMode is 2, non-DJs cannot skip.
     * 1 = Voteskip is on always for non-DJs, even if DJMode is 0. DJs can still surpass voteskip.
     */
    skipMode: Number
});

export const Guild = model(`Guild`, GuildSchema);
