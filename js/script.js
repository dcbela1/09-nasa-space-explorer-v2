// Use this URL to fetch NASA APOD JSON data.
// NASA Space Explorer App
// Fetches NASA-style APOD JSON feed and displays 9 images between selected dates

const gallery = document.getElementById("gallery");
const btn = document.getElementById("getImageBtn");
const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");

// 🌍 NASA APOD JSON Data Source
const apodData = "https://cdn.jsdelivr.net/gh/GCA-Classroom/apod/data.json";

// 💫 Random space facts
const facts = [
  "Venus spins backward compared to most planets.",
  "One day on Mercury lasts 1,408 hours.",
  "Neutron stars can spin 600 times per second.",
  "There are more stars than grains of sand on Earth.",
  "Saturn could float in water because it's so light.",
  "The Sun makes up 99.86% of the solar system’s mass.",
  "A day on Venus is longer than a year on Venus."
];

// Display random fact at top of page
document
  .querySelector(".filters")
  .insertAdjacentHTML(
    "beforebegin",
    `<div class="random-fact"><p>💫 Did you know? ${
      facts[Math.floor(Math.random() * facts.length)]
    }</p></div>`
  );

// 🛰 Create modal for image details
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

// Close modal functionality
modal.querySelector(".close-btn").addEventListener("click", () => (modal.style.display = "none"));
window.addEventListener("click", e => { if (e.target === modal) modal.style.display = "none"; });

// 🚀 Fetch NASA data and render gallery
btn.addEventListener("click", async () => {
  gallery.innerHTML = `<div class="placeholder"><p>🔄 Loading space photos...</p></div>`;

  try {
    const response = await fetch(apodData);
    const data = await response.json();

    const start = new Date(startDate.value);
    const end = new Date(endDate.value);

    // Filter data by date range
    const filtered = data.filter(item => {
      const d = new Date(item.date);
      return d >= start && d <= end;
    }).slice(0, 9); // Show a max of 9 items

    gallery.innerHTML = "";

    filtered.forEach(item => {
      const card = document.createElement("div");
      card.className = "gallery-item";

      // Handle image vs video entries
      let media = "";
      if (item.media_type === "video") {
        media = `
          <div class="video-wrapper">
            <iframe src="${item.url}" frameborder="0" allowfullscreen></iframe>
          </div>`;
      } else {
        media = `<img src="${item.url}" alt="${item.title}">`;
      }

      card.innerHTML = `
        ${media}
        <h3>${item.title}</h3>
        <p>${new Date(item.date).toLocaleDateString()}</p>
      `;

      // Only add modal event for images
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

    // Handle empty results
    if (filtered.length === 0) {
      gallery.innerHTML = `<p>No results found for the selected dates. Try a wider range.</p>`;
    }

  } catch (err) {
    console.error("Error fetching NASA data:", err);
    gallery.innerHTML = `<p>❌ Error loading data. Please try again later.</p>`;
  }
});
