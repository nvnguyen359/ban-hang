document.addEventListener("DOMContentLoaded", function () {
  window.bridge.updateMessage(updateMessage);
  window.bridge.upData(getPrinters);
});
// document.querySelector(".btn").addEventListener("click", () => {
//   window.bridge.sendData({a:1});
// });
function updateMessage(event, message) {
  console.log("message logged in view");
  let elemE = document.getElementById("message");
  elemE.innerHTML = message;
}

function getPrinters(event, data) {
  document.getElementById(
    "listPrinters"
  ).innerHTML = `Danh sách máy in: ${JSON.stringify(data)}`;
}
