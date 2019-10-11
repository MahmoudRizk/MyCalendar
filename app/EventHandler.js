const {HOME} = require('./constants/directories');
import {ipcMain } from 'electron';
import {CalEvent} from './models/CalEvent';

const events = require('events'); //NodeJS events api
import factoryAPI from './api/factory';

export class NodeEvents extends events{
  //Singleton object that handles events within main process.
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

    ipcMain.on("dateChange", (event, args) => {
      const calEvent = new CalEvent();
      const rows = calEvent.queryByDate(args.date);
      rows.then((result) => {
        event.returnValue = result;
      });
    });

    ipcMain.on("getMonthYearEvents", (event, args) => {
      const calEvent = new CalEvent();
      const rows = calEvent.queryByMonthYear(args.date);
      rows.then((result) => {
        event.returnValue = result;
      });
    });

    ipcMain.on("delCalendarEvent", (event, args) => {
      const calEvent = new CalEvent();
      calEvent.delEntry(args).then((success)=>{
        event.returnValue = success;
      });
    });

    ipcMain.on("addCalendarEvent", (event, args) => {
      const calEvent = new CalEvent();
      calEvent.addEntry(args).then((success)=>{
        event.returnValue = success;
      });
    });

    ipcMain.on("updateCalendarEvent", (event, args) => {
      const calEvent = new CalEvent();
      calEvent.updateEntry(args).then((success)=>{
        event.returnValue = success;
      });
    });

    ipcMain.on("getAuthorize", (event, args) => {
      const api = factoryAPI(args.accountType);
      api.authorize();
      event.returnValue = "";
    });

    ipcMain.on("saveToken", (event, args) => {
      const api = factoryAPI(args.accountType);
      api.saveToken(args.value);
      event.returnValue = "";
    });

    ipcMain.on("syncCalendar", (event, args) => {
      console.log("Sync btn from backend!!");
      const api = factoryAPI('gmail');
      const results = api.fetchData();
      console.log(results);
      event.returnValue = "";
    });

    const eventListener = new NodeEvents();

    eventListener.on('test', (args) => {
      console.log('------->test event reveived!!!', args);
      const calEvent = new CalEvent();
      args.map((a) => {
        calEvent.addEntry(a).then();
      })

    });


  }

}

export default {NodeEvents, EventHandler};
