const {HOME} = require('./constants/directories');
import {ipcMain } from 'electron';
import {CalEvent} from './models/CalEvent';

import {factoryAPI} from './api/factory';


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


  }

}

export default EventHandler;
