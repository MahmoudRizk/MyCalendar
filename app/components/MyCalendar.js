import Calendar from 'react-calendar';

import $ from 'jquery';

export class MyCalendar extends Calendar{

  customView = () => {
    // let padDim = $(window).height() / 16
    $( ".react-calendar__tile" ).css( "padding", "1.95em" );
    $( ".react-calendar" ).css( "width", "auto" );
    // $( ".react-calendar" ).css( "height", "auto" );
    // console.log($(window).height());
    // console.log($(window).width());
  }

  componentDidMount(){
    this.customView();
  }

  componentDidUpdate() {
    this.customView();
  }

}

export default MyCalendar;
