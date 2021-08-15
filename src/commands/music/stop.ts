import { Constants } from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { logError } from '@br88c/discord-utils';

export default {
    command: `stop`,
    allowButton: true,
    mustHaveConnectedPlayer: true,
    mustHaveTracksInQueue: true,
    mustBePausedOrPlaying: true,
    userMustBeInSameVC: true,
    interaction: {
        name: `stop`,
        description: `Stop the music.`
    },
    exec: (ctx) => {
        ctx.player!.stop()
            .then(() => {
                ctx.embed
                    .color(Constants.STOP_EMBED_COLOR)
                    .title(`:octagonal_sign:  Stopped the music`)
                    .send()
                    .catch((error) => {
                        logError(error);
                        void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
                    });
            })
            .catch((error) => {
                logError(error);
                void ctx.error(`An unknown error occurred while stopping the music. Please submit an issue in our support server.`);
            });
    }
} as CommandOptions;
