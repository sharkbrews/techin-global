/**
 * TECHIN GLOBAL HYDRAULICS AND ENGINEERING - INTERACTIVE ENGINE
 * High-performance vanilla JS modules for animations, calculators, and UI interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroCanvas();
  initNavbar();
  initStatsCounters();
  initServicesFilter();
  initQuoteCalculator();
  initTestimonialSlider();
  initContactForm();
  initScrollAnimations();
  initBackToTop();
});

/* ==========================================================================
   1. HERO CANVAS: DYNAMIC HYDRAULIC CIRCUIT & FLUID FLOW ANIMATION
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
    const count = Math.floor(width / 130);
    
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1.5,
        type: Math.random() > 0.8 ? 'valve' : 'junction'
      });
    }

    // Fluid particles moving along lines
    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: Math.random() * 1.5 + 0.8,
        size: Math.random() * 2 + 1,
        color: Math.random() > 0.4 ? '#ff8400' : '#00b4d8'
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting schematic conduit lines
    ctx.lineWidth = 0.8;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 180) {
          const alpha = (1 - dist / 180) * 0.22;
          ctx.strokeStyle = `rgba(0, 180, 216, ${alpha})`;
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
      ctx.fillStyle = node.type === 'valve' ? 'rgba(255, 132, 0, 0.7)' : 'rgba(148, 163, 184, 0.4)';
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
      ctx.shadowBlur = 8;
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
   2. NAVBAR STICKY, MOBILE MENU & SCROLLSPY
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const mobileBtn = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-link');

  // Sticky navbar shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
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
        `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>` : 
        `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`;
    });

    // Close mobile menu on link click
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`;
      });
    });
  }

  // Active section scrollspy
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 140;
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
   3. ANIMATED NUMBER COUNTERS (INTERSECTION OBSERVER)
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
   4. SERVICES CATEGORY FILTER
   ========================================================================== */
function initServicesFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.service-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat.includes(category)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   5. INTERACTIVE HYDRAULIC QUOTE ESTIMATOR
   ========================================================================== */
function initQuoteCalculator() {
  const equipSelect = document.getElementById('calc-equipment');
  const serviceChips = document.querySelectorAll('.calc-chip');
  const estimateOutput = document.getElementById('calc-price-est');
  const timeOutput = document.getElementById('calc-time-est');
  const directQuoteBtn = document.getElementById('calc-apply-quote');

  if (!equipSelect || !estimateOutput) return;

  let selectedService = 'overhaul';

  serviceChips.forEach(chip => {
    chip.addEventListener('click', () => {
      serviceChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      selectedService = chip.getAttribute('data-service');
      recalculate();
    });
  });

  equipSelect.addEventListener('change', recalculate);

  function recalculate() {
    const equip = equipSelect.value;
    let turnaround = '24–48 Hours';
    let label = 'Comprehensive Overhaul & Hydrostatic Test';

    if (selectedService === 'inspection') {
      turnaround = 'Within 12–24 Hours';
      label = 'Dimensional Metrology & NDT Testing';
    } else if (selectedService === 'overhaul') {
      turnaround = '3 to 5 Working Days';
      label = 'Complete Rebuild, Lapping & Pressure Proofing';
    } else if (selectedService === 'emergency') {
      turnaround = 'Priority 24-Hour Emergency Bay';
      label = 'Round-the-clock Emergency Overhaul Mobilization';
    } else if (selectedService === 'amc') {
      turnaround = 'Annual Scheduled & Preventive Matrix';
      label = 'Yearly SLA with Dedicated Mobile Team';
    }

    if (equip.includes('railway')) {
      turnaround += ' (RDSO Benchmarked)';
    }

    estimateOutput.textContent = label;
    if (timeOutput) timeOutput.textContent = turnaround;
  }

  // Hooking to form prefill
  if (directQuoteBtn) {
    directQuoteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceRequiredInput = document.getElementById('contact-service');
      const messageInput = document.getElementById('contact-message');
      const contactSection = document.getElementById('contact');

      if (serviceRequiredInput) {
        serviceRequiredInput.value = equipSelect.options[equipSelect.selectedIndex].text;
      }
      if (messageInput) {
        messageInput.value = `Inquiry regarding ${equipSelect.options[equipSelect.selectedIndex].text} - Service Type: ${selectedService.toUpperCase()}. Please provide comprehensive quote and testing schedule.`;
      }

      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        showToast(`Quote details pre-filled for ${equipSelect.options[equipSelect.selectedIndex].text}!`);
      }
    });
  }

  recalculate();
}

/* ==========================================================================
   6. TESTIMONIAL SLIDER CAROUSEL
   ========================================================================== */
function initTestimonialSlider() {
  const testimonials = [
    {
      text: "Techin Global overhauled our 450-Ton wheel demounting hydraulic press and bogie lifting units with utmost precision. Their hydrostatic test certification met Indian Railways RDSO standards flawlessly.",
      author: "Er. Rajesh K. Sharma",
      role: "Senior Section Engineer (Mechanical), Northern Railway Carriage & Wagon Workshop",
      avatar: "RS"
    },
    {
      text: "We had a critical breakdown on our heavy stamping hydraulic press power pack. The Techin Global team mobilized within 4 hours, swapped radial piston seals, lapped spool valves, and eliminated machine downtime.",
      author: "Vikramaditya Rao",
      role: "VP Maintenance & Operations, Apex Heavy Forgings Ltd.",
      avatar: "VR"
    },
    {
      text: "Outstanding expertise in hydraulic motors and proportional control valves. Their pressure testing bay capable of 700 Bar provides 100% confidence before equipment re-installation.",
      author: "Anand M. Pillai",
      role: "Chief Technical Officer, Southern Marine & Heavy Infrastructure",
      avatar: "AP"
    },
    {
      text: "Servicing our track maintenance tamper hydraulics was completed in record time. Zero hydraulic fluid leakage and responsive post-delivery support across all our divisional sites.",
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
   7. CONTACT FORM SUBMISSION & QUICK ACTIONS
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('main-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const phone = document.getElementById('contact-phone').value.trim();
    const service = document.getElementById('contact-service').value;

    if (!name || !email || !phone) {
      showToast('Please fill out all required contact fields.', true);
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span>Processing Request...</span>`;
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = `<span>✓ Inquiry Dispatched Successfully</span>`;
      submitBtn.style.background = '#10b981';
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
   8. TOAST NOTIFICATION UTILITY
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
   9. SCROLL ANIMATIONS (INTERSECTION OBSERVER)
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
   10. BACK TO TOP BUTTON
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
