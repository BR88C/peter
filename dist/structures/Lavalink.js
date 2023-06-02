"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lavalink = void 0;
const Constants_1 = require("../utils/Constants");
const cmd_1 = require("@distype/cmd");
const lavalink_1 = require("@distype/lavalink");
class Lavalink extends lavalink_1.Manager {
    async spawnNodes() {
        this.on(`PLAYER_DESTROYED`, (player, reason) => {
            if (reason !== `/leave` && player.textChannel) {
                this.client.rest.createMessage(player.textChannel, { embeds: [
                        new cmd_1.Embed()
                            .setColor(cmd_1.DiscordColors.BRANDING_RED)
                            .setTitle(`:outbox_tray:  ${reason}`)
                            .getRaw()
                    ] }).catch((error) => {
                    this.client.logger.log(`Error sending player destroyed message: ${(error?.message ?? error) ?? `Unknown reason`}`, {
                        level: `ERROR`, system: this.system
                    });
                });
            }
        });
        this.on(`PLAYER_VOICE_MOVED`, (player, newChannel) => {
            if (player.textChannel) {
                this.client.rest.createMessage(player.textChannel, { embeds: [
                        new cmd_1.Embed()
                            .setColor(cmd_1.DiscordColors.ROLE_SEA_GREEN)
                            .setTitle(`:loud_sound:  Moved`)
                            .setDescription(`New Channel: <#${newChannel}>`)
                            .getRaw()
                    ] }).catch((error) => {
                    this.client.logger.log(`Error sending player moved message: ${(error?.message ?? error) ?? `Unknown reason`}`, {
                        level: `ERROR`, system: this.system
                    });
                });
            }
        });
        this.on(`PLAYER_TRACK_START`, (player, track) => {
            if (track && player.textChannel) {
                const embed = new cmd_1.Embed()
                    .setColor(cmd_1.DiscordColors.ROLE_SEA_GREEN)
                    .setTitle(`Now Playing: ${(0, cmd_1.cleanseMarkdown)(track.title)}`, track.uri);
                if (track.thumbnail(`mqdefault`))
                    embed.setImage(track.thumbnail(`mqdefault`));
                if (track.requester)
                    embed.setFooter(`Requested by ${track.requester}`);
                this.client.rest.createMessage(player.textChannel, { embeds: [embed.getRaw()] }).catch((error) => {
                    this.client.logger.log(`Error sending now playing message: ${(error?.message ?? error) ?? `Unknown reason`}`, {
                        level: `ERROR`, system: this.system
                    });
                });
            }
        });
        await super.spawnNodes();
    }
    filtersString(player) {
        const prettyFilters = [];
        if (player.filters.equalizer?.find((v) => v.band === 0))
            prettyFilters.push(`Bassboost = +${Math.round((player.filters.equalizer?.find((v) => v.band === 0)?.gain ?? 0) / Constants_1.Constants.BASSBOOST_INTENSITY_MULTIPLIER)}`);
        if (typeof player.filters.timescale?.pitch === `number`)
            prettyFilters.push(`Pitch = ${Math.round(player.filters.timescale.pitch * 100)}﹪`);
        if (typeof player.filters.rotation?.rotationHz === `number`)
            prettyFilters.push(`Rotation = ${player.filters.rotation.rotationHz} Hz`);
        if (typeof player.filters.timescale?.speed === `number`)
            prettyFilters.push(`Speed = ${Math.round(player.filters.timescale.speed * 100)}﹪`);
        if (player.filters.equalizer?.find((v) => v.band === Constants_1.Constants.EQ_BAND_COUNT - 1))
            prettyFilters.push(`Treble = +${Math.round((player.filters.equalizer?.find((v) => v.band === Constants_1.Constants.EQ_BAND_COUNT - 1)?.gain ?? 0) / Constants_1.Constants.TREBLE_INTENSITY_MULTIPLIER)}`);
        if (typeof player.filters.tremolo?.depth === `number`)
            prettyFilters.push(`Tremolo = ${Math.round(player.filters.tremolo.depth * 100)}﹪`);
        if (typeof player.filters.vibrato?.depth === `number`)
            prettyFilters.push(`Vibrato = ${Math.round(player.filters.vibrato.depth * 100)}﹪`);
        if (player.volume !== 100)
            prettyFilters.push(`Volume = ${player.volume}﹪`);
        return prettyFilters.length ? `\`\`\`prolog\n${prettyFilters.join(`, `)}\n\`\`\`` : `\`\`\`\nNo Active Filters\n\`\`\``;
    }
}
exports.Lavalink = Lavalink;
