import Calendar from 'react-calendar';

import $ from 'jquery';

export class MyCalendar extends Calendar{

  customView = () => {
    // let padDim = $(window).height() / 16
    $( ".react-calendar__tile" ).css( "padding", "1.9em" );
    $( ".react-calendar" ).css( "width", "auto" );
    // $( ".react-calendar" ).css( "height", "auto" );
    // console.log($(window).height());
    // console.log($(window).width());
    $( ".react-calendar" ).css( "border", "0px" );
    $( ".react-calendar__navigation" ).css( "margin-left", "4%" ).css("margin-right","4%");
  }

  componentDidMount(){
    this.customView();
    $(".react-calendar__navigation").append("<button class='btn' id='sync' style='background: green; color: #fff; margin-top: 0.5%;'>Sync</button>");
    $(".react-calendar__navigation").children('#sync').click(this.props.sync);
  }

  componentDidUpdate() {
    this.customView();
  }

}

export default MyCalendar;
