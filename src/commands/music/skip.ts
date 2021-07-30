import { Constants } from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { PlayerState } from '@discord-rose/lavalink';

export default {
    command: `skip`,
    interaction: {
        name: `skip`,
        description: `Skip to the next song, or to a specified song.`,
        options: [
            {
                type: 4,
                name: `index`,
                description: `The index of the queue to skip to.`,
                required: false
            }
        ]
    },
    exec: async (ctx) => {
        const player = ctx.worker.lavalink.players.get(ctx.interaction.guild_id!);
        if (!player || player.state < PlayerState.CONNECTED) return void ctx.error(`Unable to skip; the bot is not connected to a voice channel.`);
        if (!player.queue.length) return void ctx.error(`Unable to skip; there is no music in the queue.`);

        const foundVoiceState = ctx.worker.voiceStates.find((state) => state.guild_id === ctx.interaction.guild_id && state.users.has(ctx.author.id));
        if (foundVoiceState?.channel_id !== player.options.voiceChannelId) return void ctx.error(`You must be in the voice channel to skip.`);

        const index = typeof ctx.options.index === `number` ? ctx.options.index - 1 : undefined;
        if (index && (index < 0 || index >= player.queue.length)) return void ctx.error(`Invalid index. Please specify a value greater than 0 and less than or equal to the queue's length.`);
        await player.skip(index);

        ctx.embed
            .color(Constants.SKIP_EMBED_COLOR)
            .title(`:track_next:  Skipped to ${typeof index === `number` ? `song ${index + 1}` : `the next song`}`)
            .send()
            .catch(() => void ctx.error(`Unable to send the response message.`));
    }
} as CommandOptions;
