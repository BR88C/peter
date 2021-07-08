import { Constants } from '../../config/Constants';
import { ExtendedPlayer } from '../../managers/LavalinkManager';

// Import modules.
import { CommandOptions } from 'discord-rose';

export default {
    command: `resume`,
    interaction: {
        name: `resume`,
        description: `Resume the music.`
    },
    exec: (ctx) => {
        const player: ExtendedPlayer | undefined = ctx.worker.lavalink.players.get(ctx.interaction.guild_id) as any;
        if (!player || !player.queue?.current) return void ctx.error(`Unable to resume the music; no music is playing.`);

        if (!player.paused) return void ctx.error(`The music is already resumed.`);

        player.pause(true);

        ctx.embed
            .color(Constants.PAUSE_EMBED_COLOR)
            .title(`:pause_button:  Paused the music`)
            .send()
            .catch((error) => void ctx.error(error));
    }
} as CommandOptions;
