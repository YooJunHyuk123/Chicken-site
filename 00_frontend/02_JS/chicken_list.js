// chicken_list.js
// Page for viewing and searching chickens

const API_BASE = ""; 
// e.g. "https://abcd1234.execute-api.ap-northeast-2.amazonaws.com/prod"

async function apiFetch(path, options = {}) {
  const res = await fetch(API_BASE + path, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const type = res.headers.get("Content-Type") || "";
  const data = type.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data;
}

document.addEventListener("DOMContentLoaded", () => {
  let currentUser = null;
  let allChickens = [];

  const authInfo = document.getElementById("auth-info");
  const chickenListEl = document.getElementById("chicken-list");
  const searchForm = document.getElementById("search-form");
  const resetBtn = document.getElementById("reset-btn");

  async function fetchMe() {
    try {
      const data = await apiFetch("/api/me");
      currentUser = data.user;
      updateAuthInfo();
    } catch (err) {
      authInfo.textContent = "Error while checking login status.";
    }
  }

  function updateAuthInfo() {
    if (currentUser) {
      authInfo.textContent =
        `Logged in as: ${currentUser.nickname} (${currentUser.email})`;
    } else {
      authInfo.innerHTML =
        `Not logged in. You can still browse, but adding chickens requires <a href="auth.html">login</a>.`;
    }
  }

  // Load all chickens once
  async function loadChickens() {
    chickenListEl.innerHTML = "<p>Loading...</p>";
    try {
      const data = await apiFetch("/api/chickens");
      allChickens = data.chickens || [];
      renderChickens(allChickens);
    } catch (err) {
      chickenListEl.innerHTML = "<p>Failed to load chickens.</p>";
    }
  }

  function renderChickens(list) {
    if (!list.length) {
      chickenListEl.innerHTML = "<p>No chickens found.</p>";
      return;
    }

    chickenListEl.innerHTML = "";
    list.forEach((c) => {
      const card = document.createElement("article");
      card.className = "card";

      if (c.image_url) {
        const media = document.createElement("figure");
        media.className = "media";
        const img = document.createElement("img");
        img.src = c.image_url;
        img.alt = c.name || "Chicken image";
        media.appendChild(img);
        card.appendChild(media);
      }

      const body = document.createElement("section");
      body.className = "body";

      const title = document.createElement("h2");
      title.textContent = c.name || "(No name)";
      body.appendChild(title);

      const meta = document.createElement("ul");
      meta.className = "meta";
      meta.innerHTML = `
        <li>Brand: ${c.brand || "-"}</li>
        <li>Style: ${c.style || "-"}</li>
        <li>Spicy ${c.spicy ?? "-"} / Sweet ${c.sweet ?? "-"} / Crisp ${c.crisp ?? "-"}</li>
      `;
      body.appendChild(meta);

      const owner = document.createElement("p");
      owner.textContent = c.owner_nickname
        ? `Posted by: ${c.owner_nickname}`
        : "Posted by: unknown";
      body.appendChild(owner);

      if (c.comment) {
        const comment = document.createElement("p");
        comment.textContent = "Comment: " + c.comment;
        body.appendChild(comment);
      }

      card.appendChild(body);
      chickenListEl.appendChild(card);
    });
  }

  // Client-side search
  function filterChickens(keyword, style) {
    const kw = keyword.trim().toLowerCase();

    const filtered = allChickens.filter((c) => {
      const matchStyle = style ? (c.style === style) : true;

      if (!matchStyle) return false;

      if (!kw) return true;

      const name = (c.name || "").toLowerCase();
      const brand = (c.brand || "").toLowerCase();
      const owner = (c.owner_nickname || "").toLowerCase();
      const comment = (c.comment || "").toLowerCase();

      return (
        name.includes(kw) ||
        brand.includes(kw) ||
        owner.includes(kw) ||
        comment.includes(kw)
      );
    });

    renderChickens(filtered);
  }

  // Search form handler
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = new FormData(searchForm);
    const keyword = form.get("keyword") || "";
    const style = form.get("style") || "";
    filterChickens(keyword, style);
  });

  // Reset button handler
  resetBtn.addEventListener("click", () => {
    searchForm.reset();
    renderChickens(allChickens);
  });

  // Initial
  fetchMe();
  loadChickens();
});
