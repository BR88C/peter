import { Config } from '../../config/Config';
import { Constants } from '../../config/Constants';
import { removeToken } from '../../utils/StringUtils';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { inspect } from 'util';

export default {
    command: `eval`,
    exec: async (ctx) => {
        // Check if the user is a developer.
        if (!Config.devs.IDs.includes(ctx.author.id)) return void ctx.error(`You do not have permission to run this command.`);

        if (ctx.args.length === 0) return void ctx.error(`You must supply an expression to eval.`);

        let evalResponse: any;
        try {
            const multiLine = ctx.args[0] === `-m`;
            evalResponse = await new Promise(async (resolve, reject) => { // eslint-disable-line
                try {
                    eval(`(async () => ${multiLine ? `{ ` : ``}${ctx.args.join(` `).replace(`-m `, ``)}${multiLine ? ` }` : ``})().then((a) => resolve(a)).catch((error) => resolve(error));`); // eslint-disable-line no-eval
                } catch (error) {
                    resolve(error);
                }
            });
        } catch (error) {
            evalResponse = error;
        }

        // Format.
        evalResponse = removeToken((typeof evalResponse !== `string` && typeof evalResponse !== `number` ? inspect(evalResponse, false, 1) : evalResponse).toString(), ctx.worker.lavalink.spotifyToken
            ? Config.defaultTokenArray.concat({
                token: ctx.worker.lavalink.spotifyToken, replacement: `%spotify_token%`
            })
            : Config.defaultTokenArray);

        // Send response.
        for (let i = 0; i < Math.ceil(evalResponse.length / Constants.MAX_EMBED_DESCRIPTION_SIZE); i++) {
            await ctx.embed
                .color(Constants.EVAL_EMBED_COLOR)
                .title(i === 0 ? `\`${ctx.args.join(` `).replace(`-m `, ``).length > 25 ? `${ctx.args.join(` `).replace(`-m `, ``).substring(0, 25)}...` : `${ctx.args.join(` `).replace(`-m `, ``)}`}\`` : undefined)
                .description(`\`\`\`js\n${evalResponse.substring(i * Constants.MAX_EMBED_DESCRIPTION_SIZE, (i + 1) * Constants.MAX_EMBED_DESCRIPTION_SIZE)}\n\`\`\``)
                .send(i === 0)
                .catch(() => void ctx.error(`Unable to send the response message.`));
        }
    }
} as CommandOptions;
