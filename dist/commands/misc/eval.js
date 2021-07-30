"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("../../config/Config");
const Constants_1 = require("../../config/Constants");
const StringUtils_1 = require("../../utils/StringUtils");
const util_1 = require("util");
exports.default = {
    command: `eval`,
    exec: async (ctx) => {
        if (!Config_1.Config.devs.IDs.includes(ctx.author.id))
            return void ctx.error(`You do not have permission to run this command.`);
        if (ctx.args.length === 0)
            return void ctx.error(`You must supply an expression to eval.`);
        let evalResponse;
        try {
            const multiLine = ctx.args[0] === `-m`;
            evalResponse = await new Promise(async (resolve, reject) => {
                try {
                    eval(`(async () => ${multiLine ? `{ ` : ``}${ctx.args.join(` `).replace(`-m `, ``)}${multiLine ? ` }` : ``})().then((a) => resolve(a)).catch((error) => resolve(error));`);
                }
                catch (error) {
                    resolve(error);
                }
            });
        }
        catch (error) {
            evalResponse = error;
        }
        evalResponse = StringUtils_1.removeToken((typeof evalResponse !== `string` && typeof evalResponse !== `number` ? util_1.inspect(evalResponse, false, 1) : evalResponse).toString(), ctx.worker.lavalink.spotifyToken
            ? Config_1.Config.defaultTokenArray.concat({
                token: ctx.worker.lavalink.spotifyToken, replacement: `%spotify_token%`
            })
            : Config_1.Config.defaultTokenArray);
        for (let i = 0; i < Math.ceil(evalResponse.length / 2e3); i++) {
            await ctx.embed
                .color(Constants_1.Constants.EVAL_EMBED_COLOR)
                .title(i === 0 ? `\`\`\` ${ctx.args.join(` `).replace(`-m `, ``).length > 25 ? `${ctx.args.join(` `).replace(`-m `, ``).substring(0, 25)}\`...` : `${ctx.args.join(` `).replace(`-m `, ``)}`} \`\`\`` : undefined)
                .description(`\`\`\`js\n${evalResponse.substring(i * 2e3, (i + 1) * 2e3)}\n\`\`\``)
                .send(i === 0)
                .catch(() => void ctx.error(`Unable to send the response message.`));
        }
    }
};
