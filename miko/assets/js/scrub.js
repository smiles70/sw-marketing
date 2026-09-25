/* Scroll-scrub hero — canvas frame-sequence engine.
   Video seeking caps at ~5 seeks/sec and cannot track scroll. This preloads
   a frame sequence and draws to canvas instead: zero decode latency, 60fps.
   Keeps the 10k-websites standard: progress ring + watchdog, resting rAF,
   framerate-independent lerp, smoothstep band plateaus, delta-gated writes. */
(function () {
  const hero = document.getElementById("scrub-hero");
  const stage = document.querySelector(".stage");
  const canvas = document.getElementById("scrub-canvas");
  const bands = [...document.querySelectorAll(".band")];
  const BANDS = window.SCRUB_BANDS || [];
  const COUNT = window.SCRUB_FRAMES || 120;
  const DIR = window.SCRUB_DIR;
  const poster = document.querySelector(".scrub-poster");
  const ring = document.querySelector(".ring");
  const ringC = document.querySelector(".ring circle");

  const staticMode = innerWidth < 760 ||
    matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (staticMode || !hero || !canvas) {
    document.body.classList.add("static-hero");
    // Mobile parity: swap the still poster for a short ambient loop when one
    // exists (../assets/video/loop-vN.mp4). Poster stays as the fallback.
    try {
      const vDir = (window.SCRUB_DIR || "").match(/frames\/(v\d+)/);
      if (vDir && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const vid = document.createElement("video");
        vid.muted = true; vid.loop = true; vid.autoplay = true;
        vid.setAttribute("playsinline", ""); vid.setAttribute("muted", "");
        vid.src = `${DIR}/../../video/loop-${vDir[1]}.mp4`;
        vid.style.cssText = "position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .6s";
        vid.oncanplay = () => { vid.style.opacity = 1; if (poster) poster.style.opacity = 0; };
        vid.onerror = () => vid.remove();
        (stage || hero.parentNode || document.body).appendChild(vid);
      }
    } catch (e) {}
    updateBands(0);
    return;
  }

  const ctx = canvas.getContext("2d", { alpha: false });
  const frames = new Array(COUNT);
  let ready = 0, drawn = -1;

  /* ---------- sizing: canvas matches the FRAME, not the viewport ----------
     Drawing 1:1 makes every blit an unscaled copy (the fast path). CSS
     object-fit:cover then scales the canvas on the compositor for free.
     A scaled drawImage each frame costs ~2x and is what caused the stutter. */
  function resize() {
    const img = frames.find(f => f);
    if (!img) return;
    if (canvas.width !== img.naturalWidth) {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      drawn = -1;
    }
    draw(shown);
  }
  function draw(p) {
    const i = Math.min(COUNT - 1, Math.max(0, Math.round(p * (COUNT - 1))));
    if (i === drawn) return;                 // delta-gate: only on change
    const img = frames[i];
    if (!img) return;
    drawn = i;
    ctx.drawImage(img, 0, 0);                // 1:1, no scaling
  }

  /* ---------- preload with ring + watchdog ---------- */
  const pad = n => String(n).padStart(3, "0");
  let done = false;
  const watchdog = setTimeout(() => { if (!done && ready < 8) fail(); }, 20000);

  poster.style.backgroundImage = `url(${poster.dataset.src})`;
  let concurrency = 8, next = 0;
  function loadNext() {
    if (next >= COUNT) return;
    const i = next++;
    const img = new Image();
    img.decoding = "async";
    const settle = () => {
      ready++;
      ringC.style.strokeDashoffset = Math.round(126 * (1 - ready / COUNT));
      if (i === 0) { resize(); revealStage(); }   // first frame: show canvas
      if (ready === COUNT) {
        done = true; clearTimeout(watchdog);
        ring.style.opacity = 0;
      }
      loadNext();
    };
    img.onload = () => {
      // decode() off the main thread: without it the FIRST drawImage of each
      // frame pays a synchronous JPEG decode (~45ms) and the scrub stutters.
      (img.decode ? img.decode().catch(() => {}) : Promise.resolve())
        .then(() => { frames[i] = img; settle(); });
    };
    img.onerror = () => { frames[i] = null; settle(); };
    img.src = `${DIR}/f${pad(i + 1)}.${window.SCRUB_EXT || "jpg"}`;
  }
  function revealStage() {
    stage.classList.add("video-ready");
    poster.style.opacity = 0;
    kick();                      // start ambient playback immediately
  }
  function fail() {
    ring.style.display = "none";
    document.body.classList.add("static-hero");
  }
  for (let c = 0; c < concurrency; c++) loadNext();

  /* ---------- band plateaus (smoothstep + --k), delta-gated ---------- */
  const smoothstep = (p, a, b) => {
    const t = Math.min(1, Math.max(0, (p - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };
  const cache = bands.map(() => ({ o: -1, k: -1 }));
  function updateBands(p) {
    bands.forEach((el, i) => {
      const [a, b] = BANDS[i] || [0, 0];
      const f = Math.min(0.02, (b - a) / 3);
      const o = (i === 0 ? 1 : smoothstep(p, a, a + f)) *
                (i === bands.length - 1 ? 1 : 1 - smoothstep(p, b - f, b));
      const k = Math.min(1, Math.max(0, (p - a) / Math.min(0.025, (b - a) * 0.35)));
      if (Math.abs(o - cache[i].o) > 0.008) {
        cache[i].o = o; el.style.opacity = o.toFixed(3);
      }
      if (Math.abs(k - cache[i].k) > 0.008) {
        cache[i].k = k; el.style.setProperty("--k", k.toFixed(3));
      }
    });
  }

  /* ---------- resting rAF + framerate-independent lerp ----------
     Two modes. AMBIENT: the sequence plays itself so the hero is alive the
     moment it loads. SCRUB: the visitor's scroll owns the playhead. First
     real scroll hands over, and the lerp eases across so it reads as the
     visitor taking control rather than a cut. */
  let target = 0, shown = 0, rafId = null, lastTick = 0, heroOn = true;
  let ambient = true;
  const AMBIENT_FPS = 15;
  const heroProgress = () => {
    const r = hero.getBoundingClientRect();
    return Math.min(1, Math.max(0, -r.top / (hero.offsetHeight - innerHeight)));
  };
  function tick(now) {
    const dt = Math.min(100, now - (lastTick || now));
    lastTick = now;
    if (ambient) {
      shown = (shown + (dt / 1000) * (AMBIENT_FPS / COUNT)) % 1;   // loop
      rafId = requestAnimationFrame(tick);
    } else {
      shown += (target - shown) * (1 - Math.pow(1 - 0.18, dt / 16.667));
      if (Math.abs(target - shown) < 0.0004) {
        shown = target; rafId = null; lastTick = 0;
      } else rafId = requestAnimationFrame(tick);
    }
    draw(shown);
    updateBands(ambient ? 0 : shown);   // ambient holds the opening headline
  }
  function kick() {
    if (rafId === null && heroOn) { lastTick = 0; rafId = requestAnimationFrame(tick); }
  }
  addEventListener("scroll", () => {
    if (ambient && scrollY > 4) { ambient = false; stage.classList.add("scrubbing"); }
    target = heroProgress();
    kick();
  }, { passive: true });
  addEventListener("resize", resize);
  new IntersectionObserver(e => {
    heroOn = e[0].isIntersecting;
    if (heroOn) kick();
  }).observe(hero);

  target = heroProgress(); shown = target;
  resize(); updateBands(target);
})();
