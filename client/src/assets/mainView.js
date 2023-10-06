
try {
  document.getElementById("btPrintPos").addEventListener("click", () => {
 
    sendTestPrint()
  });
  function sendTestPrint() {
    window.bridge.send('test-print',{a:1})
  }
  document.addEventListener("DOMContentLoaded", function () {
    window.bridge.updateMessage(updateMessage);
    window.bridge.upData(upData)
  });
  
  function updateMessage(event, message) {
    console.log("message logged in view");
    let elemE = document.getElementById("message");
    elemE.innerHTML = message;
  }
  function upData(event,data){
    document.getElementById('updata').innerHTML = 'data '+JSON.stringify(data)
  }
  
} catch (error) {
  
}

