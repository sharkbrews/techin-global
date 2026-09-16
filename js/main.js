/**
 * TECHIN GLOBAL HYDRAULICS AND ENGINEERING - INTERACTIVE ENGINE
 * High-performance vanilla JS modules for animations, calculators, filters, and UI interactions
 * Light-theme first with theme switcher support
 */

function initializeApp() {
  try { initThemeToggle(); } catch (e) { console.error("Theme toggle error:", e); }
  try { initHeroCanvas(); } catch (e) { console.error("Canvas error:", e); }
  try { initNavbar(); } catch (e) { console.error("Navbar error:", e); }
  try { initStatsCounters(); } catch (e) { console.error("Stats counter error:", e); }
  try { initServicesFilter(); } catch (e) { console.error("Filter error:", e); }
  try { initQuoteCalculator(); } catch (e) { console.error("Calculator error:", e); }
  try { initTestimonialSlider(); } catch (e) { console.error("Testimonial slider error:", e); }
  try { initContactForm(); } catch (e) { console.error("Contact form error:", e); }
  try { initScrollAnimations(); } catch (e) { console.error("Scroll animation error:", e); }
  try { initBackToTop(); } catch (e) { console.error("BackToTop error:", e); }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

/* ==========================================================================
   1. THEME TOGGLE (LIGHT DEFAULT WITH OPTIONAL DARK MODE)
   ========================================================================== */
function initThemeToggle() {
  const savedTheme = localStorage.getItem('techin_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('techin_theme', next);
      updateThemeIcon(next);
      showToast(`Switched to ${next.toUpperCase()} theme.`);
    });
  });

  function updateThemeIcon(theme) {
    toggleBtns.forEach(btn => {
      if (theme === 'dark') {
        btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;
        btn.setAttribute('aria-label', 'Switch to Light Theme');
      } else {
        btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
        btn.setAttribute('aria-label', 'Switch to Dark Theme');
      }
    });
  }
}

/* ==========================================================================
   2. HERO CANVAS: DYNAMIC HYDRAULIC CIRCUIT & SCHEMATIC FLOW
   ========================================================================== */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let nodes = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createNetwork();
  }

  function createNetwork() {
    nodes = [];
    particles = [];
    const count = Math.floor(width / 120);
    
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 2 + 1.5,
        type: Math.random() > 0.75 ? 'valve' : 'junction'
      });
    }

    // Fluid particles moving along lines
    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: Math.random() * 1.5 + 0.8,
        size: Math.random() * 2.5 + 1,
        color: Math.random() > 0.4 ? '#ea580c' : '#0284c7'
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting schematic conduit lines
    ctx.lineWidth = 0.9;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 180) {
          const alpha = (1 - dist / 180) * 0.25;
          ctx.strokeStyle = `rgba(2, 132, 199, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Update and draw schematic nodes
    nodes.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = node.type === 'valve' ? 'rgba(234, 88, 12, 0.75)' : 'rgba(100, 116, 139, 0.4)';
      ctx.fill();
    });

    // Draw high-pressure fluid pulses
    particles.forEach(p => {
      p.y -= p.speed;
      if (p.y < 0) {
        p.y = height;
        p.x = Math.random() * width;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 6;
      ctx.shadowColor = p.color;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
}

/* ==========================================================================
   3. NAVBAR STICKY, MOBILE MENU, DROPDOWN & SCROLLSPY
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const mobileBtn = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-link:not(.dropdown-toggle)');
  const dropdownToggle = document.querySelector('.dropdown-toggle');
  const dropdownMenu = document.querySelector('.dropdown-menu');

  // Sticky navbar shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const isOpen = navLinks.classList.contains('active');
      mobileBtn.innerHTML = isOpen ? 
        `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>` : 
        `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`;
    });

    // Close mobile menu on link click
    const allMenuLinks = navLinks.querySelectorAll('a');
    allMenuLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 860) {
          navLinks.classList.remove('active');
          mobileBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`;
        }
      });
    });
  }

  // Mobile touch support for dropdown toggle
  if (dropdownToggle && dropdownMenu) {
    dropdownToggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 860) {
        e.preventDefault();
        dropdownMenu.classList.toggle('show');
      }
    });
  }

  // Active section scrollspy
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 160;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        links.forEach(l => {
          l.classList.remove('active');
          if (l.getAttribute('href') === `#${id}`) {
            l.classList.add('active');
          }
        });
      }
    });
  });
}

/* ==========================================================================
   4. ANIMATED NUMBER COUNTERS (INTERSECTION OBSERVER)
   ========================================================================== */
function initStatsCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetVal = parseInt(el.getAttribute('data-target'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1800;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out expo
          const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const currentVal = Math.floor(easeOut * targetVal);

          el.innerHTML = `${currentVal}<span class="counter-accent">${suffix}</span>`;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.innerHTML = `${targetVal}<span class="counter-accent">${suffix}</span>`;
          }
        }

        requestAnimationFrame(updateCounter);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.4 });

  statNumbers.forEach(stat => observer.observe(stat));
}

/* ==========================================================================
   5. SERVICES CATEGORY FILTER (TROUBLESHOOTING & REPAIR + REFURBISHMENT + RAILWAYS)
   ========================================================================== */
window.filterServices = function(category) {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.service-card');

  filterBtns.forEach(btn => {
    if (btn.getAttribute('data-filter') === category) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  cards.forEach(card => {
    const cardCat = card.getAttribute('data-category') || '';
    const cardPillar = card.getAttribute('data-pillar') || '';
    const isMatch = (category === 'all' || cardCat.includes(category) || cardPillar.includes(category));

    if (isMatch) {
      card.classList.remove('filter-hidden');
      card.style.display = 'flex';
      card.style.opacity = '1';
      card.style.visibility = 'visible';
    } else {
      card.classList.add('filter-hidden');
      card.style.display = 'none';
      card.style.opacity = '0';
    }
  });
};

function initServicesFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const category = btn.getAttribute('data-filter') || 'all';
      window.filterServices(category);
    });
  });
}

/* ==========================================================================
   6. INTERACTIVE HYDRAULIC QUOTE ESTIMATOR & COST CALCULATOR
   ========================================================================== */
window.calcSelectedScope = 'overhaul';
window.calcSelectedPressure = '250';

window.setCalcScope = function(btnEl, scope) {
  window.calcSelectedScope = scope;
  document.querySelectorAll('.calc-scope-chip').forEach(c => c.classList.remove('active'));
  if (btnEl) {
    btnEl.classList.add('active');
  } else {
    const matchingBtn = document.querySelector(`.calc-scope-chip[data-service="${scope}"]`);
    if (matchingBtn) matchingBtn.classList.add('active');
  }
  window.calculateQuote();
};

window.setCalcPressure = function(btnEl, pressure) {
  window.calcSelectedPressure = pressure;
  document.querySelectorAll('.calc-pressure-chip').forEach(c => c.classList.remove('active'));
  if (btnEl) {
    btnEl.classList.add('active');
  } else {
    const matchingBtn = document.querySelector(`.calc-pressure-chip[data-pressure="${pressure}"]`);
    if (matchingBtn) matchingBtn.classList.add('active');
  }
  window.calculateQuote();
};

window.calculateQuote = function() {
  const equipSelect = document.getElementById('calc-equipment');
  const priceOutput = document.getElementById('calc-price-est');
  const protocolOutput = document.getElementById('calc-protocol-est');
  const timeOutput = document.getElementById('calc-time-est');

  if (!equipSelect || !priceOutput) return;

  const equipKey = equipSelect.value;
  const scope = window.calcSelectedScope || 'overhaul';
  const pressure = window.calcSelectedPressure || '250';

  const equipmentData = {
    'cylinder-honing': { min: 18000, max: 42000, name: 'Hydraulic Cylinder & Piston Refurbishment / Honing' },
    'axial-pump': { min: 28000, max: 68000, name: 'Hydraulic Pump & Motor Overhauling (Rexroth / Eaton / Parker)' },
    'fault-diagnosis': { min: 12000, max: 28000, name: 'Mechanical, Hydraulic & Electrical Fault Diagnosis' },
    'pressure-flow': { min: 15000, max: 35000, name: 'Hydraulic Pressure & Flow Problem Solving' },
    'control-panels': { min: 16000, max: 40000, name: 'Electrical Control Panels, Sensors & Solenoids' },
    'gearbox-drive': { min: 32000, max: 75000, name: 'Gearbox & Reduction Drive Overhauling / Shaft Reconditioning' },
    'seal-kit': { min: 9500, max: 24000, name: 'Seal Kit Replacement & Hydraulic Seal Renewal' },
    'power-pack': { min: 25000, max: 60000, name: 'Hydraulic Power Unit (HPU) / Integrated Manifold Block' },
    'railway-jacks': { min: 48000, max: 110000, name: 'Indian Railways Bogie Lifting Jacks / Synchronized Rig' },
    'railway-wheelpress': { min: 65000, max: 145000, name: 'Indian Railways Wheel-Axle Press Hydraulic System' },
    'heavy-press': { min: 75000, max: 180000, name: 'Heavy Industrial Forging / Stamping Hydraulic Press (> 500T)' }
  };

  const scopeData = {
    'diagnostic': {
      multiplier: 0.45,
      time: 'Within 12–24 Hours',
      protocol: 'Dynamic Sensor Profiling, Acoustic Cavitation & Megger Insulation Testing'
    },
    'overhaul': {
      multiplier: 1.0,
      time: '3 to 5 Working Days',
      protocol: 'Precision Teardown, Honing/Lapping, Genuine Seal Renewal & Dynamic Proofing'
    },
    'emergency': {
      multiplier: 1.35,
      time: 'Priority 24-Hour Emergency Bay',
      protocol: '24/7 Breakdown Bay Mobilization, Rapid Ultrasonic Cleaning & Emergency Rebuild'
    },
    'amc': {
      multiplier: 1.5,
      time: 'Scheduled Preventive SLA',
      protocol: 'Annual Maintenance Contract SLA with Scheduled Vibration & Oil Analysis'
    }
  };

  const pressureData = {
    '250': { multiplier: 1.0, label: '250-Bar Proof Testing' },
    '450': { multiplier: 1.15, label: '450-Bar High-Pressure Rig Verification' },
    '700': { multiplier: 1.25, label: '700-Bar (10K PSI) Computer-Logged Proofing' }
  };

  const base = equipmentData[equipKey] || { min: 20000, max: 50000, name: 'Hydraulic Component' };
  const sc = scopeData[scope] || scopeData['overhaul'];
  const pr = pressureData[pressure] || pressureData['250'];

  const minCost = Math.round((base.min * sc.multiplier * pr.multiplier) / 500) * 500;
  const maxCost = Math.round((base.max * sc.multiplier * pr.multiplier) / 500) * 500;

  let turnaround = sc.time;
  if (equipKey.includes('railway')) {
    turnaround += ' (RDSO Benchmarked)';
  }

  priceOutput.textContent = `₹${minCost.toLocaleString('en-IN')} – ₹${maxCost.toLocaleString('en-IN')}`;
  if (protocolOutput) {
    protocolOutput.textContent = `${sc.protocol} (${pr.label})`;
  }
  if (timeOutput) {
    timeOutput.textContent = turnaround;
  }
};

function initQuoteCalculator() {
  const equipSelect = document.getElementById('calc-equipment');
  const directQuoteBtn = document.getElementById('calc-apply-quote');

  if (equipSelect) {
    equipSelect.addEventListener('change', () => {
      window.calculateQuote();
    });
  }

  // Pre-fill Formal RFQ Form
  if (directQuoteBtn) {
    directQuoteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentEquip = document.getElementById('calc-equipment');
      if (!currentEquip) return;

      const equipName = currentEquip.options[currentEquip.selectedIndex].text;
      const priceText = document.getElementById('calc-price-est')?.textContent || '';
      const serviceRequiredInput = document.getElementById('contact-service');
      const messageInput = document.getElementById('contact-message');
      const contactSection = document.getElementById('contact');

      if (serviceRequiredInput) {
        serviceRequiredInput.value = equipName;
      }
      if (messageInput) {
        messageInput.value = `Inquiry regarding ${equipName}\n- Service Scope: ${(window.calcSelectedScope || 'overhaul').toUpperCase()}\n- Pressure Proofing: ${window.calcSelectedPressure || '250'} Bar\n- Estimated Budget Bracket: ${priceText}\n\nPlease confirm workshop bay slot availability and formal engineering quotation.`;
      }

      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        showToast(`Quote parameters pre-filled for ${equipName}!`);
      }
    });
  }

  window.calculateQuote();
}

// Global delegated click listener as universal fallback
document.addEventListener('click', (e) => {
  const filterBtn = e.target.closest('.filter-btn');
  if (filterBtn) {
    e.preventDefault();
    const cat = filterBtn.getAttribute('data-filter') || 'all';
    window.filterServices(cat);
    return;
  }

  const scopeChip = e.target.closest('.calc-scope-chip');
  if (scopeChip) {
    e.preventDefault();
    const sc = scopeChip.getAttribute('data-service') || 'overhaul';
    window.setCalcScope(scopeChip, sc);
    return;
  }

  const pressChip = e.target.closest('.calc-pressure-chip');
  if (pressChip) {
    e.preventDefault();
    const pr = pressChip.getAttribute('data-pressure') || '250';
    window.setCalcPressure(pressChip, pr);
    return;
  }
});

/* ==========================================================================
   7. TESTIMONIAL SLIDER CAROUSEL
   ========================================================================== */
function initTestimonialSlider() {
  const testimonials = [
    {
      text: "Techin Global overhauled our 450-Ton wheel demounting hydraulic press and synchronized bogie lifting jacks with utmost precision. Their hydrostatic test certification met Indian Railways RDSO standards flawlessly.",
      author: "Er. Rajesh K. Sharma",
      role: "Senior Section Engineer (Mechanical), Northern Railway Carriage & Wagon Workshop",
      avatar: "RS"
    },
    {
      text: "We had a critical breakdown on our heavy stamping hydraulic press power pack. The Techin Global team mobilized within 4 hours, diagnosed hydraulic pressure loss, renewed all seals, and eliminated machine downtime.",
      author: "Vikramaditya Rao",
      role: "VP Maintenance & Operations, Apex Heavy Forgings Ltd.",
      avatar: "VR"
    },
    {
      text: "Outstanding expertise in hydraulic motor overhauling, barrel lapping, and electrical control systems. Their pressure testing bay capable of 700 Bar provides 100% confidence before equipment re-installation.",
      author: "Anand M. Pillai",
      role: "Chief Technical Officer, Southern Marine & Heavy Infrastructure",
      avatar: "AP"
    },
    {
      text: "Servicing our track maintenance tamper hydraulics was completed in record time. Zero hydraulic fluid leakage and responsive post-delivery support across all our divisional loco sheds.",
      author: "Sunil Verma",
      role: "Divisional Mechanical Engineer, Western Railway Loco Shed",
      avatar: "SV"
    }
  ];

  let currentIndex = 0;
  const quoteText = document.querySelector('.testimonial-text');
  const quoteAuthor = document.querySelector('.author-details h4');
  const quoteRole = document.querySelector('.author-details p');
  const quoteAvatar = document.querySelector('.author-avatar');
  const prevBtn = document.getElementById('t-prev-btn');
  const nextBtn = document.getElementById('t-next-btn');

  if (!quoteText) return;

  function renderTestimonial(index) {
    const item = testimonials[index];
    quoteText.style.opacity = '0';
    quoteText.style.transform = 'translateY(10px)';

    setTimeout(() => {
      quoteText.textContent = `“${item.text}”`;
      if (quoteAuthor) quoteAuthor.textContent = item.author;
      if (quoteRole) quoteRole.textContent = item.role;
      if (quoteAvatar) quoteAvatar.textContent = item.avatar;

      quoteText.style.opacity = '1';
      quoteText.style.transform = 'translateY(0)';
      quoteText.style.transition = 'all 0.3s ease';
    }, 200);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
      renderTestimonial(currentIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % testimonials.length;
      renderTestimonial(currentIndex);
    });
  }

  // Auto rotate every 7 seconds
  setInterval(() => {
    currentIndex = (currentIndex + 1) % testimonials.length;
    renderTestimonial(currentIndex);
  }, 7000);
}

/* ==========================================================================
   8. CONTACT FORM SUBMISSION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('main-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const phone = document.getElementById('contact-phone').value.trim();

    if (!name || !email || !phone) {
      showToast('Please fill out all required contact fields.', true);
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span>Processing Request...</span>`;
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = `<span>✓ Inquiry Dispatched to Engineering Team</span>`;
      submitBtn.style.background = '#059669';
      showToast(`Thank you ${name}! Our senior hydraulic engineers will contact you within 2 hours.`);
      form.reset();

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 4000);
    }, 1200);
  });
}

/* ==========================================================================
   9. TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(message, isError = false) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.style.borderColor = isError ? '#ef4444' : 'var(--accent-amber)';
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${isError ? '#ef4444' : 'var(--accent-amber)'}" stroke-width="2">
      ${isError ? '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>' : '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'}
    </svg>
    <span>${message}</span>
  `;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}

/* ==========================================================================
   10. SCROLL ANIMATIONS (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  if (!animatedElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  animatedElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   11. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const btn = document.querySelector('.fab-back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
