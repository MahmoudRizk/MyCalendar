import {CalEvent} from './CalEvent';

export class Migrations{
  constructor(){
    CalEvent.migrate();
  }

}
  export default Migrations;
