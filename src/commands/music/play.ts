import { Queue } from '../../structures/Queue';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { Constants } from '../../config/Constants';

export default {
    command: `play`,
    interaction: {
        name: `play`,
        description: `Plays a specified song.`,
        options: [
            {
                type: 3,
                name: `query`,
                description: `A YouTube link, or the name of a song / video.`,
                required: true
            }
        ]
    },
    exec: async (ctx) => {
        if (!ctx.interaction.channel_id || !ctx.interaction.guild_id) return void ctx.error(`An unknown error occured when trying to connect to the voice channel.`);

        const foundVoiceState = ctx.worker.voiceStates.find((state) => state.guild_id === ctx.interaction.guild_id && state.users.has(ctx.interaction.member.user.id));
        if (!foundVoiceState) return void ctx.error(`You must be in a voice channel to play music.`);

        const queue = new Queue(ctx.interaction.channel_id, foundVoiceState.channel_id, ctx.interaction.guild_id, ctx.worker);
        queue.createConnection().then(() => {
            ctx.embed
                .color(Constants.CONNECTING_EMBED_COLOR)
                .title(`Connecting...`)
                .send()
                .catch((error) => void ctx.error(error));

            queue.playSong().then(async () => await ctx.send(`epic`)).catch((error) => void ctx.error(error));
        }).catch((error) => void ctx.error(error));
    }
} as CommandOptions;
