import Constants from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { Utils } from '@br88c/discord-utils';

export default {
    command: `resume`,
    mustHaveConnectedPlayer: true,
    mustHaveTracksInQueue: true,
    mustBePaused: true,
    userMustBeInSameVC: true,
    interaction: {
        name: `resume`,
        description: `Resume the music.`
    },
    exec: (ctx) => {
        ctx.player!.resume()
            .then(() => {
                ctx.embed
                    .color(Constants.PAUSE_RESUME_EMBED_COLOR)
                    .title(`:arrow_forward:  Resumed the music`)
                    .send()
                    .catch((error) => {
                        Utils.logError(error);
                        void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
                    });
            })
            .catch((error) => {
                Utils.logError(error);
                void ctx.error(`An unknown error occurred while resuming the music. Please submit an issue in our support server.`);
            });
    }
} as CommandOptions;
