const toggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

toggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

document.addEventListener("click", e => {
  const target = e.target.closest("a, button");
  if (!target) return;

  const rect = target.getBoundingClientRect();
  const ripple = document.createElement("span");

  ripple.className = "ripple";
  ripple.style.left = `${e.clientX - rect.left}px`;
  ripple.style.top = `${e.clientY - rect.top}px`;
  ripple.style.width = ripple.style.height = `${rect.width * 2}px`;

  target.appendChild(ripple);

  setTimeout(() => ripple.remove(), 700);
});

document.querySelectorAll("a").forEach(link => {
  const href = link.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("http")) return;

  link.addEventListener("click", e => {
    e.preventDefault();
    document.body.classList.add("fade-out");

    setTimeout(() => {
      window.location.href = href;
    }, 400);
  });
});

const overlay = document.querySelector(".page-transition");

document.querySelectorAll("a").forEach(link => {
  const href = link.getAttribute("href");
  if (!href || href.startsWith("http")) return;

  link.addEventListener("click", e => {
    e.preventDefault();
    overlay.classList.add("active");

    setTimeout(() => {
      window.location.href = href;
    }, 600);
  });
});

