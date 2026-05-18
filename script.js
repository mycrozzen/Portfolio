/* ─── CURSOR ─── */
const cursor = document.getElementById("cursor");
const ring = document.getElementById("cursor-ring");
let cx = 0,
  cy = 0,
  rx = 0,
  ry = 0;

document.addEventListener("mousemove", (e) => {
  cx = e.clientX;
  cy = e.clientY;
  cursor.style.left = cx + "px";
  cursor.style.top = cy + "px";
});
function animateRing() {
  rx += (cx - rx) * 0.12;
  ry += (cy - ry) * 0.12;
  ring.style.left = rx + "px";
  ring.style.top = ry + "px";
  requestAnimationFrame(animateRing);
}
animateRing();

/* ─── PRELOADER ─── */
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("preloader").classList.add("hidden");
  }, 1600);
});

/* ─── NAV SCROLL ─── */
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 40);
});

/* ─── MOBILE MENU ─── */
const burger = document.getElementById("burger");
const mobileMenu = document.getElementById("mobileMenu");
let menuOpen = false;
function toggleMobile() {
  menuOpen = !menuOpen;
  burger.classList.toggle("active", menuOpen);
  mobileMenu.classList.toggle("open", menuOpen);
  document.body.style.overflow = menuOpen ? "hidden" : "";
}
function closeMobile() {
  menuOpen = false;
  burger.classList.remove("active");
  mobileMenu.classList.remove("open");
  document.body.style.overflow = "";
}

/* ─── INTERSECTION OBSERVER ─── */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        // skill bars
        e.target
          .querySelectorAll(".skill-card")
          .forEach((c) => c.classList.add("in-view"));
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 }
);

document
  .querySelectorAll(".reveal, .stagger")
  .forEach((el) => observer.observe(el));

/* ─── SKILLS DATA ─── */
const skillsData = [
  { icon: "🎨", name: "Canva", level: "Expert", fill: 92 },
  { icon: "🌐", name: "HTML5", level: "Advanced", fill: 85 },
  { icon: "✨", name: "CSS3", level: "Advanced", fill: 80 },
  { icon: "⚙️", name: "JavaScript", level: "Intermediate", fill: 70 },
  { icon: "📐", name: "UI Design", level: "Advanced", fill: 88 },
  { icon: "📱", name: "Responsive Design", level: "Advanced", fill: 82 }
];

function buildSkills() {
  const grid = document.getElementById("skillsGrid");
  grid.classList.add("stagger");
  grid.innerHTML = skillsData
    .map(
      (s) => `
    <div class="skill-card" style="--fill:${s.fill}%">
      <span class="skill-icon">${s.icon}</span>
      <div class="skill-name">${s.name}</div>
      <div class="skill-level">${s.level}</div>
      <div class="skill-bar-track">
        <div class="skill-bar-fill"></div>
      </div>
    </div>
  `
    )
    .join("");
  observer.observe(grid);
}
buildSkills();

/* ─── GITHUB API ─── */
async function fetchGitHub() {
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch("https://api.github.com/users/mycrozzen"),
      fetch(
        "https://api.github.com/users/mycrozzen/repos?sort=updated&per_page=12"
      )
    ]);
    const user = await userRes.json();
    const repos = await reposRes.json();

    // Avatar
    if (user.avatar_url) {
      document.getElementById("avatarImg").src = user.avatar_url;
    }
    if (user.name) document.getElementById("ghName").textContent = user.name;
    if (user.location)
      document.getElementById("ghLocation").textContent = user.location;

    // Stats
    document.getElementById("repoCount").textContent = user.public_repos ?? "—";
    document.getElementById("followerCount").textContent =
      user.followers ?? "—";

    // Projects
    buildProjects(repos.filter((r) => !r.fork));
  } catch (err) {
    buildProjects([]);
  }
}

function getLangIcon(lang) {
  const map = {
    JavaScript: "JS",
    HTML: "HTML",
    CSS: "CSS",
    Python: "PY",
    TypeScript: "TS",
    Vue: "VUE",
    React: "JSX"
  };
  return map[lang] || (lang ? lang.slice(0, 3).toUpperCase() : "—");
}

function buildProjects(repos) {
  const container = document.getElementById("projectsContainer");

  if (!repos.length) {
    container.innerHTML = `
      <div class="projects-grid stagger">
        ${[
          {
            name: "Navbar Component",
            desc:
              "Animated navbar with hamburger menu using HTML, CSS & JavaScript",
            topics: ["HTML", "CSS", "JS"],
            url: "https://github.com/mycrozzen/navbar-component",
            demo: ""
          },
          {
            name: "Portfolio Site",
            desc:
              "Personal portfolio website built from scratch with responsive design and smooth animations.",
            topics: ["HTML", "CSS", "JS"],
            url: "https://github.com/mycrozzen/Portfolio",
            demo: "https://mycrozzen.github.io/Portfolio/"
          }
        ]
          .map((p, i) => projectCard(p, i))
          .join("")}
      </div>`;
  } else {
    container.innerHTML = `
      <div class="projects-grid stagger">
        ${repos
          .slice(0, 9)
          .map((r, i) =>
            projectCard(
              {
                name: r.name,
                desc: r.description || "No description provided.",
                topics: r.topics?.length
                  ? r.topics
                  : r.language
                  ? [r.language]
                  : [],
                url: r.html_url,
                demo: r.homepage,
                stars: r.stargazers_count,
                lang: r.language
              },
              i
            )
          )
          .join("")}
      </div>`;
  }

  observer.observe(container.querySelector(".projects-grid"));
}

function projectCard(p, i) {
  const num = String(i + 1).padStart(2, "0");
  const tagsHtml = p.topics
    .slice(0, 4)
    .map((t) => `<span class="tag">${t}</span>`)
    .join("");
  const linksHtml = [
    p.url
      ? `<a class="project-link" href="${p.url}" target="_blank"><svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg> Code</a>`
      : "",
    p.demo
      ? `<a class="project-link" href="${p.demo}" target="_blank"><svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg> Live</a>`
      : ""
  ].join("");
  return `
    <div class="project-card">
      <div class="project-number">${num}</div>
      <div class="project-name">${p.name}</div>
      <div class="project-desc">${p.desc}</div>
      <div class="project-meta">
        <div class="project-tags">${tagsHtml}</div>
        <div class="project-links">${linksHtml}</div>
      </div>
    </div>`;
}

fetchGitHub();

/* ─── FORM SUBMIT ─── */
function handleFormSubmit() {
  const name = document.getElementById("fname").value.trim();
  const email = document.getElementById("femail").value.trim();
  const subject = document.getElementById("fsubject").value.trim();
  const message = document.getElementById("fmessage").value.trim();
  const msg = document.getElementById("formMsg");

  if (!name || !email || !message) {
    msg.style.color = "#ef4444";
    msg.textContent = "✕ Please fill in all required fields.";
    msg.style.display = "block";
    return;
  }

  const mailto = `mailto:mycrozzen@gmail.com?subject=${encodeURIComponent(
    subject || "Portfolio Inquiry — " + name
  )}&body=${encodeURIComponent(
    `Hi, I'm ${name}.\n\n${message}\n\nReply to: ${email}`
  )}`;
  window.location.href = mailto;

  msg.style.color = "var(--gold)";
  msg.textContent = "✓ Opening your mail client...";
  msg.style.display = "block";
}

/* ─── ACTIVE NAV HIGHLIGHT ─── */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");
window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((s) => {
    if (window.scrollY >= s.offsetTop - 160) current = s.id;
  });
  navLinks.forEach((a) => {
    a.style.color =
      a.getAttribute("href") === "#" + current ? "var(--gold)" : "";
  });
});
