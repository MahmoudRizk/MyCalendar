import React, {Component} from 'react'

import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'

import '../assets/css/CalendarEventsList.css'

import $ from 'jquery';

export class CalendarEventsList extends Component{

  render(){

  const buttonClick = () => {
    const val = $( ".form-control.events-input" ).val().trim();
    if(val){
      this.props.addCalendarEvent(val);
      $( ".form-control.events-input" ).val("");
    }

  }

  const delButtonClick = () => {
    this.props.delCalendarEvent(event.srcElement.id);
    console.log(event.srcElement.id);
  }

  const view = this.props.result.map((d) =>
    <ListGroup.Item variant="primary">
      <Button id={d.id} onClick={delButtonClick}>
        Delete
      </Button>
      {d.name}
    </ListGroup.Item>)


  return(
    <ListGroup className="events-list scrollbar-primary">
      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <Button variant="primary" onClick={buttonClick}>Add</Button>
        </InputGroup.Prepend>
        <FormControl aria-describedby="basic-addon1" className="events-input" />
      </InputGroup>
      {view}
    </ListGroup>
  )}

}

export default CalendarEventsList
