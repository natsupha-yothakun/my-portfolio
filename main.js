(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  /* =====================================================================
     LOADER
     ===================================================================== */
  document.body.classList.add('is-loading');
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
      loader?.classList.add('is-hidden');
      document.body.classList.remove('is-loading');
    }, 400);
  });

  /* =====================================================================
     FOOTER YEAR
     ===================================================================== */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =====================================================================
     CUSTOM CURSOR
     ===================================================================== */
/* =====================================================================
     🔮 PLASMA FIREBALL CURSOR WITH SMOOTH SMOKE TRAIL
     (ลูกไฟพลาสม่าเรืองแสงสีฟ้าน้ำทะเล พร้อมหางควันฟุ้งละมุนไหลช้าๆ สมูท)
     ===================================================================== */
  if (!isTouch) {
    const dot = document.getElementById('cursorDot');   // ลูกไฟพลาสม่าดวงหลัก
    const ring = document.getElementById('cursorRing'); // เป้าเล็งฉาก (เก็บไว้ล็อกเป้าได้เหมือนเดิม)
    
    // mx, my = พิกัดเมาส์จริง | cx, cy = พิกัดลูกไฟหลักที่วิ่งตามแบบสมูทช้าๆ
    let mx = 0, my = 0, cx = 0, cy = 0, rx = 0, ry = 0;
    const trailParticles = [];
    const maxTrail = 25; // เพิ่มปริมาณเพื่อความฟุ้งหนาแน่นสไตล์เปลวไฟ

    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; 
      my = e.clientY;
    });

    // ฟังก์ชันระเบิดกลุ่มควันพลาสม่าลากหาง
    function createFireTrail(x, y) {
      if (trailParticles.length >= maxTrail) return;

      const p = document.createElement('div');
      p.className = 'plasma-smoke-particle';
      p.style.left = `${x}px`;
      p.style.top = `${y}px`;
      
      // สุ่มขนาดให้มีเม็ดใหญ่เม็ดเล็กคละกันแบบกลุ่มก้อนควันในรูปภาพ
      const size = Math.random() * 12 + 6; 
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      
      document.body.appendChild(p);
      
      trailParticles.push({
        element: p,
        opacity: 0.7,
        scale: 1,
        // สั่งให้เศษหางไฟกระจายตัวลอยนิ่งๆ เอื่อยๆ ไม่พุ่งกระจัดกระจายเกินไป
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8 - 0.3 // ให้ลอยละล่องขึ้นด้านบนเบาๆ เหมือนควันไฟ
      });
    }

    // 🌟 คอร์ลูปฟิสิกส์: ควบคุมความช้าสมูทระนาบน้ำไหล
    function plasmaLoop() {
      // ⚡ ปรับค่าตรงนี้: ของเดิม 0.18 ปรับลดเหลือ 0.08 เพื่อให้ลูกไฟวิ่งตามเมาส์ "ช้าลงและหน่วงนุ่มนวล" แบบลักชูรี
      cx += (mx - cx) * 0.08;
      cy += (my - cy) * 0.08;

      if (dot) {
        dot.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      }

      // วงแหวนเป้าเล็งนอกวิ่งตามปกติ
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      if (ring) {
        ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      }

      // ปล่อยหางควันพลาสม่าออกจากตูดลูกไฟดวงหลักยามขยับเคลื่อนไหว
      if (Math.abs(mx - cx) > 1 || Math.abs(my - cy) > 1) {
        createFireTrail(cx, cy);
      }

      // จัดการคำนวณแอนิเมชันม้วนตัวจางหายของหางไฟ
      for (let i = trailParticles.length - 1; i >= 0; i--) {
        const p = trailParticles[i];
        p.opacity -= 0.02; // อัตราความช้าในการจางหาย (ลดลงทีละนิดเพื่อให้หางยาวสวยตามเรฟ)
        p.scale += 0.015;  // 💡 ควันไฟต้องยิ่งลอยยิ่ง "ขยายตัวฟุ้งใหญ่ขึ้น" ก่อนจะจางหายไป
        
        const currentX = parseFloat(p.element.style.left) + p.vx;
        const currentY = parseFloat(p.element.style.top) + p.vy;
        p.element.style.left = `${currentX}px`;
        p.element.style.top = `${currentY}px`;
        
        p.element.style.opacity = p.opacity;
        p.element.style.transform = `scale(${p.scale})`;

        if (p.opacity <= 0) {
          p.element.remove();
          trailParticles.splice(i, 1);
        }
      }

      requestAnimationFrame(plasmaLoop);
    }
    plasmaLoop();

    // ระบบ Lock On กรอบเหลี่ยมฉากเวลาชี้วัตถุเหมือนเดิม
    document.querySelectorAll('[data-cursor]').forEach((el) => {
      const kind = el.dataset.cursor;
      el.addEventListener('mouseenter', () => ring?.classList.add('is-locked', `is-${kind}`));
      el.addEventListener('mouseleave', () => ring?.classList.remove('is-locked', `is-${kind}`));
    });
  }

  /* =====================================================================
     MAGNETIC BUTTONS
     ===================================================================== */
  if (!isTouch && !prefersReducedMotion) {
    document.querySelectorAll('.magnetic').forEach((btn) => {
      const strength = 22;
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.setProperty('--mx', `${(x / rect.width) * strength}px`);
        btn.style.setProperty('--my', `${(y / rect.height) * strength}px`);
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.setProperty('--mx', '0px');
        btn.style.setProperty('--my', '0px');
      });
    });
  }

  /* =====================================================================
     HEADER: scroll state, progress bar, mobile nav
     ===================================================================== */
  const header = document.getElementById('siteHeader');
  const progress = document.getElementById('scrollProgress');

  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 12);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  navToggle?.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  mobileNav?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
    mobileNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));

  /* =====================================================================
     SCROLL REVEAL
     ===================================================================== */
  const revealTargets = document.querySelectorAll('.reveal-up');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  /* =====================================================================
     3D TILT CARDS
     ===================================================================== */
  if (!isTouch && !prefersReducedMotion) {
    document.querySelectorAll('.tilt-card').forEach((card) => {
      const max = 8;
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty('--ry', `${px * max * 2}deg`);
        card.style.setProperty('--rx', `${-py * max * 2}deg`);
      });
      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* =====================================================================
     HERO BLOB CANVAS — morphing gradient blobs
     ===================================================================== */
  (function blobCanvas() {
    const canvas = document.getElementById('blobCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    window.addEventListener('resize', resize);
    resize();

    const blobs = [
      { x: 0.28, y: 0.35, r: 0.34, hue: 226, s: 0.00042, t: 0 },
      { x: 0.72, y: 0.30, r: 0.28, hue: 262, s: 0.00051, t: 100 },
      { x: 0.50, y: 0.68, r: 0.30, hue: 244, s: 0.00037, t: 250 },
    ];

    let raf;
    function draw(time) {
      ctx.clearRect(0, 0, w, h);
      blobs.forEach((b) => {
        const wobble = prefersReducedMotion ? 0 : Math.sin(time * b.s + b.t) * 0.03;
        const cx = (b.x + wobble) * w;
        const cy = (b.y + Math.cos(time * b.s + b.t) * 0.02) * h;
        const radius = b.r * Math.max(w, h);
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        grad.addColorStop(0, `hsla(${b.hue}, 90%, 65%, 0.35)`);
        grad.addColorStop(1, 'hsla(0,0%,0%,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else raf = requestAnimationFrame(draw);
    });
  })();

  /* =====================================================================
     PROJECT MODAL — content comes from the matching <template> in the
     HTML (id="project-1", "project-2", ...), so all copy stays editable
     directly in index.html. No JSON, no build step.
     ===================================================================== */
  (function projectModal() {
    const modal = document.getElementById('projectModal');
    const content = document.getElementById('projectModalContent');
    if (!modal || !content) return;
    let lastFocused = null;

    function open(templateId) {
      const tpl = document.getElementById(templateId);
      if (!tpl) return;
      lastFocused = document.activeElement;
      content.innerHTML = '';
      content.appendChild(tpl.content.cloneNode(true));
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      modal.querySelector('.project-modal-close').focus();
    }

    function close() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      lastFocused?.focus();
    }

    document.querySelectorAll('[data-project]').forEach((card) => {
      const templateId = card.dataset.project;
      card.addEventListener('click', () => open(templateId));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(templateId); }
      });
    });

    modal.querySelectorAll('[data-close-modal]').forEach((el) => el.addEventListener('click', close));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
    });
  })();

  /* =====================================================================
     SKILL CONSTELLATION (canvas, draggable nodes)
     Reads its data straight from the hidden #skillsData list in the
     HTML — edit the data-* attributes there, nothing here.
     ===================================================================== */
  // =========================================================================
// 3D SPHERE WORD CLOUD ENGINE
// =========================================================================
document.addEventListener("DOMContentLoaded", function () {
  try {
    // ตั้งค่าพารามิเตอร์ให้ทรงกลมเรืองแสงคุมโทนน้ำเงินน้ำทะเลลึก
    TagCanvas.Start('skillsCanvas', 'sphereTags', {
      textColour: null,           /* ใช้สีอิสระตามที่ตั้งค่าไว้ใน HTML */
      outlineColour: 'transparent',/* ซ่อนเส้นกรอบเวลาเอาเมาส์ชี้เพื่อความคลีน */
      reverse: true,              /* หมุนตามทิศทางเมาส์จริง */
      depth: 0.8,                 /* ความลึกของมิติสามมิติ (0-1) */
      maxSpeed: 0.04,             /* ความเร็วสูงสุดในการหมุน */
      minSpeed: 0.01,             /* ความเร็วเริ่มต้นยามปล่อยว่าง */
      wheelZoom: false,           /* ปิดระบบซูมเข้าออกเพื่อไม่ให้กระทบการเลื่อนหน้าเว็บ */
      textFont: null,
      freezeActive: false,        /* ไม่หยุดหมุนเวลาเมาส์ชี้ เพื่อให้คงความสมูท */
      initial: [0.1, -0.1],       /* ทิศทางการหมุนเริ่มต้นแกน [X, Y] */
      noSelect: true,             /* ป้องกันการคลุมดำข้อความเวลาปัดนิ้ว */
      clickToFront: 600           /* หมุนคำที่ถูกกดมาด้านหน้า */
    });
  } catch (e) {
    // ถ้าอุปกรณ์ไม่รองรับ Canvas ให้ซ่อนตัวแผงเพื่อความปลอดภัยของระบบ
    document.getElementById('skillsCanvas').style.display = 'none';
  }
});

  /* =====================================================================
     CONTACT FORM — fully static, no server.
     Validates in the browser, then opens the visitor's email client
     with a pre-filled message via a mailto: link. Change YOUR_EMAIL
     below to your real address.
     ===================================================================== */
  (function contactForm() {
    const YOUR_EMAIL = 'arjun.mehta.dev@gmail.com';

    const form = document.getElementById('contactForm');
    if (!form) return;
    const status = document.getElementById('formStatus');
    const submitBtn = form.querySelector('button[type="submit"]');

    const rules = {
      name: (v) => v.trim().length >= 2 || 'Enter a name (2+ characters).',
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email address.',
      subject: (v) => v.trim().length >= 3 || 'Subject should be at least 3 characters.',
      message: (v) => v.trim().length >= 10 || 'Message should be at least 10 characters.',
    };

    function validateField(field) {
      const rule = rules[field.name];
      if (!rule) return true;
      const result = rule(field.value);
      const row = field.closest('.form-row');
      const errorEl = row?.querySelector('.form-error');
      if (result === true) {
        row?.classList.remove('has-error');
        if (errorEl) errorEl.textContent = '';
        return true;
      }
      row?.classList.add('has-error');
      if (errorEl) errorEl.textContent = result;
      return false;
    }

    Object.keys(rules).forEach((name) => {
      const field = form.querySelector(`[name="${name}"]`);
      field?.addEventListener('blur', () => validateField(field));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      Object.keys(rules).forEach((name) => {
        const field = form.querySelector(`[name="${name}"]`);
        if (field && !validateField(field)) valid = false;
      });
      if (!valid) {
        status.textContent = 'Please fix the highlighted fields.';
        status.className = 'form-status is-error';
        return;
      }

      submitBtn.classList.add('is-loading');
      submitBtn.disabled = true;

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const subject = form.subject.value.trim();
      const message = form.message.value.trim();

      const body = `From: ${name} (${email})\n\n${message}`;
      const mailtoUrl = `mailto:${YOUR_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      // Small delay purely so the loading state is visible before the
      // browser hands off to the mail client.
      setTimeout(() => {
        window.location.href = mailtoUrl;
        submitBtn.classList.remove('is-loading');
        submitBtn.disabled = false;
        status.textContent = "Opening your email client to send this — if nothing happens, email me directly instead.";
        status.className = 'form-status is-success';
      }, 500);
    });
  })();
})();
  
// =========================================================================
// AUTOMATIC & MOUSE WHEEL SMOOTH SCROLL FOR CERTIFICATES CAROUSEL
// (ระบบเลื่อนใบเซอร์อัตโนมัติ + ใช้ลูกกลิ้งเมาส์เลื่อนได้ + หยุดเลื่อนเมื่อชี้เมาส์)
// =========================================================================
document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.querySelector(".cert-carousel-container");
  
  if (carousel) {
    let isHovered = false;
    let scrollSpeed = 0.001; // 🚀 ปรับความเร็วตรงนี้ได้ครับ (เลขน้อยเลื่อนช้าๆ พรีเมียม / เลขมากเลื่อนไว)
    let autoScrollInterval;

    // 1. ฟังก์ชันสั่งเลื่อนอัตโนมัติ
    function startAutoScroll() {
      autoScrollInterval = setInterval(() => {
        // ถ้าเมาส์ไม่ได้ชี้อยู่ และหน้าจอไม่ใช่ขนาดมือถือ ให้เลื่อนอัตโนมัติ
        if (!isHovered && window.innerWidth > 640) {
          // เลื่อนไปทางขวาทีละนิด
          carousel.scrollLeft += scrollSpeed;
          
          // ถ้าเลื่อนจนสุดความกว้างของแถวแล้ว ให้เด้งกลับมาเริ่มนับ 0 ใหม่แบบเนียนๆ
          if (carousel.scrollLeft >= (carousel.scrollWidth - carousel.clientWidth - 5)) {
            carousel.scrollLeft = 0;
          }
        }
      }, 20); // ทำงานทุกๆ 20 มิลลิวินาทีเพื่อให้ภาพขยับสมูทต่อเนื่อง
    }

    // 2. ฟังก์ชันหยุดเลื่อนเมื่อนิ้วจิ้มหรือเมาส์ชี้ (Hover)
    carousel.addEventListener("mouseenter", () => isHovered = true);
    carousel.addEventListener("mouseleave", () => isHovered = false);
    carousel.addEventListener("touchstart", () => isHovered = true);
    carousel.addEventListener("touchend", () => {
      // ปล่อยนิ้วแล้ว 2 วินาที ค่อยให้ระบบกลับมาเลื่อนอัตโนมัติต่อ
      setTimeout(() => { isHovered = false; }, 2000);
    });

    // 3. ระบบดักจับลูกกลิ้งเมาส์ (เมาส์หมุนแนวตั้ง แผงเลื่อนแนวนอน)
    carousel.addEventListener("wheel", function (event) {
      if (window.innerWidth > 640) {
        event.preventDefault();
        carousel.scrollLeft += event.deltaY * 1.0; // เลื่อนตามแรงหมุนของเมาส์จริง
      }
    }, { passive: false });

    // 🚀 เริ่มเดินระบบตั้งแต่วินาทีแรกที่เปิดเว็บ
    startAutoScroll();
  }
});




// =========================================================================
// ULTRA SMART SCROLL FOR MULTIPLE CERTIFICATE CAROUSELS (รองรับทุกแผงสไลด์บนเว็บ)
// =========================================================================
document.addEventListener("DOMContentLoaded", function () {
  // 🌟 เปลี่ยนจาก querySelector เป็น querySelectorAll เพื่อให้จับทั้งแผงเทคนิคและแผงใบสอบ
  const carousels = document.querySelectorAll(".cert-carousel-container");
  
  carousels.forEach((carousel) => {
    let isHovered = false;
    let isInteracting = false; 
    let scrollSpeed = 0.4; 
    let autoScrollInterval;
    let interactionTimeout;

    // 1. ระบบเลื่อนอัตโนมัติยามปล่อยว่าง
    function startAutoScroll() {
      autoScrollInterval = setInterval(() => {
        if (!isHovered && !isInteracting) {
          carousel.scrollLeft += scrollSpeed;
          if (carousel.scrollLeft >= (carousel.scrollWidth - carousel.clientWidth - 5)) {
            carousel.scrollLeft = 0;
          }
        }
      }, 20);
    }

    // ตัวดักจับเช็กพฤติกรรมการ Hover และสัมผัสหน้าจอ
    carousel.addEventListener("mouseenter", () => isHovered = true);
    carousel.addEventListener("mouseleave", () => isHovered = false);
    carousel.addEventListener("touchstart", () => isHovered = true);
    carousel.addEventListener("touchend", () => {
      setTimeout(() => { isHovered = false; }, 2000);
    });

    // 2. ระบบคัดแยกและบูสต์ความเร็ว Trackpad + เมาส์ธรรมดา
    carousel.addEventListener("wheel", function (event) {
      if (window.innerWidth > 640) {
        isInteracting = true;
        clearTimeout(interactionTimeout);
        
        interactionTimeout = setTimeout(() => {
          isInteracting = false;
        }, 1500);

        const isTrackpad = Math.abs(event.deltaX) > 0 || !Number.isInteger(event.deltaY / 100);

        if (isTrackpad) {
          isHovered = true;
          clearTimeout(carousel.trackpadTimeout);
          carousel.trackpadTimeout = setTimeout(() => { isHovered = false; }, 1500);
          
          if (Math.abs(event.deltaX) > 0) {
            event.preventDefault();
            carousel.scrollLeft += event.deltaX * 2.5; // บูสต์ความเร็ว Trackpad ให้ติดมือลื่นๆ
          }
          
        } else {
          event.preventDefault();
          carousel.scrollLeft += event.deltaY * 1.0; // เมาส์ธรรมดากลิ้งแนวตั้งไปแนวนอนปกติ
        }
      }
    }, { passive: false });

    // สั่งเดินเครื่องทุกแผงคอนเทนเนอร์
    startAutoScroll();
  });
});
// =========================================================================
// SMART SCROLL FOR CERTIFICATES CAROUSEL (TRACKPAD & MOUSE WHEEL SEPARATION)
// (แยกตรวจจับเมาส์ธรรมดา และ Trackpad เพื่อให้ปัดหน้าจอได้อย่างเป็นธรรมชาติ)
// =========================================================================
// =========================================================================
// TURBO SCROLL FOR TRACKPAD & MOUSE WHEEL (ซ่อมบั๊ก Trackpad ปัดซ้ายขวาแล้วอืด)
// =========================================================================
document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.querySelector(".cert-carousel-container");
  
  if (carousel) {
    let isHovered = false;
    let isInteracting = false; 
    let scrollSpeed = 1; 
    let autoScrollInterval;
    let interactionTimeout;

    // 1. ระบบเลื่อนอัตโนมัติยามปล่อยว่าง
    function startAutoScroll() {
      autoScrollInterval = setInterval(() => {
        if (!isHovered && !isInteracting) {
          carousel.scrollLeft += scrollSpeed;
          if (carousel.scrollLeft >= (carousel.scrollWidth - carousel.clientWidth - 5)) {
            carousel.scrollLeft = 0;
          }
        }
      }, 30);
    }

    // ตัวดักจับเช็กพฤติกรรมการ Hover และสัมผัสหน้าจอ
    carousel.addEventListener("mouseenter", () => isHovered = true);
    carousel.addEventListener("mouseleave", () => isHovered = false);
    carousel.addEventListener("touchstart", () => isHovered = true);
    carousel.addEventListener("touchend", () => {
      setTimeout(() => { isHovered = false; }, 2000);
    });

    // 🚀 2. ระบบคัดแยกและบูสต์ความเร็ว Trackpad (แก้ปัญหาปัดซ้ายขวาช้า)
    carousel.addEventListener("wheel", function (event) {
      if (window.innerWidth > 640) {
        
        isInteracting = true;
        clearTimeout(interactionTimeout);
        
        interactionTimeout = setTimeout(() => {
          isInteracting = false;
        }, 1500);

        // เช็กว่าเป็น Trackpad หรือไม่
        const isTrackpad = Math.abs(event.deltaX) > 0 || !Number.isInteger(event.deltaY / 100);

        if (isTrackpad) {
          // 💻 จังหวะใช้ Trackpad:
          isHovered = true;
          clearTimeout(window.trackpadTimeout);
          window.trackpadTimeout = setTimeout(() => { isHovered = false; }, 1500);
          
          // 🔥 [จุดแก้บั๊ก] ถ้าผู้ใช้ปัดซ้าย-ขวาตรงๆ (มีค่า deltaX) ให้ดักจับแล้วคูณความเร็วเพิ่มแรงส่งทันที!
          if (Math.abs(event.deltaX) > 0) {
            event.preventDefault(); // เบรกระบบหน่วงของเบราว์เซอร์
            carousel.scrollLeft += event.deltaX * 2.5; // ⚡ คูณ 2.5 บูสต์ความเร็วให้ติดมือ (ปรับเพิ่ม/ลดเลขนี้ได้ตามชอบครับ)
          }
          
        } else {
          // 🖱️ ถ้าเป็นเมาส์ธรรมดา (ลูกกลิ้ง): ล็อกล้อแนวตั้งแปลงไปแนวนอนปกติ
          event.preventDefault();
          carousel.scrollLeft += event.deltaY * 1.0;
        }
      }
    }, { passive: false });

    startAutoScroll();
  }
});






// ดึง Element ตัวหุ่นยนต์และลูกตาดำมาเตรียมไว้
const bot = document.getElementById('companion-bot');
const pupils = document.querySelectorAll('.pupil');

// ตัวแปรเก็บพิกัดเมาส์ (เริ่มต้นที่ 0)
let mX = 0, mY = 0; 
let bX = window.innerWidth - 100, bY = window.innerHeight - 150;
let targetBX = bX, targetBY = bY;
let floatOscillation = 0;

// 1. ดักจับพิกัดเมาส์ทุกครั้งที่ผู้ใช้ขยับ
window.addEventListener('mousemove', (e) => {
    mX = e.clientX;
    mY = e.clientY;
});

// 2. ฟังก์ชันคำนวณและ Animation Loop (ทำงานที่ 60fps)
function coreBotProcessingCycle() {
    // เอฟเฟกต์หุ่นยนต์ลอยได้เบาๆ (Floating Effect)
    floatOscillation += 0.03;
    const bounceOffset = Math.sin(floatOscillation) * 6;

    // ดึงพิกัดจุดศูนย์กลางของหุ่นยนต์บนหน้าจอ ณ เวลานั้น
    const botRect = bot.getBoundingClientRect();
    const botCenterX = botRect.left + botRect.width / 2;
    const botCenterY = botRect.top + botRect.height / 2;

    // คำนวณระยะห่างระหว่างเมาส์กับหุ่นยนต์ (Vector X และ Y)
    const vectorX = mX - botCenterX;
    const vectorY = mY - botCenterY;
    
    // หาองศาที่เมาส์ทำกับตัวหุ่นยนต์ (ผลลัพธ์เป็น Radians)
    const radAngle = Math.atan2(vectorY, vectorX);
    
    // จำกัดระยะไม่ให้ลูกตาดำวิ่งทะลุขอบตาออกไป (สูงสุดไม่เกิน 3 พิกเซล)
    const radiusDistance = Math.min(3, Math.hypot(vectorX, vectorY) / 60);

    // แปลงค่ากลับเป็นพิกัด X และ Y สำหรับการขยับลูกตา
    const pupilsOffsetX = Math.cos(radAngle) * radiusDistance;
    const pupilsOffsetY = Math.sin(radAngle) * radiusDistance;

    // สั่งให้ลูกตาดำทุกข้างขยับไปตามพิกัดที่คำนวณได้
    pupils.forEach(pupil => {
        pupil.style.transform = `translate3d(${pupilsOffsetX}px, ${pupilsOffsetY}px, 0)`;
    });

    // อัปเดตตำแหน่งหุ่นยนต์รวมเอฟเฟกต์ลอยตัว
    bot.style.transform = `translate3d(${bX}px, ${bY + bounceOffset}px, 0)`;

    // วนลูปทำงานเรื่อยๆ อย่างลื่นไหล
    requestAnimationFrame(coreBotProcessingCycle);
}

// เริ่มเปิดสวิตช์ทำงาน
requestAnimationFrame(coreBotProcessingCycle);