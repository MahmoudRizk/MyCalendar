import Calendar from 'react-calendar';

import $ from 'jquery';

export class MyCalendar extends Calendar{

  customView = () => {
    $( ".react-calendar__tile" ).css( "padding", "2em 2em" );
    $( ".react-calendar" ).css( "width", "auto" );
    $( ".react-calendar" ).css( "height", "auto" );
  }

  componentDidMount(){
    this.customView();
  }

  componentDidUpdate() {
    this.customView();
  }

}

export default MyCalendar;
