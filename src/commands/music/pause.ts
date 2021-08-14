import { Constants } from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { logError } from '@br88c/discord-utils';

export default {
    command: `pause`,
    allowButton: true,
    mustHaveConnectedPlayer: true,
    mustHaveTracksInQueue: true,
    mustBePlaying: true,
    userMustBeInSameVC: true,
    interaction: {
        name: `pause`,
        description: `Pause the music.`
    },
    exec: async (ctx) => {
        await ctx.player!.pause();

        ctx.embed
            .color(Constants.PAUSE_RESUME_EMBED_COLOR)
            .title(`:pause_button:  Paused the music`)
            .send()
            .catch((error) => {
                logError(error);
                void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
            });
    }
} as CommandOptions;
