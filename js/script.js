// NASA Space Explorer App - JSON Edition
// Author: Michael Hines
// Description: Fetches NASA APOD-style data from provided JSON feed
// Displays 9 items between selected dates with modal and video support

const gallery = document.getElementById("gallery");
const btn = document.getElementById("getImageBtn");
const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");

// 🔭 JSON data source
const apodData = "https://cdn.jsdelivr.net/gh/GCA-Classroom/apod/data.json";

// 🌠 Random space facts (LevelUp)
const facts = [
  "Venus spins backward compared to most planets.",
  "One day on Mercury lasts 1,408 hours.",
  "Neutron stars can spin 600 times per second.",
  "There are more stars in the universe than grains of sand on Earth.",
  "Saturn could float in water because it’s so light.",
  "The Sun makes up 99.86% of the solar system’s mass.",
  "A day on Venus is longer than a year on Venus."
];

// Show random fact each page load
document
  .querySelector(".filters")
  .insertAdjacentHTML(
    "beforebegin",
    `<div class="random-fact"><p>💫 Did you know? ${
      facts[Math.floor(Math.random() * facts.length)]
    }</p></div>`
  );

// 🌌 Create modal
const modal = document.createElement("div");
modal.className = "modal";
modal.innerHTML = `
  <div class="modal-content">
    <span class="close-btn">&times;</span>
    <img id="modalImage" src="" alt="">
    <h2 id="modalTitle"></h2>
    <p id="modalDate"></p>
    <p id="modalExplanation"></p>
  </div>
`;
document.body.appendChild(modal);

// Close modal on click or background
const closeModal = () => (modal.style.display = "none");
modal.querySelector(".close-btn").addEventListener("click", closeModal);
window.addEventListener("click", e => { if (e.target === modal) closeModal(); });

// 🚀 Fetch and render gallery
btn.addEventListener("click", async () => {
  gallery.innerHTML = `<div class="placeholder"><p>🔄 Loading space photos...</p></div>`;

  try {
    const res = await fetch(apodData);
    const data = await res.json();

    // Handle missing date inputs gracefully
    if (!startDate.value || !endDate.value) {
      alert("Please select a start and end date before fetching images.");
      gallery.innerHTML = `<div class="placeholder"><p>👆 Choose a date range above to begin exploring.</p></div>`;
      return;
    }

    const start = new Date(startDate.value);
    const end = new Date(endDate.value);

    // Filter results between selected dates
    const filtered = data.filter(item => {
      const d = new Date(item.date);
      return d >= start && d <= end;
    }).slice(0, 9);

    // If no matches, fallback to last 9 items in JSON
    const results = filtered.length ? filtered : data.slice(-9);

    gallery.innerHTML = "";

    // Build gallery cards
    results.forEach(item => {
      const card = document.createElement("div");
      card.className = "gallery-item";

      // Handle image or video entries
      let mediaHTML = "";
      if (item.media_type === "video") {
        // Display thumbnail or embed player
        if (item.thumbnail_url) {
          mediaHTML = `
            <a href="${item.url}" target="_blank">
              <img src="${item.thumbnail_url}" alt="${item.title}">
            </a>`;
        } else {
          mediaHTML = `
            <div class="video-wrapper">
              <iframe src="${item.url}" frameborder="0" allowfullscreen></iframe>
            </div>`;
        }
      } else {
        mediaHTML = `<img src="${item.url}" alt="${item.title}">`;
      }

      card.innerHTML = `
        ${mediaHTML}
        <h3>${item.title}</h3>
        <p>${new Date(item.date).toLocaleDateString()}</p>
      `;

      // Add modal only for image items
      if (item.media_type === "image") {
        card.addEventListener("click", () => {
          document.getElementById("modalImage").src = item.hdurl || item.url;
          document.getElementById("modalTitle").textContent = item.title;
          document.getElementById("modalDate").textContent = new Date(item.date).toDateString();
          document.getElementById("modalExplanation").textContent = item.explanation;
          modal.style.display = "flex";
        });
      }

      gallery.appendChild(card);
    });

    // If no images found after filtering
    if (results.length === 0) {
      gallery.innerHTML = `<p>No results found for those dates. Try another range.</p>`;
    }
  } catch (err) {
    console.error("Error fetching NASA data:", err);
    gallery.innerHTML = `<p>❌ Unable to load data. Please try again later.</p>`;
  }
});

// 🗓 Auto-fill default date range (last 9 days)
window.addEventListener("load", () => {
  const today = new Date();
  const past = new Date();
  past.setDate(today.getDate() - 8); // 9 days total
  startDate.value = past.toISOString().split("T")[0];
  endDate.value = today.toISOString().split("T")[0];
});
