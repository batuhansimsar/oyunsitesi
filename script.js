/* ============================================================
   VoidWar — Interactive JavaScript
   ============================================================ */

// ── NAV SCROLL ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ── MOBILE MENU ──
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu    = document.getElementById('mobile-menu');
mobileMenuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  mobileMenuBtn.textContent = mobileMenu.classList.contains('open') ? '✕' : '☰';
});
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    mobileMenuBtn.textContent = '☰';
  });
});

// ── PARTICLES ──
(function spawnParticles() {
  const container = document.getElementById('hero-particles');
  const colors = ['#8a5aff', '#3d9df3', '#b48cff', '#60a0f0'];
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 3 + 1;
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      box-shadow: 0 0 ${size * 3}px ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${Math.random() * 12 + 8}s;
      animation-delay: ${Math.random() * 10}s;
    `;
    container.appendChild(p);
  }
})();

// ── COUNTER ANIMATION ──
function animateCounter(el, target, duration = 2000, suffix = '') {
  const start = performance.now();
  const isLarge = target >= 1000000;
  const update = (now) => {
    const elapsed = Math.min(now - start, duration);
    const progress = elapsed / duration;
    const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.round(ease * target);

    if (isLarge) {
      el.textContent = (current / 1000000).toFixed(1) + 'M';
    } else {
      el.textContent = current.toLocaleString('tr-TR');
    }

    if (progress < 1) requestAnimationFrame(update);
    else {
      if (isLarge) el.textContent = (target / 1000000).toFixed(1) + 'M';
      else el.textContent = target.toLocaleString('tr-TR');
    }
  };
  requestAnimationFrame(update);
}

// ── INTERSECTION OBSERVER ──
const observerOptions = { threshold: 0.15 };

// Counters
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, observerOptions);

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// Reveal on scroll
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('revealed'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

// Add reveal class and observe elements
const revealTargets = [
  '.feature-card',
  '.char-card',
  '.news-card',
  '.trailer-wrapper > *',
  '.gallery-main > *',
];
revealTargets.forEach(selector => {
  document.querySelectorAll(selector).forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });
});

// Stat bars
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-fill').forEach(bar => {
        bar.style.width = bar.style.getPropertyValue('--fill') || getComputedStyle(bar).getPropertyValue('--fill');
      });
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.char-card').forEach(card => {
  // Reset fill widths initially
  card.querySelectorAll('.stat-fill').forEach(bar => {
    const fillVal = bar.style.cssText.match(/--fill:\s*([\d%]+)/)?.[1] || '0%';
    bar.setAttribute('data-fill', fillVal);
    bar.style.setProperty('--fill', fillVal);
    bar.style.width = '0%';
  });
  statObserver.observe(card);
});

// Trigger stat fill after character section is visible
const charObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.querySelectorAll('.stat-fill').forEach(bar => {
          const fill = bar.getAttribute('data-fill') || '0%';
          bar.style.width = fill;
        });
      }, 400);
      charObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.char-card').forEach(card => charObserver.observe(card));

// ── GALLERY ──
const galleryMainImg = document.getElementById('gallery-main-img');
const galleryCaption = document.getElementById('gallery-caption');

document.querySelectorAll('.gallery-thumb').forEach(thumb => {
  thumb.addEventListener('click', () => {
    document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');

    const newSrc = thumb.dataset.img;
    const newCaption = thumb.dataset.caption || '';

    galleryMainImg.style.opacity = '0';
    galleryMainImg.style.transform = 'scale(0.98)';

    setTimeout(() => {
      galleryMainImg.src = newSrc;
      galleryMainImg.alt = thumb.querySelector('img').alt;
      const parts = newCaption.split(' — ');
      const num = parts[0] || '';
      const text = parts.slice(1).join(' — ');
      galleryCaption.innerHTML = `<span class="caption-num">${num}</span><span class="caption-text">${text}</span>`;
      galleryMainImg.style.opacity = '1';
      galleryMainImg.style.transform = 'scale(1)';
    }, 250);
  });
});

// Smooth gallery image transitions
if (galleryMainImg) {
  galleryMainImg.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
}

// ── SCROLL TO TOP ──
const scrollTopBtn = document.getElementById('scroll-top-btn');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
});
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── TRAILER BUTTON ──
const trailerPlayBtn = document.getElementById('trailer-play-btn');
if (trailerPlayBtn) {
  trailerPlayBtn.addEventListener('click', () => {
    // Simulate YouTube embed (replace with real URL in production)
    const frame = document.getElementById('trailer-frame');
    frame.innerHTML = `
      <div style="
        width:100%; height:100%;
        background:#000;
        display:flex; flex-direction:column;
        align-items:center; justify-content:center;
        border-radius: 20px;
        gap: 16px;
      ">
        <div style="font-size:3rem;">🎬</div>
        <p style="color:rgba(255,255,255,0.7); font-size:0.9rem; text-align:center; padding: 0 24px;">
          Gerçek bir oyun olsaydı, burada YouTube fragmanı oynatılırdı.<br/>
          <span style="color:#8a5aff">youtube.com/watch?v=VOIDWAR_TRAILER</span>
        </p>
        <button onclick="location.reload()" style="
          padding:10px 24px; border-radius:8px;
          background:rgba(138,90,255,0.2); border:1px solid rgba(138,90,255,0.5);
          color:#b48cff; cursor:pointer; font-size:0.85rem;
        ">← Geri Dön</button>
      </div>
    `;
  });
}

// ── ACTIVE NAV LINK ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const activeSectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}` ? '#fff' : '';
      });
    }
  });
}, { rootMargin: '-30% 0px -60% 0px' });

sections.forEach(section => activeSectionObserver.observe(section));

// ── PARALLAX ON HERO ──
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const heroBg = document.querySelector('.hero-bg-img');
  if (heroBg && scrolled < window.innerHeight) {
    heroBg.style.transform = `scale(1.05) translateY(${scrolled * 0.15}px)`;
  }
});

// ── FEATURE CARD MOUSE GLOW ──
document.querySelectorAll('.feature-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mx', `${x}%`);
    card.style.setProperty('--my', `${y}%`);
  });
});

// ── SMOOTH ANCHOR SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── PAGE LOAD ANIMATION ──
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  setTimeout(() => { document.body.style.opacity = '1'; }, 50);
});
