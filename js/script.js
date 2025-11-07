// NASA Space Explorer App (JSON Edition)
const apodData = "https://cdn.jsdelivr.net/gh/GCA-Classroom/apod/data.json";
const gallery = document.getElementById("gallery");
const btn = document.getElementById("getImageBtn");
const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");

// Modal setup
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

// Fetch and render
btn.addEventListener("click", async () => {
  gallery.innerHTML = `<p style="text-align:center;">🔄 Loading space photos...</p>`;
  try {
    const res = await fetch(apodData);
    const data = await res.json();

    const start = new Date(startDate.value);
    const end = new Date(endDate.value);

    const filtered = data.filter(item => {
      const d = new Date(item.date);
      return d >= start && d <= end;
    }).slice(0, 9);

    gallery.innerHTML = "";

    filtered.forEach(item => {
      const card = document.createElement("div");
      card.className = "gallery-item";

      const media = item.media_type === "video"
        ? `<a href="${item.url}" target="_blank"><img src="${item.thumbnail_url || 'https://via.placeholder.com/300x200?text=Video'}"></a>`
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
    gallery.innerHTML = `<p>❌ Error loading data.</p>`;
  }
});

// Auto-fill last 9 days
window.addEventListener("load", () => {
  const today = new Date();
  const past = new Date();
  past.setDate(today.getDate() - 8);
  startDate.value = past.toISOString().split("T")[0];
  endDate.value = today.toISOString().split("T")[0];
});
