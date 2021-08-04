import { Constants } from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';

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
    exec: async (ctx) => {
        await ctx.player!.resume();

        ctx.embed
            .color(Constants.PAUSE_RESUME_EMBED_COLOR)
            .title(`:arrow_forward:  Resumed the music`)
            .send()
            .catch(() => void ctx.error(`Unable to send the response message.`));
    }
} as CommandOptions;
