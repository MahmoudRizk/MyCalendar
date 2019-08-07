import React, {Component} from 'react';
import '../assets/css/App.css';

import {Container, Row, Col} from 'react-bootstrap';

import {MyCalendar} from '../components/MyCalendar'
import {CalendarEventsList} from '../components/CalendarEventsList'

import {ipcRenderer} from  'electron';

export class App extends Component{

  constructor(props) {
        super();
        this.state = {
            date: new Date(),
            result: []
        };
  }
  onChange = date => {
    this.setState({ date: date });

    console.log(date.toLocaleDateString());
    console.log(typeof(date));
    console.log(this.formatDate(date));

    let result = ipcRenderer.sendSync("dateChange", {date: this.formatDate(date)});
    this.setState({result: result});
    console.log(result);
  }

  formatDate = date => {

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    return year + '/' + month + '/' + day;
  }

  render(){

  const {date, result} = this.state;

  return (

      <Container fluid={true}>
        <Row>
          <Col sm={8} className="MyCalendar-col">
              <MyCalendar onChange={this.onChange}
                          value={date}
                          calendarType="Arabic"/>
          </Col>
          <Col sm={4} className="CalendarEventsList-col">
              <CalendarEventsList data={result}/>
          </Col>
        </Row>
      </Container>

  );
  }
}

export default App;
