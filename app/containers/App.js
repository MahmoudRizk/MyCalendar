import React, {Component} from 'react';
import {ipcRenderer} from  'electron';
import {Container, Row, Col} from 'react-bootstrap';
import $ from 'jquery';

import {MyCalendar} from '../components/MyCalendar'
import {CalendarEventsList} from '../components/CalendarEventsList'
import '../assets/css/App.css';

const moment = require('moment');

export class App extends Component{
  constructor(props) {
    super();
    this.state = {
      date: new Date(),
      result: []
    };
  }

  tagCalendarTiles = (date) =>{
    const response = ipcRenderer.sendSync("CalEvent_queryByMonthYear", {date: this.formatDate(date)});
    response.map((res) => {
      let val = res.date.split("-");
      val = val[0] + val[1] + val[2];
      $("._"+val).children().css( "font-weight", "900" ).css( "visibility", "visible" );
    });
    if(this.state.result.length === 0){
      let val = this.formatDate(this.state.date).split("-");
      val = val[0] + val[1] + val[2];
      $("._"+val).children().css( "font-weight", "normal" )
      $("._"+val).children("div").css( "visibility", "hidden" );
    }
  }

  onChange = date => {
    this.setState({ date });
    const result = ipcRenderer.sendSync("CalEvent_queryByDate", {date: this.formatDate(date)});
    this.setState({result});
  }

  addCalendarEvent = value => {
    const response = ipcRenderer.sendSync("CalEvent_addEntry", {date: this.formatDate(this.state.date), value: value});
    if(response.success){
      this.state.result.push({date: this.formatDate(this.state.date), id: response.id, value: value});
      const result = this.state.result;
      this.setState({result});
    }
    else{
      console.log("Database Error!!");
    }
  }

  delCalendarEvent = (id) => {
    const response = ipcRenderer.sendSync("CalEvent_delEntry", {id: id});
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

  updateCalendarEvent = (id, value) => {
    const response = ipcRenderer.sendSync("CalEvent_updateEntry", {id: id, value: value});
    if(response){
      const pos = this.state.result.map(function(e) { return e.id.toString(); }).indexOf(id.toString());
      this.state.result[pos].value = value;
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
    let date = activeStartDate;
    date.setDate(this.state.date.getDate());
    this.setState({date});
    this.onChange(date);
  }

  onDrillDown = this.onActiveDateChange;
  tileContent =  ({ date, view }) => view === 'month' ? <div Style="visibility: hidden;">.</div> : null

  sync = () => {
    console.log('Sync btn!!');
    const response = ipcRenderer.sendSync("api_fetchData");
  }

  componentDidMount(){
    this.tagCalendarTiles(this.state.date);
    const result = ipcRenderer.sendSync("CalEvent_queryByDate", {date: this.formatDate(this.state.date)});
    this.setState({result});
  }

  componentDidUpdate(){
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
              tileContent={this.tileContent}
              sync={this.sync}
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
