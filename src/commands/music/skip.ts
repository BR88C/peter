import { Constants } from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { Player } from '@discord-rose/lavalink';

export default {
    command: `skip`,
    interaction: {
        name: `skip`,
        description: `Skip to the next song, or to a specified song.`,
        options: [
            {
                type: 4,
                name: `index`,
                description: `The song index to skip to.`,
                required: false
            }
        ]
    },
    exec: async (ctx) => {
        const player: Player | undefined = ctx.worker.lavalink.players.get(ctx.interaction.guild_id) as any;
        if (!player || !player.queue.length) return void ctx.error(`Unable to skip; there is no music in the queue.`);

        const foundVoiceState = ctx.worker.voiceStates.find((state) => state.guild_id === ctx.interaction.guild_id && state.users.has(ctx.interaction.member.user.id));
        if (!foundVoiceState || foundVoiceState.channel_id !== player.options.voiceChannelId) return void ctx.error(`You must be in the VC to skip.`);

        const index = typeof ctx.options.index === `number` ? ctx.options.index - 1 : undefined;
        if (index && (index < 0 || index >= player.queue.length)) return void ctx.error(`Invalid index`);
        await player.skip(index);

        ctx.embed
            .color(Constants.SKIP_EMBED_COLOR)
            .title(`:track_next:  Skipped to ${typeof index === `number` ? `track ${index + 1}` : `the next track`}`)
            .send()
            .catch((error) => void ctx.error(error));
    }
} as CommandOptions;
