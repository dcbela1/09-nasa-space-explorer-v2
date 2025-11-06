// NASA Space Explorer App
// Uses class-provided JSON feed (no API key)

const gallery = document.getElementById("gallery");
const btn = document.getElementById("getImageBtn");
const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");

const apodData = "https://cdn.jsdelivr.net/gh/GCA-Classroom/apod/data.json";

// Random Fact
const facts = [
  "Venus spins backward compared to most planets.",
  "One day on Mercury lasts 1,408 hours.",
  "Neutron stars can spin 600 times per second.",
  "There are more stars in the universe than grains of sand on Earth.",
  "Saturn could float in water because it’s so light.",
  "The Sun makes up 99.86% of the solar system’s mass.",
  "A day on Venus is longer than a year on Venus."
];

document.querySelector(".filters").insertAdjacentHTML(
  "beforebegin",
  `<div class="random-fact"><p>💫 Did you know? ${
    facts[Math.floor(Math.random() * facts.length)]
  }</p></div>`
);

// Modal
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
window.addEventListener("click", e => { if (e.target === modal) closeModal(); });

// Fetch Data
btn.addEventListener("click", async () => {
  gallery.innerHTML = `<div class="placeholder"><p>🔄 Loading space photos...</p></div>`;

  try {
    const res = await fetch(apodData);
    const data = await res.json();

    const start = new Date(startDate.value);
    const end = new Date(endDate.value);

    // Filter data
    const filtered = data.filter(item => {
      const d = new Date(item.date);
      return d >= start && d <= end;
    }).slice(0, 9);

    gallery.innerHTML = "";

    if (filtered.length === 0) {
      gallery.innerHTML = `<p>No results for that date range. Try again.</p>`;
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement("div");
      card.className = "gallery-item";

      // Handle videos and images
      const media =
        item.media_type === "video"
          ? `<a href="${item.url}" target="_blank"><img src="${item.thumbnail_url || 'https://via.placeholder.com/300x200?text=Video'}" alt="${item.title}"></a>`
          : `<img src="${item.url}" alt="${item.title}">`;

      card.innerHTML = `
        ${media}
        <h3>${item.title}</h3>
        <p>${new Date(item.date).toLocaleDateString()}</p>
      `;

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
    gallery.innerHTML = `<p>❌ Error fetching data.</p>`;
    console.error(err);
  }
});

// Default date range: last 9 days
window.addEventListener("load", () => {
  const today = new Date();
  const past = new Date();
  past.setDate(today.getDate() - 8);
  startDate.value = past.toISOString().split("T")[0];
  endDate.value = today.toISOString().split("T")[0];
});
