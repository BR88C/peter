/* Checks if a value specified is valid */

module.exports = (input, min, max, message, offString) => {
	let specifiedValue = input;
	if(offString && specifiedValue.toLowerCase() === offString) specifiedValue = 0;
	specifiedValue = parseInt(specifiedValue);
	if(isNaN(specifiedValue)) {
        message.reply(`please specify an Integer!`);
        return `invalid`;
    }
    if(specifiedValue > max || specifiedValue < min) {
        message.reply(`please specify a value between ${min} and ${max}!`);
        return `invalid`;
    }
    return specifiedValue;
}