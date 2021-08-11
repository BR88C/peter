import { Constants } from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';
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
            .catch(() => void ctx.error(`Unable to send the response message.`));
    }
} as CommandOptions;
