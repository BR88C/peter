import { Constants } from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { PlayerState } from '@discord-rose/lavalink';

export default {
    command: `clear`,
    interaction: {
        name: `clear`,
        description: `Clears the queue.`
    },
    exec: (ctx) => {
        const player = ctx.worker.lavalink.players.get(ctx.interaction.guild_id!);
        if (!player || player.state < PlayerState.CONNECTED) return void ctx.error(`Unable to clear the queue; the bot is not connected to a voice channel.`);
        if (!player.queue.length) return void ctx.error(`Unable to clear the queue; there is no music in the queue.`);

        const foundVoiceState = ctx.worker.voiceStates.find((state) => state.guild_id === ctx.interaction.guild_id && state.users.has(ctx.author.id));
        if (foundVoiceState?.channel_id !== player.options.voiceChannelId) return void ctx.error(`You must be in the voice channel to clear the queue.`);

        player.queue = player.queuePosition !== null && player.queue[player.queuePosition] ? [player.queue[player.queuePosition]] : [];

        ctx.embed
            .color(Constants.QUEUE_CLEARED_EMBED_COLOR)
            .title(`:broom:  Cleared the queue`)
            .send()
            .catch(() => void ctx.error(`Unable to send the response message.`));
    }
} as CommandOptions;
