import { Constants } from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { PlayerState } from '@discord-rose/lavalink';

export default {
    command: `stop`,
    interaction: {
        name: `stop`,
        description: `Stop the music.`
    },
    exec: async (ctx) => {
        const player = ctx.worker.lavalink.players.get(ctx.interaction.guild_id!);
        if (!player || player.state < PlayerState.CONNECTED) return void ctx.error(`Unable to stop the music; the bot is not connected to a VC.`);
        if (!player.queue.length) return void ctx.error(`Unable to stop the music; there is no music in the queue.`);
        if (player.queuePosition === null || player.state < PlayerState.PAUSED) return void ctx.error(`Unable to stop the music; there is no music playing.`);

        const foundVoiceState = ctx.worker.voiceStates.find((state) => state.guild_id === ctx.interaction.guild_id && state.users.has(ctx.author.id));
        if (foundVoiceState?.channel_id !== player.options.voiceChannelId) return void ctx.error(`You must be in the VC to stop the music.`);

        await player.stop();

        ctx.embed
            .color(Constants.STOP_EMBED_COLOR)
            .title(`:octagonal_sign:  Stopped the music`)
            .send()
            .catch((error) => void ctx.error(error));
    }
} as CommandOptions;
