import React, {Component} from 'react';
import {ipcRenderer} from  'electron';
import {Container, Row, Col} from 'react-bootstrap';
const moment = require('moment');

import {MyCalendar} from '../components/MyCalendar'
import {CalendarEventsList} from '../components/CalendarEventsList'

import '../assets/css/App.css';

import $ from 'jquery';

export class App extends Component{

  constructor(props) {
    super();
    this.state = {
      date: new Date(),
      result: []
    };
  }

  tagCalendarTiles = (date) =>{
    const response = ipcRenderer.sendSync("getMonthYearEvents", {date: this.formatDate(date)});
    console.log('tagCalendarTiles');
    console.log(this.state);
    response.map((res) => {
      console.log(res.date, res.count);
      let val = res.date.split("-");
      val = val[0] + val[1] + val[2];
      // $("._"+val).css( "background", "#deeeff" );
      $("._"+val).children().css( "font-weight", "900" ).css( "visibility", "visible" );
    });
    if(this.state.result.length === 0){
      let val = this.formatDate(this.state.date).split("-");
      val = val[0] + val[1] + val[2];
      // $("._"+val).css("background", "");
      $("._"+val).children().css( "font-weight", "normal" )
      $("._"+val).children("p").css( "visibility", "hidden" );
    }
  }

  onChange = date => {
    console.log("=======>", date);
    console.log("=======>", this.state.date);
    this.setState({ date });
    const result = ipcRenderer.sendSync("dateChange", {date: this.formatDate(date)});
    this.setState({result});
    if(date.getMonth() !== this.state.date.getMonth() || date.getYear() !== this.state.date.getYear()){
       // this.tagCalendarTiles(date);
    }
  }

  addCalendarEvent = entry => {
    const response = ipcRenderer.sendSync("addCalendarEvent", {date: this.formatDate(this.state.date), entry: entry});
    if(response.success){
      this.state.result.push({date: this.formatDate(this.state.date), id: response.id, name: entry});
      const result = this.state.result;
      this.setState({result});
    }
    else{
      console.log("Database Error!!");
    }
  }

  delCalendarEvent = (id) => {
    const response = ipcRenderer.sendSync("delCalendarEvent", {id: id});
    if(response){
      const pos = this.state.result.map(function(e) { return e.id.toString(); }).indexOf(id.toString());
      this.state.result.splice(pos, 1);
      const result = this.state.result
      this.setState({result});
    }
    else{
      console.log("Database Error!!");
    }
  }

  updateCalendarEvent = (id, entry) => {
    const response = ipcRenderer.sendSync("updateCalendarEvent", {id: id, entry: entry});
    if(response){
      const pos = this.state.result.map(function(e) { return e.id.toString(); }).indexOf(id.toString());
      this.state.result[pos].name = entry;
      this.setState(this.state.result);
    }
    else{
      console.log("Database Error!!");
    }
  }

  formatDate = date => {
    return moment(date).format('YYYY-MM-DD');
  }

  setDateClass = ({date, view}) => {
    let val = this.formatDate(date).split("-");
    val = val[0] + val[1] + val[2];
    return "_" + val.toString();
  }

  onActiveDateChange = ({ activeStartDate, view }) => {
    console.log("onActiveDateChange", activeStartDate);
    let date = activeStartDate;
    date.setDate(this.state.date.getDate());
    this.setState({date});
    this.onChange(date);
    // this.tagCalendarTiles(activeStartDate);
  }

  // onDrillDown = ({ activeStartDate, view }) => console.log('Drilled down to: ', activeStartDate, view);
  onDrillDown = this.onActiveDateChange;
  onClickDay = (value) => console.log('Clicked day: ', value);
  tileContent =  ({ date, view }) => view === 'month' ? <p Style="visibility: hidden;">.</p> : null
  componentDidMount(){
    this.tagCalendarTiles(this.state.date);
    const result = ipcRenderer.sendSync("dateChange", {date: this.formatDate(this.state.date)});
    this.setState({result});
  }

  componentDidUpdate(){
    console.log('componentDidUpdate', this.state);
    this.tagCalendarTiles(this.state.date);
  }

  render(){
    const {date, result} = this.state;
    return (
      <Container fluid>
        <Row>
          <Col sm={8} className="MyCalendar-col">
            <MyCalendar
              onChange={this.onChange}
              value={date}
              calendarType="Arabic"
              showFixedNumberOfWeeks={true}
              tileClassName={this.setDateClass}
              onActiveDateChange = {this.onActiveDateChange}
              onDrillDown={this.onDrillDown}
              onClickDay={this.onClickDay}
              tagCalendarTiles={this.tagCalendarTiles}
              tileContent={this.tileContent}
            />
          </Col>
          <Col sm={4} className="CalendarEventsList-col">
            <CalendarEventsList
              result={result}
              date={this.formatDate(date)}
              addCalendarEvent={this.addCalendarEvent}
              delCalendarEvent={this.delCalendarEvent}
              updateCalendarEvent={this.updateCalendarEvent}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
