/* Creates a progress bar based on the percent and length specified */

module.exports = (percent, length) => {
    // If the length is not odd, make it odd
    if(length % 2 === 0) length = length + 1;

    // Find the length completed based on the percent and length specified
    let lengthCompleted = Math.round(percent * (length - 1));

    // Set complete to lengthSpecified Dashes
    let complete = `-`.repeat(lengthCompleted);
    // If there is at least one dash, make it bold
    if(complete) complete = `**` + complete + `**`;

    // Set incomplete to the remainging length left dashes
    let incomplete = `-`.repeat((length - 1) - lengthCompleted);

    // Return complete, a marker for the current position, and incomplete
    return complete + `●` + incomplete;

}