// Import modules.
/**
 * An array of presences for the bot to randomly use.
 * The interval at which the bot's presence is changed is set in config.js
 */
export const Presences: Array<{type: `playing` | `streaming` | `listening` | `watching` | `competing`, name: string, status: `online` | `dnd` | `idle` | `invisible` | `offline` }> = [
    {
        type: `watching`,
        name: `a kid's guide to the Internet`,
        status: `online`
    },
    {
        type: `listening`,
        name: `sick jams`,
        status: `online`
    },
    {
        type: `listening`,
        name: `smooth jazz`,
        status: `online`
    },
    {
        type: `listening`,
        name: `lofi hip hop radio - beats to relax/study to`,
        status: `online`
    },
    {
        type: `playing`,
        name: `/help`,
        status: `online`
    },
    {
        type: `playing`,
        name: `on the internet`,
        status: `online`
    },
    {
        type: `playing`,
        name: `lol watch this`,
        status: `online`
    }
];
