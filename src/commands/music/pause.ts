import { Constants } from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';

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
            .catch(() => void ctx.error(`Unable to send the response message.`));
    }
} as CommandOptions;
