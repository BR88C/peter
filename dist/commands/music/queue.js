"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_utils_1 = require("@br88c/node-utils");
const cmd_1 = require("@distype/cmd");
exports.default = new cmd_1.ChatCommand()
    .setName(`queue`)
    .setDescription(`Displays the tracks in the queue`)
    .setDmPermission(false)
    .setExecute(async (ctx) => {
    const player = ctx.client.lavalink.players.get(ctx.guildId);
    if (!player)
        return ctx.error(`The bot must be connected to a voice channel to show the queue`);
    const expired = [false, false];
    let acknowledgedExpired = false;
    const left = new cmd_1.Button()
        .setId(`queue_${ctx.interaction.id}_left`)
        .setStyle(cmd_1.ButtonStyle.PRIMARY)
        .setLabel(`<`)
        .setExpire(30000, async () => {
        expired[0] = true;
        if (!acknowledgedExpired && expired.every((v) => v)) {
            acknowledgedExpired = true;
            await changePage(0);
            return true;
        }
        else {
            return false;
        }
    })
        .setExecute(async (bCtx) => {
        await changePage(-1, bCtx);
    });
    const pageDisplay = new cmd_1.Button()
        .setId(`queue_${ctx.interaction.id}_page_display`)
        .setStyle(cmd_1.ButtonStyle.PRIMARY)
        .setDisabled(true);
    const right = new cmd_1.Button()
        .setId(`queue_${ctx.interaction.id}_right`)
        .setStyle(cmd_1.ButtonStyle.PRIMARY)
        .setLabel(`>`)
        .setExpire(30000, async () => {
        expired[1] = true;
        if (!acknowledgedExpired && expired.every((v) => v)) {
            acknowledgedExpired = true;
            await changePage(0);
            return true;
        }
        else {
            return false;
        }
    })
        .setExecute(async (bCtx) => {
        await changePage(1, bCtx);
    });
    let currentPage = Math.floor((player.queuePosition ?? 0) / 10);
    const embed = new cmd_1.Embed().setColor(cmd_1.DiscordColors.ROLE_SEA_GREEN);
    const changePage = async (page, bCtx) => {
        if (expired.every((v) => v)) {
            ctx.commandHandler.unbindButton(`queue_${ctx.interaction.id}_left`).unbindButton(`queue_${ctx.interaction.id}_right`);
            left.setDisabled(true);
            right.setDisabled(true);
            await ctx.edit(`@original`, embed, [left, pageDisplay, right]);
            return;
        }
        currentPage += page;
        const maxPage = Math.floor(player.queue.length / 10);
        if (currentPage > maxPage)
            currentPage = 0;
        else if (currentPage < 0)
            currentPage = maxPage;
        const trackTitles = player.queue.length
            ? player.queue.slice(currentPage * 10, (currentPage + 1) * 10).map((track, i) => `${(i + (currentPage * 10)) === player.queuePosition ? `↳ ` : ``}**${i + (currentPage * 10) + 1}.** ${track.uri ? `[` : ``}${(0, cmd_1.cleanseMarkdown)(track.title)}${track.uri ? `](${track.uri})` : ``} ${track.length ? ` [${(0, node_utils_1.timestamp)(track.length)}]` : ``}`).join(`\n`)
            : `**No tracks in the queue.**`;
        const queueLength = player.queue.reduce((p, c) => p + c.length, 0);
        embed
            .setTitle(player.currentTrack ? `**Now Playing:** ${player.currentTrack.title} ${player.currentTrack.length ? `[${(0, node_utils_1.timestamp)(player.currentTrack ? (player.currentTrack.length ?? 0) - (player.trackPosition ?? (player.currentTrack.length ?? 0)) : 0)} remaining]` : ``}` : `**Nothing is currently playing**`)
            .setDescription(trackTitles)
            .setFields({
            name: `Queue Size`,
            value: `\`${player.queue.length}\``,
            inline: true
        }, {
            name: `Queue Length`,
            value: `\`${(0, node_utils_1.timestamp)(queueLength)}\``,
            inline: true
        }, {
            name: `Time Left`,
            value: `\`${player.queuePosition !== null ? (0, node_utils_1.timestamp)(queueLength - (player.queue.slice(0, player.queuePosition).reduce((p, c) => p + (c.length ?? 0), 0) + (player.trackPosition ?? 0))) : `N/A`}\``,
            inline: true
        }, {
            name: `Voice Channel`,
            value: `<#${player.voiceChannel}>`,
            inline: true
        }, {
            name: `Text Channel`,
            value: `<#${player.textChannel}>`,
            inline: true
        }, {
            name: `Loop`,
            value: `\`${player.loop.charAt(0).toUpperCase()}${player.loop.slice(1)}\`${player.twentyfourseven ? ` (24/7 On)` : ``}`,
            inline: true
        }, {
            name: `Active Filters`,
            value: ctx.client.lavalink.filtersString(player),
            inline: false
        });
        if (player.currentTrack?.thumbnail(`mqdefault`))
            embed.setThumbnail(player.currentTrack.thumbnail(`mqdefault`));
        pageDisplay.setLabel(`Page ${currentPage + 1}/${maxPage + 1}`);
        expired[0] = false;
        expired[1] = false;
        if (!ctx.responded) {
            await ctx.send(embed, [left, pageDisplay, right]);
        }
        else if (bCtx) {
            await bCtx.editParent(embed, [left, pageDisplay, right], false);
        }
    };
    await changePage(0);
});
