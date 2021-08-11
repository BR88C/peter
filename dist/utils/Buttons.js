"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindButtons = void 0;
const discord_rose_1 = require("discord-rose");
const bindButtons = (worker) => {
    worker.on(`INTERACTION_CREATE`, async (data) => {
        if (!data.guild_id || !data.member)
            return;
        if (data.type === 3) {
            const command = worker.commands.commands?.find((command) => command.interaction?.name === data.data.custom_id);
            if (!command)
                return;
            const ctx = Object.assign(new discord_rose_1.SlashCommandContext({
                worker,
                interaction: data,
                command,
                prefix: `/`,
                ran: data.data.name,
                args: []
            }));
            try {
                for (const middleware of worker.commands.middlewares) {
                    try {
                        if (await middleware(ctx) !== true)
                            return;
                    }
                    catch (error) {
                        error.nonFatal = true;
                        throw error;
                    }
                    await command.exec(ctx);
                }
            }
            catch (error) {
                worker.commands.errorFunction(ctx, error);
            }
        }
    });
};
exports.bindButtons = bindButtons;
