import { app, BrowserWindow } from 'electron';
import path from 'node:path';

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  const url = process.env.VITE_DEV_SERVER_URL;
  if (url) {
    win.loadURL(url);
  } else {
    win.loadFile(path.join(__dirname, '../index.html'));
  }
}

app.whenReady().then(createWindow);
