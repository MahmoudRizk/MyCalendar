import React, {Component} from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import { MdDelete, MdCancel, MdCheck, MdEdit } from 'react-icons/md';
import {Row, Col} from 'react-bootstrap';
import $ from 'jquery';

import '../assets/css/CalendarEventsList.css'

export class CalendarEventsList extends Component{

  render(){
    const buttonClick = () => {
      const val = $( ".form-control.events-input" ).val().trim();
      if(val){
        this.props.addCalendarEvent(val);
        $( ".form-control.events-input" ).val("");
      }
    }

    const delButtonClick = (e, args) => {
      let id = args.id
      this.props.delCalendarEvent(id);
      $("#" + id + ".event-edit").css("display", "");
      $("#" + id + ".event-delete").css("display", "none");
      $("#" + id + ".listGroup-content").css("display", "block");
      $("#" + id + ".event-update").css("display", "none");
      $("#" + id + ".event-cancel").css("display", "none");
      $("#" + id + ".form-control.events-input-edit").css("display", "none");
    }

    const editButtonClick = (e, args) => {
      let id = args.id;
      let content = $("#" + id + ".listGroup-content").css("display", "none");
      $("#" + id + ".event-edit").css("display", "none");
      $("#" + id + ".event-delete").css("display", "inline");
      $("#" + id + ".event-update").css("display", "inline");
      $("#" + id + ".event-cancel").css("display", "inline");
      $("#" + id + ".form-control.events-input-edit").css("display", "block").val(content[0].innerHTML);
      console.log("edit button", id);
    }

    const cancelButtonClick = (e, args) => {
      let id = args.id;
      $("#" + id + ".event-edit").css("display", "");
      $("#" + id + ".event-delete").css("display", "none");
      $("#" + id + ".listGroup-content").css("display", "block");
      $("#" + id + ".event-update").css("display", "none");
      $("#" + id + ".event-cancel").css("display", "none");
      $("#" + id + ".form-control.events-input-edit").css("display", "none");
      console.log("Cancel button");
    }

    const updateButtonClick = (e, args) => {
      let id = args.id;
      let value = $("#" + id + ".form-control.events-input-edit").val();
      this.props.updateCalendarEvent(id, value);

      $("#" + id + ".event-edit").css("display", "");
      $("#" + id + ".event-delete").css("display", "none");
      $("#" + id + ".listGroup-content").css("display", "block");
      $("#" + id + ".event-update").css("display", "none");
      $("#" + id + ".event-cancel").css("display", "none");
      $("#" + id + ".form-control.events-input-edit").css("display", "none");

      console.log("Update button");
    }

    const view = this.props.result.map((d) =>
      <ListGroup.Item className="list-group-item-action">
        <MdCheck size="1.2em" id={d.id} data-id={d.id} onClick={(e) => updateButtonClick(e, {id: d.id})} className="event-update"/>
        <MdDelete size="1.2em" id={d.id} data-id={d.id} onClick={(e) => delButtonClick(e, {id: d.id})} className="event-delete"/>
        <MdCancel size="1.2em" id={d.id} data-id={d.id} onClick={(e) => cancelButtonClick(e, {id: d.id})} className="event-cancel"/>
        <Row>
          <Col>
            <div className="event-content listGroup-content" id={d.id}>
              {d.value}
            </div>
          </Col>
          <Col>
            <MdEdit size="1.2em" id={d.id} data-id={d.id} onClick={(e) => editButtonClick(e, {id: d.id})} className="event-edit"/>
          </Col>
        </Row>
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
    )
  }
}

export default CalendarEventsList
