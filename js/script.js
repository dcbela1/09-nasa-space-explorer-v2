// NASA Space Explorer App (Class JSON Edition)
// Author: Michael Hines

const apodData = "https://cdn.jsdelivr.net/gh/GCA-Classroom/apod/data.json";

const gallery = document.getElementById("gallery");
const btn = document.getElementById("getImageBtn");
const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");

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

// Close modal
const closeModal = () => (modal.style.display = "none");
modal.querySelector(".close-btn").addEventListener("click", closeModal);
window.addEventListener("click", e => {
  if (e.target === modal) closeModal();
});

// 🚀 Fetch data and display gallery
btn.addEventListener("click", async () => {
  gallery.innerHTML = `<p style="text-align:center;">🔄 Loading space photos...</p>`;

  const start = new Date(startDate.value);
  const end = new Date(endDate.value);

  try {
    const res = await fetch(apodData);
    const data = await res.json();

    // Filter items based on selected date range
    const filtered = data.filter(item => {
      const d = new Date(item.date);
      return d >= start && d <= end;
    });

    // Limit to 9 items
    const results = filtered.slice(0, 9);

    if (results.length === 0) {
      gallery.innerHTML = `<p>No data available for that date range.</p>`;
      return;
    }

    // Build gallery
    gallery.innerHTML = "";
    results.forEach(item => {
      const card = document.createElement("div");
      card.className = "gallery-item";

      // Handle both image and video types
      const media =
        item.media_type === "video"
          ? `<a href="${ite
