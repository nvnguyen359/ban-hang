document.addEventListener("DOMContentLoaded", function () {
  window.bridge.updateMessage(updateMessage);
});

function updateMessage(event, message) {
  //alert(message);
  console.log("updateMessage", "message logged in view");
  let elemE = document.getElementById("message");
  console.log(message);
  elemE.innerHTML = `${message}`.replace(":", " ");
  localStorage.setItem("ver", message.split(":")[1]);
  const getversion = document.getElementById("getversion");
  if (getversion) getversion.innerHTML = `${message}`.split(":")[1];
}
function upData(event, data) {
  document.getElementById("updata").innerHTML = "data " + JSON.stringify(data);
}
