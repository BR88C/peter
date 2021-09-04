"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultTokenArray = void 0;
exports.defaultTokenArray = [
    {
        token: process.env.SPOTIFY_ID ?? `%spotify_id%`, replacement: `%spotify_id%`
    },
    {
        token: process.env.SPOTIFY_SECRET ?? `%spotify_secret%`, replacement: `%spotify_secret%`
    },
    {
        token: process.env.TOPGG_TOKEN ?? `%topgg_token%`, replacement: `%topgg_token%`
    }
].concat(JSON.parse(process.env.LAVALINK_PASSWORDS ?? `[]`).map((password, i) => ({
    token: password, replacement: `%lavalink_password_${i}%`
})));
