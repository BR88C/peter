/**
 * Adds a backslash before all markdown formatting characters in a string
 * 
 * @param {string} string String to be cleansed
 * @returns The cleaned string
 */
const cleanseMarkdown = (string) => {
    string
        .replace(`\``, `\\\``) // Backticks
        .replace(`-`, `\\-`) // Hyphens
        .replace(`*`, `\\*`) // Asterisks
        .replace(`_`, `\\_`) // Underlines
        .replace(`|`, `\\|`); // Vertical bars

    return string;
};

module.exports = cleanseMarkdown;