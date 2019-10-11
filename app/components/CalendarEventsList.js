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

  const editButtonClick = () => {
    let id = event.srcElement.id;
    let content = $("#" + id + ".listGroup-content").css("display", "none");
    $("#" + id + ".event-edit").css("display", "none");
    $("#" + id + ".event-delete").css("display", "none");
    $("#" + id + ".event-update").css("display", "inline");
    $("#" + id + ".event-cancel").css("display", "inline");
    $("#" + id + ".form-control.events-input-edit").css("display", "block").val(content[0].innerHTML);
    console.log("edit button", id);
  }

  const cancelButtonClick = () => {
    let id = event.srcElement.id;
    $("#" + id + ".event-edit").css("display", "inline");
    $("#" + id + ".event-delete").css("display", "inline");
    $("#" + id + ".listGroup-content").css("display", "block");
    $("#" + id + ".event-update").css("display", "none");
    $("#" + id + ".event-cancel").css("display", "none");
    $("#" + id + ".form-control.events-input-edit").css("display", "none");
    console.log("Cancel button");
  }

  const updateButtonClick = () => {
    let id = event.srcElement.id;
    let entry = $("#" + id + ".form-control.events-input-edit").val();
    this.props.updateCalendarEvent(id, entry);

    $("#" + id + ".event-edit").css("display", "inline");
    $("#" + id + ".event-delete").css("display", "inline");
    $("#" + id + ".listGroup-content").css("display", "block");
    $("#" + id + ".event-update").css("display", "none");
    $("#" + id + ".event-cancel").css("display", "none");
    $("#" + id + ".form-control.events-input-edit").css("display", "none");

    console.log("Update button");
  }


  const view = this.props.result.map((d) =>
    <ListGroup.Item className="list-group-item-action">
      <Button id={d.id} onClick={delButtonClick} className="event-delete">
        Delete
      </Button>
      <Button id={d.id} onClick={editButtonClick} className="event-edit">
        Edit
      </Button>
      <Button id={d.id} onClick={updateButtonClick} style={{display: 'none'}} className="event-update">
        Update
      </Button>
      <Button id={d.id} onClick={cancelButtonClick} style={{display: 'none'}} className="event-cancel">
        Cancel
      </Button>
      <div className="listGroup-content" id={d.id}>
        {d.name}
      </div>
      <InputGroup className="mb-3">
        <FormControl aria-describedby="basic-addon1" className="events-input-edit" style={{display: 'none'}} id={d.id}/>
      </InputGroup>
    </ListGroup.Item>)


  return(
    <div Style="margin-top: 1%; margin-right: 1%;">
      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <Button variant="primary" onClick={buttonClick}>Add</Button>
        </InputGroup.Prepend>
        <FormControl aria-describedby="basic-addon1" className="events-input" />
      </InputGroup>
      <ListGroup className="events-list scrollbar-primary">
        {view}
      </ListGroup>
    </div>
  )}

}

export default CalendarEventsList
