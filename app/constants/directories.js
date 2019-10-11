const path = require('path');
const homedir = require('os').homedir();

module.exports = { HOME : path.join(homedir, '/.MyCalendar')};
