module.exports = (percent, length) => {
    
    if(length % 2 === 0) {
        length = length + 1;
    }

    let lengthCompleted = Math.round(percent * (length - 1));

    let complete = `-`.repeat(lengthCompleted);
    if(complete) {
        complete = `**` + complete + `**`
    }

    let incomplete = `-`.repeat((length - 1) - lengthCompleted);

    return complete + `●` + incomplete;

}