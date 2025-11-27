// auth.js
// Authentication page logic (sign up, login, logout)

// Set this to your AWS backend base URL if needed
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

  const authStatus = document.getElementById("auth-status");
  const signupForm = document.getElementById("signup-form");
  const signupMessage = document.getElementById("signup-message");
  const loginForm = document.getElementById("login-form");
  const loginMessage = document.getElementById("login-message");
  const logoutBtn = document.getElementById("logout-btn");
  const logoutMessage = document.getElementById("logout-message");

  async function fetchMe() {
    try {
      const data = await apiFetch("/api/me");
      currentUser = data.user;
      updateAuthUI();
    } catch (err) {
      authStatus.textContent = "Error while checking login status.";
    }
  }

  function updateAuthUI() {
    if (currentUser) {
      authStatus.textContent =
        `Logged in as: ${currentUser.nickname} (${currentUser.email})`;
      logoutBtn.style.display = "inline-block";
    } else {
      authStatus.textContent = "Not logged in.";
      logoutBtn.style.display = "none";
    }
  }

  // Sign up
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    signupMessage.textContent = "";

    const form = new FormData(signupForm);
    const body = {
      email: form.get("email"),
      password: form.get("password"),
      nickname: form.get("nickname")
    };

    try {
      await apiFetch("/api/signup", {
        method: "POST",
        body: JSON.stringify(body)
      });
      signupMessage.style.color = "green";
      signupMessage.textContent = "Account created. You can now log in.";
      signupForm.reset();
    } catch (err) {
      signupMessage.style.color = "red";
      signupMessage.textContent = "Sign up failed: " + err.message;
    }
  });

  // Login
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginMessage.textContent = "";
    logoutMessage.textContent = "";

    const form = new FormData(loginForm);
    const body = {
      email: form.get("email"),
      password: form.get("password")
    };

    try {
      // 성공 케이스
      const result = await apiFetch("/api/login", {
        method: "POST",
        body: JSON.stringify(body)
      });

      currentUser = result.user;
      updateAuthUI();

      loginMessage.style.color = "green";
      loginMessage.textContent = "Login successful. Redirecting to Chicken Dex...";

      // 비밀번호 필드만 지우기
      loginForm.querySelector('input[name="password"]').value = "";

      // 1초 후 도감 페이지로 이동
      setTimeout(() => {
        window.location.href = "dex.html";
      }, 1000);

    } catch (err) {
      // 실패 케이스
      loginMessage.style.color = "red";
      loginMessage.textContent = "Login failed: " + err.message;

      // 비밀번호만 지우고, 이메일은 남겨둠
      loginForm.querySelector('input[name="password"]').value = "";
    }
  });

  // Logout
  logoutBtn.addEventListener("click", async () => {
    logoutMessage.textContent = "";
    try {
      await apiFetch("/api/logout", { method: "POST" });
      currentUser = null;
      updateAuthUI();
      logoutMessage.style.color = "green";
      logoutMessage.textContent = "Logged out.";
    } catch (err) {
      logoutMessage.style.color = "red";
      logoutMessage.textContent = "Logout failed: " + err.message;
    }
  });

  // Initial check
  fetchMe();
});
