import { Queue } from '../../structures/Queue';

// Import modules.
import { CommandOptions } from 'discord-rose';

export default {
    command: `play`,
    interaction: {
        name: `play`,
        description: `Plays a specified song.`,
        options: [
            {
                type: 6,
                name: `query`,
                description: `A YouTube link, or the name of a song / video.`,
                required: true
            }
        ]
    },
    exec: async (ctx) => {
        let queue: Queue;
        if (ctx.channel && ctx.guild) queue = new Queue(ctx.channel.id, `738892661150187544`, ctx.guild.id, ctx.worker);
        else return await ctx.error(`An unknown error occured when trying to connect to the voice channel.`);

        queue.createConnection().then(() => {
            queue.playSong().then(async () => await ctx.send(`epic`)).catch(async (error) => await ctx.error(error));
        }).catch(async (error) => await ctx.error(error));
    }
} as CommandOptions;
