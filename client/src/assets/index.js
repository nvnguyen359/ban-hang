setTimeout(() => {
  jsRun();
  window.addEventListener("hashchange", (event) => {
    console.log(`should render page: ${window.location.hash}`);
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
        localStorage.setItem("url", btn.getAttribute("data-id"));
        btn.classList.add("active");
      });
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const menus = document.querySelectorAll(".menu  a.menu-item");
  const url = this.location.pathname.split(";")[0];
  if (menus) {
    if (url == "/") menus[0].classList.add("active");
    menus.forEach((a) => {
      if (a.getAttribute("href").includes(url)) {
        a.classList.add("active");
      }
    });
    menus.forEach((a, index) => {
      a.addEventListener("click", (event) => {
        menus.forEach((x) => x.classList.remove("active"));
        a.classList.add("active");
      });
    });
    document.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
      const item = document.getElementById("id-input-search");
        if (item) {
          item.style.width = "100%";
          item.style.opacity = "1";
          item.focus()
         document.getElementById('icon-search').classList.add('show')
        }
      }
    });
  }
});
