import { Constants } from '../../config/Constants';
import { ExtendedPlayer } from '../../managers/LavalinkManager';

// Import modules.
import { CommandOptions } from 'discord-rose';

export default {
    command: `clear`,
    interaction: {
        name: `clear`,
        description: `Clears the queue.`
    },
    exec: (ctx) => {
        const player: ExtendedPlayer | undefined = ctx.worker.lavalink.players.get(ctx.interaction.guild_id) as any;
        if (!player) return void ctx.error(`Unable to clear the queue; there is no music in the queue.`);

        player.queue.clear();

        ctx.embed
            .color(Constants.QUEUE_CLEARED_EMBED_COLOR)
            .title(`:broom:  Cleared the queue`)
            .send()
            .catch((error) => void ctx.error(error));
    }
} as CommandOptions;
