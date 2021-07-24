import { Constants } from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { PlayerState } from '@discord-rose/lavalink';

export default {
    command: `shuffle`,
    interaction: {
        name: `shuffle`,
        description: `Shuffles the queue, then plays the first track.`
    },
    exec: async (ctx) => {
        const player = ctx.worker.lavalink.players.get(ctx.interaction.guild_id!);
        if (!player || player.state < PlayerState.CONNECTED) return void ctx.error(`Unable to shuffle; the bot is not connected to a VC.`);
        if (!player.queue.length) return void ctx.error(`Unable to shuffle; there is no music in the queue.`);

        const foundVoiceState = ctx.worker.voiceStates.find((state) => state.guild_id === ctx.interaction.guild_id && state.users.has(ctx.author.id));
        if (foundVoiceState?.channel_id !== player.options.voiceChannelId) return void ctx.error(`You must be in the VC to shuffle the queue.`);

        await player.shuffle();

        ctx.embed
            .color(Constants.QUEUE_SHUFFLED_EMBED_COLOR)
            .title(`:twisted_rightwards_arrows:  Shuffled the queue`)
            .send()
            .catch((error) => void ctx.error(error));
    }
} as CommandOptions;
