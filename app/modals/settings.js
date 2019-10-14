const remote = require('electron').remote;
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

function modalClose(){
   var window = remote.getCurrentWindow();
   window.close();
 }

function GmailLoginBtn(){
 $('#gmail-form').css('display', 'block');
 const response = ipcRenderer.sendSync('api_getAuthorize', {accountType: 'gmail'});
}

function gmailAdd(){
  let val = $('#gmail-token').val();
  const response = ipcRenderer.sendSync('api_saveToken', {accountType: 'gmail', value: val});
}

function outlookAdd(){
   let a = $('#outlook-token').val();
}
