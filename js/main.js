(() => {
  "use strict";
  const P = window.PORTFOLIO,
    $ = (s) => document.querySelector(s);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const el = (t, c, x) => {
    const e = document.createElement(t);
    if (c) e.className = c;
    if (x != null) e.textContent = x;
    return e;
  };
  const ICONS = {
    github: `<svg class="f" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>`,
    x: `<svg class="f" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
    leetcode: `<svg viewBox="0 0 24 24"><path d="M16 4 6.5 13.5a2.1 2.1 0 0 0 0 3l3 3a2.1 2.1 0 0 0 3 0L15 17"/><path d="M11 12h9"/></svg>`,
    linkedin: `<svg viewBox="0 0 24 24"><path d="M6 10v8M6 6v.01M11 18v-8M11 13.5a3.5 3.5 0 0 1 7 0V18"/></svg>`,
    email: `<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>`,
    link: `<svg viewBox="0 0 24 24"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>`,
  };

  $("#tagline").textContent = P.tagline;
  $("#intro").textContent = P.intro;
  $("#yr").textContent = new Date().getFullYear();
  document.title = `${P.brand} - Developer Portfolio`;

  const box = $("#about-box"),
    left = el("div");
  left.append(el("p", "", P.about.bio));
  const ints = el("ul");
  P.about.interests.forEach((i) => ints.append(el("li", "", i)));
  left.append(ints);
  const dl = el("dl");
  P.about.facts.forEach(([k, v]) => {
    const d = el("div");
    d.append(el("dt", "", k), el("dd", "", v));
    dl.append(d);
  });

  const pc = el("div", "pcard"),
    pim = el("div", "pimg");
  if (P.profile) {
    const i = el("img");
    i.alt = `${P.name} portrait`;
    i.addEventListener("error", () => {
      i.remove();
      pim.textContent = P.brand;
    });
    i.src = P.profile;
    pim.append(i);
  } else pim.textContent = "Add your photo in data.js";
  const cap = el("div", "pcap");
  cap.append(el("b", "", P.name), el("small", "", P.brand));
  const btns = el("div", "abtn"),
    rs = P.resume
      ? el("a", "btn pri", "Download resume")
      : el("span", "btn na", "Download resume (add file)");
  if (P.resume) {
    rs.href = P.resume;
    rs.setAttribute("download", "");
  } else rs.title = "Set resume in data.js";
  const vp = el("a", "btn", "View projects");
  vp.href = "#portfolio";
  vp.addEventListener("click", () => openTab("projects"));
  btns.append(rs, vp);
  pc.append(pim, cap);
  left.append(dl, btns);
  box.append(pc, left);
  if (!reduce) tilt(pc);

  function coverflow(root, items) {
    const stage = el("div", "cf-stage"),
      nav = el("div", "cf-nav"),
      prev = el("button", "", "‹"),
      next = el("button", "", "›"),
      n = items.length;
    let a = 0;
    prev.type = next.type = "button";
    prev.setAttribute("aria-label", "Previous");
    next.setAttribute("aria-label", "Next");
    const cs = items.map((it, i) => {
      const c = el("article", "cf-card"),
        ul = el("ul");
      c.tabIndex = 0;
      it.points.forEach((p) => ul.append(el("li", "", p)));
      c.append(
        el("small", "", it.period),
        el("h3", "", it.title),
        el("p", "org", it.org),
        ul,
      );
      stage.append(c);
      c.addEventListener("click", () => set(i));
      c.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          set(i);
        }
      });
      return c;
    });
    function set(k) {
      a = (k + n) % n;
      cs.forEach((c, i) => {
        const d = i - a;
        c.style.setProperty("--d", d);
        c.style.setProperty("--ad", Math.abs(d));
        c.classList.toggle("on", d === 0);
      });
    }
    prev.addEventListener("click", () => set(a - 1));
    next.addEventListener("click", () => set(a + 1));
    root.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") set(a - 1);
      if (e.key === "ArrowRight") set(a + 1);
    });
    let sx = null;
    stage.addEventListener("pointerdown", (e) => (sx = e.clientX));
    stage.addEventListener("pointerup", (e) => {
      if (sx !== null && Math.abs(e.clientX - sx) > 45)
        set(a + (e.clientX < sx ? 1 : -1));
      sx = null;
    });
    nav.append(prev, next);
    root.append(stage, nav);
    set(0);
  }
  function zigzag(root, items) {
    items.forEach((it, i) => {
      const li = el("li", "zi " + (i % 2 ? "r" : "l")),
        node = el("span", "zn", it.org.replace(/[\[\]\s]/g, "")[0] || "•"),
        c = el("article", "zc"),
        ul = el("ul");
      node.setAttribute("aria-hidden", "true");
      it.points.forEach((p) => ul.append(el("li", "", p)));
      c.append(
        el("small", "", it.period),
        el("h3", "", it.title),
        el("p", "org", it.org),
        ul,
      );
      li.append(node, c);
      root.append(li);
      if (!reduce) tilt(c);
    });
  }
  coverflow($("#edu"), P.education);
  zigzag($("#exp"), P.experience);
  const link = (url, text, cls) => {
    if (url) {
      const a = el("a", cls, text);
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      return a;
    }
    return el("span", cls, text + " (add link)");
  };
  $("#ct-text").textContent = P.contact.text;
  const mk = (s, full) => {
    const ok = !!s.url,
      n = ok ? el("a") : el("span", "na");
    if (ok) {
      n.href = s.url;
      if (!s.url.startsWith("mailto:")) {
        n.target = "_blank";
        n.rel = "noopener noreferrer";
      }
    } else n.title = "Add your link in data.js";
    const ic = el("span", "ico");
    ic.innerHTML = ICONS[s.icon] || ICONS.link;
    n.append(ic);
    if (full) {
      const t = el("div");
      t.append(
        el("b", "", s.label),
        el(
          "small",
          "",
          ok
            ? s.url.replace(/^https?:\/\/|^mailto:/, "")
            : "Add in data.js: " + s.hint,
        ),
      );
      n.append(t);
    } else {
      n.append(el("span", "vh", s.label + (ok ? "" : " (add link)")));
      if (ok) n.title = s.label;
    }
    const li = el("li");
    li.append(n);
    return li;
  };
  P.socials.forEach((s) => {
    $("#soc").append(mk(s, false));
    $("#fsoc").append(mk(s, false));
  });

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

  const hero = $("#home"),
    scene = $("#scene");
  if (!reduce) {
    let vis = true,
      raf = 0,
      tx = 0,
      ty = 0;
    new IntersectionObserver(([e]) => (vis = e.isIntersecting)).observe(hero);
    addEventListener(
      "pointermove",
      (e) => {
        if (!vis || raf) return;
        tx = e.clientX / innerWidth - 0.5;
        ty = e.clientY / innerHeight - 0.5;
        raf = requestAnimationFrame(() => {
          raf = 0;
          scene.style.setProperty("--px", (tx * 22).toFixed(2) + "deg");
          scene.style.setProperty("--py", (-ty * 18).toFixed(2) + "deg");
          scene.style.setProperty("--mx", (tx * 14).toFixed(1));
          scene.style.setProperty("--my", (ty * 14).toFixed(1));
        });
      },
      { passive: true },
    );
  }

  const rio = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          rio.unobserve(e.target);
        }
      }),
    { threshold: 0.12 },
  );
  document.querySelectorAll(".rv, .zi").forEach((n) => rio.observe(n));

  const menu = $("#menu"),
    burger = $("#burger"),
    ind = $("#ind"),
    links = [...menu.querySelectorAll("a")];
  let current = links[0];
  function place() {
    ind.style.width = current.offsetWidth + "px";
    ind.style.transform = `translateX(${current.offsetLeft}px)`;
  }
  function setActive(id) {
    current = links.find((a) => a.getAttribute("href") === "#" + id) || current;
    links.forEach((a) => {
      const on = a === current;
      a.classList.toggle("on", on);
      on
        ? a.setAttribute("aria-current", "true")
        : a.removeAttribute("aria-current");
    });
    place();
  }
  const sio = new IntersectionObserver(
    (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
    { rootMargin: "-45% 0px -50% 0px" },
  );
  document.querySelectorAll("main section").forEach((s) => sio.observe(s));
  addEventListener("resize", place);
  setActive("home");
  const close = () => {
    menu.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  };
  burger.addEventListener("click", () => {
    const o = menu.classList.toggle("open");
    burger.setAttribute("aria-expanded", o);
  });
  links.forEach((a) => a.addEventListener("click", close));
  addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  if (P.logo) {
    const lg = $("#logo"),
      b = $("#brand");
    lg.alt = `${P.brand} logo`;
    lg.hidden = false;
    b.classList.add("has-logo");
    lg.addEventListener("error", () => {
      lg.hidden = true;
      b.classList.remove("has-logo");
    });
    lg.src = P.logo;
  }

  const prog = $("#prog"),
    tls = [...document.querySelectorAll(".zz")];
  let sraf = 0;
  const onScroll = () => {
    sraf = 0;
    const max = document.documentElement.scrollHeight - innerHeight;
    prog.style.transform = `scaleX(${max > 0 ? Math.min(scrollY / max, 1) : 0})`;
    tls.forEach((t) => {
      const r = t.getBoundingClientRect();
      t.style.setProperty(
        "--p",
        Math.max(
          0,
          Math.min(100, ((innerHeight * 0.65 - r.top) / r.height) * 100),
        ).toFixed(1) + "%",
      );
    });
  };
  if (!reduce) {
    addEventListener(
      "scroll",
      () => {
        if (!sraf) sraf = requestAnimationFrame(onScroll);
      },
      { passive: true },
    );
    addEventListener("resize", onScroll);
    onScroll();
  }

  if (!reduce && matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".soc a, .soc .na").forEach((a) => {
      a.addEventListener("pointermove", (e) => {
        const r = a.getBoundingClientRect();
        a.style.transform = `translate(${((e.clientX - r.left - r.width / 2) * 0.3).toFixed(1)}px,${((e.clientY - r.top - r.height / 2) * 0.3 - 3).toFixed(1)}px)`;
      });
      a.addEventListener("pointerleave", () => {
        a.style.transform = "";
      });
    });
  }

  const rEl = $("#roles"),
    roles = P.roles || [];
  let ri = 0;
  if (roles.length) {
    rEl.setAttribute("aria-hidden", "true");
    const sr = el("span", "vh", roles.join(", "));
    rEl.after(sr);
    const show = () => {
      rEl.replaceChildren();
      [...roles[ri % roles.length]].forEach((ch, i) => {
        const s = el("span", "", ch === " " ? "\u00a0" : ch);
        s.style.setProperty("--i", i);
        rEl.append(s);
      });
    };
    show();
    if (!reduce && roles.length > 1)
      setInterval(() => {
        if (document.hidden || scrollY > innerHeight) return;
        ri++;
        show();
      }, 2800);
  }

  const chips = $("#chips");
  if (!reduce && matchMedia("(hover: hover)").matches) {
    let kr = 0;
    chips.addEventListener("pointermove", (e) => {
      if (kr) return;
      kr = requestAnimationFrame(() => {
        kr = 0;
        chips.querySelectorAll(".chip").forEach((c) => {
          const r = c.getBoundingClientRect(),
            dx = e.clientX - r.left - r.width / 2,
            dy = e.clientY - r.top - r.height / 2,
            k = Math.max(0, 1 - Math.hypot(dx, dy) / 170);
          c.style.transform = `perspective(500px) rotateX(${((-dy / r.height) * 20 * k).toFixed(1)}deg) rotateY(${((dx / r.width) * 20 * k).toFixed(1)}deg) translateZ(${(k * 30).toFixed(0)}px) scale(${(1 + k * 0.08).toFixed(3)})`;
          c.style.borderColor = k > 0.45 ? "var(--acc)" : "";
        });
      });
    });
    chips.addEventListener("pointerleave", () =>
      chips.querySelectorAll(".chip").forEach((c) => {
        c.style.transform = "";
        c.style.borderColor = "";
      }),
    );
  }

  const em = (
    (P.socials.find((s) => s.icon === "email") || {}).url || ""
  ).replace("mailto:", "");
  const copy = $("#copy"),
    hint = $("#ct-hint"),
    ct = $("#ct");
  hint.textContent =
    em || "Add your email in data.js (the Email entry in socials).";
  copy.disabled = !em;
  copy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(em);
      copy.textContent = "Copied";
    } catch (_) {
      copy.textContent = "Copy failed";
    }
    setTimeout(() => (copy.textContent = "Copy email"), 1800);
  });
  $("#cf").addEventListener("submit", (e) => {
    e.preventDefault();
    if (!em) {
      hint.textContent =
        "Add your email in data.js first, then this form will open your mail app.";
      return;
    }
    const f = new FormData(e.target);
    location.href = `mailto:${em}?subject=${encodeURIComponent("Hello from " + f.get("n"))}&body=${encodeURIComponent(f.get("m"))}`;
  });
  if (!reduce)
    ct.addEventListener("pointermove", (e) => {
      const r = ct.getBoundingClientRect();
      ct.style.setProperty("--gx", e.clientX - r.left + "px");
      ct.style.setProperty("--gy", e.clientY - r.top + "px");
    });

  const TABS = [
      ["projects", "Projects"],
      ["certs", "Certificates"],
      ["stack", "Tech Stack"],
    ],
    mt = $("#mtabs");
  function openTab(k) {
    TABS.forEach(([id]) => {
      const p = $("#tp-" + id),
        on = id === k;
      p.hidden = !on;
      if (on) {
        p.classList.remove("in");
        void p.offsetWidth;
        p.classList.add("in");
      }
    });
    mt.querySelectorAll("button").forEach((b) => {
      const s = b.dataset.k === k;
      b.setAttribute("aria-selected", s);
      b.tabIndex = s ? 0 : -1;
    });
  }
  TABS.forEach(([k, l]) => {
    const b = el("button", "", l);
    b.type = "button";
    b.role = "tab";
    b.dataset.k = k;
    b.addEventListener("click", () => openTab(k));
    mt.append(b);
  });
  openTab("projects");
  P.certificates.forEach((c) => {
    const d = el("article", "card"),
      b = el("div", "body"),
      pl = el("div", "pl");
    pl.append(link(c.url, "View certificate"));
    b.append(
      el("span", "cat", c.issuer),
      el("h3", "", c.title),
      el("p", "", c.year),
      pl,
    );
    d.append(b);
    $("#certs").append(d);
    if (!reduce) tilt(d);
  });
  const rail = $("#grid");
  $("#pprev").addEventListener("click", () =>
    rail.scrollBy({ left: -330, behavior: reduce ? "auto" : "smooth" }),
  );
  $("#pnext").addEventListener("click", () =>
    rail.scrollBy({ left: 330, behavior: reduce ? "auto" : "smooth" }),
  );

  const cv = $("#sph"),
    g2 = cv.getContext("2d"),
    pts = [];
  for (let i = 0; i < 16; i++) {
    const la = (Math.PI * (i + 0.5)) / 16 - Math.PI / 2,
      m = Math.round(30 * Math.cos(la)) + 4;
    for (let j = 0; j < m; j++) {
      const lo = (2 * Math.PI * j) / m;
      pts.push([
        Math.cos(la) * Math.cos(lo),
        Math.sin(la),
        Math.cos(la) * Math.sin(lo),
      ]);
    }
  }
  let ay = 0,
    ax = 0.35,
    tx2 = 0.35,
    svis = false,
    sraf2 = 0;
  const fit = () => {
    const d = devicePixelRatio || 1,
      w = cv.clientWidth;
    cv.width = cv.height = Math.round(w * d);
  };
  function frame() {
    sraf2 = 0;
    const w = cv.width,
      R = w * 0.36,
      cy = Math.cos(ay),
      sy = Math.sin(ay);
    ax += (tx2 - ax) * 0.06;
    if (!reduce) ay += 0.006;
    const cxx = Math.cos(ax),
      sxx = Math.sin(ax);
    g2.clearRect(0, 0, w, w);
    for (const [x, y, z] of pts) {
      const x1 = x * cy + z * sy,
        z1 = -x * sy + z * cy,
        y1 = y * cxx - z1 * sxx,
        z2 = y * sxx + z1 * cxx,
        k = 1 / (1.6 - z2 * 0.4),
        t = (z2 + 1) / 2;
      g2.fillStyle = `rgba(185,166,255,${(0.12 + 0.88 * t).toFixed(2)})`;
      g2.beginPath();
      g2.arc(
        w / 2 + x1 * R * k * 1.3,
        w / 2 + y1 * R * k * 1.3,
        (1 + 1.8 * t) * (w / 300),
        0,
        6.283,
      );
      g2.fill();
    }
    if (svis && !reduce) sraf2 = requestAnimationFrame(frame);
  }
  fit();
  frame();
  addEventListener("resize", () => {
    fit();
    frame();
  });
  new IntersectionObserver(([e]) => {
    svis = e.isIntersecting;
    if (svis && !sraf2) sraf2 = requestAnimationFrame(frame);
  }).observe(cv);
  if (!reduce)
    ct.addEventListener("pointermove", (e) => {
      const r = ct.getBoundingClientRect();
      tx2 = 0.35 + ((e.clientY - r.top) / r.height - 0.5) * 0.9;
    });
})();
