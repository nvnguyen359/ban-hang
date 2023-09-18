const { autoUpdater } = require("electron-updater");
const { SocketIo } = require("../socket");
/** event new update,... */
function eventsAutoUpdate(app) {
  const socket = new SocketIo();
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  let mes = "";
  autoUpdater.checkForUpdates();
  mes = `Đang kiểm tra các bản cập nhật. Phiên bản hiện tại ${app.getVersion()}`;
  socket.sendMessage({ mes, ver: app.getVersion() });
  /*New Update Available*/
  autoUpdater.on("update-available", (info) => {
    mes = `Cập nhật có sẵn. Phiên bản hiện tại ${app.getVersion()}`;
    socket.sendMessage({ mes, ver: app.getVersion() });
    let pth = autoUpdater.downloadUpdate();
    mes = pth;
    socket.sendMessage({ mes, ver: app.getVersion() });
  });

  autoUpdater.on("update-not-available", (info) => {
    mes = `No Cập nhật có sẵn. Phiên bản hiện tại ${app.getVersion()}`;
    socket.sendMessage({ mes, ver: app.getVersion() });
  });

  /*Download Completion Message*/
  autoUpdater.on("update-downloaded", (info) => {
    mes = `Đã tải xuống bản cập nhật. Phiên bản hiện tại ${app.getVersion()}`;
    socket.sendMessage({ mes, ver: app.getVersion() });
  });

  autoUpdater.on("error", (info) => {
    mes = info;
    socket.sendMessage({ mes, ver: app.getVersion() });
  });
  return mes;
}

module.exports = {
  eventsAutoUpdate,
};
