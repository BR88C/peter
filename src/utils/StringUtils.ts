import { Config } from "../config/Config";

/**
 * Centers a string on a specified length using spaces.
 * @param str The string to center.
 * @param length The length of the new string.
 * @returns The centered string.
 */
export const centerString = (str: string, length: number): string => {
    if (str.length > length) throw Error(`Invalid length to center string on.`);
    else return `${` `.repeat(Math.floor((length - str.length) / 2))}${str}${` `.repeat(Math.ceil((length - str.length) / 2))}`;
};

/**
 * Cleanses a string from markdown formatting, adding back slashes to do so.
 * @param str The string to cleanse.
 * @returns The cleansed string.
 */
export const cleanseMarkdown = (str: string): string => str
    .replace(/`/g, `\\\``) // Backticks
    .replace(/~/g, `\\-`) // Tildes
    .replace(/\*/g, `\\*`) // Asterisks
    .replace(/_/g, `\\_`) // Underlines
    .replace(/\|/g, `\\|`); // Vertical bars

/**
* Removes the bot token from a string and replaces it with a placeholder.
* @param str The string to check.
* @returns The cleaned string.
*/
export const removeToken = (str: string, tokens: Array<{ token: string, replacement: string }> = Config.defaultTokenArray): string => {
    for (const token of tokens) str = str.split(token.token).join(token.replacement);
    return str;
};
