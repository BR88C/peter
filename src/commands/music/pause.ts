import { Constants } from '../../config/Constants';
import { ExtendedPlayer } from '../../managers/LavalinkManager';

// Import modules.
import { CommandOptions } from 'discord-rose';

export default {
    command: `pause`,
    interaction: {
        name: `pause`,
        description: `Pause the music.`
    },
    exec: (ctx) => {
        const player: ExtendedPlayer | undefined = ctx.worker.lavalink.players.get(ctx.interaction.guild_id) as any;
        if (!player || !player.queue?.current) return void ctx.error(`Unable to disconnect the bot; no music is playing.`);

        if (player.paused) return void ctx.error(`The music is already paused.`);

        player.pause(true);

        ctx.embed
            .color(Constants.PAUSE_EMBED_COLOR)
            .title(`:pause_button:  Paused the music`)
            .send()
            .catch((error) => void ctx.error(error));
    }
} as CommandOptions;
