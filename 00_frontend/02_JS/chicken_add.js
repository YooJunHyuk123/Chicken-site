// chicken_add.js
// Page for adding a new boneless chicken

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

  const authInfo = document.getElementById("auth-info");
  const chickenForm = document.getElementById("chicken-form");
  const chickenMessage = document.getElementById("chicken-message");

  async function fetchMe() {
    try {
      const data = await apiFetch("/api/me");
      currentUser = data.user;
      updateAuthInfo();
    } catch (err) {
      authInfo.textContent = "Error while checking login status.";
      disableForm();
    }
  }

  function updateAuthInfo() {
    if (currentUser) {
      authInfo.textContent =
        `Logged in as: ${currentUser.nickname} (${currentUser.email})`;
      enableForm();
    } else {
      authInfo.innerHTML =
        `Not logged in. Please <a href="auth.html">go to Auth page</a>.`;
      disableForm();
    }
  }

  function disableForm() {
    chickenForm.querySelectorAll("input, textarea, select, button")
      .forEach(el => el.disabled = true);
  }

  function enableForm() {
    chickenForm.querySelectorAll("input, textarea, select, button")
      .forEach(el => el.disabled = false);
  }

  // Add chicken
  chickenForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    chickenMessage.textContent = "";

    if (!currentUser) {
      chickenMessage.textContent = "You must be logged in.";
      return;
    }

    const form = new FormData(chickenForm);
    const body = {
      name: form.get("name"),
      brand: form.get("brand"),
      style: form.get("style"),
      spicy: Number(form.get("spicy")),
      sweet: Number(form.get("sweet")),
      crisp: Number(form.get("crisp")),
      comment: form.get("comment"),
      image_url: form.get("image_url")
    };

    try {
      await apiFetch("/api/chickens", {
        method: "POST",
        body: JSON.stringify(body)
      });
      chickenMessage.style.color = "green";
      chickenMessage.textContent = "Chicken added!";
      chickenForm.reset();
    } catch (err) {
      chickenMessage.style.color = "red";
      chickenMessage.textContent = "Failed: " + err.message;
    }
  });

  // Initial
  disableForm();
  fetchMe();
});
