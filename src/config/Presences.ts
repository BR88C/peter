// Import modules.
/**
 * An array of presences for the bot to randomly use.
 * The interval at which the bot's presence is changed is set in config.js
 */
export const Presences: Array<{type: `playing` | `streaming` | `listening` | `watching` | `competing`, name: string, status: `online` | `dnd` | `idle` | `invisible` | `offline` }> = [
    {
        type: `playing`,
        name: `with new Slash Commands!`,
        status: `online`
    },
    {
        type: `playing`,
        name: `/help`,
        status: `online`
    },
    {
        type: `playing`,
        name: `peters.guidetothe.net`,
        status: `online`
    }
];
