const {google} = require('googleapis');
const opn = require('opn');
const fs = require('fs');

import {AbstractAPI} from './AbstractAPI'
import {NodeEvents} from '../EventHandler';

const {HOME} = require('../constants/directories');
const path = require('path');

export class GoogleAPI extends AbstractAPI{
  constructor(){
    super();
    this.SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
    this.TOKEN_PATH = path.join(HOME, 'googleToken.json');
    this.credentials = {"installed":{"client_id":"962444181958-7qghcjtabsbj4ob6k2ma4os51qb4crm2.apps.googleusercontent.com","project_id":"quickstart-1562528953248","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"Pu9alsmNs7QE091bYob7gtGw","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}
    const {client_secret, client_id, redirect_uris} = this.credentials.installed;
    this.oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    try{
      let token = fs.readFileSync(this.TOKEN_PATH);
      this.oAuth2Client.setCredentials(JSON.parse(token));
    }
    catch(err){
      console.log(err);
    }
  }

  authorize(){
    const authUrl = this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.SCOPES,
    });
    opn(authUrl);
  }

  saveToken(code){
    const {client_secret, client_id, redirect_uris} = this.credentials.installed;
    this.oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);
    this.oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      this.oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(this.TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', this.TOKEN_PATH);
      });
    });

  }

  callback(err, res){
    let results = [];
    if (err) return console.log('The API returned an error: ' + err);
    const events = res.data.items;
    if (events.length) {
      console.log('Upcoming 400 events:', events);
      events.map((event, i) => {
        const start = event.start.dateTime || event.start.date;
        results.push({date: start.split('T')[0] , value: event.summary})
      });
    } else {
      console.log('No upcoming events found.');
    }
    const eventEmitter = new NodeEvents();
    eventEmitter.emit('CalEvent_addEntry', results);
  }

  fetchData(){
    const auth = this.oAuth2Client;
    const calendar = google.calendar({version: 'v3', auth});
    const startDate = new Date();
    startDate.setDate(1);
    startDate.setMonth(-1);
    let results;
    calendar.events.list({
      calendarId: 'primary',
      timeMin: startDate.toISOString(),
      maxResults: 400,
      singleEvents: true,
      orderBy: 'startTime',
    }, this.callback.bind(this));

    return 'fetchData';
  }
}


export default GoogleAPI;
