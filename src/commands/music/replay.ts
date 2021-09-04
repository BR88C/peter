import Constants from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { Track } from '@discord-rose/lavalink';
import { Utils } from '@br88c/discord-utils';

export default {
    command: `replay`,
    mustHaveConnectedPlayer: true,
    mustHaveTracksInQueue: true,
    mustBePausedOrPlaying: true,
    userMustBeInSameVC: true,
    interaction: {
        name: `replay`,
        description: `Seek to the beginning of the song.`
    },
    exec: (ctx) => {
        if (!(ctx.player!.currentTrack! as Track).isSeekable || (ctx.player!.currentTrack! as Track).isStream) return void ctx.error(`The current song does not support seeking to the beginning of the song.`);
        ctx.player!.seek(0)
            .then(() => {
                ctx.embed
                    .color(Constants.SEEK_EMBED_COLOR)
                    .title(`:rewind:  Seeked to the beginning of the song`)
                    .send()
                    .catch((error) => {
                        Utils.logError(error);
                        void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
                    });
            })
            .catch((error) => {
                Utils.logError(error);
                void ctx.error(`An unknown error occurred while seeking to the beginning of the song. Please submit an issue in our support server.`);
            });
    }
} as CommandOptions;
