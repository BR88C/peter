import { Constants } from '../config/Constants';
import { Player } from '@discord-rose/lavalink';

/**
 * Generate a filters string.
 * @param player The player to get filters from.
 * @returns The generated string.
 */
export const filtersString = (player: Player): string => {
    const prettyFilters: string[] = [];
    if (player.filters.equalizer?.find((v) => v.band === 0)) prettyFilters.push(`Bassboost = +${(player.filters.equalizer?.find((v) => v.band === 0)?.gain ?? 0) / Constants.BASSBOOST_INTENSITY_MULTIPLIER}`);
    if (typeof player.filters.timescale?.pitch === `number`) prettyFilters.push(`Pitch = ${player.filters.timescale.pitch * 100}﹪`);
    if (typeof player.filters.rotation?.rotationHz === `number`) prettyFilters.push(`Rotation = ${player.filters.rotation.rotationHz} Hz`);
    if (typeof player.filters.timescale?.speed === `number`) prettyFilters.push(`Speed = ${player.filters.timescale.speed * 100}﹪`);
    if (player.filters.equalizer?.find((v) => v.band === Constants.EQ_BAND_COUNT - 1)) prettyFilters.push(`Treble = +${(player.filters.equalizer?.find((v) => v.band === Constants.EQ_BAND_COUNT - 1)?.gain ?? 0) / Constants.TREBLE_INTENSITY_MULTIPLIER}`);
    if (typeof player.filters.tremolo?.depth === `number`) prettyFilters.push(`Tremolo = ${player.filters.tremolo.depth}﹪`);
    if (typeof player.filters.vibrato?.depth === `number`) prettyFilters.push(`Vibrato = ${player.filters.vibrato.depth}﹪`);
    if (player.volume !== 100) prettyFilters.push(`Volume = ${player.volume}﹪`);
    return prettyFilters.length ? `\`\`\`prolog\n${prettyFilters.join(`, `)}\n\`\`\`` : `\`\`\`diff\n-= No Active effects =-\n\`\`\``;
};
