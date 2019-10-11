import {GoogleAPI} from './GoogleAPI'

function factoryAPI(name) {
  if(name === 'gmail'){
    return new GoogleAPI();
  }
}

export default factoryAPI;
