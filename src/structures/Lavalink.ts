import { Constants } from '../utils/Constants';

import { cleanseMarkdown, DiscordColors, Embed } from '@distype/cmd';
import { Manager, Player } from '@distype/lavalink';
import { DiscordConstants } from 'distype';

/**
 * The Lavalink manager.
 */
export class Lavalink extends Manager {
    /**
     * Spawns all nodes and binds events.
     */
    public override async spawnNodes (): Promise<void> {
        this.on(`PLAYER_DESTROYED`, (player, reason) => {
            if (reason !== `/leave` && player.textChannel) {
                this.client.rest.createMessage(player.textChannel, { embeds: [
                    new Embed()
                        .setColor(DiscordColors.BRANDING_RED)
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
                    new Embed()
                        .setColor(DiscordColors.ROLE_SEA_GREEN)
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
                const embed = new Embed()
                    .setColor(DiscordColors.ROLE_SEA_GREEN)
                    .setTitle(`Now Playing: ${cleanseMarkdown(track.title)}`, track.uri);

                if (track.thumbnail(`mqdefault`)) embed.setImage(track.thumbnail(`mqdefault`)!);
                if (track.requester) embed.setFooter(`Requested by ${track.requester}`);

                if (Date.now() - player.lastMessage > Constants.MESSAGE_FREQUENCY) {
                    console.log([embed.getRaw(), ...player.messageQueue.slice(-(DiscordConstants.MESSAGE_LIMITS.EMBEDS - 1))])
                    this.client.rest.createMessage(player.textChannel, { embeds: [...player.messageQueue.slice(-(DiscordConstants.MESSAGE_LIMITS.EMBEDS - 1)), embed.getRaw()] })
                        .then(() => {
                            player.lastMessage = Date.now();
                            player.messageQueue = [];
                        })
                        .catch((error) => {
                            this.client.logger.log(`Error sending now playing message: ${(error?.message ?? error) ?? `Unknown reason`}`, {
                                level: `ERROR`, system: this.system
                            });
                        });
                } else {
                    player.messageQueue.push(embed.getRaw());
                }
            }
        });

        await super.spawnNodes();
    }

    /**
     * Create a pretty string showing all filters active on a player.
     * @param player The player to pull filters from.
     * @returns The pretty string.
     */
    public filtersString (player: Player): string {
        const prettyFilters: string[] = [];
        if (player.filters.equalizer?.find((v) => v.band === 0)) prettyFilters.push(`Bassboost = +${Math.round((player.filters.equalizer?.find((v) => v.band === 0)?.gain ?? 0) / Constants.BASSBOOST_INTENSITY_MULTIPLIER)}`);
        if (typeof player.filters.timescale?.pitch === `number`) prettyFilters.push(`Pitch = ${Math.round(player.filters.timescale.pitch * 100)}﹪`);
        if (typeof player.filters.rotation?.rotationHz === `number`) prettyFilters.push(`Rotation = ${player.filters.rotation.rotationHz} Hz`);
        if (typeof player.filters.timescale?.speed === `number`) prettyFilters.push(`Speed = ${Math.round(player.filters.timescale.speed * 100)}﹪`);
        if (player.filters.equalizer?.find((v) => v.band === Constants.EQ_BAND_COUNT - 1)) prettyFilters.push(`Treble = +${Math.round((player.filters.equalizer?.find((v) => v.band === Constants.EQ_BAND_COUNT - 1)?.gain ?? 0) / Constants.TREBLE_INTENSITY_MULTIPLIER)}`);
        if (typeof player.filters.tremolo?.depth === `number`) prettyFilters.push(`Tremolo = ${Math.round(player.filters.tremolo.depth * 100)}﹪`);
        if (typeof player.filters.vibrato?.depth === `number`) prettyFilters.push(`Vibrato = ${Math.round(player.filters.vibrato.depth * 100)}﹪`);
        if (player.volume !== 100) prettyFilters.push(`Volume = ${player.volume}﹪`);
        return prettyFilters.length ? `\`\`\`prolog\n${prettyFilters.join(`, `)}\n\`\`\`` : `\`\`\`\nNo Active Filters\n\`\`\``;
    }
}
