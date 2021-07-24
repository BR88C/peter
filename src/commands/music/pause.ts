import { Constants } from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { PlayerState } from '@discord-rose/lavalink';

export default {
    command: `pause`,
    interaction: {
        name: `pause`,
        description: `Pause the current track.`
    },
    exec: async (ctx) => {
        const player = ctx.worker.lavalink.players.get(ctx.interaction.guild_id!);
        if (!player || player.state < PlayerState.CONNECTED) return void ctx.error(`Unable to pause; the bot is not connected to the VC.`);
        if (!player.queue.length) return void ctx.error(`Unable to pause; there are no tracks in the queue.`);
        if (player.queuePosition === null || player.state < PlayerState.PAUSED) return void ctx.error(`Unable to pause; there are no tracks playing.`);

        const foundVoiceState = ctx.worker.voiceStates.find((state) => state.guild_id === ctx.interaction.guild_id && state.users.has(ctx.author.id));
        if (foundVoiceState?.channel_id !== player.options.voiceChannelId) return void ctx.error(`You must be in the VC to pause the current track.`);

        if (player.state === PlayerState.PAUSED) return void ctx.error(`The current track is already paused.`);
        await player.pause();

        ctx.embed
            .color(Constants.PAUSE_EMBED_COLOR)
            .title(`:pause_button:  Paused the current track`)
            .send()
            .catch((error) => void ctx.error(error));
    }
} as CommandOptions;
