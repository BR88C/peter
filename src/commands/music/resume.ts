import { Constants } from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { Player, PlayerState } from '@discord-rose/lavalink';

export default {
    command: `resume`,
    interaction: {
        name: `resume`,
        description: `Resume the music.`
    },
    exec: async (ctx) => {
        const player: Player | undefined = ctx.worker.lavalink.players.get(ctx.interaction.guild_id);
        if (!player) return void ctx.error(`Unable to resume; there is no music in the queue.`); // || !player.queue.length
        if (player.state === PlayerState.CONNECTED) return void ctx.error(`Unable to pause; there is no music playing.`);
        if (player.state === PlayerState.PLAYING) return void ctx.error(`The music is already resumed.`);

        await player.resume();

        ctx.embed
            .color(Constants.PAUSE_EMBED_COLOR)
            .title(`:pause_button:  Paused the music`)
            .send()
            .catch((error) => void ctx.error(error));
    }
} as CommandOptions;
