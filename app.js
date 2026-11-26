(function () {
  const raw = window.NOVEL_DATA || [];
  const titleEl = document.getElementById("title");
  const textEl = document.getElementById("text");
  const hintsEl = document.getElementById("hints");

  const chapters = raw.map(function (chapter) {
    const paragraphs = chapter.text.split(/\n{2,}/).filter(function (p) { return p.trim().length; });
    const segments = [];
    let buffer = [];
    let count = 0;
    paragraphs.forEach(function (p) {
      buffer.push(p);
      count += Array.from(p).length;
      if (buffer.length >= 3 || count >= 1100) {
        segments.push(buffer.join("\n\n"));
        buffer = [];
        count = 0;
      }
    });
    if (buffer.length) segments.push(buffer.join("\n\n"));
    return segments;
  });

  let chapterIndex = 0;
  let segmentIndex = 0;
  let fast = false;
  let scrollTick = 0;
  let resume = null;
  let token = 0;

  function wait(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }

  function waitForAdvance() {
    return new Promise(function (resolve) { resume = resolve; });
  }

  function release() {
    if (!resume) return;
    const next = resume;
    resume = null;
    next();
  }

  function pace(ch, i, seed) {
    const r = Math.random();
    let d;
    if (ch === "\n") {
      d = 340 + r * 300;
    } else if (/[.!?…]/.test(ch)) {
      d = 680 + r * 520;
    } else if (/[,;:—–"'”]/.test(ch)) {
      d = 190 + r * 150;
    } else if (ch === " ") {
      d = 18 + r * 14;
    } else {
      const wave = 0.5 + 0.5 * Math.sin(i * 0.006 + seed * 0.61);
      d = (23 + r * 19) * (wave < 0.34 ? 1.9 : 1);
    }
    return fast ? Math.max(1, d * 0.06) : d;
  }

  // guard is the token the passage started under. A chapter jump bumps the token,
  // so the passage in flight stops instead of printing on into a cleared screen.
  async function typeString(el, str, seed, clear, guard) {
    if (clear) el.textContent = "";
    const chars = Array.from(str);
    for (let i = 0; i < chars.length; i++) {
      if (guard !== undefined && guard !== token) return false;
      el.textContent += chars[i];
      if (++scrollTick % 8 === 0) {
        window.scrollTo(0, document.body.scrollHeight);
      }
      await wait(pace(chars[i], i, seed));
    }
    if (guard !== undefined && guard !== token) return false;
    window.scrollTo(0, document.body.scrollHeight);
    return true;
  }

  function jump(delta) {
    chapterIndex = Math.max(0, Math.min(chapters.length - 1, chapterIndex + delta));
    segmentIndex = 0;
    token += 1;
    textEl.textContent = "";
    release();
  }

  function advance(e) {
    const isAdvance = e.type === "click" || e.key === " " || e.key === "Enter";
    if (isAdvance && resume) {
      if (e.preventDefault) e.preventDefault();
      release();
      return;
    }
    if (e.type !== "keydown") return;
    if (e.key.toLowerCase() === "f") {
      fast = !fast;
      e.preventDefault();
    } else if (e.key === "ArrowRight") {
      jump(1);
      e.preventDefault();
    } else if (e.key === "ArrowLeft") {
      jump(-1);
      e.preventDefault();
    }
  }

  document.addEventListener("click", advance);
  document.addEventListener("keydown", advance);

  async function run() {
    await typeString(titleEl, "TOKYO\n\n", 0, true);
    await typeString(hintsEl, "CLICK / SPACE CONTINUE · F SPEED UP · ← / → CHAPTER", 1, true);
    await waitForAdvance();

    while (chapterIndex < chapters.length) {
      const chapterAt = chapterIndex;
      const segments = chapters[chapterAt];
      let jumped = false;
      while (segmentIndex < segments.length) {
        const myToken = token;
        await typeString(textEl, segments[segmentIndex], chapterAt * 97 + segmentIndex, true, myToken);
        if (myToken !== token) { jumped = true; break; }
        if (chapterAt === chapters.length - 1 && segmentIndex === segments.length - 1) return;
        await waitForAdvance();
        if (myToken !== token) { jumped = true; break; }
        segmentIndex += 1;
      }
      if (jumped) continue;
      chapterIndex += 1;
      segmentIndex = 0;
    }
  }

  if (chapters.length) run();
})();
