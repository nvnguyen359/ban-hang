const { autoUpdater } = require("electron-updater");
const { getPrinters } = require("./lib");
autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;
function newUpdate(app) {
  let mes = "";
  /*New Update Available*/
  return new Promise((res, rej) => {
    autoUpdater.on("update-available", (info) => {
      mes = `Cập nhật có sẵn. Phiên bản hiện tại ${app.getVersion()}`;
      let pth = autoUpdater.downloadUpdate();
      mes = pth;
      res(mes);
    });
  });
}
function checkupdateNotAvailable(curWindow, app) {
  return new Promise((res, rej) => {
    let mes = "";
    autoUpdater.on("update-not-available", (info) => {
      mes = `Cập nhật không có sẵn. Phiên bản hiện tại ${app.getVersion()}`;
      curWindow.showMessage(mes);
      res(mes);
    });
  });
}
function updateDownloaded(app) {
  let mes = "";
  /*New Update Available*/
  return new Promise((res, rej) => {
    autoUpdater.on("update-available", (info) => {
      mes = `Cập nhật có sẵn. Phiên bản hiện tại ${app.getVersion()}`;
      let pth = autoUpdater.downloadUpdate();
      mes = pth;
    });
    res(mes);
  });
}
function downloadComplete(app) {
  return new Promise((res, rej) => {
    let mes = "";
    autoUpdater.on("update-downloaded", (info) => {
      mes = `Đã tải xuống bản cập nhật. Phiên bản hiện tại ${app.getVersion()}`;
      res(mes);
    });
  });
}
/** event new update,... */
function eventsAutoUpdate(curWindow, app) {
  let mes = "";
  /*New Update Available*/
  autoUpdater.on("update-available", (info) => {
    mes = `Cập nhật có sẵn. Phiên bản hiện tại ${app.getVersion()}`;
    curWindow.showMessage(mes);
    let pth = autoUpdater.downloadUpdate();
    mes = pth;
    curWindow.showMessage(pth);
  });

  autoUpdater.on("update-not-available", (info) => {
    mes = `No Cập nhật có sẵn. Phiên bản hiện tại ${app.getVersion()}`;
    curWindow.showMessage(mes);
  });

  /*Download Completion Message*/
  autoUpdater.on("update-downloaded", (info) => {
    mes = `Đã tải xuống bản cập nhật. Phiên bản hiện tại ${app.getVersion()}`;
    curWindow.showMessage(mes);
  });

  autoUpdater.on("error", (info) => {
    mes = info;
    curWindow.showMessage(info);
  });
  return mes;
}
function checkForUpdates(curWindow, app) {
  let mes = "";
  autoUpdater.checkForUpdates();
  mes = `Đang kiểm tra các bản cập nhật. Phiên bản hiện tại ${app.getVersion()}`;
  curWindow.showMessage(mes);
  getPrinters().then((data) => {
    curWindow.upData(JSON.stringify(data));
  });
  return { mes, ver: app.getVersion() };
}
module.exports = {
  checkForUpdates,
  eventsAutoUpdate,
  newUpdate,
  checkupdateNotAvailable,
  updateDownloaded,
  downloadComplete
};
