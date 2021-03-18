/**
 * Adds a backslash before all markdown formatting characters in a string.
 *
 * @param {String} string String to be cleansed.
 * @returns {String} The cleaned string.
 */
const cleanseMarkdown = (string) =>
    string
        .replace(/\`/g, `\\\``) // Backticks
        .replace(/~/g, `\\-`) // Tildes
        .replace(/\*/g, `\\*`) // Asterisks
        .replace(/_/g, `\\_`) // Underlines
        .replace(/\|/g, `\\|`) // Vertical bars
;

module.exports = cleanseMarkdown;
