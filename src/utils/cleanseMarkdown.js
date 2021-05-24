/**
 * Cleanses a string from markdown formatting, adding back slashes to do so.
 * @param {string} str The string to cleanse.
 * @returns {string} The cleansed string.
 */
const cleanseMarkdown = (str) => str
    .replace(/`/g, `\\\``) // Backticks
    .replace(/~/g, `\\-`) // Tildes
    .replace(/\*/g, `\\*`) // Asterisks
    .replace(/_/g, `\\_`) // Underlines
    .replace(/\|/g, `\\|`); // Vertical bars

module.exports = cleanseMarkdown;
