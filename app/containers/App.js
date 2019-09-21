import React, {Component} from 'react';
import {ipcRenderer} from  'electron';
import {Container, Row, Col} from 'react-bootstrap';

import {MyCalendar} from '../components/MyCalendar'
import {CalendarEventsList} from '../components/CalendarEventsList'

import '../assets/css/App.css';

export class App extends Component{

  constructor(props) {
    super();
    this.state = {
      date: new Date(),
      result: []
    };
  }

  onChange = date => {
    this.setState({ date });
    const result = ipcRenderer.sendSync("dateChange", {date: this.formatDate(date)});
    this.setState({result});
  }

  addCalendarEvent = entry => {
    const response = ipcRenderer.sendSync("addCalendarEvent", {date: this.formatDate(this.state.date), entry: entry});
    if(response.success){
      this.state.result.push({date: this.formatDate(this.state.date), id: response.id, name: entry});
      this.setState(this.state.result);
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
      this.setState(this.state.result);
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
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${year  }/${  month  }/${  day}`;
  }

  componentDidMount(){
    const result = ipcRenderer.sendSync("dateChange", {date: this.formatDate(this.state.date)});
    this.setState({result});
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
