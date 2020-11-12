const randomint = require(`../utils/randomint.js`);

module.exports = (int) => {
    if(int) {
        return int % 16777215;
    } else {
        return randomint(1,16777215);
    }
}