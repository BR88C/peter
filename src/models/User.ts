import { model, Schema } from 'mongoose';
import { Snowflake } from 'discord-rose';

const UserSchema: Schema = new Schema({
    /**
     * The User's ID.
     */
    id: String,
    /**
     * If the User is a premium User.
     */
    premium: Boolean,
    /**
     * The number of results to show a user from a search.
     * 0 will automatically pick the first result.
     */
    searchResults: Number
});

export const User = model(`User`, UserSchema);
