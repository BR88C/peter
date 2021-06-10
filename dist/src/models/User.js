"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
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
exports.User = mongoose_1.model(`User`, UserSchema);
