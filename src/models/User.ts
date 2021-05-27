import {
    model, Schema
} from 'mongoose';

const UserSchema = new Schema({
    /**
     * The User's ID.
     */
    id: String,
    /**
     * If the User is a premium User.
     */
    premium: Boolean,
    /**
     * The User's search mode.
     * 0 = The first result of a search query is used.
     * 1 = The user is shown an empheral with the firt 5 results.
     * 2 = The user is shown an empheral with the first 10 results.
     */
    searchMode: Number
});

export const User = model(`User`, UserSchema);
