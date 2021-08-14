import { Constants } from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { logError } from '@br88c/discord-utils';
import { Track } from '@discord-rose/lavalink';

export default {
    command: `replay`,
    allowButton: true,
    mustHaveConnectedPlayer: true,
    mustHaveTracksInQueue: true,
    mustBePausedOrPlaying: true,
    userMustBeInSameVC: true,
    interaction: {
        name: `replay`,
        description: `Seek to the beginning of the song.`
    },
    exec: async (ctx) => {
        if (!(ctx.player!.currentTrack! as Track).isSeekable || (ctx.player!.currentTrack! as Track).isStream) return void ctx.error(`The current song does not support seeking to the beginning of the song.`);
        await ctx.player!.seek(0);

        ctx.embed
            .color(Constants.SEEK_EMBED_COLOR)
            .title(`:rewind:  Seeked to the beginning of the song`)
            .send()
            .catch((error) => {
                logError(error);
                void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
            });
    }
} as CommandOptions;
