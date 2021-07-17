import { Constants } from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { Player } from '@discord-rose/lavalink'

export default {
    command: `clear`,
    interaction: {
        name: `clear`,
        description: `Clears the queue.`
    },
    exec: (ctx) => {
        const player: Player | undefined = ctx.worker.lavalink.players.get(ctx.interaction.guild_id);
        if (!player) return void ctx.error(`Unable to clear the queue; there is no music in the queue.`); // || !player.queue.length

        // player.queue.clear();

        ctx.embed
            .color(Constants.QUEUE_CLEARED_EMBED_COLOR)
            .title(`:broom:  Cleared the queue`)
            .send()
            .catch((error) => void ctx.error(error));
    }
} as CommandOptions;
