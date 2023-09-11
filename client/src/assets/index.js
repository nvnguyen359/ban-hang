setTimeout(() => {
  jsRun();
  window.addEventListener( 'hashchange', event => {
    console.log( `should render page: ${ window.location.hash }` )
   
  });
}, 500);
function jsRun() {
  var btns = document.querySelectorAll(".btns-left  .btn-left");
  btns.forEach((btn, index) => {
    if (btn.textContent == "Tất Cả") {
      btn.classList.add("active");
    }
    if (btn) {
      btn.addEventListener("click", () => {
        let btns = document.querySelectorAll(".btns-left  .btn-left");
        btns.forEach((btn) => {
          btn.classList.remove("active");
        });
        localStorage.setItem('url',btn.getAttribute('data-id'))
        btn.classList.add("active");
      });
    }
  });
}
