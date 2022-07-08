"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenFilters = void 0;
function tokenFilters(...additional) {
    return [
        {
            token: process.env.BOT_TOKEN,
            replacement: `%bot_token%`
        },
        {
            token: process.env.LAVALINK_PASSWORD,
            replacement: `%lavalink_password%`
        }
    ].concat(...additional);
}
exports.tokenFilters = tokenFilters;
