const SESSION_KEY = "asrahfc_logged_in";

function isLoggedIn() {
  return localStorage.getItem(SESSION_KEY) === "true";
}

function setLoggedIn(val) {
  localStorage.setItem(SESSION_KEY, val ? "true" : "false");
}

function togglePassword(inputId) {
  const el = document.getElementById(inputId);
  if (!el) return;
  el.type = el.type === "password" ? "text" : "password";
}

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function setupRevealAnimations() {
  const revealItems = document.querySelectorAll(".reveal");
  if (!revealItems.length) return;

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  revealItems.forEach((item) => observer.observe(item));
}

function setupNextMatchCountdown() {
  const countdown = document.getElementById("nextMatchCountdown");
  if (!countdown) return;

  const targetDate = new Date(countdown.dataset.matchDate);
  const countDays = document.getElementById("countDays");
  const countHours = document.getElementById("countHours");
  const countMinutes = document.getElementById("countMinutes");
  const countSeconds = document.getElementById("countSeconds");
  const countdownMessage = document.getElementById("countdownMessage");

  function updateCountdown() {
    const diff = targetDate.getTime() - Date.now();

    if (Number.isNaN(targetDate.getTime()) || diff <= 0) {
      countDays.textContent = "0";
      countHours.textContent = "0";
      countMinutes.textContent = "0";
      countSeconds.textContent = "0";
      countdownMessage.textContent = "Match day is here or the fixture date has passed.";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    countDays.textContent = String(days);
    countHours.textContent = String(hours).padStart(2, "0");
    countMinutes.textContent = String(minutes).padStart(2, "0");
    countSeconds.textContent = String(seconds).padStart(2, "0");
    countdownMessage.textContent = "Countdown updates automatically in your browser.";
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// auth.html -> used to show notice to login or signup
function setupAuthNotice() {
  const authNotice = document.getElementById("authNotice");
  if (!authNotice) return;
  const page = getParam("page");
  const next = getParam("next");

  if (!isLoggedIn() && page && next) {
    authNotice.classList.remove("d-none");
    authNotice.classList.remove("alert-success");
    authNotice.classList.add("alert-warning");
    authNotice.innerHTML = `⚠️ Please <strong>Login</strong> or <strong>Sign Up</strong> to continue to <strong>${page}</strong>.`;
  }

  if (isLoggedIn() && next) {
    authNotice.classList.remove("d-none");
    authNotice.classList.remove("alert-warning");
    authNotice.classList.add("alert-success");
    authNotice.innerHTML = `✅ You are already logged in. <a class="btn btn-brand btn-sm ms-2" href="${next}">Continue</a>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setupAuthNotice();
  setupRevealAnimations();
  setupNextMatchCountdown();
});

// login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;
    const loginError = document.getElementById("loginError");
    const hardcodedCredentials = { username: "admin", password: "password123" };
    
    if (username === hardcodedCredentials.username && password === hardcodedCredentials.password) {
      setLoggedIn(true);
      const next = getParam("next");
      window.location.href = next ? next : "dashboard.html";
    } else {
      loginError.style.display = "block";
      loginError.textContent = "Invalid username or password. Try admin / password123.";
    }
  });
}

// signup
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const signupMsg = document.getElementById("signupMsg");
    signupMsg.style.display = "block";
    signupMsg.textContent = "Account created (simulated). Please log in using admin / password123.";
    signupForm.reset();
  });
}
