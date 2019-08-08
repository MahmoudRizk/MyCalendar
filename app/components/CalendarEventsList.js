import React, {Component} from 'react'

import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'

import '../assets/css/CalendarEventsList.css'

export class CalendarEventsList extends Component{

  render(){
  const view = this.props.result.map((d) => <ListGroup.Item variant="primary">{d.name}</ListGroup.Item>)

  const buttonClick = () => {
    console.log("Key pressed!!!");
    console.log(this.props.date);
    this.props.addCalendarEvent("test");
  }

  return(
    <ListGroup className="events-list scrollbar-primary">
      <Button variant="primary" onClick={buttonClick}>Press Me!</Button>
      {view}
    </ListGroup>
  )}

}

export default CalendarEventsList
