// ============================================
// APEX MEDICAL CENTRE — CLINIC 6 SCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ── DARK MODE TOGGLE ──
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;

  const savedTheme = localStorage.getItem('apexTheme') || 'light';
  html.setAttribute('data-theme', savedTheme);
  themeToggle.textContent = savedTheme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('apexTheme', next);
    themeToggle.textContent = next === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
  });

  // ── STICKY HEADER SHADOW ──
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 40
      ? '0 4px 20px rgba(0,0,0,.12)'
      : '0 1px 3px rgba(0,0,0,.08)';
  }, { passive: true });

  // ── HAMBURGER MENU ──
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');

  hamburger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.textContent = isOpen ? '✕' : '☰';
  });

  // Close mobile nav on link click
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      hamburger.textContent = '☰';
    });
  });

  // Close nav on outside click
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) {
      nav.classList.remove('open');
      hamburger.textContent = '☰';
    }
  });

  // ── FAQ ACCORDION ──
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      // Collapse all
      document.querySelectorAll('.faq-q').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.classList.remove('open');
      });

      // Expand clicked if it was closed
      if (!isExpanded) {
        btn.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
      }
    });
  });

  // ── SCROLL REVEAL ANIMATION ──
  const revealEls = document.querySelectorAll(
    '.specialty-card, .doctor-card, .facility-card, .tech-item, .testimonial-card, .faq-item, .quick-card, .stat'
  );
  revealEls.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));

  // ── APPOINTMENT FORM ──
  const appointmentForm = document.getElementById('appointmentForm');
  if (appointmentForm) {
    // Set min date to today
    const apDate = document.getElementById('ap-date');
    if (apDate) {
      const today = new Date().toISOString().split('T')[0];
      apDate.setAttribute('min', today);
    }

    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const errorEl = document.getElementById('ap-error');
      const submitBtn = document.getElementById('ap-submit');

      const name  = document.getElementById('ap-name').value.trim();
      const phone = document.getElementById('ap-phone').value.trim();
      const dept  = document.getElementById('ap-dept').value;
      const date  = document.getElementById('ap-date').value;

      // Validation
      if (!name) { errorEl.textContent = '⚠️ Please enter the patient\'s full name.'; return; }
      if (!phone || !/^[+]?[\d\s\-]{10,14}$/.test(phone)) {
        errorEl.textContent = '⚠️ Please enter a valid phone number.'; return;
      }
      if (!dept) { errorEl.textContent = '⚠️ Please select a specialty.'; return; }
      if (!date) { errorEl.textContent = '⚠️ Please choose a preferred date.'; return; }

      errorEl.textContent = '';
      submitBtn.textContent = '⏳ Booking…';
      submitBtn.disabled = true;

      // Simulate API call
      setTimeout(() => {
        submitBtn.textContent = '✅ Appointment Confirmed!';
        submitBtn.style.background = '#16a34a';
        setTimeout(() => {
          closeModal('appointmentModal');
          appointmentForm.reset();
          submitBtn.textContent = 'Confirm Appointment';
          submitBtn.style.background = '';
          submitBtn.disabled = false;
          showNotification('Your appointment has been booked! We\'ll confirm within 2 hours via SMS.', 'success');
        }, 1800);
      }, 1500);
    });
  }

  // ── CONTACT FORM ──
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      btn.textContent = '⏳ Sending…';
      btn.disabled = true;
      setTimeout(() => {
        contactForm.reset();
        btn.textContent = '✅ Message Sent!';
        btn.style.background = '#16a34a';
        setTimeout(() => {
          btn.textContent = 'Send Message';
          btn.style.background = '';
          btn.disabled = false;
        }, 2500);
      }, 1200);
    });
  }

  // ── ANIMATED STAT COUNTERS ──
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat strong').forEach(el => {
          const target = el.textContent;
          const num = parseFloat(target.replace(/[^0-9.]/g, ''));
          const suffix = target.replace(/[\d.]/g, '');
          let current = 0;
          const increment = num / 60;
          const timer = setInterval(() => {
            current += increment;
            if (current >= num) {
              el.textContent = target;
              clearInterval(timer);
            } else {
              el.textContent = (Number.isInteger(num) ? Math.floor(current) : current.toFixed(1)) + suffix;
            }
          }, 25);
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);
});

// ── MODAL CONTROLS ──
function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  modal.querySelector('button, input, select, textarea')?.focus();
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(m => {
      m.classList.remove('active');
    });
    document.body.style.overflow = '';
  }
});

// ── SYMPTOM CHECKER ──
function checkSymptoms() {
  const input = document.getElementById('sym-input').value.trim().toLowerCase();
  const result = document.getElementById('symptom-result');

  if (!input || input.length < 5) {
    result.innerHTML = '⚠️ Please describe your symptoms in more detail.';
    result.className = 'symptom-result visible';
    return;
  }

  const rules = [
    { keywords: ['chest pain','chest pressure','shortness of breath','heart','palpitation'], dept: 'Cardiology', urgency: '🔴 HIGH', action: 'Please call 112 immediately or visit Emergency.' },
    { keywords: ['stroke','sudden weakness','face drooping','slurred speech','numbness'], dept: 'Neurology', urgency: '🔴 HIGH', action: 'This may be a stroke. Call 112 immediately — time is critical.' },
    { keywords: ['headache','migraine','dizziness','memory','seizure'], dept: 'Neurology', urgency: '🟡 MODERATE', action: 'Book a Neurology consultation within 24–48 hours.' },
    { keywords: ['fever','cold','cough','flu','sore throat','body ache'], dept: 'General Medicine', urgency: '🟢 LOW', action: 'Book a General Medicine appointment. Stay hydrated and rest.' },
    { keywords: ['joint pain','knee','hip','back pain','arthritis','swelling'], dept: 'Orthopaedics', urgency: '🟡 MODERATE', action: 'Book an Orthopaedics consultation for evaluation.' },
    { keywords: ['pregnancy','pregnant','baby','delivery','nausea morning','trimester'], dept: 'Women & Child Health', urgency: '🟡 MODERATE', action: 'Book a Women\'s Health consultation. Prenatal care is important.' },
    { keywords: ['cancer','lump','tumour','blood in stool','unexplained weight loss'], dept: 'Oncology', urgency: '🟡 MODERATE', action: 'Please book an Oncology consultation as soon as possible.' },
    { keywords: ['breathing','asthma','wheeze','lung','inhaler','copd'], dept: 'Pulmonology', urgency: '🟡 MODERATE', action: 'Book a Pulmonology appointment. Avoid triggers and use your inhaler.' },
  ];

  let matched = null;
  for (const rule of rules) {
    if (rule.keywords.some(k => input.includes(k))) { matched = rule; break; }
  }

  if (matched) {
    result.innerHTML = `
      <strong>${matched.urgency} — Suggested: ${matched.dept}</strong><br>
      ${matched.action}<br><br>
      <small>⚠️ This is an AI-assisted suggestion only. Always consult a qualified doctor.</small>
    `;
  } else {
    result.innerHTML = `
      <strong>🟡 GENERAL — Suggested: General Medicine</strong><br>
      Your symptoms didn't match a specific specialty. Please book a General Medicine consultation for a full assessment.<br><br>
      <small>⚠️ This tool is for guidance only and does not replace professional medical advice.</small>
    `;
  }

  result.className = 'symptom-result visible';
}

// ── TOAST NOTIFICATION ──
function showNotification(message, type = 'success') {
  const existing = document.getElementById('apex-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'apex-toast';
  toast.setAttribute('role', 'alert');
  toast.style.cssText = `
    position:fixed; bottom:2rem; right:2rem; z-index:9999;
    background:${type === 'success' ? '#16a34a' : '#dc2626'};
    color:#fff; padding:1rem 1.5rem; border-radius:12px;
    box-shadow:0 8px 32px rgba(0,0,0,.2); font-size:.9rem;
    font-family:Inter,sans-serif; max-width:360px; line-height:1.5;
    animation:slideUp .35s ease;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity .4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}
