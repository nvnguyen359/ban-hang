const { contextBridge, ipcRenderer } = require("electron");

let bridge = {
    updateMessage: (callback) => ipcRenderer.on("updateMessage", callback),
    sendData: (callback) => ipcRenderer.send("sendData", callback),
    upData: (callback) => ipcRenderer.on("upData", callback),
  };
  
  contextBridge.exposeInMainWorld("bridge", bridge);