// NASA Space Explorer App (Live API Edition)
// Author: Michael Hines
// Fetches real data from NASA's APOD API using your personal key

const API_KEY = "7VFSMyl2p3bYgsTg3IHJFGmhoTvoEDGuhl8iDxj1";
const gallery = document.getElementById("gallery");
const btn = document.getElementById("getImageBtn");
const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");

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
window.addEventListener("click", e => { if (e.target === modal) closeModal(); });

// 🚀 Fetch NASA APOD data
btn.addEventListener("click", async () => {
  gallery.innerHTML = `<p style="text-align:center;">🔄 Loading space photos...</p>`;

  const start = startDate.value;
  const end = endDate.value;

  if (!start || !end) {
    gallery.innerHTML = `<p>Please select a start and end date first.</p>`;
    return;
  }

  // Build NASA API request URL
  const url = `https://api.nasa.gov/planetary/apod?start_date=${start}&end_date=${end}&api_key=${API_KEY}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Network response was not ok");
    const data = await res.json();

    gallery.innerHTML = "";

    if (!Array.isArray(data) || data.length === 0) {
      gallery.innerHTML = `<p>No images found for that date range.</p>`;
      return;
    }

    // Show up to 9 results
    const results = data.slice(0, 9);

    results.forEach(item => {
      const card = document.createElement("div");
      card.className = "gallery-item";

      // Handle videos and images
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

      // Click to open modal (only for images)
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
    console.error("❌ Error fetching data:", err);
    gallery.innerHTML = `<p>⚠️ Unable to load NASA data. Please try again later.</p>`;
  }
});

// 🗓 Auto-fill default last 9 days on load
window.addEventListener("load", () => {
  const today = new Date();
  const past = new Date();
  past.setDate(today.getDate() - 8);
  startDate.value = past.toISOString().split("T")[0];
  endDate.value = today.toISOString().split("T")[0];
});
