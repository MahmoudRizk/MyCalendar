// Update with your config settings.
const path = require('path');
const homedir = require('os').homedir();
module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: path.join(homedir, 'database.sqlite')
    }
  }

};
