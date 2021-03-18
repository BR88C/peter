/**
 * Creates a progress bar based on the percent and length specified.
 *
 * @param {number} percent Percent of progress bar to show complete.
 * @param {number} length Length of the progress bar.
 * @returns {String} Progress bar string.
 */
const progressBar = (percent, length) => {
    // If the length is not odd, make it odd
    if (length % 2 === 0) length = length + 1;

    // Find the length completed based on the percent and length specified
    const lengthCompleted = Math.round(percent * (length - 1));

    // Set complete to lengthSpecified Dashes
    const complete = `─`.repeat(lengthCompleted);

    // Set incomplete to the remainging length left dashes
    const incomplete = `─`.repeat((length - 1) - lengthCompleted);

    // Return complete, a marker for the current position, and incomplete
    return `${complete}🔘${incomplete}`;
};

module.exports = progressBar;
