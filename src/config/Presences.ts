// Import modules.
import { PresenceUpdateStatus } from 'discord-api-types';

/**
 * An array of presences for the bot to randomly use.
 * The interval at which the bot's presence is changed is set in config.js
 */
export const Presences: Array<{type: `playing` | `streaming` | `listening` | `watching` | `competing`, name: string, status: PresenceUpdateStatus }> = [
    {
        type: `watching`,
        name: `a kid's guide to the Internet`,
        status: `online` as PresenceUpdateStatus
    },
    {
        type: `listening`,
        name: `sick jams`,
        status: `online` as PresenceUpdateStatus
    },
    {
        type: `listening`,
        name: `smooth jazz`,
        status: `online` as PresenceUpdateStatus
    },
    {
        type: `listening`,
        name: `lofi hip hop radio - beats to relax/study to`,
        status: `online` as PresenceUpdateStatus
    },
    {
        type: `playing`,
        name: `/help`,
        status: `online` as PresenceUpdateStatus
    },
    {
        type: `playing`,
        name: `on the internet`,
        status: `online` as PresenceUpdateStatus
    },
    {
        type: `playing`,
        name: `lol watch this`,
        status: `online` as PresenceUpdateStatus
    }
];
