import { ipcMain } from 'electron';
import {
  IPC_DECRYPT_CONTENT,
  IPC_MESSAGE_ERROR,
  IPC_MESSAGE_SUCCESS,
  IPC_SELECT_FILE,
  IPC_WRITE_FILE,
} from '../../shared/common';
import { decryptContent, encryptContent } from '../util';

const { dialog } = require('electron');
const fs = require('fs');

ipcMain.on(IPC_SELECT_FILE, async (event) => {
  // eslint-disable-next-line promise/catch-or-return
  dialog.showOpenDialog({ properties: ['openFile'] }).then((response) => {
    if (!response.canceled) {
      // handle fully qualified file name
      if (response?.canceled === false && response?.filePaths?.length === 1) {
        fs.readFile(response.filePaths[0], 'utf-8', (err: any, data: any) => {
          if (err) {
            event.reply(
              IPC_MESSAGE_ERROR,
              `An error occurred reading the file :${err.message}`
            );
          }
          event.reply(IPC_SELECT_FILE, { data, path: response.filePaths[0] });
        });
      }
    } else {
      console.log('no file selected');
    }
  });
});

ipcMain.on(IPC_WRITE_FILE, (event, args: any[]) => {
  if (args?.length === 1) {
    const data: any = args[0];
    const { content, path, password } = data;
    fs.writeFile(path, encryptContent({ content }, password), (err: any) => {
      if (err) {
        event.reply(
          IPC_MESSAGE_ERROR,
          `An error occurred updating the file${err.message}`
        );
      }
      event.reply(IPC_MESSAGE_SUCCESS, 'The file has been successfully saved');
    });
  }
});

ipcMain.on(IPC_DECRYPT_CONTENT, (event, args) => {
  if (args?.length === 1) {
    const data: any = args[0];
    const { content, password } = data;
    console.log('content', content);
    console.log('password', password);
    event.reply(IPC_DECRYPT_CONTENT, decryptContent(content, password));
  }
});
