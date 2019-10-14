import {ipcMain } from 'electron';

import {CalEvent} from './models/CalEvent';
import factoryAPI from './api/factory';

const {HOME} = require('./constants/directories');
const events = require('events'); //NodeJS events api

export class NodeEvents extends events{//Singleton object that handles events within main process.
  constructor(){
    super();
    if(!!NodeEvents.instance){
      return NodeEvents.instance;
    }
    NodeEvents.instance = this;
    return this;
  }
}

export class EventHandler{
  constructor(){

    ipcMain.on("CalEvent_queryByDate", (event, args) => {
      const calEvent = new CalEvent();
      const rows = calEvent.queryByDate({date: args.date});
      rows.then((result) => {
        event.returnValue = result;
      });
    });

    ipcMain.on("CalEvent_queryByMonthYear", (event, args) => {
      const calEvent = new CalEvent();
      const rows = calEvent.queryByMonthYear({date: args.date});
      rows.then((result) => {
        event.returnValue = result;
      });
    });

    ipcMain.on("CalEvent_delEntry", (event, args) => {
      const calEvent = new CalEvent();
      calEvent.delEntry({id: args.id}).then((success)=>{
        event.returnValue = success;
      });
    });

    ipcMain.on("CalEvent_addEntry", (event, args) => {
      const calEvent = new CalEvent();
      calEvent.addEntry(args).then((success)=>{
        event.returnValue = success;
      });
    });

    ipcMain.on("CalEvent_updateEntry", (event, args) => {
      const calEvent = new CalEvent();
      calEvent.updateEntry(args).then((success)=>{
        event.returnValue = success;
      });
    });

    ipcMain.on("api_getAuthorize", (event, args) => {
      const api = factoryAPI(args.accountType);
      api.authorize();
      event.returnValue = "";
    });

    ipcMain.on("api_saveToken", (event, args) => {
      const api = factoryAPI(args.accountType);
      api.saveToken(args.value);
      event.returnValue = "";
    });

    ipcMain.on("api_fetchData", (event, args) => {
      const api = factoryAPI('gmail');
      const results = api.fetchData();
      console.log(results);
      event.returnValue = "";
    });

    const eventListener = new NodeEvents();

    eventListener.on('CalEvent_addEntry', (args) => {
      console.log('------->test event reveived!!!', args);
      const calEvent = new CalEvent();
      calEvent.addEntry(args).then();
    });
  }
}

export default {NodeEvents, EventHandler};
