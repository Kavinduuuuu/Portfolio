/* ============================================================================
   1. 3D FRAME CANVAS SCROLL ENGINE (220 FRAMES)
   ============================================================================ */
(() => {
  const FRAME_COUNT = 270;
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });

  const images = [];
  let lastDrawnFrame = -1;
  let targetProgress = 0;
  let currentProgress = 0;
  const LERP_SPEED = 0.12;
  let isPageVisible = true;
  let isTicking = false;

  const getFramePath = (index) => {
    const padded = String(index).padStart(3, '0');
    return `Image/ezgif-frame-${padded}.jpg`;
  };

  const resizeCanvas = () => {
    const isMobile = window.innerWidth < 768;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    lastDrawnFrame = -1;
    renderFrame(Math.round(currentProgress * (FRAME_COUNT - 1)) + 1);
  };

  const renderFrame = (targetFrame) => {
    const clampedTarget = Math.max(1, Math.min(FRAME_COUNT, targetFrame));
    let img = images[clampedTarget - 1];
    let actualIndex = clampedTarget;

    if (!img || !img.complete || img.naturalWidth === 0) {
      let found = false;
      for (let offset = 1; offset < FRAME_COUNT; offset++) {
        const prev = clampedTarget - 1 - offset;
        if (prev >= 0 && images[prev]?.complete && images[prev].naturalWidth > 0) {
          img = images[prev];
          actualIndex = prev + 1;
          found = true;
          break;
        }
        const next = clampedTarget - 1 + offset;
        if (next < FRAME_COUNT && images[next]?.complete && images[next].naturalWidth > 0) {
          img = images[next];
          actualIndex = next + 1;
          found = true;
          break;
        }
      }
      if (!found) return;
    }

    if (actualIndex === lastDrawnFrame) return;

    const cw = canvas.width;
    const ch = canvas.height;
    if (!cw || !ch) return;

    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.clearRect(0, 0, cw, ch);

    // 1. Draw the clean frame image
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(img, 0, 0, iw, ih, dx, dy, dw, dh);

    // 2. Feather-erase outer perimeter to eliminate any compression edges
    ctx.globalCompositeOperation = 'destination-out';
    const eraseRadius = Math.max(cw, ch) * 0.72;
    const eraseVignette = ctx.createRadialGradient(
      cw / 2, ch * 0.44, Math.min(cw, ch) * 0.22,
      cw / 2, ch * 0.44, eraseRadius
    );
    eraseVignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    eraseVignette.addColorStop(0.6, 'rgba(0, 0, 0, 0)');
    eraseVignette.addColorStop(1, 'rgba(0, 0, 0, 0.5)');

    ctx.fillStyle = eraseVignette;
    ctx.fillRect(0, 0, cw, ch);

    ctx.globalCompositeOperation = 'source-over';
    lastDrawnFrame = actualIndex;
  };

  const preloadImages = () => {
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.onerror = () => { if (i === 1 || i === FRAME_COUNT) console.warn('Scroll frame NOT found:', img.src); };
      img.src = getFramePath(i);
      img.onload = () => {
        if (lastDrawnFrame === -1 || Math.abs(i - Math.round(currentProgress * (FRAME_COUNT - 1) + 1)) <= 1) {
          lastDrawnFrame = -1;
        }
      };
      images.push(img);
    }
  };

  const getScrollProgress = () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    return Math.min(1, Math.max(0, scrollY / maxScroll));
  };

  const tick = () => {
    if (!isPageVisible) {
      isTicking = false;
      return;
    }
    targetProgress = getScrollProgress();
    currentProgress += (targetProgress - currentProgress) * LERP_SPEED;
    if (Math.abs(targetProgress - currentProgress) < 0.0001) {
      currentProgress = targetProgress;
    }
    renderFrame(Math.round(currentProgress * (FRAME_COUNT - 1)) + 1);
    requestAnimationFrame(tick);
  };

  const startTicking = () => {
    if (!isTicking && isPageVisible) {
      isTicking = true;
      requestAnimationFrame(tick);
    }
  };

  document.addEventListener('visibilitychange', () => {
    isPageVisible = document.visibilityState === 'visible';
    if (isPageVisible) {
      lastDrawnFrame = -1;
      startTicking();
    }
  });

  window.addEventListener('resize', resizeCanvas, { passive: true });
  window.addEventListener('scroll', () => {
    targetProgress = getScrollProgress();
  }, { passive: true });

  resizeCanvas();
  preloadImages();
  startTicking();
})();

/* ============================================================================
   2. SITE DATA CONFIGURATION
   ============================================================================ */
/* ============================================================================
   2. SITE DATA CONFIGURATION
   ============================================================================ */
const SITE = {
  name: "Kandage Kavindu Thathsara",
  display: "Kavindu",
  availability: "Open for internships · Colombo, Sri Lanka",
  intro: "Full-Stack Developer & UI/UX Designer engineering AI-powered platforms (RAG), scalable web applications with Next.js & TypeScript, and human-centric interfaces in Figma.",
  about: "At the intersection of software engineering, artificial intelligence, and cybersecurity, I combine robust backend architecture, cutting-edge AI pipelines, and intuitive UI/UX principles to craft high-impact digital products.",
  resume: "Kavindu_Thathsara_CV.pdf",
  email: "thathsarakavindu9@gmail.com",
  phone: "+94772106370",
  links: {
    GitHub: "https://github.com/Kavinduuuuu",
    LinkedIn: "https://linkedin.com/in/kavindu-thathsara",
    Instagram: "https://instagram.com/kavinduuu_"
  },

  // EXACT IMAGE 3 ARSENAL + EXPANDED AI & INDUSTRY TOOLS
  toolsRibbon: [
    {
      id: "python",
      name: "PYTHON",
      sub: "Core Language",
      cats: ["featured", "industry"],
      svg: `<svg viewBox="0 0 128 128"><defs><linearGradient id="py-b" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#387eb8"/><stop offset="100%" stop-color="#366994"/></linearGradient><linearGradient id="py-y" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ffe873"/><stop offset="100%" stop-color="#ffd43b"/></linearGradient></defs><path fill="url(#py-b)" d="M63.6 5.8c-14.7 0-23.7 6.4-23.7 18.6v13.7h24.2v3.4H30.4C13.8 41.5 5 51.2 5 67.8c0 17 9.8 26.2 26 26.2h9.2v-12.7c0-14.5 12.3-27.2 26.8-27.2h23.7v-3.7c0-13.8-11.4-24.6-27.1-24.6zm-12.2 7.7a4.2 4.2 0 1 1 0 8.4 4.2 4.2 0 0 1 0-8.4z"/><path fill="url(#py-y)" d="M64.4 122.2c14.7 0 23.7-6.4 23.7-18.6V89.9H63.9v-3.4h33.7c16.6 0 25.4-9.7 25.4-26.3 0-17-9.8-26.2-26-26.2h-9.2v12.7c0 14.5-12.3 27.2-26.8 27.2H47.3v3.7c0 13.8 11.4 24.6 27.1 24.6zm12.2-7.7a4.2 4.2 0 1 1 0-8.4 4.2 4.2 0 0 1 0 8.4z"/></svg>`
    },
    {
      id: "java",
      name: "JAVA",
      sub: "Enterprise OOP",
      cats: ["featured", "industry"],
      svg: `<svg viewBox="0 0 128 128"><path fill="#e76f00" d="M47.7 21.6c4.6 5.3 1.2 11.8-6.1 16.5-6.5 4.1-8.5 7.9-5.1 12.5 4.3 5.7 14.2 3.1 18.1-4.8 5-10.2-2.1-18.8-6.9-24.2zM69.8 12.4c3.8 4.2 1.5 9.7-4.4 14.1-6.1 4.5-8.2 9.1-3.6 14 5.2 5.5 16 3.1 18.4-5.2 2.8-9.9-5.5-17.7-10.4-22.9z"/><path fill="#5382a1" d="M36 67.2c2.8 1.4 17.5 3.5 33.6 2.3 18.9-1.4 27.3-6.6 27.3-6.6s-3.5 3.3-11.4 5.4c-9.8 2.7-28 3.5-49.5-1.1zm-4.7 13c3.4 1.2 18.6 3.6 34.6 2.4 18.8-1.5 28.5-7.7 28.5-7.7s-3.7 3.8-11.4 6c-10.8 3.1-30.8 4.2-51.7-.7zm4.3 13.9c16.2 3.8 42.1 3.5 56.5-3.3-6.6 3.9-19.7 6.4-34.9 6.2-12.7-.2-21.6-2.9-21.6-2.9z"/><path fill="#5382a1" d="M96.7 75.8c7.2-7.5 6.2-14.8 3-17.5-3.3-2.8-8.2-1.9-12.2-.4 3.7-2.6 10.8-4.7 15.6-.9 4.9 3.9 4.3 13.2-6.4 18.8z"/><path fill="#e76f00" d="M22 108.8c22.8 5.7 61.2 5.9 84 0 7.8-2 0-7.3-8.8-6.1-23.7 3.3-51.2 3.1-70.5-.3-9.5-1.7-13.6 4.6-4.7 6.4z"/></svg>`
    },
    {
      id: "csharp",
      name: "C#",
      sub: ".NET Platform",
      cats: ["featured", "industry"],
      svg: `<svg viewBox="0 0 128 128"><path fill="#9B4993" d="M64 5l52 30v60l-52 30-52-30V35z"/><path fill="#fff" d="M60.6 85.3c-13.1 0-21.6-9.1-21.6-21.3s8.5-21.3 21.6-21.3c8.2 0 14.5 3.8 18.4 9.9l-8.5 5.5c-2.3-3.8-5.7-5.9-9.9-5.9-6.9 0-11.4 5.3-11.4 11.8s4.5 11.8 11.4 11.8c4.2 0 7.6-2.1 9.9-5.9l8.5 5.5c-3.9 6.1-10.2 9.9-18.4 9.9zm27-14.2h-3.4l.7-4.4h3.4l.9-5.7h4.8l-.9 5.7h4.3l.9-5.7h4.8l-.9 5.7h3.3l-.7 4.4h-3.4l-.8 5.2h3.4l-.7 4.4h-3.4l-.9 5.7h-4.8l.9-5.7h-4.3l-.9 5.7H86l.9-5.7h-3.4l.7-4.4h3.4l.8-5.2zm8.8 0h4.3l.8-5.2h-4.3l-.8 5.2z"/></svg>`
    },
    {
      id: "javascript",
      name: "JAVASCRIPT",
      sub: "ES6+ / Web",
      cats: ["featured", "industry"],
      svg: `<svg viewBox="0 0 128 128"><rect width="128" height="128" rx="20" fill="#f7df1e"/><path fill="#000" d="M37.5 106c-8.5 0-14.8-4.2-18-11.2l12.4-7.4c2.1 4.2 4.8 6.5 8 6.5 4.5 0 7.3-2.6 7.3-8.8V44.2h15.2v40.8c0 13.8-7.9 21-24.9 21zm48.7 0c-15.3 0-25-8.8-25-22.3 0-14.7 10.6-20.7 20.9-23.7l3.8-1.1c5.2-1.5 8.2-3.1 8.2-6.5 0-3.6-2.9-5.8-7.3-5.8-4.8 0-8.2 2.4-10.6 6.8l-12.3-7.5c5.3-9.5 13.6-13.7 23.3-13.7 13.7 0 22.3 7.8 22.3 19.8 0 13-8.8 18.5-19.1 21.6l-3.8 1.1c-5.8 1.7-8.4 3.7-8.4 7.4 0 4.2 3.5 6.7 8.9 6.7 5.9 0 10.2-3.1 13-8.2l12.1 7.3c-5 9.4-14.1 15-24.9 15z"/></svg>`
    },
    {
      id: "htmlcss",
      name: "HTML/CSS",
      sub: "Frontend Modern",
      cats: ["featured", "industry"],
      svg: `<svg viewBox="0 0 128 128"><path fill="#e34f26" d="M19 116.5L8.5 0h111l-10.5 116.5L64 128z"/><path fill="#ef652a" d="M64 118.5l37.8-10.5 8.9-97.9H64z"/><path fill="#edebeb" d="M64 54.4H45.8l-1.3-14.4H64V26.2H28.7l3.8 42H64zm0 37.8l-.2.1-16.7-4.5-1.1-12h-14l2.1 23.5 29.7 8.2.2-.1z"/><path fill="#fff" d="M64 54.4h18.2l-1.7 19.3L64 78.3v13.9l29.8-8.2.3-3.4 3.4-38.3.2-2.5H64zm0-28.2v13.8h34.8l1.3-13.8z"/></svg>`
    },
    {
      id: "git",
      name: "GIT",
      sub: "Version Control",
      cats: ["featured", "industry"],
      svg: `<svg viewBox="0 0 128 128"><path fill="#f05032" d="M124.7 56.4L71.6 3.3c-4.4-4.4-11.6-4.4-16 0L39.8 19.1l20.4 20.4c4.7-1.6 10.2-.5 13.9 3.2 3.7 3.7 4.8 9.2 3.2 13.9l19.6 19.6c4.7-1.6 10.2-.5 13.9 3.2 5.1 5.1 5.1 13.3 0 18.4s-13.3 5.1-18.4 0c-3.9-3.9-4.9-9.7-3-14.5L71.3 64.9v27.6c1.8 1.1 3.4 2.6 4.5 4.5 3.7 6.1 1.8 14.1-4.3 17.8-6.1 3.7-14.1 1.8-17.8-4.3-3.7-6.1-1.8-14.1 4.3-17.8 2.2-1.3 4.8-1.9 7.3-1.6V63.1c-2.5.3-5.1-.3-7.3-1.6l-19.3 19.3c-4.4 4.4-11.6 4.4-16 0L3.3 71.6c-4.4-4.4-4.4-11.6 0-16L19.1 39.8 3.3 24c-4.4-4.4-4.4-11.6 0-16s11.6-4.4 16 0l15.8 15.8 16-16c4.4-4.4 11.6-4.4 16 0l57.6 57.6c4.4 4.4 4.4 11.6 0 16-4.4 4.4-11.6 4.4-16 0z"/></svg>`
    },
    {
      id: "figma",
      name: "FIGMA",
      sub: "UI/UX & Systems",
      cats: ["featured", "industry"],
      svg: `<svg viewBox="0 0 128 128"><path fill="#0acf83" d="M42.7 128c11.8 0 21.3-9.5 21.3-21.3V85.3H42.7C30.9 85.3 21.3 94.9 21.3 106.7S30.9 128 42.7 128z"/><path fill="#a259ff" d="M21.3 64c0-11.8 9.5-21.3 21.3-21.3H64v42.7H42.7C30.9 85.3 21.3 75.8 21.3 64z"/><path fill="#f24e1e" d="M21.3 21.3C21.3 9.5 30.9 0 42.7 0H64v42.7H42.7C30.9 42.7 21.3 33.1 21.3 21.3z"/><path fill="#ff7262" d="M64 0h21.3c11.8 0 21.3 9.5 21.3 21.3S97.1 42.7 85.3 42.7H64V0z"/><path fill="#1abcfe" d="M106.7 64c0 11.8-9.5 21.3-21.3 21.3C73.6 85.3 64 75.8 64 64s9.5-21.3 21.3-21.3c11.8 0 21.4 9.5 21.4 21.3z"/></svg>`
    },

    // AI VIDEO & MOTION (USER REQUESTED HIGGSFIELD & GOOGLE VEO 3)
    {
      id: "veo3",
      name: "GOOGLE VEO 3",
      sub: "Generative Video AI",
      cats: ["ai-video"],
      svg: `<svg viewBox="0 0 128 128"><defs><linearGradient id="v-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#4285F4"/><stop offset="35%" stop-color="#9B72CB"/><stop offset="70%" stop-color="#EA4335"/><stop offset="100%" stop-color="#FBBC05"/></linearGradient></defs><rect width="128" height="128" rx="26" fill="#020418" stroke="url(#v-g)" stroke-width="4"/><path d="M38 42l34 22-34 22z" fill="url(#v-g)"/><rect x="76" y="44" width="16" height="40" rx="4" fill="#bff119"/><circle cx="84" cy="36" r="4" fill="#00f0ff"/></svg>`
    },
    {
      id: "higgsfield",
      name: "HIGGSFIELD AI",
      sub: "AI Motion & Cinema",
      cats: ["ai-video"],
      svg: `<svg viewBox="0 0 128 128"><defs><linearGradient id="h-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#bff119"/><stop offset="100%" stop-color="#00f0ff"/></linearGradient></defs><rect width="128" height="128" rx="26" fill="#040828" stroke="url(#h-g)" stroke-width="4"/><circle cx="64" cy="64" r="28" stroke="url(#h-g)" stroke-width="6" fill="none" stroke-dasharray="14 6"/><circle cx="64" cy="64" r="12" fill="#bff119"/><path d="M64 16v18M64 94v18M16 64h18M94 64h18" stroke="#00f0ff" stroke-width="5" stroke-linecap="round"/></svg>`
    },
    {
      id: "runway",
      name: "RUNWAY GEN-3",
      sub: "Motion Synthesis",
      cats: ["ai-video"],
      svg: `<svg viewBox="0 0 128 128"><rect width="128" height="128" rx="26" fill="#060814" stroke="#00f0ff" stroke-width="4"/><path d="M32 36h64M32 64h48M32 92h64" stroke="#bff119" stroke-width="8" stroke-linecap="round"/></svg>`
    },

    // AI IMAGE & CREATIVE (USER REQUESTED GOOGLE FLOW & IMAGE GEN)
    {
      id: "gflow",
      name: "GOOGLE FLOW",
      sub: "Visual Generation",
      cats: ["ai-image"],
      svg: `<svg viewBox="0 0 128 128"><defs><linearGradient id="gf-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1630d6"/><stop offset="50%" stop-color="#00e5ff"/><stop offset="100%" stop-color="#bff119"/></linearGradient></defs><rect width="128" height="128" rx="26" fill="#030720" stroke="url(#gf-g)" stroke-width="4"/><path d="M30 76c14-34 30-34 44 0s30 34 44 0" stroke="url(#gf-g)" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="52" cy="58" r="7" fill="#bff119"/><circle cx="96" cy="58" r="7" fill="#00e5ff"/></svg>`
    },
    {
      id: "midjourney",
      name: "MIDJOURNEY V6",
      sub: "Photorealistic AI",
      cats: ["ai-image"],
      svg: `<svg viewBox="0 0 128 128"><rect width="128" height="128" rx="26" fill="#02030f" stroke="#fff" stroke-width="3"/><path fill="#fff" d="M64 24c-5 18-18 31-36 36 18 5 31 18 36 36 5-18 18-31 36-36-18-5-31-18-36-36z"/></svg>`
    },
    {
      id: "flux",
      name: "FLUX.1 AI",
      sub: "Text-to-Image SOTA",
      cats: ["ai-image"],
      svg: `<svg viewBox="0 0 128 128"><rect width="128" height="128" rx="26" fill="#0d041e" stroke="#ff2a85" stroke-width="4"/><polygon points="64,24 104,96 24,96" fill="none" stroke="#bff119" stroke-width="6"/><circle cx="64" cy="72" r="10" fill="#00e5ff"/></svg>`
    },

    // LLMS, RAG & DEV AI TOOLS
    {
      id: "gemini",
      name: "GEMINI 2.0 PRO",
      sub: "Multimodal AI",
      cats: ["llm-rag"],
      svg: `<svg viewBox="0 0 128 128"><defs><linearGradient id="gm-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1ba0e2"/><stop offset="50%" stop-color="#9f75ff"/><stop offset="100%" stop-color="#f26a8d"/></linearGradient></defs><path fill="url(#gm-g)" d="M64 4c0 33.1 26.9 60 60 60-33.1 0-60 26.9-60 60 0-33.1-26.9-60-60-60 33.1 0 60-26.9 60-60z"/></svg>`
    },
    {
      id: "groq",
      name: "GROQ LPU",
      sub: "Fast RAG Inference",
      cats: ["llm-rag"],
      svg: `<svg viewBox="0 0 128 128"><rect width="128" height="128" rx="26" fill="#f55036"/><path fill="#fff" d="M78 30L44 68h22l-16 30 38-42H64z"/></svg>`
    },
    {
      id: "cursor",
      name: "CURSOR AI",
      sub: "Agentic IDE",
      cats: ["llm-rag"],
      svg: `<svg viewBox="0 0 128 128"><rect width="128" height="128" rx="26" fill="#000" stroke="#bff119" stroke-width="4"/><path d="M38 32l52 32-28 6 16 26-10 6-16-26-14 16z" fill="#bff119"/></svg>`
    },

    // IT INDUSTRY & UNDERGRADUATE STACK
    {
      id: "react",
      name: "REACT / NEXT",
      sub: "UI Architecture",
      cats: ["industry"],
      svg: `<svg viewBox="0 0 128 128"><ellipse cx="64" cy="64" rx="14" ry="48" fill="none" stroke="#61dafb" stroke-width="4" transform="rotate(30 64 64)"/><ellipse cx="64" cy="64" rx="14" ry="48" fill="none" stroke="#61dafb" stroke-width="4" transform="rotate(90 64 64)"/><ellipse cx="64" cy="64" rx="14" ry="48" fill="none" stroke="#61dafb" stroke-width="4" transform="rotate(150 64 64)"/><circle cx="64" cy="64" r="8" fill="#61dafb"/></svg>`
    },
    {
      id: "docker",
      name: "DOCKER",
      sub: "Containers & CI/CD",
      cats: ["industry"],
      svg: `<svg viewBox="0 0 128 128"><path fill="#2496ed" d="M120.3 54c-1.5-.9-8.4-1.2-12.7 1.9-2.3 1.7-4.4 4.5-5.3 7.8-8.4.6-21.2 5.1-27.1 16.5-12.9-1.2-31.5 2.1-40.8 14.8-1.7-.8-3.6-1.3-5.7-1.3-7.7 0-14 6.3-14 14 0 2.2.5 4.3 1.4 6.1C8.2 114.7 12.8 116 18 116c31.1 0 54.3-11.8 67.5-27.8 14.2.8 28.5-7.7 33.3-19.1 5.3-2.3 8.3-7.5 7.4-13.1-.7-1.4-3.9-1.8-5.9-2zM48.8 38.6h12v12h-12zm-15.6 0h12v12h-12zm31.2 0h12v12h-12zm-15.6-15.6h12v12h-12zm15.6 0h12v12h-12zm-31.2 0h12v12h-12zm31.2 31.2h12v12h-12zm-15.6 0h12v12h-12zm-15.6 0h12v12h-12zm-15.6 0h12v12h-12z"/></svg>`
    },

    // CYBERSECURITY & CTF
    {
      id: "cyber",
      name: "CTF / ETHICAL",
      sub: "VulnHat & C²SH",
      cats: ["cyber"],
      svg: `<svg viewBox="0 0 128 128"><path fill="#bff119" d="M64 12l42 16v34c0 30-18 52-42 60-24-8-42-30-42-60V28z"/><path fill="#020418" d="M64 22l32 12v28c0 23-14 40-32 46-18-6-32-23-32-46V34z"/><path fill="#bff119" d="M56 46h16v12h-16zm-8 16h32v24H48z"/></svg>`
    }
  ],

  projects: [
    {
      title: "VarsitySport-Agent",
      img: "images/VarsitySport-Agent.jpg",
      category: "AI / RAG",
      year: "2024",
      summary: "University sports management & safety advisory AI with RAG.",
      description: "Academic AI application for university sports management and safety advisory, utilizing Retrieval-Augmented Generation (RAG) and semantic vector search for real-time protocol retrieval and emergency coordination.",
      tools: ["Python", "Streamlit", "Groq", "FAISS", "Sentence-Transformers", "RAG"],
      liveUrl: "",
      sourceUrl: "https://github.com/Kavinduuuuu"
    },
    {
      title: "Sports Injury Recovery Assistant",
      img: "images/Sports-Injury-Recovery-Assistant.jpg",
      category: "AI / RAG",
      year: "2024",
      summary: "AI-assisted clinical recovery guidance using agentic RAG.",
      description: "AI-assisted application focused on retrieving sports injury recovery information and protocols using document retrieval, vector databases, and language-model technologies.",
      tools: ["Python", "Streamlit", "ChromaDB", "Sentence-Transformers", "Groq"],
      liveUrl: "",
      sourceUrl: "https://github.com/Kavinduuuuu"
    },
    {
      title: "Encrypted Network Traffic Recognition",
      img: "images/Encrypted-Network-Traffic-Recognition.jpg",
      category: "AI / RAG",
      year: "2024",
      summary: "Machine learning classification for encrypted network flows.",
      description: "Machine-learning project focused on recognizing and classifying encrypted network traffic patterns using feature extraction, dimensionality reduction, and ensemble models.",
      tools: ["Python", "Scikit-learn", "XGBoost", "TensorFlow/Keras", "PCA", "Pandas"],
      liveUrl: "",
      sourceUrl: "https://github.com/Kavinduuuuu"
    },
    {
      title: "GameEdge",
      img: "images/GameEdge.jpg",
      category: "Full-stack",
      year: "2024",
      summary: "Gaming cafe management and e-sports booking platform.",
      description: "Full-stack gaming cafe management and tournament scheduling platform developed using a modern TypeScript technology stack, Node.js backend, and modular npm workspaces.",
      tools: ["TypeScript", "Node.js", "Tailwind CSS", "npm Workspaces", "Git"],
      liveUrl: "",
      sourceUrl: "https://github.com/Kavinduuuuu"
    },
    {
      title: "DailyCalc LK",
      img: "images/DailyCalc-LK.jpg",
      category: "DevOps",
      year: "2024",
      summary: "Containerized utility calculator with CI/CD pipeline.",
      description: "Web-based utility calculator with PHP backend, fully containerized with Docker and continuously deployed through automated GitHub Actions CI/CD workflows.",
      tools: ["HTML5", "CSS3", "JavaScript", "Bootstrap 5", "PHP", "Docker", "GitHub Actions"],
      liveUrl: "",
      sourceUrl: "https://github.com/Kavinduuuuu"
    },
    {
      title: "SmartCampus LMS",
      img: "images/Smartcampus-lms.jpg",
      category: "UI/UX",
      year: "2024",
      summary: "Campus Learning Management System UI/UX in Figma.",
      description: "Comprehensive user interface design and student experience architecture for a modern campus LMS created in Figma: course catalogs, interactive grade tracking, and accessible student portals.",
      tools: ["Figma", "Design Systems", "Information Architecture", "Prototyping"],
      liveUrl: "",
      sourceUrl: "https://github.com/Kavinduuuuu"
    },
    {
      title: "Wallify Paint Shop",
      img: "images/Wallify-Paint-Shop.jpg",
      category: "UI/UX",
      year: "2024",
      summary: "E-commerce & color visualizer product interface.",
      description: "Complete digital interface designed for a specialty paint shop in Figma, featuring interactive color palette visualizers, surface paint calculators, and streamlined checkout.",
      tools: ["Figma", "Color Theory", "Wireframing", "Layout Design"],
      liveUrl: "",
      sourceUrl: "https://github.com/Kavinduuuuu"
    },
    {
      title: "Share2Care — Meal Bank Finder",
      img: "images/Share2Care-Meal-Bank-Finder.jpg",
      category: "UI/UX",
      year: "2024",
      summary: "Community food aid mobile platform design.",
      description: "Mobile application interface designed in Figma connecting communities with nearby food and meal banks, prioritizing rapid accessibility and compassionate UX for people in need.",
      tools: ["Figma", "User Research", "Mobile UI", "Design Thinking"],
      liveUrl: "",
      sourceUrl: "https://github.com/Kavinduuuuu"
    }
  ],

  // COMPREHENSIVE AI & INDUSTRY STACK (USER REQUESTED)
  skills: {
    "AI Video & Image": [
      "Google Veo 3", "Higgsfield AI", "Midjourney v6", "ComfyUI"
    ],
    "LLMs, RAG & AI Dev": [
      "Google Gemini", "Claude", "LangChain", "FAISS"
    ],
    "Languages": [
      "Python", "Java", "TypeScript", "SQL"
    ],
    "Web Engineering": [
      "React", "Next.js", "Node.js", "Tailwind CSS"
    ],
    "DevOps & Tools": [
      "Docker", "Git & GitHub", "GitHub Actions", "Linux / Bash"
    ],
    "UI/UX & Design": [
      "Figma", "Design Systems", "Adobe Photoshop", "Canva"
    ]
  },

  // TIMELINE WITH THE 2 CYBERSECURITY CERTIFICATIONS
  timeline: [
    {
      t: "THE PROJECT RED CORE — CTF Workshop 2026",
      o: "Community of Cybersecurity in Horizon (C²SH) & VulnHat PVT LTD",
      d: "2026",
      x: "Certified participation in hands-on Capture The Flag (CTF) challenges, offensive cybersecurity methodologies, web vulnerability exploitation, network packet analysis, and secure code review organized by C²SH in partnership with VulnHat PVT LTD company.",
      certImg: "Image/cert_red_core_2026.png",
      badge: "Cybersecurity & CTF",
      advisor: "Mr. Thilina Samarasinghe (Advisor)",
      founder: "Mr. Lakshitha Perera (Founder, VulnHat PVT LTD)",
      verified: true
    },
    {
      t: "THE HACKERS' BLUEPRINT — Web Security & Ethical Hacking",
      o: "Community of Cybersecurity in Horizon (C²SH) & Horizon Campus",
      d: "2024 – 2025",
      x: "Comprehensive training and practical evaluation in ethical hacking principles, OWASP vulnerability hunting, network reconnaissance, defense-in-depth architecture, and responsible disclosure.",
      certImg: "Image/cert_hackers_blueprint (3).png",
      badge: "Ethical Hacking",
      verified: true
    },
    {
      t: "Sports Director & Council Editor",
      o: "Rotaract Club & Sports Council · Horizon Campus",
      d: "2026 – Present",
      x: "Lead campus sports initiatives, tournament planning, and athletic coordination. Direct promotional digital media, video coverage, and social branding.",
      badge: "Leadership & Media"
    },
    {
      t: "BSc (Hons) in Information Technology",
      o: "Horizon College of Business & Technology, Malabe",
      d: "Nov 2023 – Expected 2028",
      x: "Relevant areas: Software Development, Web Technologies, Database Systems, Computer Networks, and Artificial Intelligence.",
      badge: "Undergraduate Degree"
    },
    {
      t: "UI/UX Design Specialization",
      o: "Google Career Certificates",
      d: "2023",
      x: "User experience research, wireframing, high-fidelity Figma prototyping, design systems, and usability testing.",
      badge: "Google Certified"
    },
    {
      t: "Computer Hardware Trainee",
      o: "WARA Technologies, Sri Lanka",
      d: "Mar 2023 – Nov 2023",
      x: "Practical hardware assembly, diagnostic troubleshooting, network maintenance, and technical customer support.",
      badge: "Hardware & Systems"
    }
  ]
};

/* ============================================================================
   3. DYNAMIC CONTENT RENDERING (INSTANT LOAD)
   ============================================================================ */
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const setHtml = (sel, val) => { const el = $(sel); if (el) el.innerHTML = val; };
const setText = (sel, val) => { const el = $(sel); if (el) el.textContent = val; };

setHtml('#logo', esc(SITE.display) + '<i>.</i>');
setHtml('#av', '<span class="av-dot"></span> ' + esc(SITE.availability));
setText('#intro', SITE.intro);
setText('#about-t', SITE.about);
const elCv = $('#cv'); if (elCv) { elCv.href = SITE.resume; elCv.setAttribute('download', SITE.resume); }
setText('#ft', '© ' + new Date().getFullYear() + ' ' + SITE.name + ' · Engineered with Next-Gen Standards.');

const TOOL_SVGS = {"Google Veo 3": "<svg viewBox=\"0 0 128 128\"><defs><linearGradient id=\"veo-g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#4285F4\"/><stop offset=\"35%\" stop-color=\"#9B72CB\"/><stop offset=\"70%\" stop-color=\"#EA4335\"/><stop offset=\"100%\" stop-color=\"#FBBC05\"/></linearGradient></defs><rect width=\"128\" height=\"128\" rx=\"28\" fill=\"#020418\" stroke=\"url(#veo-g)\" stroke-width=\"5\"/><path d=\"M42 42l36 22-36 22z\" fill=\"url(#veo-g)\"/><rect x=\"80\" y=\"44\" width=\"16\" height=\"40\" rx=\"4\" fill=\"#bff119\"/><circle cx=\"88\" cy=\"36\" r=\"4.5\" fill=\"#00f0ff\"/></svg>", "Higgsfield AI": "<svg viewBox=\"0 0 128 128\"><defs><linearGradient id=\"hg-g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#bff119\"/><stop offset=\"100%\" stop-color=\"#00f0ff\"/></linearGradient></defs><rect width=\"128\" height=\"128\" rx=\"28\" fill=\"#040828\" stroke=\"url(#hg-g)\" stroke-width=\"5\"/><circle cx=\"64\" cy=\"64\" r=\"28\" stroke=\"url(#hg-g)\" stroke-width=\"6\" fill=\"none\" stroke-dasharray=\"14 6\"/><circle cx=\"64\" cy=\"64\" r=\"12\" fill=\"#bff119\"/><path d=\"M64 16v18M64 94v18M16 64h18M94 64h18\" stroke=\"#00f0ff\" stroke-width=\"5\" stroke-linecap=\"round\"/></svg>", "Runway Gen-3 Alpha": "<svg viewBox=\"0 0 128 128\"><rect width=\"128\" height=\"128\" rx=\"28\" fill=\"#060918\" stroke=\"#00f0ff\" stroke-width=\"4\"/><path d=\"M30 38h68M30 64h50M30 90h68\" stroke=\"#bff119\" stroke-width=\"9\" stroke-linecap=\"round\"/><circle cx=\"94\" cy=\"64\" r=\"8\" fill=\"#00f0ff\"/></svg>", "Luma Dream Machine": "<svg viewBox=\"0 0 128 128\"><defs><linearGradient id=\"lu-g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#ffb703\"/><stop offset=\"50%\" stop-color=\"#fb8500\"/><stop offset=\"100%\" stop-color=\"#219ebc\"/></linearGradient></defs><rect width=\"128\" height=\"128\" rx=\"28\" fill=\"#04061a\" stroke=\"url(#lu-g)\" stroke-width=\"4\"/><circle cx=\"64\" cy=\"64\" r=\"26\" fill=\"url(#lu-g)\"/><ellipse cx=\"64\" cy=\"64\" rx=\"46\" ry=\"16\" fill=\"none\" stroke=\"#bff119\" stroke-width=\"4\" transform=\"rotate(-25 64 64)\"/></svg>", "Pika Labs": "<svg viewBox=\"0 0 128 128\"><rect width=\"128\" height=\"128\" rx=\"28\" fill=\"#120422\" stroke=\"#ff2a85\" stroke-width=\"4\"/><polygon points=\"46,32 94,64 46,96\" fill=\"#bff119\"/><circle cx=\"94\" cy=\"38\" r=\"8\" fill=\"#00e5ff\"/></svg>", "Kling AI": "<svg viewBox=\"0 0 128 128\"><rect width=\"128\" height=\"128\" rx=\"28\" fill=\"#03081e\" stroke=\"#1630d6\" stroke-width=\"4\"/><path d=\"M38 32v64M38 64l36-32M38 64l42 32\" stroke=\"#00f0ff\" stroke-width=\"10\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>", "OpenAI Sora": "<svg viewBox=\"0 0 128 128\"><defs><linearGradient id=\"so-g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#00f5d4\"/><stop offset=\"100%\" stop-color=\"#7b2cbf\"/></linearGradient></defs><rect width=\"128\" height=\"128\" rx=\"28\" fill=\"#050514\" stroke=\"url(#so-g)\" stroke-width=\"4\"/><circle cx=\"64\" cy=\"64\" r=\"32\" fill=\"none\" stroke=\"url(#so-g)\" stroke-width=\"8\"/><circle cx=\"64\" cy=\"64\" r=\"12\" fill=\"#bff119\"/></svg>", "Google Flow": "<svg viewBox=\"0 0 128 128\"><defs><linearGradient id=\"gf-g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#1630d6\"/><stop offset=\"50%\" stop-color=\"#00e5ff\"/><stop offset=\"100%\" stop-color=\"#bff119\"/></linearGradient></defs><rect width=\"128\" height=\"128\" rx=\"28\" fill=\"#030720\" stroke=\"url(#gf-g)\" stroke-width=\"4\"/><path d=\"M30 76c14-34 30-34 44 0s30 34 44 0\" stroke=\"url(#gf-g)\" stroke-width=\"9\" fill=\"none\" stroke-linecap=\"round\"/><circle cx=\"52\" cy=\"58\" r=\"8\" fill=\"#bff119\"/><circle cx=\"96\" cy=\"58\" r=\"8\" fill=\"#00e5ff\"/></svg>", "Midjourney v6": "<svg viewBox=\"0 0 128 128\"><rect width=\"128\" height=\"128\" rx=\"28\" fill=\"#02030f\" stroke=\"#ffffff\" stroke-width=\"3\"/><path fill=\"#ffffff\" d=\"M64 22c-6 20-20 34-40 40 20 6 34 20 40 40 6-20 20-34 40-40-20-6-34-20-40-40z\"/></svg>", "Flux.1 (Dev/Schnell)": "<svg viewBox=\"0 0 128 128\"><rect width=\"128\" height=\"128\" rx=\"28\" fill=\"#0d041e\" stroke=\"#ff2a85\" stroke-width=\"4\"/><polygon points=\"64,22 106,98 22,98\" fill=\"none\" stroke=\"#bff119\" stroke-width=\"7\"/><circle cx=\"64\" cy=\"74\" r=\"11\" fill=\"#00e5ff\"/></svg>", "Stable Diffusion XL": "<svg viewBox=\"0 0 128 128\"><defs><linearGradient id=\"sd-g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#7928ca\"/><stop offset=\"100%\" stop-color=\"#ff0080\"/></linearGradient></defs><rect width=\"128\" height=\"128\" rx=\"28\" fill=\"#050616\" stroke=\"url(#sd-g)\" stroke-width=\"4\"/><circle cx=\"48\" cy=\"48\" r=\"18\" fill=\"#00e5ff\"/><circle cx=\"80\" cy=\"52\" r=\"14\" fill=\"#bff119\"/><circle cx=\"64\" cy=\"82\" r=\"20\" fill=\"url(#sd-g)\"/></svg>", "DALL-E 3": "<svg viewBox=\"0 0 128 128\"><rect width=\"128\" height=\"128\" rx=\"28\" fill=\"#0a0a14\" stroke=\"#10a37f\" stroke-width=\"4\"/><rect x=\"36\" y=\"36\" width=\"56\" height=\"56\" rx=\"8\" fill=\"none\" stroke=\"#10a37f\" stroke-width=\"6\"/><circle cx=\"64\" cy=\"64\" r=\"14\" fill=\"#bff119\"/></svg>", "Magnific AI": "<svg viewBox=\"0 0 128 128\"><defs><linearGradient id=\"mg-g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#ff007a\"/><stop offset=\"100%\" stop-color=\"#7928ca\"/></linearGradient></defs><rect width=\"128\" height=\"128\" rx=\"28\" fill=\"#04061a\" stroke=\"url(#mg-g)\" stroke-width=\"4\"/><circle cx=\"56\" cy=\"56\" r=\"26\" fill=\"none\" stroke=\"#00e5ff\" stroke-width=\"8\"/><line x1=\"75\" y1=\"75\" x2=\"102\" y2=\"102\" stroke=\"#bff119\" stroke-width=\"9\" stroke-linecap=\"round\"/></svg>", "ComfyUI": "<svg viewBox=\"0 0 128 128\"><rect width=\"128\" height=\"128\" rx=\"28\" fill=\"#04081c\" stroke=\"#ff7b00\" stroke-width=\"4\"/><circle cx=\"38\" cy=\"48\" r=\"12\" fill=\"#00e5ff\"/><circle cx=\"90\" cy=\"48\" r=\"12\" fill=\"#bff119\"/><circle cx=\"64\" cy=\"90\" r=\"14\" fill=\"#ff7b00\"/><path d=\"M38 48L64 90L90 48\" stroke=\"#ffffff\" stroke-width=\"4\"/></svg>", "Google Gemini": "<svg viewBox=\"0 0 128 128\"><defs><linearGradient id=\"gm-g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#1ba0e2\"/><stop offset=\"50%\" stop-color=\"#9f75ff\"/><stop offset=\"100%\" stop-color=\"#f26a8d\"/></linearGradient></defs><path fill=\"url(#gm-g)\" d=\"M64 4c0 33.1 26.9 60 60 60-33.1 0-60 26.9-60 60 0-33.1-26.9-60-60-60 33.1 0 60-26.9 60-60z\"/></svg>", "Groq LPU": "<svg viewBox=\"0 0 128 128\"><rect width=\"128\" height=\"128\" rx=\"28\" fill=\"#f55036\"/><path fill=\"#ffffff\" d=\"M78 30L44 68h22l-16 30 38-42H64z\"/></svg>", "Cursor AI": "<svg viewBox=\"0 0 128 128\"><rect width=\"128\" height=\"128\" rx=\"28\" fill=\"#000000\" stroke=\"#bff119\" stroke-width=\"5\"/><path d=\"M38 32l52 32-28 6 16 26-10 6-16-26-14 16z\" fill=\"#bff119\"/></svg>", "GitHub Copilot": "<svg viewBox=\"0 0 128 128\"><rect width=\"128\" height=\"128\" rx=\"28\" fill=\"#181f38\" stroke=\"#6e40c9\" stroke-width=\"4\"/><path fill=\"#ffffff\" d=\"M40 50c0-12 11-22 24-22s24 10 24 22v14c0 10-8 18-18 18h-12c-10 0-18-8-18-18V50z\"/><circle cx=\"54\" cy=\"56\" r=\"6\" fill=\"#00e5ff\"/><circle cx=\"74\" cy=\"56\" r=\"6\" fill=\"#00e5ff\"/></svg>", "Claude": "<svg viewBox=\"0 0 128 128\"><rect width=\"128\" height=\"128\" rx=\"28\" fill=\"#d97706\"/><circle cx=\"64\" cy=\"64\" r=\"26\" fill=\"#ffffff\"/><path d=\"M64 24v80M24 64h80\" stroke=\"#d97706\" stroke-width=\"6\"/></svg>", "FAISS": "<svg viewBox=\"0 0 128 128\"><rect width=\"128\" height=\"128\" rx=\"28\" fill=\"#0866ff\"/><path fill=\"#ffffff\" d=\"M40 38h48v14H56v12h28v14H56v26H40z\"/></svg>", "ChromaDB": "<svg viewBox=\"0 0 128 128\"><rect width=\"128\" height=\"128\" rx=\"28\" fill=\"#090d24\" stroke=\"#ff0055\" stroke-width=\"4\"/><circle cx=\"64\" cy=\"64\" r=\"32\" fill=\"none\" stroke=\"#ff0055\" stroke-width=\"8\"/><circle cx=\"64\" cy=\"64\" r=\"16\" fill=\"#00e5ff\"/></svg>", "LangChain": "<svg viewBox=\"0 0 128 128\"><rect width=\"128\" height=\"128\" rx=\"28\" fill=\"#0f172a\" stroke=\"#10b981\" stroke-width=\"4\"/><circle cx=\"46\" cy=\"64\" r=\"16\" fill=\"none\" stroke=\"#10b981\" stroke-width=\"7\"/><circle cx=\"82\" cy=\"64\" r=\"16\" fill=\"none\" stroke=\"#bff119\" stroke-width=\"7\"/></svg>", "Sentence-Transformers": "<svg viewBox=\"0 0 128 128\"><rect width=\"128\" height=\"128\" rx=\"28\" fill=\"#1e1b4b\" stroke=\"#818cf8\" stroke-width=\"4\"/><path d=\"M30 64h68M64 30v68\" stroke=\"#00e5ff\" stroke-width=\"6\"/><circle cx=\"64\" cy=\"64\" r=\"14\" fill=\"#bff119\"/></svg>", "Streamlit": "<svg viewBox=\"0 0 128 128\"><rect width=\"128\" height=\"128\" rx=\"28\" fill=\"#ff4b4b\"/><polygon points=\"64,30 84,72 44,72\" fill=\"#ffffff\"/><polygon points=\"84,52 104,94 64,94\" fill=\"#ffe100\"/><polygon points=\"44,52 64,94 24,94\" fill=\"#ffffff\"/></svg>", "Python": "<svg viewBox=\"0 0 128 128\"><defs><linearGradient id=\"p-b\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#387eb8\"/><stop offset=\"100%\" stop-color=\"#366994\"/></linearGradient><linearGradient id=\"p-y\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#ffe873\"/><stop offset=\"100%\" stop-color=\"#ffd43b\"/></linearGradient></defs><path fill=\"url(#p-b)\" d=\"M63.6 5.8c-14.7 0-23.7 6.4-23.7 18.6v13.7h24.2v3.4H30.4C13.8 41.5 5 51.2 5 67.8c0 17 9.8 26.2 26 26.2h9.2v-12.7c0-14.5 12.3-27.2 26.8-27.2h23.7v-3.7c0-13.8-11.4-24.6-27.1-24.6zm-12.2 7.7a4.2 4.2 0 1 1 0 8.4 4.2 4.2 0 0 1 0-8.4z\"/><path fill=\"url(#p-y)\" d=\"M64.4 122.2c14.7 0 23.7-6.4 23.7-18.6V89.9H63.9v-3.4h33.7c16.6 0 25.4-9.7 25.4-26.3 0-17-9.8-26.2-26-26.2h-9.2v12.7c0 14.5-12.3 27.2-26.8 27.2H47.3v3.7c0 13.8 11.4 24.6 27.1 24.6zm12.2-7.7a4.2 4.2 0 1 1 0-8.4 4.2 4.2 0 0 1 0 8.4z\"/></svg>", "Java": "<svg viewBox=\"0 0 128 128\"><path d=\"M46 16c-7 11 11 15 4 27M66 10c-9 13 13 17 4 33\" stroke=\"#f89820\" stroke-width=\"7\" fill=\"none\" stroke-linecap=\"round\"/><path d=\"M24 60h66v20c0 19-13 31-33 31S24 99 24 80z\" fill=\"#5382a1\"/><path d=\"M90 68h8c13 0 13 24-4 24h-5\" stroke=\"#5382a1\" stroke-width=\"7\" fill=\"none\"/><rect x=\"20\" y=\"114\" width=\"78\" height=\"7\" rx=\"3.5\" fill=\"#f89820\"/></svg>", "C# (.NET)": "<svg viewBox=\"0 0 128 128\"><path fill=\"#9B4993\" d=\"M64 5l52 30v60l-52 30-52-30V35z\"/><path fill=\"#ffffff\" d=\"M60.6 85.3c-13.1 0-21.6-9.1-21.6-21.3s8.5-21.3 21.6-21.3c8.2 0 14.5 3.8 18.4 9.9l-8.5 5.5c-2.3-3.8-5.7-5.9-9.9-5.9-6.9 0-11.4 5.3-11.4 11.8s4.5 11.8 11.4 11.8c4.2 0 7.6-2.1 9.9-5.9l8.5 5.5c-3.9 6.1-10.2 9.9-18.4 9.9zm27-14.2h-3.4l.7-4.4h3.4l.9-5.7h4.8l-.9 5.7h4.3l.9-5.7h4.8l-.9 5.7h3.3l-.7 4.4h-3.4l-.8 5.2h3.4l-.7 4.4h-3.4l-.9 5.7h-4.8l.9-5.7h-4.3l-.9 5.7H86l.9-5.7h-3.4l.7-4.4h3.4l.8-5.2zm8.8 0h4.3l.8-5.2h-4.3l-.8 5.2z\"/></svg>", "TypeScript": "<svg viewBox=\"0 0 128 128\"><rect width=\"128\" height=\"128\" rx=\"20\" fill=\"#3178c6\"/><text x=\"116\" y=\"112\" text-anchor=\"end\" font-family=\"Arial,Helvetica,sans-serif\" font-weight=\"800\" font-size=\"60\" fill=\"#ffffff\">TS</text></svg>", "JavaScript": "<svg viewBox=\"0 0 128 128\"><rect width=\"128\" height=\"128\" rx=\"20\" fill=\"#f7df1e\"/><path fill=\"#000000\" d=\"M37.5 106c-8.5 0-14.8-4.2-18-11.2l12.4-7.4c2.1 4.2 4.8 6.5 8 6.5 4.5 0 7.3-2.6 7.3-8.8V44.2h15.2v40.8c0 13.8-7.9 21-24.9 21zm48.7 0c-15.3 0-25-8.8-25-22.3 0-14.7 10.6-20.7 20.9-23.7l3.8-1.1c5.2-1.5 8.2-3.1 8.2-6.5 0-3.6-2.9-5.8-7.3-5.8-4.8 0-8.2 2.4-10.6 6.8l-12.3-7.5c5.3-9.5 13.6-13.7 23.3-13.7 13.7 0 22.3 7.8 22.3 19.8 0 13-8.8 18.5-19.1 21.6l-3.8 1.1c-5.8 1.7-8.4 3.7-8.4 7.4 0 4.2 3.5 6.7 8.9 6.7 5.9 0 10.2-3.1 13-8.2l12.1 7.3c-5 9.4-14.1 15-24.9 15z\"/></svg>", "HTML5": "<svg viewBox=\"0 0 128 128\"><path fill=\"#e34f26\" d=\"M19 116.5L8.5 0h111l-10.5 116.5L64 128z\"/><path fill=\"#ef652a\" d=\"M64 118.5l37.8-10.5 8.9-97.9H64z\"/><path fill=\"#edebeb\" d=\"M64 54.4H45.8l-1.3-14.4H64V26.2H28.7l3.8 42H64zm0 37.8l-.2.1-16.7-4.5-1.1-12h-14l2.1 23.5 29.7 8.2.2-.1z\"/><path fill=\"#ffffff\" d=\"M64 54.4h18.2l-1.7 19.3L64 78.3v13.9l29.8-8.2.3-3.4 3.4-38.3.2-2.5H64zm0-28.2v13.8h34.8l1.3-13.8z\"/></svg>", "CSS3 / Sass": "<svg viewBox=\"0 0 128 128\"><path fill=\"#1572b6\" d=\"M19 116.5L8.5 0h111l-10.5 116.5L64 128z\"/><path fill=\"#33a9dc\" d=\"M64 118.5l37.8-10.5 8.9-97.9H64z\"/><path fill=\"#ffffff\" d=\"M64 26.2h35.3l-3.5 42H64v14l18.2-5 1.2-14.2h14.2l-2.2 25.4-31.4 8.7V26.2z\"/><path fill=\"#cf439c\" d=\"M64 72c-12 0-18-6-18-12s6-12 18-12v24z\"/></svg>", "SQL": "<svg viewBox=\"0 0 128 128\"><rect width=\"128\" height=\"128\" rx=\"28\" fill=\"#03254c\"/><ellipse cx=\"64\" cy=\"36\" rx=\"40\" ry=\"14\" fill=\"#00e5ff\"/><path d=\"M24 36v32c0 8 18 14 40 14s40-6 40-14V36\" fill=\"none\" stroke=\"#00e5ff\" stroke-width=\"6\"/><path d=\"M24 68v32c0 8 18 14 40 14s40-6 40-14V68\" fill=\"none\" stroke=\"#bff119\" stroke-width=\"6\"/></svg>", "PHP": "<svg viewBox=\"0 0 128 128\"><ellipse cx=\"64\" cy=\"64\" rx=\"58\" ry=\"36\" fill=\"#777bb4\"/><text x=\"64\" y=\"74\" font-size=\"34\" font-weight=\"900\" fill=\"#ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">PHP</text></svg>", "C / C++": "<svg viewBox=\"0 0 128 128\"><path fill=\"#00599c\" d=\"M64 6l50 29v58l-50 29-50-29V35z\"/><text x=\"64\" y=\"78\" font-size=\"38\" font-weight=\"900\" fill=\"#ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">C++</text></svg>", "React": "<svg viewBox=\"0 0 128 128\"><ellipse cx=\"64\" cy=\"64\" rx=\"14\" ry=\"48\" fill=\"none\" stroke=\"#61dafb\" stroke-width=\"5\" transform=\"rotate(30 64 64)\"/><ellipse cx=\"64\" cy=\"64\" rx=\"14\" ry=\"48\" fill=\"none\" stroke=\"#61dafb\" stroke-width=\"5\" transform=\"rotate(90 64 64)\"/><ellipse cx=\"64\" cy=\"64\" rx=\"14\" ry=\"48\" fill=\"none\" stroke=\"#61dafb\" stroke-width=\"5\" transform=\"rotate(150 64 64)\"/><circle cx=\"64\" cy=\"64\" r=\"9\" fill=\"#61dafb\"/></svg>", "Next.js": "<svg viewBox=\"0 0 128 128\"><circle cx=\"64\" cy=\"64\" r=\"58\" fill=\"#000000\" stroke=\"#ffffff\" stroke-width=\"4\"/><text x=\"64\" y=\"86\" text-anchor=\"middle\" font-family=\"Arial,Helvetica,sans-serif\" font-weight=\"800\" font-size=\"62\" fill=\"#ffffff\">N</text></svg>", "Node.js": "<svg viewBox=\"0 0 128 128\"><path fill=\"#5fa04e\" d=\"M64 8l50 28v58l-50 28-50-28V36z\"/><path fill=\"#ffffff\" d=\"M64 36l30 17v34l-30 17-30-17V53z\"/></svg>", "Express.js": "<svg viewBox=\"0 0 128 128\"><rect width=\"128\" height=\"128\" rx=\"28\" fill=\"#000000\" stroke=\"#ffffff\" stroke-width=\"3\"/><text x=\"64\" y=\"76\" font-size=\"28\" font-weight=\"900\" fill=\"#ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">EX</text></svg>", "Tailwind CSS": "<svg viewBox=\"0 0 128 128\"><path fill=\"#38bdf8\" d=\"M64 42c-12 0-19 6-21 18 5-6 10-9 16-7 4 1 6 4 9 7 5 5 10 10 22 10 12 0 19-6 21-18-5 6-10 9-16 7-4-1-6-4-9-7-5-5-10-10-22-10zM38 68c-12 0-19 6-21 18 5-6 10-9 16-7 4 1 6 4 9 7 5 5 10 10 22 10 12 0 19-6 21-18-5 6-10 9-16 7-4-1-6-4-9-7-5-5-10-10-22-10z\"/></svg>", "Bootstrap 5": "<svg viewBox=\"0 0 128 128\"><rect width=\"128\" height=\"128\" rx=\"28\" fill=\"#7952b3\"/><text x=\"64\" y=\"86\" font-size=\"64\" font-weight=\"900\" fill=\"#ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">B</text></svg>", "REST APIs": "<svg viewBox=\"0 0 128 128\"><rect width=\"128\" height=\"128\" rx=\"28\" fill=\"#031633\" stroke=\"#00e5ff\" stroke-width=\"4\"/><circle cx=\"36\" cy=\"64\" r=\"14\" fill=\"#00e5ff\"/><circle cx=\"92\" cy=\"64\" r=\"14\" fill=\"#bff119\"/><path d=\"M50 64h28\" stroke=\"#ffffff\" stroke-width=\"6\" stroke-dasharray=\"4 4\"/></svg>", "WebSockets": "<svg viewBox=\"0 0 128 128\"><rect width=\"128\" height=\"128\" rx=\"28\" fill=\"#08081a\" stroke=\"#bff119\" stroke-width=\"4\"/><path d=\"M40 76l24-24 14 14 26-26M38 52l26 26 14-14 26 26\" stroke=\"#bff119\" stroke-width=\"6\" stroke-linecap=\"round\"/></svg>", "Docker": "<svg viewBox=\"0 0 128 128\"><path fill=\"#2496ed\" d=\"M120.3 54c-1.5-.9-8.4-1.2-12.7 1.9-2.3 1.7-4.4 4.5-5.3 7.8-8.4.6-21.2 5.1-27.1 16.5-12.9-1.2-31.5 2.1-40.8 14.8-1.7-.8-3.6-1.3-5.7-1.3-7.7 0-14 6.3-14 14 0 2.2.5 4.3 1.4 6.1C8.2 114.7 12.8 116 18 116c31.1 0 54.3-11.8 67.5-27.8 14.2.8 28.5-7.7 33.3-19.1 5.3-2.3 8.3-7.5 7.4-13.1-.7-1.4-3.9-1.8-5.9-2zM48.8 38.6h12v12h-12zm-15.6 0h12v12h-12zm31.2 0h12v12h-12zm-15.6-15.6h12v12h-12zm15.6 0h12v12h-12zm-31.2 0h12v12h-12zm31.2 31.2h12v12h-12zm-15.6 0h12v12h-12zm-15.6 0h12v12h-12zm-15.6 0h12v12h-12z\"/></svg>", "Git & GitHub": "<svg viewBox=\"0 0 128 128\"><path fill=\"#f05032\" d=\"M124.7 56.4L71.6 3.3c-4.4-4.4-11.6-4.4-16 0L39.8 19.1l20.4 20.4c4.7-1.6 10.2-.5 13.9 3.2 3.7 3.7 4.8 9.2 3.2 13.9l19.6 19.6c4.7-1.6 10.2-.5 13.9 3.2 5.1 5.1 5.1 13.3 0 18.4s-13.3 5.1-18.4 0c-3.9-3.9-4.9-9.7-3-14.5L71.3 64.9v27.6c1.8 1.1 3.4 2.6 4.5 4.5 3.7 6.1 1.8 14.1-4.3 17.8-6.1 3.7-14.1 1.8-17.8-4.3-3.7-6.1-1.8-14.1 4.3-17.8 2.2-1.3 4.8-1.9 7.3-1.6V63.1c-2.5.3-5.1-.3-7.3-1.6l-19.3 19.3c-4.4 4.4-11.6 4.4-16 0L3.3 71.6c-4.4-4.4-4.4-11.6 0-16L19.1 39.8 3.3 24c-4.4-4.4-4.4-11.6 0-16s11.6-4.4 16 0l15.8 15.8 16-16c4.4-4.4 11.6-4.4 16 0l57.6 57.6c4.4 4.4 4.4 11.6 0 16-4.4 4.4-11.6 4.4-16 0z\"/></svg>", "GitHub Actions": "<svg viewBox=\"0 0 128 128\"><rect width=\"128\" height=\"128\" rx=\"28\" fill=\"#2088ff\"/><circle cx=\"64\" cy=\"64\" r=\"28\" fill=\"none\" stroke=\"#ffffff\" stroke-width=\"8\"/><polygon points=\"64,36 78,64 50,64\" fill=\"#bff119\"/></svg>", "Linux / Bash": "<svg viewBox=\"0 0 128 128\"><rect width=\"128\" height=\"128\" rx=\"28\" fill=\"#18181b\" stroke=\"#ffffff\" stroke-width=\"3\"/><text x=\"64\" y=\"78\" font-size=\"34\" font-weight=\"900\" fill=\"#bff119\" text-anchor=\"middle\" font-family=\"monospace\">&gt;_</text></svg>", "Postman": "<svg viewBox=\"0 0 128 128\"><circle cx=\"64\" cy=\"64\" r=\"58\" fill=\"#ff6c37\"/><path fill=\"#ffffff\" d=\"M64 36c12 0 20 8 20 20v8c0 10-8 18-18 18H52c-10 0-18-8-18-18V56c0-12 8-20 20-20z\"/></svg>", "Vercel": "<svg viewBox=\"0 0 128 128\"><rect width=\"128\" height=\"128\" rx=\"28\" fill=\"#000000\" stroke=\"#ffffff\" stroke-width=\"3\"/><polygon points=\"64,32 104,96 24,96\" fill=\"#ffffff\"/></svg>", "Nginx": "<svg viewBox=\"0 0 128 128\"><path fill=\"#009639\" d=\"M64 8l50 28v58l-50 28-50-28V36z\"/><path fill=\"#ffffff\" d=\"M46 44v40l36-40v40\"/></svg>", "Ethical Hacking": "<svg viewBox=\"0 0 128 128\"><rect width=\"128\" height=\"128\" rx=\"28\" fill=\"#020412\" stroke=\"#bff119\" stroke-width=\"4\"/><path fill=\"#bff119\" d=\"M64 22c-20 0-32 16-32 36 0 14 7 24 16 28v12h32V86c9-4 16-14 16-28 0-20-12-36-32-36zm-14 36a6 6 0 1 1 12 0 6 6 0 0 1-12 0zm28 0a6 6 0 1 1 12 0 6 6 0 0 1-12 0z\"/></svg>", "Capture The Flag (CTF)": "<svg viewBox=\"0 0 128 128\"><rect width=\"128\" height=\"128\" rx=\"28\" fill=\"#030822\" stroke=\"#00e5ff\" stroke-width=\"4\"/><polygon points=\"44,28 96,48 44,68\" fill=\"#bff119\"/><rect x=\"38\" y=\"24\" width=\"6\" height=\"80\" rx=\"3\" fill=\"#ffffff\"/></svg>", "Web Application Security": "<svg viewBox=\"0 0 128 128\"><path fill=\"#1630d6\" d=\"M64 8l44 18v34c0 30-18 54-44 62-26-8-44-32-44-62V26z\"/><path fill=\"#bff119\" d=\"M54 50h20v14h-20zm-6 14h32v22H48z\"/></svg>", "OWASP Top 10": "<svg viewBox=\"0 0 128 128\"><path fill=\"#02081c\" stroke=\"#00aaff\" stroke-width=\"4\" d=\"M64 12l42 18v34c0 28-18 50-42 58-24-8-42-30-42-58V30z\"/><text x=\"64\" y=\"74\" font-size=\"28\" font-weight=\"900\" fill=\"#00aaff\" text-anchor=\"middle\" font-family=\"sans-serif\">OW</text></svg>", "Burp Suite": "<svg viewBox=\"0 0 128 128\"><rect width=\"128\" height=\"128\" rx=\"28\" fill=\"#ff6633\"/><text x=\"64\" y=\"80\" font-size=\"44\" font-weight=\"900\" fill=\"#ffffff\" text-anchor=\"middle\" font-family=\"sans-serif\">B</text></svg>", "Wireshark": "<svg viewBox=\"0 0 128 128\"><rect width=\"128\" height=\"128\" rx=\"28\" fill=\"#0b55a0\"/><path fill=\"#ffffff\" d=\"M34 84c16-38 32-48 60-48-12 18-20 34-26 48z\"/></svg>", "VulnHat CTF": "<svg viewBox=\"0 0 128 128\"><rect width=\"128\" height=\"128\" rx=\"28\" fill=\"#050a18\" stroke=\"#bff119\" stroke-width=\"4\"/><path fill=\"#bff119\" d=\"M30 68h68l-8-24H38zm-16 8h100v8H14z\"/><rect x=\"42\" y=\"70\" width=\"16\" height=\"4\" fill=\"#000000\"/><rect x=\"70\" y=\"70\" width=\"16\" height=\"4\" fill=\"#000000\"/></svg>", "Figma": "<svg viewBox=\"0 0 128 128\"><path fill=\"#0acf83\" d=\"M42.7 128c11.8 0 21.3-9.5 21.3-21.3V85.3H42.7C30.9 85.3 21.3 94.9 21.3 106.7S30.9 128 42.7 128z\"/><path fill=\"#a259ff\" d=\"M21.3 64c0-11.8 9.5-21.3 21.3-21.3H64v42.7H42.7C30.9 85.3 21.3 75.8 21.3 64z\"/><path fill=\"#f24e1e\" d=\"M21.3 21.3C21.3 9.5 30.9 0 42.7 0H64v42.7H42.7C30.9 42.7 21.3 33.1 21.3 21.3z\"/><path fill=\"#ff7262\" d=\"M64 0h21.3c11.8 0 21.3 9.5 21.3 21.3S97.1 42.7 85.3 42.7H64V0z\"/><path fill=\"#1abcfe\" d=\"M106.7 64c0 11.8-9.5 21.3-21.3 21.3C73.6 85.3 64 75.8 64 64s9.5-21.3 21.3-21.3c11.8 0 21.4 9.5 21.4 21.3z\"/></svg>", "Design Systems": "<svg viewBox=\"0 0 128 128\"><rect width=\"128\" height=\"128\" rx=\"28\" fill=\"#1e1035\" stroke=\"#a855f7\" stroke-width=\"4\"/><rect x=\"30\" y=\"30\" width=\"30\" height=\"30\" rx=\"8\" fill=\"#a855f7\"/><rect x=\"68\" y=\"30\" width=\"30\" height=\"30\" rx=\"8\" fill=\"#00e5ff\"/><rect x=\"30\" y=\"68\" width=\"30\" height=\"30\" rx=\"8\" fill=\"#bff119\"/><rect x=\"68\" y=\"68\" width=\"30\" height=\"30\" rx=\"8\" fill=\"#ff007a\"/></svg>", "Interactive Prototyping": "<svg viewBox=\"0 0 128 128\"><rect width=\"128\" height=\"128\" rx=\"28\" fill=\"#030822\" stroke=\"#00e5ff\" stroke-width=\"4\"/><path d=\"M40 78l24-24 14 14 26-26\" stroke=\"#00e5ff\" stroke-width=\"7\" stroke-linecap=\"round\"/><circle cx=\"104\" cy=\"42\" r=\"10\" fill=\"#bff119\"/></svg>", "User Research": "<svg viewBox=\"0 0 128 128\"><rect width=\"128\" height=\"128\" rx=\"28\" fill=\"#0e0422\" stroke=\"#ec4899\" stroke-width=\"4\"/><circle cx=\"56\" cy=\"56\" r=\"22\" fill=\"none\" stroke=\"#ec4899\" stroke-width=\"6\"/><line x1=\"72\" y1=\"72\" x2=\"98\" y2=\"98\" stroke=\"#bff119\" stroke-width=\"8\" stroke-linecap=\"round\"/></svg>", "Adobe Illustrator": "<svg viewBox=\"0 0 128 128\"><rect width=\"128\" height=\"128\" rx=\"28\" fill=\"#330000\" stroke=\"#ff9a00\" stroke-width=\"4\"/><text x=\"64\" y=\"80\" font-size=\"52\" font-weight=\"900\" fill=\"#ff9a00\" text-anchor=\"middle\" font-family=\"sans-serif\">Ai</text></svg>", "Adobe Photoshop": "<svg viewBox=\"0 0 128 128\"><rect width=\"128\" height=\"128\" rx=\"28\" fill=\"#001e36\" stroke=\"#31a8ff\" stroke-width=\"4\"/><text x=\"64\" y=\"80\" font-size=\"52\" font-weight=\"900\" fill=\"#31a8ff\" text-anchor=\"middle\" font-family=\"sans-serif\">Ps</text></svg>", "Canva": "<svg viewBox=\"0 0 128 128\"><circle cx=\"64\" cy=\"64\" r=\"58\" fill=\"#00c4cc\"/><text x=\"64\" y=\"84\" font-size=\"64\" font-weight=\"900\" fill=\"#ffffff\" text-anchor=\"middle\" font-family=\"'Caveat', cursive, sans-serif\">C</text></svg>"};

// 1. Render the Image 3 TOOLS & SKILLS Ribbon
function renderToolsRibbon(cat = 'featured') {
  const track = $('#ts-track');
  if (!track) return;
  const items = cat === 'all' 
    ? SITE.toolsRibbon 
    : SITE.toolsRibbon.filter(t => t.cats.includes(cat));

  track.innerHTML = items.map(t => `
    <div class="ts-card" title="${esc(t.name)} · ${esc(t.sub)}">
      <div class="ts-icon">${t.svg}</div>
      <div class="ts-lbl">${esc(t.name)}</div>
      <div class="ts-sub">${esc(t.sub)}</div>
    </div>
  `).join('');
}
renderToolsRibbon('featured');

// Filter button clicks
const tsFilterBar = $('#ts-filter-bar');
if (tsFilterBar) {
  tsFilterBar.onclick = e => {
    const btn = e.target.closest('.ts-filter-btn');
    if (!btn) return;
    tsFilterBar.querySelectorAll('.ts-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderToolsRibbon(btn.dataset.cat);
  };
}

// 2. Render Comprehensive Skills Category Grid
const SK_ICONS = {"Google Gemini": {"p": "<path d=\"M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81\"/>", "c": "#8E75B2"}, "Claude": {"p": "<path d=\"m4.714 15.956 4.718-2.648.079-.23-.08-.128h-.23l-.79-.048-2.695-.073-2.337-.097-2.265-.122-.57-.121-.535-.704.055-.353.48-.321.685.06 1.518.104 2.277.157 1.651.098 2.447.255h.389l.054-.158-.133-.097-.103-.098-2.356-1.596-2.55-1.688-1.336-.972-.722-.491L2 6.223l-.158-1.008.656-.722.88.06.224.061.893.686 1.906 1.476 2.49 1.833.364.304.146-.104.018-.072-.164-.274-1.354-2.446-1.445-2.49-.644-1.032-.17-.619a3 3 0 0 1-.103-.729L6.287.133 6.7 0l.995.134.42.364.619 1.415L9.735 4.14l1.555 3.03.455.898.243.832.09.255h.159V9.01l.127-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.583.28.48.685-.067.444-.286 1.851-.558 2.903-.365 1.942h.213l.243-.242.983-1.306 1.652-2.064.728-.82.85-.904.547-.431h1.032l.759 1.129-.34 1.166-1.063 1.347-.88 1.142-1.263 1.7-.79 1.36.074.11.188-.02 2.853-.606 1.542-.28 1.84-.315.832.388.09.395-.327.807-1.967.486-2.307.462-3.436.813-.043.03.049.061 1.548.146.662.036h1.62l3.018.225.79.522.473.638-.08.485-1.213.62-1.64-.389-3.825-.91-1.31-.329h-.183v.11l1.093 1.068 2.003 1.81 2.508 2.33.127.578-.321.455-.34-.049-2.204-1.657-.85-.747-1.925-1.62h-.127v.17l.443.649 2.343 3.521.122 1.08-.17.353-.607.213-.668-.122-1.372-1.924-1.415-2.168-1.141-1.943-.14.08-.674 7.254-.316.37-.728.28-.607-.461-.322-.747.322-1.476.388-1.924.316-1.53.285-1.9.17-.632-.012-.042-.14.018-1.432 1.967-2.18 2.945-1.724 1.845-.413.164-.716-.37.066-.662.401-.589 2.386-3.036 1.439-1.882.929-1.086-.006-.158h-.055L4.138 18.56l-1.13.146-.485-.456.06-.746.231-.243 1.907-1.312Z\"/>", "c": "#D97757"}, "LangChain": {"p": "<path d=\"M6.099 5.918C2.736 5.918 0 8.646 0 12s2.736 6.083 6.099 6.083H17.9C21.264 18.083 24 15.353 24 12s-2.736-6.082-6.099-6.082ZM5.977 7.85c.493.012 1.02.25 1.273.623.368.459.478 1.067.895 1.493.56.612 1.199 1.15 1.716 1.802.49.595.839 1.294 1.144 1.998.124.233.125.52.31.72.09.12.534.448.438.564.055.12.47.286.326.402-.194.04-.413.048-.562-.107-.054.126-.182.06-.281.043l-.025.074c-.33.022-.576-.313-.732-.565-.311-.168-.665-.27-.982-.446-.019.29.045.648-.231.835-.014.557.843.066.922.48-.061.007-.129-.009-.178.038-.223.217-.48-.165-.738-.007-.346.174-.38.316-.81.352-.023-.036-.014-.06.006-.081.12-.14.13-.305.336-.365-.212-.033-.39.084-.569.176-.232.095-.23-.214-.588.017-.04-.033-.02-.062.002-.087.091-.11.21-.127.345-.12-.663-.37-.975.45-1.281.043-.092.024-.127.106-.185.165-.05-.055-.012-.121-.01-.186-.06-.028-.135-.041-.117-.137-.117-.04-.2.03-.286.096-.08-.061.053-.15.077-.213.07-.121.23-.025.311-.112.23-.131.552.08.816.045.203.026.454-.182.352-.39-.217-.277-.179-.639-.183-.97-.027-.192-.491-.438-.626-.646-.166-.187-.295-.404-.424-.618-.467-.9-.32-2.058-.908-2.895-.266.147-.612.078-.841-.119-.124.113-.13.26-.14.417-.296-.297-.259-.856-.021-1.186.096-.13.212-.237.342-.332.029-.02.039-.041.038-.074.117-.527.576-.74 1.07-.727m12.407.46c.557 0 1.08.216 1.473.608s.61.915.61 1.47a2.06 2.06 0 0 1-.61 1.47v.001l-.902.9a2.1 2.1 0 0 1-.86.516l-.016.005-.005.016a2.05 2.05 0 0 1-.474.731l-.902.9c-.394.392-.917.608-1.475.608s-1.08-.216-1.474-.608a2.077 2.077 0 0 1 0-2.94l.902-.9a2.06 2.06 0 0 1 .858-.514l.017-.006.006-.016a2.1 2.1 0 0 1 .475-.733l.902-.9a2.07 2.07 0 0 1 1.474-.608m0 .897a1.18 1.18 0 0 0-.84.346l-.901.9a1.18 1.18 0 0 0-.343.924l.005.058c.033.265.15.504.338.691.13.13.273.212.447.269a1 1 0 0 1 .014.158.88.88 0 0 1-.26.63l-.056.056a1.96 1.96 0 0 1-.78-.48 2.06 2.06 0 0 1-.576-1.096l-.01-.058-.046.037a1 1 0 0 0-.087.08l-.903.899a1.182 1.182 0 0 0 .84 2.019c.304 0 .607-.116.838-.346l.902-.9a1.18 1.18 0 0 0 0-1.673 1.2 1.2 0 0 0-.436-.275 1 1 0 0 1-.014-.16c0-.26.102-.506.29-.693a2.064 2.064 0 0 1 1.372 1.592l.01.058.046-.038a1 1 0 0 0 .088-.08l.902-.899a1.183 1.183 0 0 0 0-1.673 1.18 1.18 0 0 0-.84-.346ZM8.41 14.364c-.08.309-.105.833-.506.848-.033.177.123.244.265.187.141-.064.208.051.256.166.218.032.54-.073.552-.33-.325-.187-.426-.542-.567-.87\"/>", "c": "#3FD3A5"}, "FAISS": {"p": "<path d=\"M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a7 7 0 0 0 .265.86 5.3 5.3 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.7 3.7 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a45 45 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.26 2.26 0 0 1 1.088-.285\"/>", "c": "#0A84FF"}, "Python": {"p": "<path d=\"m14.25.18.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z\"/>", "c": "#4B8BBE"}, "Java": {"p": "<path d=\"M11.915 0 11.7.215C9.515 2.4 7.47 6.39 6.046 10.483c-1.064 1.024-3.633 2.81-3.711 3.551-.093.87 1.746 2.611 1.55 3.235-.198.625-1.304 1.408-1.014 1.939.1.188.823.011 1.277-.491a13.4 13.4 0 0 0-.017 2.14c.076.906.27 1.668.643 2.232.372.563.956.911 1.667.911.397 0 .727-.114 1.024-.264.298-.149.571-.33.91-.5.68-.34 1.634-.666 3.53-.604 1.903.062 2.872.39 3.559.704s1.15.664 1.925.664c.767 0 1.395-.336 1.807-.9.412-.563.631-1.33.72-2.24.06-.623.055-1.32 0-2.066.454.45 1.117.604 1.213.424.29-.53-.816-1.314-1.013-1.937-.198-.624 1.642-2.366 1.549-3.236-.08-.748-2.707-2.568-3.748-3.586C16.428 6.374 14.308 2.394 12.13.215zm.175 6.038a2.95 2.95 0 0 1 2.943 2.942 2.95 2.95 0 0 1-2.943 2.943A2.95 2.95 0 0 1 9.148 8.98a2.95 2.95 0 0 1 2.942-2.942M8.685 7.983a3.5 3.5 0 0 0-.145.997c0 1.951 1.6 3.55 3.55 3.55s3.55-1.598 3.55-3.55q-.002-.495-.132-.951.502.143.915.336a43 43 0 0 1 2.042 5.829c.678 2.545 1.01 4.92.846 6.607-.082.844-.29 1.51-.606 1.94-.315.431-.713.651-1.315.651-.593 0-.932-.27-1.673-.61-.741-.338-1.825-.694-3.792-.758-1.974-.064-3.073.293-3.821.669-.375.188-.659.373-.911.5s-.466.2-.752.2c-.53 0-.876-.209-1.16-.64-.285-.43-.474-1.101-.545-1.948-.141-1.693.176-4.069.823-6.614a43 43 0 0 1 1.934-5.783c.348-.167.749-.31 1.192-.425m-3.382 4.362a.2.2 0 0 1 .13.031c-.166.56-.323 1.116-.463 1.665a34 34 0 0 0-.547 2.555 4 4 0 0 0-.2-.39c-.58-1.012-.914-1.642-1.16-2.08.315-.24 1.679-1.755 2.24-1.781m13.394.01c.562.027 1.926 1.543 2.24 1.783-.246.438-.58 1.068-1.16 2.08a4 4 0 0 0-.163.309 32 32 0 0 0-.562-2.49 41 41 0 0 0-.482-1.652.2.2 0 0 1 .127-.03\"/>", "c": "#ED8B00"}, "TypeScript": {"p": "<path d=\"M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75q.918 0 1.627.111a6.4 6.4 0 0 1 1.306.34v2.458a4 4 0 0 0-.643-.361 5 5 0 0 0-.717-.26 5.5 5.5 0 0 0-1.426-.2q-.45 0-.819.086a2.1 2.1 0 0 0-.623.242q-.254.156-.393.374a.9.9 0 0 0-.14.49q0 .294.156.529.156.234.443.444c.287.21.423.276.696.41q.41.203.926.416.705.296 1.266.628.561.333.963.753.402.418.614.957.213.538.214 1.253 0 .986-.373 1.656a3.03 3.03 0 0 1-1.012 1.085 4.4 4.4 0 0 1-1.487.596q-.85.18-1.79.18a10 10 0 0 1-1.84-.164 5.5 5.5 0 0 1-1.512-.493v-2.63a5.03 5.03 0 0 0 3.237 1.2q.5 0 .872-.09.373-.09.623-.25.249-.162.373-.38a1.02 1.02 0 0 0-.074-1.089 2.1 2.1 0 0 0-.537-.5 5.6 5.6 0 0 0-.807-.444 28 28 0 0 0-1.007-.436q-1.377-.575-2.053-1.405t-.676-2.005q0-.92.369-1.582.368-.662 1.004-1.089a4.5 4.5 0 0 1 1.47-.629 7.5 7.5 0 0 1 1.77-.201m-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z\"/>", "c": "#3178C6"}, "SQL": {"p": "<path d=\"M12 3C7.58 3 4 4.79 4 7s3.58 4 8 4 8-1.79 8-4-3.58-4-8-4M4 9v3c0 2.21 3.58 4 8 4s8-1.79 8-4V9c0 2.21-3.58 4-8 4s-8-1.79-8-4m0 5v3c0 2.21 3.58 4 8 4s8-1.79 8-4v-3c0 2.21-3.58 4-8 4s-8-1.79-8-4\"/>", "c": "#29B6F6"}, "React": {"p": "<path d=\"M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236m2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38a2.17 2.17 0 0 0-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44a23.5 23.5 0 0 0-3.107-.534A24 24 0 0 0 12.769 4.7c1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442a23 23 0 0 0-3.113.538 15 15 0 0 1-.254-1.42c-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05q.684.704 1.36 1.564c-.44-.02-.89-.034-1.345-.034q-.691-.001-1.36.034c.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093q.61.874 1.183 1.86.557.961 1.018 1.946c-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87a25.6 25.6 0 0 1-4.412.005 27 27 0 0 1-1.183-1.86q-.557-.961-1.018-1.946a25 25 0 0 1 1.013-1.954c.38-.66.773-1.286 1.18-1.868A25 25 0 0 1 12 8.098zm-3.635.254c-.24.377-.48.763-.704 1.16q-.336.585-.635 1.174c-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0q1.044.153 2.006.387c-.18.632-.405 1.282-.66 1.933a25.952 25.952 0 0 0-1.345-2.32zm3.063.675q.727.226 1.375.498c1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493a24 24 0 0 0-1.1-2.98c.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98a23 23 0 0 0-1.086 2.964c-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474s1.12-1.742 2.852-2.476c.42-.18.88-.342 1.356-.494m11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39a26 26 0 0 0 1.341-2.338zm-9.945.02c.2.392.41.783.64 1.175q.345.586.705 1.143a22 22 0 0 1-2.006-.386c.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295a1.2 1.2 0 0 1-.553-.132c-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64q.661.032 1.345.034.691.001 1.36-.034c-.44.572-.895 1.095-1.345 1.565q-.684-.706-1.36-1.565\"/>", "c": "#61DAFB"}, "Next.js": {"p": "<path d=\"M18.665 21.978A11.94 11.94 0 0 1 12 24C5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251zm-3.332-8.533 1.6 2.061V7.2h-1.6z\"/>", "c": "#FFFFFF"}, "Node.js": {"p": "<path d=\"M11.998 24c-.321 0-.641-.084-.922-.247L8.14 22.016c-.438-.245-.224-.332-.08-.383.585-.203.703-.25 1.328-.604.065-.037.151-.023.218.017l2.256 1.339a.29.29 0 0 0 .272 0l8.795-5.076a.28.28 0 0 0 .134-.238V6.921a.28.28 0 0 0-.137-.242l-8.791-5.072a.28.28 0 0 0-.271 0L3.075 6.68a.28.28 0 0 0-.139.241v10.15a.27.27 0 0 0 .139.235l2.409 1.392c1.307.654 2.108-.116 2.108-.89V7.787c0-.142.114-.253.256-.253h1.115c.139 0 .255.112.255.253v10.021c0 1.745-.95 2.745-2.604 2.745-.508 0-.909 0-2.026-.551L2.28 18.675a1.86 1.86 0 0 1-.922-1.604V6.921c0-.659.353-1.275.922-1.603L11.075.236a1.93 1.93 0 0 1 1.848 0l8.794 5.082c.57.329.924.944.924 1.603v10.15a1.86 1.86 0 0 1-.924 1.604l-8.794 5.078c-.28.163-.599.247-.925.247m7.101-10.007c0-1.9-1.284-2.406-3.987-2.763-2.731-.361-3.009-.548-3.009-1.187 0-.528.235-1.233 2.258-1.233 1.807 0 2.473.389 2.747 1.607a.254.254 0 0 0 .247.199h1.141a.26.26 0 0 0 .186-.081.26.26 0 0 0 .067-.196c-.177-2.098-1.571-3.076-4.388-3.076-2.508 0-4.004 1.058-4.004 2.833 0 1.925 1.488 2.457 3.895 2.695 2.88.282 3.103.703 3.103 1.269 0 .983-.789 1.402-2.642 1.402-2.327 0-2.839-.584-3.011-1.742a.255.255 0 0 0-.253-.215h-1.137a.25.25 0 0 0-.254.253c0 1.482.806 3.248 4.655 3.248 2.788.001 4.386-1.096 4.386-3.013\"/>", "c": "#5FA04E"}, "Tailwind CSS": {"p": "<path d=\"M12.001 4.8q-4.8 0-6 4.8 1.8-2.4 4.2-1.8c.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12q4.8 0 6-4.8-1.8 2.4-4.2 1.8c-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8m-6 7.2q-4.8 0-6 4.8 1.8-2.4 4.2-1.8c.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576q4.8 0 6-4.8-1.8 2.4-4.2 1.8c-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12\"/>", "c": "#06B6D4"}, "Docker": {"p": "<path d=\"M13.983 11.078h2.119a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.119a.185.185 0 0 0-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 0 0 .186-.186V3.574a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 0 0 .186-.186V6.29a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 0 0 .184-.186V6.29a.185.185 0 0 0-.185-.185H8.1a.185.185 0 0 0-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 0 0 .185-.186V6.29a.185.185 0 0 0-.185-.185H5.136a.186.186 0 0 0-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.185.185 0 0 0-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 0 0 .185-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.186.186 0 0 0-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.185.185 0 0 0-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51q-.508.001-1.01.087c-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.75.75 0 0 0-.75.748 11.4 11.4 0 0 0 .692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137a15.7 15.7 0 0 0 2.93-.266 12.3 12.3 0 0 0 3.823-1.389 10.5 10.5 0 0 0 2.61-2.136c1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288Z\"/>", "c": "#2496ED"}, "Git & GitHub": {"p": "<path d=\"M23.546 10.93 13.067.452a1.55 1.55 0 0 0-2.188 0L8.708 2.627l2.76 2.76a1.838 1.838 0 0 1 2.327 2.341l2.658 2.66a1.838 1.838 0 0 1 1.9 3.039 1.837 1.837 0 0 1-2.6 0 1.85 1.85 0 0 1-.404-1.996L12.86 8.955v6.525c.176.086.342.203.488.348a1.85 1.85 0 0 1 0 2.6 1.844 1.844 0 0 1-2.609 0 1.834 1.834 0 0 1 0-2.598c.182-.18.387-.316.605-.406V8.835a1.834 1.834 0 0 1-.996-2.41L7.636 3.7.45 10.881c-.6.605-.6 1.584 0 2.189l10.48 10.477a1.545 1.545 0 0 0 2.186 0l10.43-10.43a1.544 1.544 0 0 0 0-2.187\"/>", "c": "#F05032"}, "GitHub Actions": {"p": "<path d=\"M10.984 13.836a.5.5 0 0 1-.353-.146l-.745-.743a.5.5 0 1 1 .706-.708l.392.391 1.181-1.18a.5.5 0 0 1 .708.707l-1.535 1.533a.5.5 0 0 1-.354.146m9.353-.147 1.534-1.532a.5.5 0 0 0-.707-.707l-1.181 1.18-.392-.391a.5.5 0 1 0-.706.708l.746.743a.497.497 0 0 0 .706-.001M4.527 7.452l2.557-1.585A1 1 0 0 0 7.09 4.17L4.533 2.56A1 1 0 0 0 3 3.406v3.196a1.001 1.001 0 0 0 1.527.85m2.03-2.436L4 6.602V3.406zM24 12.5c0 1.93-1.57 3.5-3.5 3.5a3.5 3.5 0 0 1-3.46-3h-2.08a3.5 3.5 0 0 1-3.46 3 3.5 3.5 0 0 1-3.46-3h-.558c-.972 0-1.85-.399-2.482-1.042V17c0 1.654 1.346 3 3 3h.04c.244-1.693 1.7-3 3.46-3 1.93 0 3.5 1.57 3.5 3.5S13.43 24 11.5 24a3.5 3.5 0 0 1-3.46-3H8c-2.206 0-4-1.794-4-4V9.899A5.01 5.01 0 0 1 0 5c0-2.757 2.243-5 5-5s5 2.243 5 5a5.005 5.005 0 0 1-4.952 4.998A2.48 2.48 0 0 0 7.482 12h.558c.244-1.693 1.7-3 3.46-3a3.5 3.5 0 0 1 3.46 3h2.08a3.5 3.5 0 0 1 3.46-3c1.93 0 3.5 1.57 3.5 3.5m-15 8c0 1.378 1.122 2.5 2.5 2.5s2.5-1.122 2.5-2.5-1.122-2.5-2.5-2.5S9 19.122 9 20.5M5 9c2.206 0 4-1.794 4-4S7.206 1 5 1 1 2.794 1 5s1.794 4 4 4m9 3.5c0-1.378-1.122-2.5-2.5-2.5S9 11.122 9 12.5s1.122 2.5 2.5 2.5 2.5-1.122 2.5-2.5m9 0c0-1.378-1.122-2.5-2.5-2.5S18 11.122 18 12.5s1.122 2.5 2.5 2.5 2.5-1.122 2.5-2.5m-13 8a.5.5 0 1 0 1 0 .5.5 0 0 0-1 0m2 0a.5.5 0 1 0 1 0 .5.5 0 0 0-1 0m12 0c0 1.93-1.57 3.5-3.5 3.5a3.5 3.5 0 0 1-3.46-3.002q-.01.003-.021.005l-.506.017h-.017a.5.5 0 0 1-.016-.999l.506-.017c.018-.002.035.006.052.007A3.5 3.5 0 0 1 20.5 17c1.93 0 3.5 1.57 3.5 3.5m-1 0c0-1.378-1.122-2.5-2.5-2.5S18 19.122 18 20.5s1.122 2.5 2.5 2.5 2.5-1.122 2.5-2.5\"/>", "c": "#2088FF"}, "Linux / Bash": {"p": "<path d=\"M12.504 0q-.232 0-.48.021c-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.4.4 0 0 0-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.132 1.884 1.071s1.592-.536 2.257-1.306c.631-.765 1.683-1.084 2.378-1.503.348-.199.629-.469.649-.853.023-.4-.2-.811-.714-1.376v-.097l-.003-.003c-.17-.2-.25-.535-.338-.926-.085-.401-.182-.786-.492-1.046h-.003c-.059-.054-.123-.067-.188-.135a.36.36 0 0 0-.19-.064c.431-1.278.264-2.55-.173-3.694-.533-1.41-1.465-2.638-2.175-3.483-.796-1.005-1.576-1.957-1.56-3.368.026-2.152.236-6.133-3.544-6.139m.529 3.405h.013c.213 0 .396.062.584.198.19.135.33.332.438.533.105.259.158.459.166.724 0-.02.006-.04.006-.06v.105l-.004-.021-.004-.024a1.8 1.8 0 0 1-.15.706.95.95 0 0 1-.213.335 1 1 0 0 0-.088-.042c-.104-.045-.198-.064-.284-.133a1.3 1.3 0 0 0-.22-.066c.05-.06.146-.133.183-.198q.08-.193.088-.402v-.02a1.2 1.2 0 0 0-.061-.4c-.045-.134-.101-.2-.183-.333-.084-.066-.167-.132-.267-.132h-.016c-.093 0-.176.03-.262.132a.8.8 0 0 0-.205.334 1.2 1.2 0 0 0-.09.4v.019q.002.134.02.267c-.193-.067-.438-.135-.607-.202a2 2 0 0 1-.018-.2v-.02a1.8 1.8 0 0 1 .15-.768 1.08 1.08 0 0 1 .43-.533 1 1 0 0 1 .594-.2zm-2.962.059h.036c.142 0 .27.048.399.135.146.129.264.288.344.465.09.199.14.4.153.667v.004c.007.134.006.2-.002.266v.08c-.03.007-.056.018-.083.024-.152.055-.274.135-.393.2q.018-.136.003-.267v-.015c-.012-.133-.04-.2-.082-.333a.6.6 0 0 0-.166-.267.25.25 0 0 0-.183-.064h-.021c-.071.006-.13.04-.186.132a.55.55 0 0 0-.12.27 1 1 0 0 0-.023.33v.015c.012.135.037.2.08.334.046.134.098.2.166.268q.014.014.034.024c-.07.057-.117.07-.176.136a.3.3 0 0 1-.131.068 2.6 2.6 0 0 1-.275-.402 1.8 1.8 0 0 1-.155-.667 1.8 1.8 0 0 1 .08-.668 1.4 1.4 0 0 1 .283-.535c.128-.133.26-.2.418-.2m1.37 1.706c.332 0 .733.065 1.216.399.293.2.523.269 1.052.468h.003c.255.136.405.266.478.399v-.131a.57.57 0 0 1 .016.47c-.123.31-.516.643-1.063.842v.002c-.268.135-.501.333-.775.465-.276.135-.588.292-1.012.267a1.1 1.1 0 0 1-.448-.067 4 4 0 0 1-.322-.198c-.195-.135-.363-.332-.612-.465v-.005h-.005c-.4-.246-.616-.512-.686-.71q-.104-.403.193-.6c.224-.135.38-.271.483-.336.104-.074.143-.102.176-.131h.002v-.003c.169-.202.436-.47.839-.601.139-.036.294-.065.466-.065zm2.8 2.142c.358 1.417 1.196 3.475 1.735 4.473.286.534.855 1.659 1.102 3.024.156-.005.33.018.513.064.646-1.671-.546-3.467-1.089-3.966-.22-.2-.232-.335-.123-.335.59.534 1.365 1.572 1.646 2.757.13.535.16 1.104.021 1.67.067.028.135.06.205.067 1.032.534 1.413.938 1.23 1.537v-.043c-.06-.003-.12 0-.18 0h-.016c.151-.467-.182-.825-1.065-1.224-.915-.4-1.646-.336-1.77.465-.008.043-.013.066-.018.135-.068.023-.139.053-.209.064-.43.268-.662.669-.793 1.187-.13.533-.17 1.156-.205 1.869v.003c-.02.334-.17.838-.319 1.35-1.5 1.072-3.58 1.538-5.348.334a2.7 2.7 0 0 0-.402-.533 1.5 1.5 0 0 0-.275-.333c.182 0 .338-.03.465-.067a.62.62 0 0 0 .314-.334c.108-.267 0-.697-.345-1.163s-.931-.995-1.788-1.521c-.63-.4-.986-.87-1.15-1.396-.165-.534-.143-1.085-.015-1.645.245-1.07.873-2.11 1.274-2.763.107-.065.037.135-.408.974-.396.751-1.14 2.497-.122 3.854a8.1 8.1 0 0 1 .647-2.876c.564-1.278 1.743-3.504 1.836-5.268.048.036.217.135.289.202.218.133.38.333.59.465.21.201.477.335.876.335q.058.005.11.006c.412 0 .73-.134.997-.268.29-.134.52-.334.74-.4h.005c.467-.135.835-.402 1.044-.7zm2.185 8.958c.037.6.343 1.245.882 1.377.588.134 1.434-.333 1.791-.765l.211-.01c.315-.007.577.01.847.268l.003.003c.208.199.305.53.391.876.085.4.154.78.409 1.066.486.527.645.906.636 1.14l.003-.007v.018l-.003-.012c-.015.262-.185.396-.498.595-.63.401-1.746.712-2.457 1.57-.618.737-1.37 1.14-2.036 1.191-.664.053-1.237-.2-1.574-.898l-.005-.003c-.21-.4-.12-1.025.056-1.69.176-.668.428-1.344.463-1.897.037-.714.076-1.335.195-1.814.12-.465.308-.797.641-.984l.045-.022zm-10.814.049h.01q.08 0 .157.014c.376.055.706.333 1.023.752l.91 1.664.003.003c.243.533.754 1.064 1.189 1.637.434.598.77 1.131.729 1.57v.006c-.057.744-.48 1.148-1.125 1.294-.645.135-1.52.002-2.395-.464-.968-.536-2.118-.469-2.857-.602q-.553-.1-.723-.4c-.11-.2-.113-.602.123-1.23v-.004l.002-.003c.117-.334.03-.752-.027-1.118-.055-.401-.083-.71.043-.94.16-.334.396-.4.69-.533.294-.135.64-.202.915-.47h.002v-.002c.256-.268.445-.601.668-.838.19-.201.38-.336.663-.336m7.159-9.074c-.435.201-.945.535-1.488.535-.542 0-.97-.267-1.28-.466-.154-.134-.28-.268-.373-.335-.164-.134-.144-.333-.074-.333.109.016.129.134.199.2.096.066.215.2.36.333.292.2.68.467 1.167.467.485 0 1.053-.267 1.398-.466.195-.135.445-.334.648-.467.156-.136.149-.267.279-.267.128.016.034.134-.147.332a8 8 0 0 1-.69.468zm-1.082-1.583V5.64c-.006-.02.013-.042.029-.05.074-.043.18-.027.26.004.063 0 .16.067.15.135-.006.049-.085.066-.135.066-.055 0-.092-.043-.141-.068-.052-.018-.146-.008-.163-.065m-.551 0c-.02.058-.113.049-.166.066-.047.025-.086.068-.14.068-.05 0-.13-.02-.136-.068-.01-.066.088-.133.15-.133.08-.031.184-.047.259-.005.019.009.036.03.03.05v.02h.003z\"/>", "c": "#FCC624"}, "Figma": {"p": "<path d=\"M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491M12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539m-.024-7.51a3.023 3.023 0 0 0-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97zm7.704 0h-.098c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h.098c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49m-.097-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h.098c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019z\"/>", "c": "#F24E1E"}, "Design Systems": {"p": "<path d=\"m2.53 19.65 1.34.56v-9.03l-2.43 5.86c-.41 1.02.06 2.19 1.09 2.61m19.5-3.7L17.07 4a2 2 0 0 0-1.81-1.25c-.26 0-.53.04-.79.15L7.1 5.95a2.02 2.02 0 0 0-1.23 1.8c-.01.25.04.54.13.8l5 11.95c.29.78 1.03 1.24 1.81 1.25.26 0 .52-.05.77-.15l7.36-3.05a1.994 1.994 0 0 0 1.09-2.6M7.88 8.75a1 1 0 0 1-1-1 1 1 0 0 1 1-1c.55 0 1 .45 1 1s-.45 1-1 1m-2 11a2 2 0 0 0 2 2h1.45l-3.45-8.34z\"/>", "c": "#B388FF"}};
const SK_CATS = {"AI Video & Image": "<path d=\"m19.65 6.5-2.74-3.54 3.93-.78.78 3.92zm-2.94.57-2.74-3.53-1.97.39 2.75 3.53zM19 13c1.1 0 2.12.3 3 .81V10H2v10a2 2 0 0 0 2 2h9.81c-.51-.88-.81-1.9-.81-3 0-3.31 2.69-6 6-6M4.16 5.5l-.98.19a2.01 2.01 0 0 0-1.57 2.35L2 10l4.9-.97zm7.65 2.55L9.07 4.5l-1.97.41 2.75 3.53zM23 17.89l-2.89-.25L19 15l-1.13 2.64-2.87.25 2.18 1.88-.68 2.81 2.5-1.49 2.45 1.49-.65-2.81z\"/>", "LLMs, RAG & AI Dev": "<path d=\"M21.33 12.91c.09 1.55-.62 3.04-1.89 3.95l.77 1.49c.23.45.26.98.06 1.45-.19.47-.58.84-1.06 1l-.79.25a1.687 1.687 0 0 1-1.86-.55L14.44 18c-.89-.15-1.73-.53-2.44-1.1-.5.15-1 .23-1.5.23-.88 0-1.76-.27-2.5-.79-.53.16-1.07.23-1.62.22-.79.01-1.57-.15-2.3-.45a4.1 4.1 0 0 1-2.43-3.61c-.08-.72.04-1.45.35-2.11-.29-.75-.32-1.57-.07-2.33C2.3 7.11 3 6.32 3.87 5.82c.58-1.69 2.21-2.82 4-2.7 1.6-1.5 4.05-1.66 5.83-.37.42-.11.86-.17 1.3-.17 1.36-.03 2.65.57 3.5 1.64 2.04.53 3.5 2.35 3.58 4.47.05 1.11-.25 2.2-.86 3.13.07.36.11.72.11 1.09m-5-1.41c.57.07 1.02.5 1.02 1.07a1 1 0 0 1-1 1h-.63c-.32.9-.88 1.69-1.62 2.29.25.09.51.14.77.21 5.13-.07 4.53-3.2 4.53-3.25a2.59 2.59 0 0 0-2.69-2.49 1 1 0 0 1-1-1 1 1 0 0 1 1-1c1.23.03 2.41.49 3.33 1.3.05-.29.08-.59.08-.89-.06-1.24-.62-2.32-2.87-2.53-1.25-2.96-4.4-1.32-4.4-.4-.03.23.21.72.25.75a1 1 0 0 1 1 1c0 .55-.45 1-1 1-.53-.02-1.03-.22-1.43-.56-.48.31-1.03.5-1.6.56-.57.05-1.04-.35-1.07-.9a.97.97 0 0 1 .88-1.1c.16-.02.94-.14.94-.77 0-.66.25-1.29.68-1.79-.92-.25-1.91.08-2.91 1.29C6.75 5 6 5.25 5.45 7.2 4.5 7.67 4 8 3.78 9c1.08-.22 2.19-.13 3.22.25.5.19.78.75.59 1.29-.19.52-.77.78-1.29.59-.73-.32-1.55-.34-2.3-.06-.32.27-.32.83-.32 1.27 0 .74.37 1.43 1 1.83.53.27 1.12.41 1.71.4q-.225-.39-.39-.81a1.038 1.038 0 0 1 1.96-.68c.4 1.14 1.42 1.92 2.62 2.05 1.37-.07 2.59-.88 3.19-2.13.23-1.38 1.34-1.5 2.56-1.5m2 7.47-.62-1.3-.71.16 1 1.25zm-4.65-8.61a1 1 0 0 0-.91-1.03c-.71-.04-1.4.2-1.93.67-.57.58-.87 1.38-.84 2.19a1 1 0 0 0 1 1c.57 0 1-.45 1-1 0-.27.07-.54.23-.76.12-.1.27-.15.43-.15.55.03 1.02-.38 1.02-.92\"/>", "Languages": "<path d=\"M8 3a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2H3v2h1a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h2v-2H8v-5a2 2 0 0 0-2-2 2 2 0 0 0 2-2V5h2V3m6 0a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h1v2h-1a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-2v-2h2v-5a2 2 0 0 1 2-2 2 2 0 0 1-2-2V5h-2V3z\"/>", "Web Engineering": "<path d=\"M16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2m-5.15 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56M14.34 14H9.66c-.1-.66-.16-1.32-.16-2s.06-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2M12 19.96c-.83-1.2-1.5-2.53-1.91-3.96h3.82c-.41 1.43-1.08 2.76-1.91 3.96M8 8H5.08A7.92 7.92 0 0 1 9.4 4.44C8.8 5.55 8.35 6.75 8 8m-2.92 8H8c.35 1.25.8 2.45 1.4 3.56A8 8 0 0 1 5.08 16m-.82-2C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2M12 4.03c.83 1.2 1.5 2.54 1.91 3.97h-3.82c.41-1.43 1.08-2.77 1.91-3.97M18.92 8h-2.95a15.7 15.7 0 0 0-1.38-3.56c1.84.63 3.37 1.9 4.33 3.56M12 2C6.47 2 2 6.5 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2\"/>", "DevOps & Tools": "<path d=\"M13 19h1a1 1 0 0 1 1 1h7v2h-7a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1H2v-2h7a1 1 0 0 1 1-1h1v-2H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-7zM4 3h16a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1m5 4h1V5H9zm0 8h1v-2H9zM5 5v2h2V5zm0 8v2h2v-2z\"/>", "UI/UX & Design": "<path d=\"M17.5 12a1.5 1.5 0 0 1-1.5-1.5A1.5 1.5 0 0 1 17.5 9a1.5 1.5 0 0 1 1.5 1.5 1.5 1.5 0 0 1-1.5 1.5m-3-4A1.5 1.5 0 0 1 13 6.5 1.5 1.5 0 0 1 14.5 5 1.5 1.5 0 0 1 16 6.5 1.5 1.5 0 0 1 14.5 8m-5 0A1.5 1.5 0 0 1 8 6.5 1.5 1.5 0 0 1 9.5 5 1.5 1.5 0 0 1 11 6.5 1.5 1.5 0 0 1 9.5 8m-3 4A1.5 1.5 0 0 1 5 10.5 1.5 1.5 0 0 1 6.5 9 1.5 1.5 0 0 1 8 10.5 1.5 1.5 0 0 1 6.5 12M12 3a9 9 0 0 0-9 9 9 9 0 0 0 9 9 1.5 1.5 0 0 0 1.5-1.5c0-.39-.15-.74-.39-1-.23-.27-.38-.62-.38-1a1.5 1.5 0 0 1 1.5-1.5H16a5 5 0 0 0 5-5c0-4.42-4.03-8-9-8\"/>"};
const SK_FULL_COLOR = {"Google Veo 3":"#4285F4","Higgsfield AI":"#18E0D1","Midjourney v6":"#FFFFFF","ComfyUI":"#F5A623","Adobe Photoshop":"#31A8FF","Canva":"#00C4CC"};
if ($('#skills')) $('#skills').innerHTML = Object.entries(SITE.skills).map(([k, v]) => `
  <div class="sk-panel">
  <h3><span class="sk-hico"><svg viewBox="0 0 24 24" aria-hidden="true">${SK_CATS[k] || ''}</svg></span><span>${esc(k)}</span><span class="sk-idx"></span></h3>
  <div class="sk-grid">
    ${v.map(name => {
      const ic = SK_ICONS[name];
      const bc = ic ? ic.c : (SK_FULL_COLOR[name] || '#bff119');
      const icon = ic
        ? `<span class="sk-ico"><svg viewBox="0 0 24 24" aria-hidden="true">${ic.p}</svg></span>`
        : `<span class="sk-ico full">${TOOL_SVGS[name] || ''}</span>`;
      return `<div class="sk-item" style="--bc:${bc}" title="${esc(name)}">${icon}<span class="sk-name">${esc(name)}</span></div>`;
    }).join('')}
  </div>
  </div>
`).join('');


/* About: left-column content (stats, focus areas, education, CTAs) */
const AB_ICONS = {"code-tags": "<path d=\"m14.6 16.6 4.6-4.6-4.6-4.6L16 6l6 6-6 6zm-5.2 0L4.8 12l4.6-4.6L8 6l-6 6 6 6z\"/>", "brain": "<path d=\"M21.33 12.91c.09 1.55-.62 3.04-1.89 3.95l.77 1.49c.23.45.26.98.06 1.45-.19.47-.58.84-1.06 1l-.79.25a1.687 1.687 0 0 1-1.86-.55L14.44 18c-.89-.15-1.73-.53-2.44-1.1-.5.15-1 .23-1.5.23-.88 0-1.76-.27-2.5-.79-.53.16-1.07.23-1.62.22-.79.01-1.57-.15-2.3-.45a4.1 4.1 0 0 1-2.43-3.61c-.08-.72.04-1.45.35-2.11-.29-.75-.32-1.57-.07-2.33C2.3 7.11 3 6.32 3.87 5.82c.58-1.69 2.21-2.82 4-2.7 1.6-1.5 4.05-1.66 5.83-.37.42-.11.86-.17 1.3-.17 1.36-.03 2.65.57 3.5 1.64 2.04.53 3.5 2.35 3.58 4.47.05 1.11-.25 2.2-.86 3.13.07.36.11.72.11 1.09m-5-1.41c.57.07 1.02.5 1.02 1.07a1 1 0 0 1-1 1h-.63c-.32.9-.88 1.69-1.62 2.29.25.09.51.14.77.21 5.13-.07 4.53-3.2 4.53-3.25a2.59 2.59 0 0 0-2.69-2.49 1 1 0 0 1-1-1 1 1 0 0 1 1-1c1.23.03 2.41.49 3.33 1.3.05-.29.08-.59.08-.89-.06-1.24-.62-2.32-2.87-2.53-1.25-2.96-4.4-1.32-4.4-.4-.03.23.21.72.25.75a1 1 0 0 1 1 1c0 .55-.45 1-1 1-.53-.02-1.03-.22-1.43-.56-.48.31-1.03.5-1.6.56-.57.05-1.04-.35-1.07-.9a.97.97 0 0 1 .88-1.1c.16-.02.94-.14.94-.77 0-.66.25-1.29.68-1.79-.92-.25-1.91.08-2.91 1.29C6.75 5 6 5.25 5.45 7.2 4.5 7.67 4 8 3.78 9c1.08-.22 2.19-.13 3.22.25.5.19.78.75.59 1.29-.19.52-.77.78-1.29.59-.73-.32-1.55-.34-2.3-.06-.32.27-.32.83-.32 1.27 0 .74.37 1.43 1 1.83.53.27 1.12.41 1.71.4q-.225-.39-.39-.81a1.038 1.038 0 0 1 1.96-.68c.4 1.14 1.42 1.92 2.62 2.05 1.37-.07 2.59-.88 3.19-2.13.23-1.38 1.34-1.5 2.56-1.5m2 7.47-.62-1.3-.71.16 1 1.25zm-4.65-8.61a1 1 0 0 0-.91-1.03c-.71-.04-1.4.2-1.93.67-.57.58-.87 1.38-.84 2.19a1 1 0 0 0 1 1c.57 0 1-.45 1-1 0-.27.07-.54.23-.76.12-.1.27-.15.43-.15.55.03 1.02-.38 1.02-.92\"/>", "shield-lock": "<path d=\"M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5zm0 6c1.4 0 2.8 1.1 2.8 2.5V11c.6 0 1.2.6 1.2 1.3v3.5c0 .6-.6 1.2-1.3 1.2H9.2c-.6 0-1.2-.6-1.2-1.3v-3.5c0-.6.6-1.2 1.2-1.2V9.5C9.2 8.1 10.6 7 12 7m0 1.2c-.8 0-1.5.5-1.5 1.3V11h3V9.5c0-.8-.7-1.3-1.5-1.3\"/>", "palette": "<path d=\"M17.5 12a1.5 1.5 0 0 1-1.5-1.5A1.5 1.5 0 0 1 17.5 9a1.5 1.5 0 0 1 1.5 1.5 1.5 1.5 0 0 1-1.5 1.5m-3-4A1.5 1.5 0 0 1 13 6.5 1.5 1.5 0 0 1 14.5 5 1.5 1.5 0 0 1 16 6.5 1.5 1.5 0 0 1 14.5 8m-5 0A1.5 1.5 0 0 1 8 6.5 1.5 1.5 0 0 1 9.5 5 1.5 1.5 0 0 1 11 6.5 1.5 1.5 0 0 1 9.5 8m-3 4A1.5 1.5 0 0 1 5 10.5 1.5 1.5 0 0 1 6.5 9 1.5 1.5 0 0 1 8 10.5 1.5 1.5 0 0 1 6.5 12M12 3a9 9 0 0 0-9 9 9 9 0 0 0 9 9 1.5 1.5 0 0 0 1.5-1.5c0-.39-.15-.74-.39-1-.23-.27-.38-.62-.38-1a1.5 1.5 0 0 1 1.5-1.5H16a5 5 0 0 0 5-5c0-4.42-4.03-8-9-8\"/>", "folder-multiple": "<path d=\"M22 4h-8l-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2M2 6H0v14a2 2 0 0 0 2 2h18v-2H2z\"/>", "certificate": "<path d=\"M4 3c-1.11 0-2 .89-2 2v10a2 2 0 0 0 2 2h8v5l3-3 3 3v-5h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H4m8 2 3 2 3-2v3.5l3 1.5-3 1.5V15l-3-2-3 2v-3.5L9 10l3-1.5zM4 5h5v2H4zm0 4h3v2H4zm0 4h5v2H4z\"/>", "toolbox": "<path d=\"M18 16h-2v-1H8v1H6v-1H2v5h20v-5h-4zm2-8h-3V6c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v4h4v-2h2v2h8v-2h2v2h4v-4c0-1.1-.9-2-2-2m-5 0H9V6h6z\"/>", "school": "<path d=\"M12 3 1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17z\"/>", "download": "<path d=\"M5 20h14v-2H5m14-9h-4V3H9v6H5l7 7z\"/>", "email-fast": "<path d=\"M22 5.5H9c-1.1 0-2 .9-2 2v9a2 2 0 0 0 2 2h13c1.11 0 2-.89 2-2v-9a2 2 0 0 0-2-2m0 3.67-6.5 3.33L9 9.17V7.5l6.5 3.31L22 7.5zM5 16.5c0 .17.03.33.05.5H1c-.552 0-1-.45-1-1s.448-1 1-1h4zM3 7h2.05c-.02.17-.05.33-.05.5V9H3c-.55 0-1-.45-1-1s.45-1 1-1m-2 5c0-.55.45-1 1-1h3v2H2c-.55 0-1-.45-1-1\"/>"};
(function(){
  const box = $('#about-extra'); if (!box) return;
  const svg = n => `<svg viewBox="0 0 24 24" aria-hidden="true">${AB_ICONS[n]}</svg>`;
  const certs = SITE.timeline.filter(e => e.certImg).length;
  const tools = Object.values(SITE.skills).flat().length;
  const edu = SITE.timeline.find(e => /^BSc/i.test(e.t));
  const stats = [
    ['folder-multiple', SITE.projects.length, 'Projects built'],
    ['certificate', certs, 'Verified certificates'],
    ['toolbox', tools + '+', 'Tools & technologies'],
    ['brain', '4', 'Core domains']
  ];
  const focus = [
    ['code-tags', 'Full-Stack Engineering', 'TypeScript, Node.js and React apps with clean, modular backends.'],
    ['brain', 'AI & RAG Pipelines', 'Retrieval-augmented assistants powered by vector search and LLMs.'],
    ['shield-lock', 'Cybersecurity & CTF', 'Ethical hacking, web application security and packet analysis.'],
    ['palette', 'UI/UX Design', 'Figma prototypes and design systems with a student-first mindset.']
  ];
  box.innerHTML = `
    <div class="ab-stats">${stats.map(([i, n, l]) => `
      <div class="ab-stat"><span class="ab-stat-ico">${svg(i)}</span><b>${esc(String(n))}</b><small>${esc(l)}</small></div>`).join('')}
    </div>
    <h3 class="ab-h">What I do</h3>
    <div class="ab-focus">${focus.map(([i, t, d]) => `
      <div class="ab-row"><span class="ab-row-ico">${svg(i)}</span><div><strong>${esc(t)}</strong><p>${esc(d)}</p></div></div>`).join('')}
    </div>
    ${edu ? `<div class="ab-edu"><span class="ab-row-ico">${svg('school')}</span><div><strong>${esc(edu.t)}</strong><p>${esc(edu.o)}</p></div></div>` : ''}
    <div class="ab-cta">
      <a class="btn p" href="${esc(SITE.resume)}" download>${svg('download')}Download CV</a>
      <a class="btn" href="#contact">${svg('email-fast')}Get in touch</a>
    </div>`;
})();

// 3. Render Timeline with Certificates & Lightbox
if ($('#tl')) $('#tl').innerHTML = SITE.timeline.map((e, i) => `
  <details${i < 2 ? ' open' : ''}>
    <summary>
      <span>${esc(e.t)}</span>
      ${e.badge ? `<span class="cert-badge">${esc(e.badge)}</span>` : ''}
    </summary>
    <small>${esc(e.o)} · ${esc(e.d)}</small>
    <p>${esc(e.x)}</p>
    ${e.certImg ? `
      <div class="cert-action-box">
        <div style="display:flex;align-items:center;gap:14px">
          <img src="${esc(e.certImg)}" alt="${esc(e.t)}" class="cert-thumb cert-view-btn" data-cert="${esc(e.certImg)}" data-title="${esc(e.t)}" data-issuer="${esc(e.o)}" data-desc="${esc(e.x)}" title="Click to inspect verified certificate">
          <div>
            <div style="font-size:0.78rem;font-weight:800;color:var(--ac)">VERIFIED CYBERSECURITY CREDENTIAL</div>
            <div style="font-size:0.75rem;color:var(--mu);margin-top:2px">${e.advisor ? esc(e.advisor) + ' · ' : ''}${e.founder ? esc(e.founder) : 'Organized by C²SH'}</div>
          </div>
        </div>
        <button type="button" class="btn p cert-view-btn" data-cert="${esc(e.certImg)}" data-title="${esc(e.t)}" data-issuer="${esc(e.o)}" data-desc="${esc(e.x)}" style="min-height:36px;padding:0 18px;font-size:0.78rem">
          🛡️ View Certificate
        </button>
      </div>
    ` : ''}
  </details>
`).join('');

// Certificate Lightbox Handler
const certDlg = $('#cert-dlg');
document.addEventListener('click', e => {
  const trigger = e.target.closest('.cert-view-btn');
  if (!trigger || !certDlg) return;
  const certImg = trigger.dataset.cert;
  const title = trigger.dataset.title;
  const issuer = trigger.dataset.issuer;
  const desc = trigger.dataset.desc;

  $('#cert-modal-content').innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:1px solid var(--ln);padding-bottom:12px;gap:12px">
      <div>
        <span class="tag" style="display:inline-block;margin-bottom:4px">OFFICIAL CYBERSECURITY CREDENTIAL</span>
        <h3 id="cert-dt" style="font:clamp(1.2rem,2.5vw,1.7rem) var(--d);margin:0;color:var(--tx);letter-spacing:0.02em">${esc(title)}</h3>
        <p style="margin:4px 0 0;font-size:0.85rem;color:var(--mu)">${esc(issuer)}</p>
      </div>
      <button class="btn" id="cert-close-btn" style="min-height:38px;padding:0 18px">Close</button>
    </div>
    <div style="background:#02020a;border:1px solid var(--ln);border-radius:12px;overflow:hidden;text-align:center;padding:12px">
      <img src="${esc(certImg)}" alt="${esc(title)}" style="max-width:100%;max-height:68vh;border-radius:8px;object-fit:contain;box-shadow:0 10px 40px rgba(0,0,0,0.9)">
    </div>
    <p style="font-size:0.85rem;color:#cbd5e1;margin:0">${esc(desc)}</p>
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;border-top:1px solid var(--ln);padding-top:12px">
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <a href="${esc(certImg)}" download class="btn p" style="font-size:0.8rem;min-height:38px;padding:0 18px">Download High-Res</a>
        <a href="${esc(certImg)}" target="_blank" class="btn" style="font-size:0.8rem;min-height:38px;padding:0 18px">Open in New Tab ↗</a>
      </div>
      <span style="font-size:0.75rem;color:var(--ac);font-weight:800">AUTHENTICATED CREDENTIAL · C²SH &amp; VULNHAT</span>
    </div>
  `;
  certDlg.showModal();
  $('#cert-close-btn').onclick = () => certDlg.close();
});
if (certDlg) {
  certDlg.onclick = e => { if (e.target === certDlg) certDlg.close(); };
}

// 4. Contact Links
$('#cl').innerHTML = [
  `<a href="mailto:${esc(SITE.email)}">✉ ${esc(SITE.email)}</a>`,
  SITE.phone ? `<a href="tel:${esc(SITE.phone)}">☎ ${esc(SITE.phone)}</a>` : '',
  ...Object.entries(SITE.links).map(([k, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(k)} ↗</a>`)
].filter(Boolean).join('');

/* Projects filtering, search & modal dialog */
const cats = ['All', ...new Set(SITE.projects.map(p => p.category))];
let cat = 'All', q = '';
$('#flt').innerHTML = cats.map(c => `<button aria-pressed="${c === cat}">${esc(c)}</button>`).join('');

/* Project card illustrations (inline SVG – no external images needed) */
const _art = inner => `<svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true"><g fill="none" stroke="#bff119" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="40" cy="150" r="60" stroke="#1630d6" stroke-opacity=".25"/><circle cx="290" cy="20" r="50" stroke="#1630d6" stroke-opacity=".25"/>${inner}</g></svg>`;
const _fill = 'fill="rgba(22,48,214,.38)"';
const ART = {
"VarsitySport-Agent": _art(`
  <rect x="26" y="62" width="48" height="58" rx="6" ${_fill}/><path d="M36 78h28M36 90h28M36 102h16" stroke="#8ca0ff"/>
  <path d="M76 91h50M194 91h34" stroke-dasharray="4 6"/>
  <rect x="128" y="60" width="64" height="64" rx="14" fill="rgba(191,241,25,.12)"/>
  <path d="M146 52v8M160 52v8M174 52v8M146 124v8M160 124v8M174 124v8M120 76h8M120 92h8M120 108h8M192 76h8M192 92h8M192 108h8"/>
  <text x="160" y="104" text-anchor="middle" font-family="Anton,Impact,sans-serif" font-size="30" fill="#bff119" stroke="none">AI</text>
  <path d="M268 56l34 12v26c0 22-15 33-34 40-19-7-34-18-34-40V68z" ${_fill}/><path d="M268 80v24M256 92h24"/>
  <circle cx="160" cy="26" r="13"/><path d="M160 19l6 4-2 7h-8l-2-7z" stroke-width="2"/>`),
"Sports Injury Recovery Assistant": _art(`
  <circle cx="160" cy="62" r="36" fill="rgba(191,241,25,.1)"/><path d="M160 44v36M142 62h36" stroke-width="6"/>
  <path d="M16 134h82l10-30 14 58 12-44 8 16h160" stroke="#bff119"/>
  <g stroke="#8ca0ff"><path d="M52 52l34-24"/><circle cx="48" cy="44" r="6"/><circle cx="58" cy="56" r="6"/><circle cx="82" cy="24" r="6"/><circle cx="92" cy="36" r="6"/></g>
  <g stroke="#8ca0ff"><ellipse cx="258" cy="36" rx="26" ry="9" ${_fill}/><path d="M232 36v34c0 5 12 9 26 9s26-4 26-9V36M232 53c0 5 12 9 26 9s26-4 26-9"/></g>`),
"Encrypted Network Traffic Recognition": _art(`
  <g stroke="#3d5bff" stroke-dasharray="3 5"><path d="M160 96L50 50M160 96L270 50M160 96L38 104M160 96L282 112M160 96L90 152M160 96L232 152"/></g>
  <g fill="#040828" stroke="#5b7bff"><circle cx="50" cy="50" r="8"/><circle cx="270" cy="50" r="8"/><circle cx="38" cy="104" r="8"/><circle cx="282" cy="112" r="8"/><circle cx="90" cy="152" r="8"/><circle cx="232" cy="152" r="8"/></g>
  <g fill="#bff119" stroke="none"><rect x="96" y="66" width="7" height="7" rx="1.5"/><rect x="212" y="66" width="7" height="7" rx="1.5"/><rect x="98" y="104" width="7" height="7" rx="1.5"/><rect x="220" y="104" width="7" height="7" rx="1.5"/></g>
  <circle cx="160" cy="96" r="38" fill="rgba(191,241,25,.08)" stroke-opacity=".5"/>
  <path d="M148 90V80a12 12 0 0 1 24 0v10"/><rect x="140" y="90" width="40" height="30" rx="6" fill="#bff119"/><circle cx="160" cy="103" r="4" fill="#040828" stroke="none"/>`),
"GameEdge": _art(`
  <path d="M110 62h100c22 0 40 34 46 66 3 16-12 22-24 10l-20-22H108l-20 22c-12 12-27 6-24-10 6-32 24-66 46-66z" ${_fill}/>
  <path d="M110 80v24M98 92h24" stroke-width="6"/>
  <g fill="#bff119" stroke="none"><circle cx="212" cy="82" r="5.5"/><circle cx="226" cy="94" r="5.5"/><circle cx="198" cy="94" r="5.5"/><circle cx="212" cy="106" r="5.5"/></g>
  <circle cx="140" cy="118" r="8"/><circle cx="180" cy="118" r="8"/><path d="M150 82h20" stroke="#8ca0ff"/>
  <path d="M64 36v10M59 41h10M262 30v10M257 35h10M160 28v8M156 32h8" stroke="#8ca0ff" stroke-width="2"/>`),
"DailyCalc LK": _art(`
  <rect x="42" y="30" width="84" height="120" rx="10" ${_fill}/><rect x="52" y="40" width="64" height="22" rx="4" fill="rgba(191,241,25,.15)"/>
  <g fill="#bff119" stroke="none"><circle cx="62" cy="82" r="5"/><circle cx="84" cy="82" r="5"/><circle cx="106" cy="82" r="5"/><circle cx="62" cy="102" r="5"/><circle cx="84" cy="102" r="5"/><circle cx="106" cy="102" r="5"/><circle cx="62" cy="122" r="5"/><circle cx="84" cy="122" r="5"/><circle cx="106" cy="122" r="5"/></g>
  <path d="M150 50h18M205 50h18" stroke="#8ca0ff"/>
  <circle cx="138" cy="50" r="10"/><circle cx="193" cy="50" r="10"/><circle cx="248" cy="50" r="10" fill="#bff119"/><path d="M243 50l4 4 7-8" stroke="#040828"/>
  <g stroke="#5b7bff" ${_fill}><rect x="150" y="96" width="24" height="18" rx="2"/><rect x="178" y="96" width="24" height="18" rx="2"/><rect x="206" y="96" width="24" height="18" rx="2"/><rect x="178" y="118" width="24" height="18" rx="2"/><rect x="206" y="118" width="24" height="18" rx="2"/><rect x="150" y="118" width="24" height="18" rx="2"/></g>
  <path d="M236 108h28c-2 18-14 30-34 30" stroke="#8ca0ff"/>`),
"SmartCampus LMS": _art(`
  <rect x="46" y="38" width="218" height="116" rx="10" ${_fill}/><path d="M46 58h218"/><g fill="#bff119" stroke="none"><circle cx="58" cy="48" r="2.5"/><circle cx="68" cy="48" r="2.5"/><circle cx="78" cy="48" r="2.5"/></g>
  <rect x="54" y="66" width="34" height="80" rx="4" stroke="#5b7bff"/>
  <rect x="98" y="66" width="52" height="38" rx="5" stroke="#5b7bff"/><rect x="158" y="66" width="52" height="38" rx="5" stroke="#5b7bff"/><rect x="218" y="66" width="38" height="38" rx="5" fill="rgba(191,241,25,.18)"/>
  <path d="M98 118h120M98 130h84M98 142h100" stroke="#8ca0ff"/><path d="M98 118h70" stroke-width="4"/>
  <path d="M244 24l36-14 36 14-36 14z" fill="#040828"/><path d="M260 32v12c0 7 40 7 40 0V32M316 24v18"/>`),
"Wallify Paint Shop": _art(`
  <rect x="62" y="30" width="130" height="34" rx="9" fill="#bff119" stroke="none"/>
  <path d="M192 47h28a10 10 0 0 1 10 10v14h-70v14" /><rect x="152" y="86" width="16" height="36" rx="5" ${_fill}/>
  <path d="M84 70v12M118 70v22M150 70v8" stroke="#bff119" stroke-width="4"/>
  <g stroke="none"><rect x="52" y="132" width="40" height="32" rx="6" fill="#bff119"/><rect x="100" y="132" width="40" height="32" rx="6" fill="#3d5bff"/><rect x="148" y="132" width="40" height="32" rx="6" fill="#ff4d8d"/><rect x="196" y="132" width="40" height="32" rx="6" fill="#ffb020"/><rect x="244" y="132" width="40" height="32" rx="6" fill="#20d3c2"/></g>`),
"Share2Care — Meal Bank Finder": _art(`
  <rect x="116" y="14" width="88" height="152" rx="16" ${_fill}/><path d="M146 22h28" stroke="#8ca0ff"/>
  <path d="M124 56h72M124 80h72M124 104h72M146 40v76M172 40v76" stroke="#3d5bff" stroke-width="1.5"/>
  <path d="M160 46c-13 0-21 9-21 21 0 15 21 34 21 34s21-19 21-34c0-12-8-21-21-21z" fill="#bff119"/>
  <path d="M160 76l-8-8a5 5 0 0 1 8-6 5 5 0 0 1 8 6z" fill="#040828" stroke="none"/>
  <rect x="126" y="126" width="68" height="10" rx="5" stroke="#5b7bff"/><rect x="126" y="142" width="46" height="10" rx="5" stroke="#5b7bff"/>
  <path d="M30 108h56a28 28 0 0 1-56 0z" ${_fill}/><path d="M44 96c-4-6 4-8 0-14M58 96c-4-6 4-8 0-14M72 96c-4-6 4-8 0-14" stroke="#8ca0ff"/>
  <path d="M234 100l32-22 32 22v44h-64z" ${_fill}/><path d="M258 144v-24h16v24"/>`)
};

function draw() {
  const L = SITE.projects.filter(p => (cat === 'All' || p.category === cat) && (p.title + p.summary + p.tools.join(' ')).toLowerCase().includes(q));
  $('#grid').innerHTML = L.length ? L.map(p => {
    const i = SITE.projects.indexOf(p);
    return `<button class="c" data-i="${i}" aria-haspopup="dialog">
      <div class="cv" style="background:linear-gradient(135deg,rgba(22,48,214,0.45) 0%,#040828 65%,#02020a 100%);color:var(--ac);border-bottom:1px solid var(--ln);text-shadow:0 0 16px var(--ac-glow)">${p.img ? `<img src="${esc(p.img)}" alt="${esc(p.title)} preview" loading="lazy" data-t="${esc(p.title)}" onerror="this.parentNode.innerHTML=ART[this.dataset.t]||''">` : ''}${p.img ? '' : ART[p.title] || esc(p.title.split(/\s+/).map(w => w[0]).join('').slice(0, 3))}</div>
      <div class="cb">
        <span class="tag">${esc(p.category)}${p.year ? ' · ' + esc(p.year) : ''}</span>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.summary)}</p>
      </div>
    </button>`;
  }).join('') : '<p style="color:var(--mu);padding:20px 0">No projects match your search.</p>';
}

$('#flt').onclick = e => {
  const b = e.target.closest('button');
  if (!b) return;
  cat = b.textContent;
  [...$('#flt').children].forEach(x => x.setAttribute('aria-pressed', x === b));
  draw();
};

$('#q').oninput = e => {
  q = e.target.value.toLowerCase();
  draw();
};
draw();

const dlg = $('#dlg');
let opener;
$('#grid').onclick = e => {
  const b = e.target.closest('.c');
  if (!b) return;
  opener = b;
  const p = SITE.projects[b.dataset.i];
  const links = [
    p.liveUrl && `<a class="btn p" href="${esc(p.liveUrl)}" target="_blank" rel="noopener noreferrer">Live Demo</a>`,
    `<a class="btn" href="${esc(p.sourceUrl || SITE.links.GitHub)}" target="_blank" rel="noopener noreferrer">${p.sourceUrl ? 'View Code' : 'GitHub Profile'}</a>`
  ].filter(Boolean).join(' ');

  $('#dc').innerHTML = `
    <span class="tag">${esc(p.category)}</span>
    <h3 id="dt" style="font:1.8rem var(--d);margin:8px 0">${esc(p.title)}</h3>
    <p>${esc(p.description)}</p>
    <div class="f">${p.tools.map(t => `<span class="pill">${esc(t)}</span>`).join('')}</div>
    <div class="r" style="margin-top:20px;flex-wrap:wrap">
      ${links}
      <button class="btn" id="x">Close</button>
    </div>
  `;
  dlg.showModal();
  $('#x').onclick = () => dlg.close();
};
dlg.onclick = e => { if (e.target === dlg) dlg.close(); };
dlg.onclose = () => opener && opener.focus();

/* ============================================================================
   4. NAVIGATION SPY & MOBILE MENU
   ============================================================================ */
const navLinks = [...document.querySelectorAll('nav a')];
const spy = new IntersectionObserver(es => {
  es.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => a.classList.toggle('on', a.hash === '#' + e.target.id));
    }
  });
}, { rootMargin: '-30% 0px -60% 0px' });
document.querySelectorAll('section[id]').forEach(s => spy.observe(s));

const nav = $('#nav');
function menu(o) {
  nav.classList.toggle('open', o);
  $('#menu').setAttribute('aria-expanded', String(o));
}
$('#menu').onclick = () => menu(!nav.classList.contains('open'));
nav.onclick = e => { if (e.target.closest('a')) menu(false); };
document.addEventListener('keydown', e => { if (e.key === 'Escape') menu(false); });

/* ============================================================================
   5. CONTACT FORM SUBMISSION
   ============================================================================ */
$('#cf').onsubmit = e => {
  e.preventDefault();
  const n = $('#fn'), m = $('#fm'), em = $('#fe');
  const ok = [
    [n, n.value.trim()],
    [m, m.value.trim()],
    [em, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value.trim())]
  ].map(([el, v]) => {
    el.setAttribute('aria-invalid', String(!v));
    return !!v;
  }).every(Boolean);

  if (!ok) {
    $('#st').textContent = 'Please fill in every field with valid details.';
    return;
  }
  $('#st').textContent = 'Opening your email app to send the message…';
  location.href = `mailto:${SITE.email}?subject=${encodeURIComponent('Portfolio inquiry from ' + n.value.trim())}&body=${encodeURIComponent(m.value.trim() + '\n\nFrom: ' + n.value.trim() + ' <' + em.value.trim() + '>')}`;
};


/* =====================================================================
   HERO TYPING ANIMATION (ROBUST DOM READY)
   Cycles through:
   - "UI/UX Design"
   - "AI Image & Video Generation"
   - "Prompt Engineering"
   - "Web Development"
   - "Poster & Social Media Design"
   - "AI-Assisted Content Creation"
   ===================================================================== */
(function initHeroTyping() {
  const target = document.getElementById('heroTypingRole');
  if (!target) return;

  const roles = [
    "UI/UX Design",
    "AI Image & Video Generation",
    "Prompt Engineering",
    "Web Development",
    "Poster & Social Media Design",
    "AI-Assisted Content Creation"
  ];

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    target.textContent = roles[0];
    return;
  }

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const TYPE_SPEED = 70;
  const DELETE_SPEED = 38;
  const HOLD_TIME = 1900;
  const PAUSE_BEFORE_TYPE = 350;

  function typeStep() {
    const current = roles[roleIdx];

    if (!isDeleting) {
      charIdx++;
      target.textContent = current.slice(0, charIdx);

      if (charIdx === current.length) {
        isDeleting = true;
        setTimeout(typeStep, HOLD_TIME);
        return;
      }
      setTimeout(typeStep, TYPE_SPEED);
    } else {
      charIdx--;
      target.textContent = current.slice(0, charIdx);

      if (charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        setTimeout(typeStep, PAUSE_BEFORE_TYPE);
        return;
      }
      setTimeout(typeStep, DELETE_SPEED);
    }
  }

  typeStep();
})();

/* =====================================================================
   HERO PARTICLE BACKGROUND (LIGHTWEIGHT CANVAS, ZERO LIBRARIES)
   ===================================================================== */
(function initHeroCanvas() {
  const canvas = document.getElementById('heroParticleCanvas');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0, height = 0;
  let particles = [];
  const COUNT = 32;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = canvas.width = rect.width || canvas.offsetWidth || 800;
    height = canvas.height = rect.height || canvas.offsetHeight || 600;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.8 + 0.6,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.45 + 0.15,
        color: Math.random() > 0.35 ? '#1f4fff' : '#b6ff1a'
      });
    }
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(loop);
  }

  resize();
  createParticles();
  loop();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  }, { passive: true });
})();


/* About video: hide quietly if the file is missing; respect reduced motion */
(function(){
  const v=document.getElementById('about-video'); if(!v) return;
  const srcs=v.querySelectorAll('source');
  if(srcs.length) srcs[srcs.length-1].addEventListener('error',()=>{v.style.display='none'});
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){v.removeAttribute('autoplay');v.pause();}
})();

/* HUD card: cursor over card -> full-card intro video; leave -> profile. Auto-rotates when not hovered */
(function(){
  const card=document.getElementById('hudCard');
  const layer=document.getElementById('hudVideoLayer');
  const video=document.getElementById('hudVideo');
  if(!card||!layer||!video) return;
  const PROFILE_MS=6000, VIDEO_MAX_MS=60000;
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let timer=null, videoOk=true, hovering=false;

  function showProfile(){
    video.pause();
    card.classList.remove('show-video');
    layer.setAttribute('aria-hidden','true');
    clearTimeout(timer);
    if(!reduce && !hovering && videoOk) timer=setTimeout(showVideo,PROFILE_MS);
  }
  function showVideo(){
    if(!videoOk) return;               // no video file -> stay on the profile
    card.classList.add('show-video');
    layer.setAttribute('aria-hidden','false');
    clearTimeout(timer);
    video.currentTime=0;
    video.loop=hovering;
    const pr=video.play();
    if(pr && pr.catch) pr.catch(()=>{});
    if(!hovering) timer=setTimeout(showProfile,VIDEO_MAX_MS);
  }
  video.addEventListener('ended',()=>{ if(!hovering) showProfile(); });
  const srcs=video.querySelectorAll('source');
  const last=srcs[srcs.length-1];
  if(last) last.addEventListener('error',()=>{ videoOk=false; showProfile(); });

  card.addEventListener('pointerenter',e=>{
    if(e.pointerType!=='mouse') return;
    hovering=true; showVideo();
  });
  card.addEventListener('pointerleave',e=>{
    if(e.pointerType!=='mouse') return;
    hovering=false; video.loop=false; showProfile();
  });
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){clearTimeout(timer); video.pause();}
    else showProfile();
  });
  showProfile();

  // Load the About video only when it approaches the screen
const aboutVideo = document.getElementById("about-video");

if (aboutVideo) {
  const videoObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        aboutVideo.querySelectorAll("source[data-src]").forEach((source) => {
          source.src = source.dataset.src;
          source.removeAttribute("data-src");
        });

        aboutVideo.load();
        aboutVideo.play().catch(() => {});
        observer.unobserve(aboutVideo);
      }
    });
  }, { rootMargin: "200px" });

  videoObserver.observe(aboutVideo);
}
})();
