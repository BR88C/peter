import { Snowflake } from "discord-rose";

export interface UserDocument {
    /**
     * The User's ID.
     */
    id: Snowflake
    /**
     * If the User is a premium User.
     */
    premium: boolean
    /**
     * The number of results to show a user from a search.
     * 0 will automatically pick the first result.
     */
    searchResults: number
}
