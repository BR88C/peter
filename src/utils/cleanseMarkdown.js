/**
 * Adds a backslash before all markdown formatting characters in a string
 * 
 * @param {string} string String to be cleansed
 * @returns The cleaned string
 */
const cleanseMarkdown = (string) => {
    return string
        .replace(/\`/g, `\\\``) // Backticks
        .replace(/~/g, `\\-`) // Tildes
        .replace(/\*/g, `\\*`) // Asterisks
        .replace(/_/g, `\\_`) // Underlines
        .replace(/\|/g, `\\|`); // Vertical bars
};

module.exports = cleanseMarkdown;