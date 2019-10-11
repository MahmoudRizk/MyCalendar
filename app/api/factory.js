import {GoogleAPI} from './GoogleAPI'

module.exports = {
  factoryAPI: function(name) {
    if(name === 'gmail'){
      return new GoogleAPI();
    }
  },
};
