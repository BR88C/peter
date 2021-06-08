import { Config } from '../../config/Config';
import { Constants } from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { inspect } from 'util';
import { removeToken } from '../../utils/Cleanse';

export default {
    command: `eval`,
    exec: async (ctx) => {
        // Extra security layer.
        if (!Config.devs.IDs.includes(ctx.message.author.id)) return void ctx.error(`You do not have permission to run this command.`);

        // Return if not in development.
        if ((process.env.NODE_ENV ?? `dev`) !== `dev`) return void ctx.error(`This command is only available when the bot is in development mode.`);

        if (ctx.args.length === 0) return void ctx.error(`You must supply an expression to eval.`);

        let evalResponse: any;
        try {
            evalResponse = eval(ctx.args.join(` `)); // eslint-disable-line no-eval
        } catch (error) {
            evalResponse = error;
        }

        // Format.
        evalResponse = removeToken((typeof evalResponse !== `string` && typeof evalResponse !== `number` ? inspect(evalResponse, false, 1) : evalResponse).toString());

        // Post an embed for every 2000 characters.
        for (let i = 0; i < Math.ceil(evalResponse.length / 2e3); i++) {
            await ctx.embed
                .color(Constants.EVAL_EMBED_COLOR)
                .title(i === 0 ? `\`\`\` ${ctx.args.join(` `).length > 25 ? `${ctx.args.join(` `).substring(0, 25)}\`...` : `${ctx.args.join(` `)}`} \`\`\`` : undefined)
                .description(`\`\`\`js\n${evalResponse.substring(i * 2e3, (i + 1) * 2e3)}\n\`\`\``)
                .send(i === 0)
                .catch((error) => void ctx.error(error));
        }
    }
} as CommandOptions;
