document.addEventListener("DOMContentLoaded", function () {
  window.bridge.updateMessage(updateMessage);
  window.bridge.upData(getPrinters);

});
document.querySelector(".refesh").addEventListener("click", () => {
  window.bridge.sendData("install");
});
function updateMessage(event, message) {
  console.log("message logged in view");
  let elemE = document.getElementById("message");
  if (`${message}`.includes("Khởi động lại")) {
    document.querySelector(".refesh").classList.add("show");
  } else {
    document.querySelector(".refesh").classList.remove("show");
  }
  elemE.innerHTML = message;
}
