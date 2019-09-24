import {ipcMain } from 'electron';
import {CalEvent} from './models/CalEvent';

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

  }

}

export default EventHandler;
