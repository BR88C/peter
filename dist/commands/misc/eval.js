"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("../../config/Config");
const Constants_1 = require("../../config/Constants");
const util_1 = require("util");
const StringUtils_1 = require("../../utils/StringUtils");
exports.default = {
    command: `eval`,
    exec: async (ctx) => {
        if (!Config_1.Config.devs.IDs.includes(ctx.message.author.id))
            return void ctx.error(`You do not have permission to run this command.`);
        if ((process.env.NODE_ENV ?? `dev`) !== `dev`)
            return void ctx.error(`This command is only available when the bot is in development mode.`);
        if (ctx.args.length === 0)
            return void ctx.error(`You must supply an expression to eval.`);
        let evalResponse;
        try {
            evalResponse = eval(ctx.args.join(` `));
        }
        catch (error) {
            evalResponse = error;
        }
        evalResponse = StringUtils_1.removeToken((typeof evalResponse !== `string` && typeof evalResponse !== `number` ? util_1.inspect(evalResponse, false, 1) : evalResponse).toString());
        for (let i = 0; i < Math.ceil(evalResponse.length / 2e3); i++) {
            await ctx.embed
                .color(Constants_1.Constants.EVAL_EMBED_COLOR)
                .title(i === 0 ? `\`\`\` ${ctx.args.join(` `).length > 25 ? `${ctx.args.join(` `).substring(0, 25)}\`...` : `${ctx.args.join(` `)}`} \`\`\`` : undefined)
                .description(`\`\`\`js\n${evalResponse.substring(i * 2e3, (i + 1) * 2e3)}\n\`\`\``)
                .send(i === 0)
                .catch((error) => void ctx.error(error));
        }
    }
};
