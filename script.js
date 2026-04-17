const newsData = [
  {
    title: "Middle East Conflict Escalates as Iran–Israel Attacks Intensify",
    text: "Defence Minister Israel Katz said in a broadcast statement that the strikes in Lebanon have achieved many gains but the campaign against Hezbollah is still not complete.He said: If the fighting resumes, those residents who return to the security zone will have to be evacuated to allow completion of the mission",
    img: "images/news1.jpg"
  },
  {
    title: "News 2",
    text: "Details of news 2...",
    img: "images/news2.jpg"
  },
  {
    title: "News 3",
    text: "Details of news 3...",
    img: "images/news3.jpg"
  },
  {
    title: "News 4",
    text: "Details of news 4...",
    img: "images/news4.jpg"
  },
  {
    title: "News 5",
    text: "Details of news 5...",
    img: "images/news5.jpg"
  },
  {
    title: "News 6",
    text: "Details of news 6...",
    img: "images/news6.jpg"
  },
  {
    title: "News 7",
    text: "Details of news 7...",
    img: "images/news7.jpg"
  },
  {
    title: "News 8",
    text: "Details of news 8...",
    img: "images/news8.jpg"
  },
  {
    title: "News 9",
    text: "Details of news 9...",
    img: "images/news9.jpg"
  }
];

let currentIndex = 0;
const container = document.getElementById("newsContainer");

/* LOAD CARDS */
newsData.forEach((n, i) => {
  container.innerHTML += `
    <div class="card" onclick="openPopup(${i})">
      <div class="img-wrapper">
        <img src="${n.img}">
        <div class="overlay-title">${n.title}</div>
      </div>
    </div>
  `;
});

function openPopup(i) {
  currentIndex = i;
  updatePopup();

  document.getElementById("overlay").classList.add("show");
  document.getElementById("popup").classList.add("show");
}

function nextNews() {
  currentIndex = (currentIndex + 1) % newsData.length;
  updatePopup();
}

function prevNews() {
  currentIndex = (currentIndex - 1 + newsData.length) % newsData.length;
  updatePopup();
}

function closePopup() {
  document.getElementById("overlay").classList.remove("show");
  document.getElementById("popup").classList.remove("show");
}

function updatePopup() {
  const n = newsData[currentIndex];

  document.getElementById("popupImg").src = n.img;
  document.getElementById("popupTitle").innerText = n.title;
  document.getElementById("popupText").innerText = n.text;
}

/* Close on outside click */
document.getElementById("overlay").onclick = closePopup;

/* PAGE NAV */
function showPage(n) {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  document.getElementById("page" + n).classList.remove("hidden");

  document.querySelectorAll(".nav-btn").forEach(btn => btn.classList.remove("active"));
  document.querySelectorAll(".nav-btn")[n - 1].classList.add("active");
}

/* DARK MODE */
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

/* ===== CLOSE ON OUTSIDE CLICK ===== */
document.getElementById("overlay").onclick = closePopup;

onclick="this.classList.toggle('flip')"