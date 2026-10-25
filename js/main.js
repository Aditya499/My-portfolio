/**
 * Aditya Portfolio - Interactive Animations & Logic Engine
 * Modern Vanilla JavaScript (ES6+)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modular components
  initCyberCanvas();
  initCursorFollower();
  initTypingEffect();
  initThemeSwitcher();
  initAudioEffects();
  initTiltEffect();
  initSkillsFilter();
  initModals();
  initApiSimulator();
  initContactForm();
  initScrollNav();
  initMetricCounters();
});

/* ==========================================================================
   1. CYBER CANVAS - CONNECTED CONSTELLATION NETWORK
   ========================================================================== */
function initCyberCanvas() {
  const canvas = document.getElementById('cyber-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 14000), 85);
  const maxDistance = 120;
  let mouse = { x: null, y: null, radius: 140 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2 + 1;
      this.baseAlpha = Math.random() * 0.45 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      // Mouse repulsion
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 3;
          this.y -= (dy / dist) * force * 3;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 242, 254, ${this.baseAlpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const alpha = (1 - dist / maxDistance) * 0.22;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. CUSTOM CURSOR GLOW FOLLOWER
   ========================================================================== */
function initCursorFollower() {
  const cursorGlow = document.getElementById('cursor-glow');
  const cursorDot = document.getElementById('cursor-dot');
  if (!cursorGlow || !cursorDot) return;

  let mouseX = -100, mouseY = -100;
  let glowX = -100, glowY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  function renderCursor() {
    glowX += (mouseX - glowX) * 0.12;
    glowY += (mouseY - glowY) * 0.12;
    cursorGlow.style.left = `${glowX}px`;
    cursorGlow.style.top = `${glowY}px`;
    requestAnimationFrame(renderCursor);
  }
  renderCursor();
}

/* ==========================================================================
   3. DYNAMIC TYPING EFFECT
   ========================================================================== */
function initTypingEffect() {
  const typingElement = document.getElementById('typing-text');
  if (!typingElement) return;

  const phrases = [
    'Enterprise .NET & Angular Solutions',
    'High-Throughput ASP.NET Core APIs',
    'Secure Role-Based JWT Architectures',
    'Scalable SQL Server & EF Core Systems',
    'Clean Code & Modern Web Experiences'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 70;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 35;
    } else {
      typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 75;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      typingSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400; // Pause before typing new phrase
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   4. THEME ACCENT SWITCHER
   ========================================================================== */
function initThemeSwitcher() {
  const themeDots = document.querySelectorAll('.color-dot');
  const savedTheme = localStorage.getItem('aditya-portfolio-theme') || 'cyan';

  setTheme(savedTheme);

  themeDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const color = dot.getAttribute('data-color');
      setTheme(color);
      playSyntheticBlip(550, 0.04);
    });
  });

  function setTheme(theme) {
    document.body.classList.remove('theme-cyan', 'theme-purple', 'theme-emerald');
    document.body.classList.add(`theme-${theme}`);

    themeDots.forEach((d) => {
      d.classList.toggle('active', d.getAttribute('data-color') === theme);
    });

    localStorage.setItem('aditya-portfolio-theme', theme);
  }
}

/* ==========================================================================
   5. WEB AUDIO API SYNTHESIZER (MICRO INTERACTION AUDIO FEEDBACK)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = false;

function initAudioEffects() {
  const soundBtn = document.getElementById('sound-toggle-btn');
  const soundIcon = document.getElementById('sound-icon');
  if (!soundBtn) return;

  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundBtn.classList.toggle('sound-on', soundEnabled);

    if (soundEnabled) {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
      }
      soundIcon.className = 'fa-solid fa-volume-high';
      showToast('Sound feedback enabled', 'info');
      playSyntheticBlip(600, 0.08);
    } else {
      soundIcon.className = 'fa-solid fa-volume-xmark';
      showToast('Sound feedback muted', 'info');
    }
  });

  // Attach subtle blip to buttons
  document.querySelectorAll('button, .nav-link, .btn-primary, .btn-secondary').forEach((elem) => {
    elem.addEventListener('mouseenter', () => {
      if (soundEnabled) playSyntheticBlip(880, 0.02);
    });
  });
}

function playSyntheticBlip(freq = 600, duration = 0.05) {
  if (!soundEnabled || !audioCtx) return;
  try {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (err) {
    // Ignore audio autoplay restrictions
  }
}

/* ==========================================================================
   6. 3D TILT EFFECT ON CARDS
   ========================================================================== */
function initTiltEffect() {
  if (window.innerWidth < 992) return; // Skip on mobile/touch devices

  const tiltCards = document.querySelectorAll('[data-tilt]');

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/* ==========================================================================
   7. SKILLS FILTERING & SEARCH
   ========================================================================== */
function initSkillsFilter() {
  const tabs = document.querySelectorAll('.skill-tab-btn');
  const searchInput = document.getElementById('skills-search');
  const skillCards = document.querySelectorAll('.skill-card');

  let currentCategory = 'all';
  let searchQuery = '';

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      currentCategory = tab.getAttribute('data-filter');
      filterSkills();
      playSyntheticBlip(700, 0.03);
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      filterSkills();
    });
  }

  function filterSkills() {
    skillCards.forEach((card) => {
      const categories = card.getAttribute('data-category').split(' ');
      const searchData = (card.getAttribute('data-skill') || '').toLowerCase();
      const title = (card.querySelector('.skill-name')?.textContent || '').toLowerCase();

      const matchesCategory = currentCategory === 'all' || categories.includes(currentCategory);
      const matchesSearch = !searchQuery || searchData.includes(searchQuery) || title.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.classList.remove('hidden');
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
      } else {
        card.classList.add('hidden');
      }
    });
  }
}

/* ==========================================================================
   8. MODALS (Project Deep Dive & Resume/CV)
   ========================================================================== */
function initModals() {
  // MedConnect Project Modal
  const projectModal = document.getElementById('project-modal');
  const openMedConnectBtns = [
    document.getElementById('open-medconnect-modal'),
    document.getElementById('open-medconnect-modal-btn'),
    document.getElementById('open-live-preview-btn')
  ];
  const closeMedConnectBtns = [
    document.getElementById('modal-close-btn'),
    document.getElementById('modal-close-action-btn')
  ];

  openMedConnectBtns.forEach((btn) => {
    if (btn) {
      btn.addEventListener('click', () => {
        openModal(projectModal);
        playSyntheticBlip(500, 0.06);
      });
    }
  });

  closeMedConnectBtns.forEach((btn) => {
    if (btn) {
      btn.addEventListener('click', () => {
        closeModal(projectModal);
        playSyntheticBlip(400, 0.04);
      });
    }
  });

  // CV Modal
  const cvModal = document.getElementById('cv-modal');
  const openCvBtns = [
    document.getElementById('open-cv-modal'),
    document.getElementById('btn-download-cv')
  ];
  const closeCvBtns = [
    document.getElementById('cv-modal-close-btn'),
    document.getElementById('cv-modal-close-action-btn')
  ];
  const printCvBtn = document.getElementById('btn-print-cv');

  openCvBtns.forEach((btn) => {
    if (btn) {
      btn.addEventListener('click', () => {
        openModal(cvModal);
        playSyntheticBlip(550, 0.05);
      });
    }
  });

  closeCvBtns.forEach((btn) => {
    if (btn) {
      btn.addEventListener('click', () => {
        closeModal(cvModal);
        playSyntheticBlip(400, 0.04);
      });
    }
  });

  if (printCvBtn) {
    printCvBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Backdrop click to close
  [projectModal, cvModal].forEach((modal) => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
    }
  });

  // Escape key listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(projectModal);
      closeModal(cvModal);
    }
  });

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

/* ==========================================================================
   9. INTERACTIVE API & JWT SIMULATOR
   ========================================================================== */
function initApiSimulator() {
  const endpointSelect = document.getElementById('api-endpoint-select');
  const executeBtn = document.getElementById('btn-execute-api');
  const methodBadge = document.getElementById('current-method');
  const requestHeaderPreview = document.getElementById('request-header-preview');
  const requestBodyPreview = document.getElementById('request-body-preview');
  const responseStatusBadge = document.getElementById('response-status-badge');
  const responseLatency = document.getElementById('response-latency');
  const responseBodyPreview = document.getElementById('response-body-preview');

  if (!endpointSelect || !executeBtn) return;

  const mockEndpoints = {
    get_doctors: {
      method: 'GET',
      headers: `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
Accept: application/json
Host: medconnect-api.internal
User-Agent: Angular/17.0.0 (HttpClient)`,
      requestBody: `// No request body required for GET endpoint`,
      statusCode: '200 OK',
      statusClass: 'status-200',
      response: {
        statusCode: 200,
        status: "Success",
        totalDoctors: 2,
        data: [
          {
            doctorId: 101,
            fullName: "Dr. Alex Thompson",
            specialization: "Cardiology",
            department: "Cardiac Sciences",
            availableDays: ["Monday", "Wednesday", "Friday"],
            consultationFee: 120.00,
            rating: 4.9
          },
          {
            doctorId: 102,
            fullName: "Dr. Sarah Evans",
            specialization: "Pediatrics",
            department: "Child Healthcare",
            availableDays: ["Tuesday", "Thursday", "Saturday"],
            consultationFee: 110.00,
            rating: 4.95
          }
        ],
        timestamp: new Date().toISOString()
      }
    },
    get_appointments: {
      method: 'GET',
      headers: `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
X-User-Role: Patient
Accept: application/json`,
      requestBody: `// No request body required for GET endpoint`,
      statusCode: '200 OK',
      statusClass: 'status-200',
      response: {
        statusCode: 200,
        status: "Success",
        patientId: "PAT-9941",
        bookings: [
          {
            appointmentId: "APT-8820",
            doctor: "Dr. Alex Thompson",
            specialization: "Cardiology",
            scheduledDateTime: "2026-10-28T10:30:00Z",
            status: "Confirmed",
            roomNumber: "Suite 402",
            isPaid: true
          },
          {
            appointmentId: "APT-8805",
            doctor: "Dr. Maria Garcia",
            specialization: "General Practice",
            scheduledDateTime: "2026-10-15T14:00:00Z",
            status: "Completed",
            prescriptionRef: "RX-10294"
          }
        ],
        timestamp: new Date().toISOString()
      }
    },
    post_appointment: {
      method: 'POST',
      headers: `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
Accept: application/json`,
      requestBody: `{
  "doctorId": 101,
  "appointmentDate": "2026-10-30",
  "timeSlot": "11:15 AM",
  "reasonForVisit": "Quarterly cardiovascular checkup",
  "departmentId": 3,
  "paymentMethod": "CreditCard"
}`,
      statusCode: '201 Created',
      statusClass: 'status-200',
      response: {
        statusCode: 201,
        status: "Created",
        message: "Appointment successfully booked and confirmation SMS/Email dispatched.",
        appointmentReference: "APT-" + Math.floor(1000 + Math.random() * 9000),
        bookingDetails: {
          doctorId: 101,
          doctorName: "Dr. Alex Thompson",
          timeSlot: "11:15 AM",
          date: "2026-10-30",
          status: "Confirmed",
          verificationCode: "MC-7892"
        },
        timestamp: new Date().toISOString()
      }
    },
    get_doctor_availability: {
      method: 'GET',
      headers: `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Accept: application/json`,
      requestBody: `// No request body required for GET endpoint`,
      statusCode: '200 OK',
      statusClass: 'status-200',
      response: {
        doctorId: 104,
        doctorName: "Dr. Ben Carter",
        department: "Cardiology",
        date: "2026-10-26",
        availableSlots: [
          { slot: "09:00 AM", isAvailable: true },
          { slot: "09:45 AM", isAvailable: false },
          { slot: "10:30 AM", isAvailable: true },
          { slot: "02:00 PM", isAvailable: true },
          { slot: "03:15 PM", isAvailable: true }
        ],
        timestamp: new Date().toISOString()
      }
    },
    jwt_claims: {
      method: 'INSPECT',
      headers: `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
X-Signature-Algorithm: HMAC-SHA256`,
      requestBody: `// Token payload claims extracted by ASP.NET Core JWT Middleware`,
      statusCode: '200 Decoded',
      statusClass: 'status-200',
      response: {
        header: {
          alg: "HS256",
          typ: "JWT"
        },
        payload: {
          sub: "aditya.dev@medconnect.internal",
          name: "Aditya",
          roles: ["Admin", "SystemArchitect"],
          permissions: [
            "Appointments.Create",
            "Appointments.Read",
            "Appointments.Update",
            "Doctors.Manage",
            "Records.Access"
          ],
          iss: "https://medconnect.internal/auth",
          aud: "https://medconnect.internal/api",
          exp: Math.floor(Date.now() / 1000) + 3600,
          nbf: Math.floor(Date.now() / 1000)
        },
        status: "Cryptographic signature validated successfully"
      }
    }
  };

  function updateView() {
    const selectedKey = endpointSelect.value;
    const item = mockEndpoints[selectedKey];
    if (!item) return;

    methodBadge.textContent = item.method;
    methodBadge.className = 'badge-http-method ' + item.method.toLowerCase();
    requestHeaderPreview.textContent = item.headers;
    requestBodyPreview.textContent = item.requestBody;
  }

  endpointSelect.addEventListener('change', updateView);
  updateView();

  executeBtn.addEventListener('click', () => {
    const selectedKey = endpointSelect.value;
    const item = mockEndpoints[selectedKey];
    if (!item) return;

    executeBtn.disabled = true;
    executeBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
    responseStatusBadge.textContent = 'Executing...';
    responseStatusBadge.className = 'status-code-badge';
    responseLatency.textContent = '...';

    const simulatedLatency = Math.floor(Math.random() * 25) + 12;

    setTimeout(() => {
      responseStatusBadge.textContent = item.statusCode;
      responseStatusBadge.className = 'status-code-badge ' + item.statusClass;
      responseLatency.textContent = `${simulatedLatency}ms`;
      responseBodyPreview.textContent = JSON.stringify(item.response, null, 2);

      executeBtn.disabled = false;
      executeBtn.innerHTML = '<i class="fa-solid fa-bolt"></i> Send Request';

      playSyntheticBlip(750, 0.05);
      showToast(`API Call completed: ${item.statusCode} (${simulatedLatency}ms)`, 'success');
    }, 380);
  });
}

/* ==========================================================================
   10. CONTACT FORM, EMAIL COPY & TOASTS
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  const btnSubmit = document.getElementById('btn-submit');
  const btnCopyEmail = document.getElementById('btn-copy-email');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const messageInput = document.getElementById('contact-message');

      let isValid = true;

      // Validate name
      if (!nameInput.value.trim()) {
        nameInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        nameInput.closest('.form-group').classList.remove('has-error');
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        emailInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        emailInput.closest('.form-group').classList.remove('has-error');
      }

      // Validate message
      if (messageInput.value.trim().length < 10) {
        messageInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        messageInput.closest('.form-group').classList.remove('has-error');
      }

      if (!isValid) {
        playSyntheticBlip(300, 0.1);
        return;
      }

      // Simulation of submission
      btnSubmit.classList.add('loading');
      btnSubmit.disabled = true;

      setTimeout(() => {
        btnSubmit.classList.remove('loading');
        btnSubmit.disabled = false;
        contactForm.reset();
        showToast('Message sent successfully! Thank you for reaching out.', 'success');
        playSyntheticBlip(800, 0.08);
      }, 1200);
    });
  }

  // Copy Email to clipboard
  if (btnCopyEmail) {
    btnCopyEmail.addEventListener('click', () => {
      const email = 'aditya.developer.dotnet@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email copied to clipboard!', 'info');
        const tooltip = btnCopyEmail.querySelector('.copy-tooltip');
        if (tooltip) {
          tooltip.textContent = 'Copied!';
          setTimeout(() => {
            tooltip.textContent = 'Copy';
          }, 2000);
        }
        playSyntheticBlip(650, 0.04);
      }).catch(() => {
        showToast('Failed to copy email', 'info');
      });
    });
  }
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-info'}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 10);

  // Auto remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3800);
}

/* ==========================================================================
   11. SCROLL SPY & NAVBAR INTERACTION
   ========================================================================== */
function initScrollNav() {
  const navbarWrapper = document.querySelector('.navbar-wrapper');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  // Sticky Navbar on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbarWrapper?.classList.add('scrolled');
    } else {
      navbarWrapper?.classList.remove('scrolled');
    }

    // Scroll spy for active section highlight
    const scrollPos = window.scrollY + 160;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  });

  // Mobile Drawer Toggle
  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
      document.body.style.overflow = 'hidden';
      playSyntheticBlip(500, 0.03);
    });
  }

  function closeDrawer() {
    if (mobileDrawer) {
      mobileDrawer.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', closeDrawer);
  }

  drawerLinks.forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ==========================================================================
   12. METRIC COUNTERS ANIMATION
   ========================================================================== */
function initMetricCounters() {
  const metrics = document.querySelectorAll('.metric-number');
  let animated = false;

  function runCounters() {
    metrics.forEach((metric) => {
      const target = parseFloat(metric.getAttribute('data-target'));
      if (isNaN(target)) return;

      const isDecimal = target % 1 !== 0;
      let start = 0;
      const duration = 1500;
      const stepTime = 25;
      const steps = duration / stepTime;
      const increment = target / steps;

      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          metric.textContent = isDecimal ? target.toFixed(2) : Math.round(target) + (metric.textContent.includes('%') ? '%' : '+');
          clearInterval(timer);
        } else {
          metric.textContent = isDecimal ? start.toFixed(2) : Math.round(start);
        }
      }, stepTime);
    });
  }

  // Trigger on load
  setTimeout(runCounters, 300);
}
