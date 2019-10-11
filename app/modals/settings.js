const remote = require('electron').remote;
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

function modalClose(){
   console.log("button pressed!!");
   var window = remote.getCurrentWindow();
   window.close();
 }

function GmailLoginBtn(){
 console.log("btn pressed!!");
 $('#gmail-form').css('display', 'block');
 const response = ipcRenderer.sendSync('getAuthorize', {accountType: 'gmail'});
 console.log(response);
}

function gmailAdd(){
  console.log("button pressed!!");
  let val = $('#gmail-token').val();
  const response = ipcRenderer.sendSync('saveToken', {accountType: 'gmail', value: val});
  console.log(a);
}

function outlookAdd(){
   console.log("button pressed!!");
   let a = $('#outlook-token').val();
   console.log(a);
 }
