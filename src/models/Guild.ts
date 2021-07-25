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
     * DJ permissions.
     */
    DJMode: Number
});

export const Guild = model(`Guild`, GuildSchema);
