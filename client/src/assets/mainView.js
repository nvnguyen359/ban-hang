
document.addEventListener("DOMContentLoaded", function () {
  console.log('load xong!========')
  //alert('main View') 
  window.bridge.updateMessage(updateMessage);
  window.bridge.upData(upData)
});

function updateMessage(event, message) {
  //alert(message);
  console.log("message logged in view");
  let elemE = document.getElementById("message");
  elemE.innerHTML = message;
}
function upData(event,data){
  console,log('updata')
  document.getElementById('updata').innerHTML = 'data '+JSON.stringify(data)
}

