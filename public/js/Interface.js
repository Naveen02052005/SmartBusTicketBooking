let menuBtn = document.querySelector(".menu");
let sideBar = document.querySelector(".sideBar");
let cross = document.querySelector("#cross");

menuBtn.addEventListener("click", () => {
    sideBar.classList.add("active");
});

cross.addEventListener("click", () => {
    sideBar.classList.remove("active");
});

