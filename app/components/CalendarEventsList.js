import React, {Component} from 'react'

import ListGroup from 'react-bootstrap/ListGroup'

import '../assets/css/CalendarEventsList.css'

export class CalendarEventsList extends Component{

  render(){
    const view = this.props.data.map((d) => <ListGroup.Item variant="primary">{d.name}</ListGroup.Item>)

  return(
    <ListGroup className="events-list scrollbar-primary">
      {view}
    </ListGroup>
  )}

}

export default CalendarEventsList
