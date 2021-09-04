import Constants from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { Utils } from '@br88c/discord-utils';

export default {
    command: `pause`,
    mustHaveConnectedPlayer: true,
    mustHaveTracksInQueue: true,
    mustBePlaying: true,
    userMustBeInSameVC: true,
    interaction: {
        name: `pause`,
        description: `Pause the music.`
    },
    exec: (ctx) => {
        ctx.player!.pause()
            .then(() => {
                ctx.embed
                    .color(Constants.PAUSE_RESUME_EMBED_COLOR)
                    .title(`:pause_button:  Paused the music`)
                    .send()
                    .catch((error) => {
                        Utils.logError(error);
                        void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
                    });
            })
            .catch((error) => {
                Utils.logError(error);
                void ctx.error(`An unknown error occurred while pausing the music. Please submit an issue in our support server.`);
            });
    }
} as CommandOptions;
