import { Constants } from '../../config/Constants';
import { ExtendedPlayer } from '../../managers/LavalinkManager';

// Import modules.
import { CommandOptions } from 'discord-rose';

export default {
    command: `leave`,
    interaction: {
        name: `leave`,
        description: `Disconnect the bot and destroy the queue.`
    },
    exec: (ctx) => {
        const player: ExtendedPlayer | undefined = ctx.worker.lavalink.players.get(ctx.interaction.guild_id) as any;
        if (!player) return void ctx.error(`Unable to disconnect the bot; the bot is not connected to a VC.`);

        player.destroy();

        ctx.embed
            .color(Constants.LEAVE_EMBED_COLOR)
            .title(`:wave:  Left the VC`)
            .send()
            .catch((error) => void ctx.error(error));
    }
} as CommandOptions;
