// Import modules.
import { Presence } from '@br88c/discord-utils';

/**
 * An array of presences for the bot to randomly use.
 * The interval at which the bot's presence is changed is set in config.js.
 */
export default [
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
] as Presence[];
