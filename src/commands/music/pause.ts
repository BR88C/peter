import { Constants } from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { Player } from '@discord-rose/lavalink'

export default {
    command: `pause`,
    interaction: {
        name: `pause`,
        description: `Pause the music.`
    },
    exec: (ctx) => {
        const player: Player | undefined = ctx.worker.lavalink.players.get(ctx.interaction.guild_id);
        if (!player) return void ctx.error(`Unable to pause; there is no music in the queue.`); // || !player.queue.length
        // if (!player.queue.current) return void ctx.error(`Unable to pause; there is no music playing.`);

        // if (player.paused) return void ctx.error(`The music is already paused.`);

        // player.pause(true);

        ctx.embed
            .color(Constants.PAUSE_EMBED_COLOR)
            .title(`:pause_button:  Paused the music`)
            .send()
            .catch((error) => void ctx.error(error));
    }
} as CommandOptions;
