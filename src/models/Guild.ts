import { model, Schema } from 'mongoose';

const GuildSchema: Schema = new Schema({
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
    DJMode: Number
});

export const Guild = model(`Guild`, GuildSchema);
