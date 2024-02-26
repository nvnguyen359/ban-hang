
document.addEventListener("DOMContentLoaded", function () {
  window.bridge.updateMessage(updateMessage);
  console.log('load xong!========')
 // window.bridge.upData(upData)
});

function updateMessage(event, message) {
  //alert(message);
  console.log("updateMessage","message logged in view");
  let elemE = document.getElementById("message");
  console.log(message)
  elemE.innerHTML = message;
}
function upData(event,data){
  document.getElementById('updata').innerHTML = 'data '+JSON.stringify(data)
}

