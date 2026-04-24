/* ================================================================
   WEEKLY RECODE — script.js
   Fixes: winnerTitle binding, date display, popup position,
          keyboard navigation, accessibility, animation resets
================================================================ */

let newsData = [];
let currentIndex = 0;

/* ── SET TODAY'S DATE ── */
(function setDate() {
  const el = document.getElementById("currentDate");
  if (!el) return;
  const opts = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  el.textContent = new Date().toLocaleDateString("en-IN", opts);
})();

/* ================================================================
   LOAD JSON DATA
================================================================ */
fetch("data.json")
  .then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  })
  .then(data => {
    loadNews(data.news);
    loadWinner(data.winner);
    loadDidYouKnow(data.didYouKnow);
    setTimeout(triggerWinnerAnimation, 400);
  })
  .catch(err => console.error("Failed to load data.json:", err));

/* ================================================================
   LOAD NEWS CARDS
================================================================ */
function loadNews(news) {
  if (!news) return;
  const container = document.getElementById("newsContainer");
  if (!container) return;

  newsData = news;
  container.innerHTML = "";

  newsData.forEach((item, i) => {
    const card = document.createElement("article");
    card.className = "news-card";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `Read article: ${item.title}`);

    card.innerHTML = `
      <div class="card-img-wrap">
        <img class="card-img" src="${item.img}" alt="${item.title}" loading="lazy">
        <div class="card-overlay"></div>
        <div class="card-number">${String(i + 1).padStart(2, "0")}</div>
        <div class="card-title-overlay">${item.title}</div>
      </div>
    `;

    card.addEventListener("click", () => openPopup(i));
    card.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openPopup(i);
      }
    });

    container.appendChild(card);
  });
}

/* ================================================================
   POPUP
================================================================ */
function openPopup(i) {
  currentIndex = i;
  updatePopup();

  const overlay = document.getElementById("overlay");
  const popup   = document.getElementById("popup");

  overlay.classList.add("show");
  popup.classList.add("show");

  /* Focus trap: focus close button */
  setTimeout(() => {
    const closeBtn = popup.querySelector(".close-btn");
    if (closeBtn) closeBtn.focus();
  }, 100);
}

function closePopup() {
  document.getElementById("overlay").classList.remove("show");
  document.getElementById("popup").classList.remove("show");
}

function updatePopup() {
  const item = newsData[currentIndex];
  if (!item) return;

  document.getElementById("popupImg").src = item.img;
  document.getElementById("popupImg").alt = item.title;
  document.getElementById("popupTitle").textContent = item.title;
  document.getElementById("popupText").textContent  = item.text;
  document.getElementById("popupCounter").textContent = `${currentIndex + 1} / ${newsData.length}`;

  /* Scroll body back to top when navigating */
  const body = document.querySelector(".popup-body");
  if (body) body.scrollTop = 0;
}

function nextNews() {
  currentIndex = (currentIndex + 1) % newsData.length;
  updatePopup();
}

function prevNews() {
  currentIndex = (currentIndex - 1 + newsData.length) % newsData.length;
  updatePopup();
}

/* ================================================================
   EVENT LISTENERS
================================================================ */
document.addEventListener("DOMContentLoaded", () => {
  /* Close on overlay click */
  document.getElementById("overlay").addEventListener("click", closePopup);

  /* Keyboard: Escape to close, arrows to navigate */
  document.addEventListener("keydown", e => {
    const popup = document.getElementById("popup");
    if (!popup.classList.contains("show")) return;

    if (e.key === "Escape")      closePopup();
    if (e.key === "ArrowRight")  nextNews();
    if (e.key === "ArrowLeft")   prevNews();
  });
});

/* ================================================================
   PAGE NAVIGATION
================================================================ */
function showPage(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  const target = document.getElementById(`page${page}`);
  if (target) {
    target.classList.remove("hidden");
    /* Re-trigger animation */
    target.style.animation = "none";
    void target.offsetWidth;
    target.style.animation = "";
  }

  document.querySelectorAll(".nav-btn").forEach(btn => btn.classList.remove("active"));
  const activeBtn = document.querySelector(`.nav-btn[data-page="${page}"]`);
  if (activeBtn) activeBtn.classList.add("active");

  if (page === 3) {
    /* Slight delay so card is visible before animating */
    setTimeout(triggerWinnerAnimation, 120);
  }
}

/* ================================================================
   DARK MODE
================================================================ */
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const btn = document.querySelector(".theme-icon");
  if (btn) {
    btn.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
  }
}

/* ================================================================
   LOAD WINNER
================================================================ */
function loadWinner(winner) {
  if (!winner) return;

  const nameEl  = document.querySelector(".winner-name");
  const titleEl = document.getElementById("winnerTitle");
  const imgEl   = document.querySelector(".winner-image img");

  if (imgEl)   imgEl.src = winner.image;
  if (titleEl) titleEl.textContent = winner.title || "Champion";

  if (nameEl) {
    /* Split name into individual <span> letters for animation */
    nameEl.innerHTML = winner.name
      .split("")
      .map(ch => `<span>${ch === " " ? "&nbsp;" : ch}</span>`)
      .join("");
  }
}

/* ================================================================
   LOAD DID YOU KNOW
================================================================ */
function loadDidYouKnow(facts) {
  if (!facts) return;
  const container = document.querySelector(".flip-container");
  if (!container) return;

  container.innerHTML = "";

  facts.forEach(fact => {
    const card = document.createElement("div");
    card.className = "flip-card";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `Fact: ${fact.title}. Click to reveal.`);

    card.innerHTML = `
      <div class="flip-inner">
        <div class="flip-front">${fact.title}</div>
        <div class="flip-back">${fact.content}</div>
      </div>
    `;

    card.addEventListener("click", () => card.classList.toggle("flip"));
    card.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.classList.toggle("flip");
      }
    });

    container.appendChild(card);
  });
}

/* ================================================================
   WINNER ANIMATION
================================================================ */
function triggerWinnerAnimation() {
  const card   = document.querySelector(".winner-card");
  const nameEl = document.querySelector(".winner-name");

  if (!card || !nameEl) return;

  /* Reset first */
  card.classList.remove("animate");
  nameEl.classList.remove("flip-text");

  /* Force reflow */
  void card.offsetWidth;

  card.classList.add("animate");

  /* Delay text flip until card reveals */
  setTimeout(() => {
    nameEl.classList.add("flip-text");
  }, 500);
}