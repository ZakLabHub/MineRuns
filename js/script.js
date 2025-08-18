// Sidebar principale
const toggleBtn = document.getElementById("toggleSidebar");
const sidebar = document.querySelector(".sidebar");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
});

// Sidebar secondaire
const sidebar2 = document.getElementById("sidebar2");
const openBtn = document.getElementById("openSidebar2");
const closeBtn = document.getElementById("closeSidebar2");
const overlay = document.getElementById("overlay");

openBtn.addEventListener("click", () => {
  sidebar2.classList.add("active");
  overlay.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  sidebar2.classList.remove("active");
  overlay.style.display = "none";
});

overlay.addEventListener("click", () => {
  sidebar2.classList.remove("active");
  overlay.style.display = "none";
});
