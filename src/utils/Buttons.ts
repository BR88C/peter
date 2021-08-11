import { WorkerManager } from '../managers/WorkerManager';

import { Interaction, SlashCommandContext } from 'discord-rose';

export const bindButtons = (worker: WorkerManager): void => {
    worker.on(`INTERACTION_CREATE`, async (data) => {
        if (!data.guild_id || !data.member) return;
        if (data.type === 3) {
            const command = worker.commands.commands?.find((command) => command.interaction?.name === data.data.custom_id);
            if (!command) return;
            const ctx = Object.assign(new SlashCommandContext({
                worker,
                interaction: data as unknown as Interaction,
                command,
                prefix: `/`,
                ran: (data.data as any).name,
                args: []
            }));
            try {
                for (const middleware of worker.commands.middlewares) {
                    try {
                        if (await middleware(ctx) !== true) return;
                    } catch (error) {
                        error.nonFatal = true;
                        throw error;
                    }
                    await command.exec(ctx);
                }
            } catch (error) {
                worker.commands.errorFunction(ctx, error);
            }
        }
    });
};
