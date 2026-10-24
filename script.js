// 20 novembre 2026, 19h à Paris (UTC+1 en novembre)
const PARTY_DATE = new Date("2026-11-20T19:00:00+01:00");

// --- Compte à rebours ---
const countdown = document.getElementById("countdown");
const countdownDone = document.getElementById("countdown-done");
const units = {
  days: countdown.querySelector('[data-unit="days"]'),
  hours: countdown.querySelector('[data-unit="hours"]'),
  minutes: countdown.querySelector('[data-unit="minutes"]'),
  seconds: countdown.querySelector('[data-unit="seconds"]'),
};

function pad(n) {
  return String(n).padStart(2, "0");
}

function tick() {
  const diff = PARTY_DATE - Date.now();
  if (diff <= 0) {
    countdown.hidden = true;
    countdownDone.hidden = false;
    return false;
  }
  const s = Math.floor(diff / 1000);
  units.days.textContent = Math.floor(s / 86400);
  units.hours.textContent = pad(Math.floor((s % 86400) / 3600));
  units.minutes.textContent = pad(Math.floor((s % 3600) / 60));
  units.seconds.textContent = pad(s % 60);
  return true;
}

if (tick()) {
  const timer = setInterval(() => {
    if (!tick()) clearInterval(timer);
  }, 1000);
}

// --- Confettis ---
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
const COLORS = ["#ff4fa3", "#4ade80", "#ffd23f", "#8b5cf6", "#ffffff"];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let pieces = [];
let animating = false;

function resize() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function burst(count = 160) {
  if (reduceMotion) return;
  const w = window.innerWidth;
  for (let i = 0; i < count; i++) {
    pieces.push({
      x: w / 2 + (Math.random() - 0.5) * w * 0.4,
      y: window.innerHeight * 0.35,
      vx: (Math.random() - 0.5) * 14,
      vy: Math.random() * -14 - 4,
      size: Math.random() * 8 + 5,
      rot: Math.random() * Math.PI,
      vrot: (Math.random() - 0.5) * 0.3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      life: 0,
    });
  }
  if (!animating) {
    animating = true;
    requestAnimationFrame(frame);
  }
}

function frame() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  pieces = pieces.filter((p) => p.y < window.innerHeight + 20 && p.life < 400);
  for (const p of pieces) {
    p.vy += 0.35;
    p.vx *= 0.99;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vrot;
    p.life++;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    ctx.restore();
  }
  if (pieces.length) {
    requestAnimationFrame(frame);
  } else {
    animating = false;
  }
}

window.addEventListener("resize", resize);
resize();

document.getElementById("party-btn").addEventListener("click", () => burst());
window.addEventListener("load", () => setTimeout(() => burst(), 300));

// Si une photo hébergée chez Frog Pubs ne charge pas, on retire sa vignette
document.querySelectorAll(".gallery img").forEach((img) => {
  img.addEventListener("error", () => img.closest("figure").remove());
});
