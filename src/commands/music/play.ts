import { Queue } from '../../structures/Queue';

// Import modules.
import { APIGuild } from 'discord-api-types';
import { CommandOptions, GuildsResource } from 'discord-rose';

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
        const guild: APIGuild = await new GuildsResource(ctx.worker.api).get(ctx.interaction.guild_id, false);
        if (guild.voice_states) console.log(guild.voice_states)

        let queue: Queue;
        if (ctx.interaction.channel_id && ctx.interaction.guild_id) queue = new Queue(ctx.interaction.channel_id, `738892661150187544`, ctx.interaction.guild_id, ctx.worker);
        else return await ctx.error(`An unknown error occured when trying to connect to the voice channel.`);

        queue.createConnection().then(() => {
            ctx.send(`lets go`)
            queue.playSong().then(async () => await ctx.send(`epic`)).catch(async (error) => await ctx.error(error));
        }).catch(async (error) => await ctx.error(error));
    }
} as CommandOptions;
