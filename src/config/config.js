/**
 * General bot configuration.
 */
const config = {
    // The bot's prefix.
    prefix: `sudo`,

    // Bot developers. Used for specifying developers in commands (Help, Bot info), and for running dev only commands.
    devs: {
        ids: [`342275771546599425`],
        tags: [`BR88C#0001`]
    },

    // Links for the bot to reference.
    links: {
        invite: `https://discord.com/oauth2/authorize?client_id=744694015630245949&scope=bot%20applications.commands&permissions=271969350`,
        supportServer: `https://discord.com/invite/E2JsYPPJYN`,
        voteLink: `https://top.gg/bot/744694015630245949/vote`,
        website: `https://peter.badfirmware.com`
    },

    // The guild to fetch emojis from.
    emojiGuild: `738892660663910450`,

    // IDs for emojis the bot uses.
    emojis: {
        textChannel: `788413778709708812`,
        voiceChannel: `788412557446479923`,
        loading: `822168469855928392`,
        notes: `788424688744923166`,
        conga: `778810372177920000`,
        catjam: `815301819281965066`,
        pepedance: `815301786977435678`,
        pepejam: `815301802891149362`,
        peepojam: `815301774256766976`
    },

    // MongoDB config, fetched from src/config/mongoConfig.js
    mongoConfig: require(`./mongoConfig.js`)
};

module.exports = config;
