/**
 * Checks if a value specified is valid.
 * @param {any} input Input number.
 * @param {number} min Max accepted value.
 * @param {number} max Min accepted value.
 * @param {Object} message Message object.
 * @param {String} offString String to set value to min.
 * @returns {number} Parsed input value.
 */
const checkValueSpecified = (input, min, max, message, offString) => {
    let specifiedValue = input;
    if (offString && specifiedValue.toLowerCase() === offString) specifiedValue = min;
    specifiedValue = parseInt(specifiedValue);

    if (isNaN(specifiedValue)) {
        message.channel.send(`Error: Invalid value! Please specify an Integer.`);
        return `invalid`;
    }

    if (specifiedValue > max || specifiedValue < min) {
        message.channel.send(`Error: Invalid value! Please specify a value between ${min} and ${max}.`);
        return `invalid`;
    }

    return specifiedValue;
};

module.exports = checkValueSpecified;
