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
}

function gmailAdd(){
  console.log("button pressed!!");
  let val = $('#gmail-token').val();
}

function outlookAdd(){
   console.log("button pressed!!");
   let a = $('#outlook-token').val();
   console.log(a);
 }
