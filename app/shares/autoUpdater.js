const { autoUpdater } = require("electron-updater");
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;
/** event new update,... */
function eventsAutoUpdate(curWindow, app) {
  /*New Update Available*/
  autoUpdater.on("update-available", (info) => {
    curWindow.showMessage(
      `Update available. Current version ${app.getVersion()}`
    );
    let pth = autoUpdater.downloadUpdate();
    curWindow.showMessage(pth);
  });

  autoUpdater.on("update-not-available", (info) => {
    curWindow.showMessage(
      `No update available. Current version ${app.getVersion()}`
    );
  });

  /*Download Completion Message*/
  autoUpdater.on("update-downloaded", (info) => {
    curWindow.showMessage(
      `Update downloaded. Current version ${app.getVersion()}`
    );
  });

  autoUpdater.on("error", (info) => {
    curWindow.showMessage(info);
  });
}
function checkForUpdates(curWindow, app) {
  autoUpdater.checkForUpdates();
  curWindow.showMessage(
    `Checking for updates. Current version ${app.getVersion()}`
  );
}
module.exports = { checkForUpdates, eventsAutoUpdate };
