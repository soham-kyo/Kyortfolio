(() => {
  "use strict";
  const P = window.PORTFOLIO || {};
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function tilt(c) {
    let raf = 0;
    c.addEventListener("pointermove", (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = c.getBoundingClientRect(),
          x = (e.clientX - r.left) / r.width,
          y = (e.clientY - r.top) / r.height;
        c.classList.add("live");
        c.style.setProperty("--ry", ((x - 0.5) * 14).toFixed(2) + "deg");
        c.style.setProperty("--rx", ((0.5 - y) * 14).toFixed(2) + "deg");
        c.style.setProperty("--gx", x * 100 + "%");
        c.style.setProperty("--gy", y * 100 + "%");
      });
    });
    const end = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      c.classList.remove("live");
      c.style.setProperty("--rx", "0deg");
      c.style.setProperty("--ry", "0deg");
    };
    c.addEventListener("pointerleave", end);
    c.addEventListener("pointercancel", end);
  }

  if (!$("#storm-lightning")) {
    const storm = document.createElement("div");
    storm.className = "storm-lightning";
    storm.id = "storm-lightning";
    storm.setAttribute("aria-hidden", "true");
    document.body.prepend(storm);
  }

  const themeButton = $("#theme-toggle");
  const applyTheme = (theme) => {
    const mode = theme === "light" ? "light" : "dark";
    const isLight = mode === "light";

    document.documentElement.dataset.theme = mode;

    try {
      localStorage.setItem("portfolio-theme", mode);
    } catch (_) {}

    if (themeButton) {
      const label = isLight ? "Switch to dark mode" : "Switch to light mode";
      themeButton.textContent = isLight ? "😴" : "🕯️";
      themeButton.setAttribute("aria-label", label);
      themeButton.setAttribute("aria-pressed", String(isLight));
      themeButton.title = label;
    }

    const meta = $('meta[name="theme-color"]');
    if (meta) meta.content = isLight ? "#f7f5ff" : "#05040a";
  };

  let savedTheme = "";
  try {
    savedTheme = localStorage.getItem("portfolio-theme") || "";
  } catch (_) {}

  applyTheme(savedTheme === "light" ? "light" : "dark");

  if (themeButton && !themeButton.dataset.upgradeBound) {
    themeButton.dataset.upgradeBound = "true";
    themeButton.addEventListener("click", () =>
      applyTheme(
        document.documentElement.dataset.theme === "light" ? "dark" : "light",
      ),
    );
  }

  const inventory = {
    "Programming Languages": [
      "C",
      "Java",
      "Python",
      "JavaScript",
      "TypeScript",
      "Dart",
      "SQL",
    ],
    "Frontend Development": [
      "HTML5",
      "CSS3",
      "JavaScript DOM",
      "Responsive Design",
      "Tailwind CSS",
      "React",
    ],
    "Backend Development": ["Node.js", "Express.js", "FastAPI", "REST APIs"],
    "App Development": ["Flutter", "Dart for Flutter", "Android SDK"],
    "Databases & Storage": [
      "PostgreSQL",
      "MySQL",
      "Oracle Database",
      "MongoDB",
      "Supabase",
    ],
    "AI, ML & Data Science": ["NumPy", "Pandas", "Matplotlib", "XGBoost"],
    "Cloud, DevOps & Deployment": [
      "Git",
      "GitHub",
      "GitHub Actions",
      "Docker",
      "Vercel",
      "Netlify",
      "Render",
      "CI/CD Pipelines",
    ],
    "Testing & Code Quality": ["Postman", "Flutter Testing"],
    "Developer Tools & Design": [
      "VS Code",
      "IntelliJ IDEA",
      "GitHub Desktop",
      "Git CLI",
      "Homebrew",
      "Figma",
      "Canva",
      "LaTeX",
    ],
    "Computer Science Fundamentals": [
      "Data Structures & Algorithms",
      "Object-Oriented Programming",
      "Operating Systems",
    ],
  };
  const iconNames = {
    C: "c",
    Java: "java",
    Python: "python",
    JavaScript: "javascript",
    TypeScript: "typescript",
    Dart: "dart",
    SQL: "mysql",
    HTML5: "html5",
    CSS3: "css3",
    "JavaScript DOM": "javascript",
    "Responsive Design": "html5",
    "Tailwind CSS": "tailwindcss",
    React: "react",
    "Node.js": "nodejs",
    "Express.js": "express",
    FastAPI: "fastapi",
    "REST APIs": "fastapi",
    Flutter: "flutter",
    "Dart for Flutter": "dart",
    "Android SDK": "android",
    PostgreSQL: "postgresql",
    MySQL: "mysql",
    "Oracle Database": "oracle",
    MongoDB: "mongodb",
    Supabase: "supabase",
    NumPy: "numpy",
    Pandas: "pandas",
    Matplotlib: "matplotlib",
    XGBoost: "python",
    Git: "git",
    GitHub: "github",
    "GitHub Actions": "githubactions",
    Docker: "docker",
    Vercel: "vercel",
    Netlify: "netlify",
    Render: "render",
    "CI/CD Pipelines": "githubactions",
    Postman: "postman",
    "Flutter Testing": "flutter",
    "VS Code": "vscode",
    "IntelliJ IDEA": "intellij",
    "GitHub Desktop": "github",
    "Git CLI": "git",
    Homebrew: "homebrew",
    Figma: "figma",
    Canva: "canva",
    LaTeX: "latex",
    "Data Structures & Algorithms": "",
    "Object-Oriented Programming": "",
    "Operating Systems": "",
  };
  const textBadges = {
    "Data Structures & Algorithms": "DSA",
    "Object-Oriented Programming": "OOP",
    "Operating Systems": "OS",
  };
  const iconUrl = (name) => {
    const icon = iconNames[name] === undefined ? "github" : iconNames[name];
    return icon ? `assets/tech-icons/${icon}-original.svg` : "";
  };
  const stackTabs = $("#tabs"),
    chips = $("#chips");
  if (stackTabs && chips) {
    stackTabs.replaceChildren();
    chips.replaceChildren();
    const categories = Object.keys(inventory);
    const showCategory = (category) => {
      chips.replaceChildren();
      inventory[category].forEach((skill, index) => {
        const chip = document.createElement("div");
        chip.className = "chip";
        chip.style.setProperty("--i", index);
        const iconBox = document.createElement("span");
        iconBox.className = "mono";
        const localIcon = iconUrl(skill);
        if (localIcon) {
          const img = document.createElement("img");
          img.className = "tech-logo";
          img.alt = "";
          img.loading = "lazy";
          img.decoding = "async";
          img.src = localIcon;
          img.onerror = () => {
            img.onerror = null;
            img.hidden = true;
          };
          iconBox.append(img);
        } else {
          iconBox.classList.add("txt");
          iconBox.textContent = textBadges[skill] || skill.charAt(0);
        }
        const label = document.createElement("span");
        label.textContent = skill;
        chip.append(iconBox, label);
        chips.append(chip);
      });
      $$("#tabs button").forEach((b) => {
        const active = b.dataset.upgradeCategory === category;
        b.setAttribute("aria-selected", String(active));
        b.setAttribute("aria-pressed", String(active));
      });
    };
    categories.forEach((category, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = category;
      b.dataset.upgradeCategory = category;
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", String(i === 0));
      b.setAttribute("aria-pressed", String(i === 0));
      b.addEventListener("click", () => showCategory(category));
      stackTabs.append(b);
    });
    showCategory(categories[0]);
  }

  const certificateCards = $$("#certs .card");
  if (Array.isArray(P.certificates)) {
    P.certificates.forEach((cert, i) => {
      const card = certificateCards[i];
      const imagePath = cert.image || cert.imageUrl || cert.imageURL;
      if (!card || !imagePath) return;
      const img = document.createElement("img");
      img.className = "cert-image";
      img.src = imagePath;
      img.alt = `${cert.title || "Certificate"} certificate image`;
      img.loading = "lazy";
      img.addEventListener("click", () => {
        const dialog = $("#lb"),
          preview = $("#lbi");
        if (!dialog || !preview) return;
        preview.src = imagePath;
        preview.alt = img.alt;
        if (typeof dialog.showModal === "function") dialog.showModal();
        else window.open(imagePath, "_blank", "noopener");
      });
      card.prepend(img);
    });
  }
  if (!reduce) $$("#edu .cf-card").forEach(tilt);

  const close = $("#lbx"),
    dialog = $("#lb");
  if (close && dialog) close.addEventListener("click", () => dialog.close());
  if (dialog)
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) dialog.close();
    });

  const projectTabs = $("#ptabs"),
    projectGrid = $("#grid"),
    emptyProjects = $("#pempty");
  const projects = Array.isArray(P.projects) ? P.projects : [];
  const normalizeCategory = (c) =>
    c === "Flutter" || c === "Android" ? "App Development" : c;
  if (projectTabs && projectGrid) {
    const categories = [
      ...new Set((P.projectCategories || []).map(normalizeCategory)),
    ];
    projects.forEach((p) => {
      p.category = normalizeCategory(p.category);
    });
    projectTabs.replaceChildren();
    projectGrid.replaceChildren();
    const renderProjects = (category) => {
      projectGrid.replaceChildren();
      const shown = projects.filter(
        (p) => category === "All" || normalizeCategory(p.category) === category,
      );
      if (emptyProjects) emptyProjects.hidden = shown.length > 0;
      shown.forEach((p, index) => {
        const card = document.createElement("article");
        card.className = "card show";
        card.style.setProperty("--d", `${index * 70}ms`);
        const media = document.createElement("div");
        media.className = "media";
        if (p.image) {
          const im = document.createElement("img");
          im.src = p.image;
          im.alt = `${p.name || "Project"} preview`;
          im.loading = "lazy";
          media.append(im);
        } else media.textContent = "Project preview";
        const body = document.createElement("div");
        body.className = "body";
        const cat = document.createElement("span");
        cat.className = "cat";
        cat.textContent = normalizeCategory(p.category || "Project");
        const title = document.createElement("h3");
        title.textContent = p.name || "Untitled project";
        const desc = document.createElement("p");
        desc.textContent = p.description || "";
        const tech = document.createElement("ul");
        tech.className = "tech";
        (Array.isArray(p.tech) ? p.tech : []).forEach((t) => {
          const li = document.createElement("li");
          li.textContent = t;
          tech.append(li);
        });
        const links = document.createElement("div");
        links.className = "pl";
        const addLink = (url, label) => {
          if (!url) return;
          const a = document.createElement("a");
          a.href = url;
          a.textContent = label;
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          links.append(a);
        };
        addLink(p.github, "GitHub");
        addLink(p.demo, "Live demo");
        body.append(cat, title, desc, tech, links);
        card.append(media, body);
        projectGrid.append(card);
        if (!reduce) tilt(card);
      });
    };
    const addProjectTab = (category, label) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = label;
      b.setAttribute("aria-pressed", String(label === "All"));
      b.addEventListener("click", () => {
        $$("#ptabs button").forEach((x) =>
          x.setAttribute("aria-pressed", String(x === b)),
        );
        renderProjects(category);
      });
      projectTabs.append(b);
    };
    addProjectTab("All", "All");
    categories.forEach((c) => addProjectTab(c, c));
    renderProjects("All");
  }

  if (!reduce && window.matchMedia("(pointer:fine)").matches) {
    document.addEventListener(
      "pointermove",
      (e) => {
        document.documentElement.style.setProperty(
          "--pointer-x",
          `${e.clientX}px`,
        );
        document.documentElement.style.setProperty(
          "--pointer-y",
          `${e.clientY}px`,
        );
      },
      { passive: true },
    );
  }

  const certRail = $("#certs"),
    certPrev = $("#cprev"),
    certNext = $("#cnext");
  if (certRail && certPrev && certNext) {
    const behavior = reduce ? "auto" : "smooth";
    certPrev.addEventListener("click", () =>
      certRail.scrollBy({ left: -330, behavior }),
    );
    certNext.addEventListener("click", () =>
      certRail.scrollBy({ left: 330, behavior }),
    );
  }
})();
