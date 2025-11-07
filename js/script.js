// NASA Space Explorer App (Class JSON Edition)
// Author: Michael Hines

const apodData = "https://cdn.jsdelivr.net/gh/GCA-Classroom/apod/data.json";

const gallery = document.getElementById("gallery");
const btn = document.getElementById("getImageBtn");
const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");

// 🌠 Random "Did You Know?" Facts
const facts = [
  "A day on Venus is longer than a year on Venus.",
  "Neutron stars can spin up to 600 times per second.",
  "There are more trees on Earth than stars in the Milky Way.",
  "Jupiter’s Great Red Spot has been raging for at least 400 years.",
  "One million Earths could fit inside the Sun.",
  "The footprints on the Moon will last for millions of years.",
  "The largest known volcano is on Mars — Olympus Mons.",
  "Saturn could float in water due to its low density.",
  "Space smells like seared steak and hot metal according to astronauts!",
  "The coldest known place in the universe is a Boomerang Nebula."
];

function showRandomFact() {
  const fact = facts[Math.floor(Math.random() * facts.length)];
  const factBox = document.createElement("div");
  factBox.className = "space-fact";
  factBox.textContent = `💫 Did you know? ${fact}`;
  document.body.insertBefore(factBox, gallery);
}

// 🌌 Modal setup
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

const closeModal = () => (modal.style.display = "none");
modal.querySelector(".close-btn").addEventListener("click", closeModal);
window.addEventListener("click", e => {
  if (e.target === modal) closeModal();
});

// 🚀 Fetch APOD data from class JSON
btn.addEventListener("click", async () => {
  gallery.innerHTML = `<p style="text-align:center;">🔄 Loading space photos...</p>`;

  const start = new Date(startDate.value);
  const end = new Date(endDate.value);

  try {
    const res = await fetch(apodData);
    const data = await res.json();

    // Filter for selected date range
    const filtered = data.filter(item => {
      const d = new Date(item.date);
      return d >= start && d <= end;
    });

    const results = filtered.slice(0, 9); // Limit to 9 items

    if (results.length === 0) {
      gallery.innerHTML = `<p>No data available for that date range.</p>`;
      return;
    }

    gallery.innerHTML = "";
    results.forEach(item => {
      const card = document.createElement("div");
      card.className = "gallery-item";

      // Handle both images and videos
      const media =
        item.media_type === "video"
          ? `<a href="${item.url}" target="_blank">
              <img src="${item.thumbnail_url || 'https://via.placeholder.com/300x200?text=Video'}" alt="${item.title}">
             </a>`
          : `<img src="${item.url}" alt="${item.title}">`;

      card.innerHTML = `
        ${media}
        <h3>${item.title}</h3>
        <p>${new Date(item.date).toLocaleDateString()}</p>
      `;

      // Open modal for images
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
  } catch (err) {
    console.error("❌ Error loading data:", err);
    gallery.innerHTML = `<p>⚠️ Could not load data. Please try again later.</p>`;
  }
});

// 🗓 Auto-fill last 9 days by default + show random fact
window.addEventListener("load", () => {
  const today = new Date();
  const past = new Date();
  past.setDate(today.getDate() - 8);
  startDate.value = past.toISOString().split("T")[0];
  endDate.value = today.toISOString().split("T")[0];
  showRandomFact();
});
