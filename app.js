/**
 * CHINMAY B SABARAD - PORTFOLIO INTERACTIVE SCRIPTS
 * Theme: Terminal Noir meets Editorial Print
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. CUSTOM BLOCK CURSOR WITH LERP PHYSICS
  // ==========================================================================
  const cursor = document.getElementById('custom-cursor');
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let isHovering = false;
  let isMoving = false;
  let idleTimer;

  // Track mouse position
  document.addEventListener('mousemove', (e) => {
    // Show cursor on first movement
    if (cursor.style.opacity === '0' || !cursor.style.opacity) {
      cursor.style.opacity = '1';
    }

    mouseX = e.clientX;
    mouseY = e.clientY;

    // Stop blinking when moving
    isMoving = true;
    cursor.classList.remove('cursor-blink');

    // Reset idle timer for blinking
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      isMoving = false;
      if (!isHovering) {
        cursor.classList.add('cursor-blink');
      }
    }, 400);
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });

  // Reveal cursor when entering window
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
  });

  // Lerp loop for fluid motion
  function updateCursor() {
    // Lerp calculation: CurrentPosition + (TargetPosition - CurrentPosition) * EaseFactor
    const ease = 0.16;
    cursorX += (mouseX - cursorX) * ease;
    cursorY += (mouseY - cursorY) * ease;

    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;

    requestAnimationFrame(updateCursor);
  }
  requestAnimationFrame(updateCursor);

  // Hover states over interactive elements
  const interactives = document.querySelectorAll('a, button, .email-cmd, [role="button"]');
  interactives.forEach(element => {
    element.addEventListener('mouseenter', () => {
      isHovering = true;
      cursor.classList.remove('cursor-blink');
      // Expand cursor to visually encompass elements
      cursor.style.width = '24px';
      cursor.style.height = '24px';
      cursor.style.backgroundColor = '#FFFFFF';
      cursor.style.mixBlendMode = 'difference';
    });

    element.addEventListener('mouseleave', () => {
      isHovering = false;
      cursor.style.width = '10px';
      cursor.style.height = '18px';
      cursor.style.backgroundColor = 'var(--accent-color)';
      cursor.style.mixBlendMode = 'normal';
      if (!isMoving) {
        cursor.classList.add('cursor-blink');
      }
    });
  });

  // ==========================================================================
  // 2. HERO LOOPING TYPEWRITER EFFECT
  // ==========================================================================
  const typewriterElement = document.getElementById('typewriter-text');
  const roles = ["Full-Stack Developer", "ML Engineer", "Problem Solver", "Intern-ready"];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      // Deleting text
      typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // Faster deleting speed
    } else {
      // Typing text
      typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100; // Normal typing speed
    }

    // Determine state changes
    if (!isDeleting && charIndex === currentRole.length) {
      // Pause at full word
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      // Cycle to next role
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500; // Pause before typing next word
    }

    setTimeout(type, typingSpeed);
  }

  // Kickstart typewriter
  if (typewriterElement) {
    setTimeout(type, 1000);
  }

  // ==========================================================================
  // 3. STICKY HEADER & ACTIVE SECTION NAV TRACKING
  // ==========================================================================
  const header = document.getElementById('main-header');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    // Header styling on scroll
    if (window.scrollY > 40) {
      header.classList.remove('header-minimal');
      header.classList.add('header-full');
    } else {
      header.classList.remove('header-full');
      header.classList.add('header-minimal');
    }

    // Scroll Spy active navigation item
    let currentActiveSectionId = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120; // Offset for header height
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentActiveSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentActiveSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // ==========================================================================
  // 4. INTERSECTION OBSERVER FOR SCROLL REVEALS
  // ==========================================================================
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        // Unobserve to trigger only once
        observer.unobserve(entry.target);
      }
    });
  };

  const revealOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(revealCallback, revealOptions);

  const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
  scrollRevealElements.forEach(el => {
    observer.observe(el);
  });

  // ==========================================================================
  // 5. COPY TO CLIPBOARD EMAIL INTERACTIVE COMMAND
  // ==========================================================================
  const emailButton = document.getElementById('email-btn');
  const copyHint = document.getElementById('copy-hint');

  if (emailButton) {
    emailButton.addEventListener('click', () => {
      const emailText = "sabaradchinmay2006@gmail.com";

      navigator.clipboard.writeText(emailText).then(() => {
        // Success feedback
        copyHint.textContent = "→ [copied!]";
        copyHint.style.color = "var(--accent-color)";

        // Reset feedback state
        setTimeout(() => {
          copyHint.textContent = "→ click to copy";
          copyHint.style.color = "var(--text-muted)";
        }, 2500);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    });
  }

  // ==========================================================================
  // 6. MOBILE NAVIGATION EXPAND/COLLAPSE
  // ==========================================================================
  const menuToggle = document.getElementById('menu-toggle');
  const navLinksList = document.getElementById('nav-links-list');
  const toggleIcon = menuToggle?.querySelector('.menu-icon');

  if (menuToggle && navLinksList) {
    menuToggle.addEventListener('click', () => {
      const isOpened = navLinksList.classList.toggle('mobile-open');
      menuToggle.setAttribute('aria-expanded', isOpened);

      if (toggleIcon) {
        toggleIcon.textContent = isOpened ? '[CLOSE]' : '[MENU]';
      }
    });

    // Close menu when clicking nav link
    const mobileLinks = navLinksList.querySelectorAll('.nav-link, .nav-logo');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinksList.classList.remove('mobile-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        if (toggleIcon) {
          toggleIcon.textContent = '[MENU]';
        }
      });
    });
  }

  // ==========================================================================
  // 7. INTERACTIVE CERTIFICATE MODAL LIGHTBOX
  // ==========================================================================
  const certModal = document.getElementById('certificate-modal');
  const certModalClose = document.getElementById('cert-modal-close');
  const certModalImg = document.getElementById('cert-modal-img');
  const certModalTitle = document.getElementById('cert-modal-title');
  const certModalEvent = document.getElementById('cert-modal-event');
  const certModalIssuer = document.getElementById('cert-modal-issuer');
  const certModalDate = document.getElementById('cert-modal-date');
  const certModalProject = document.getElementById('cert-modal-project');
  const certModalDownload = document.getElementById('cert-modal-download');
  const certModalFilename = document.getElementById('cert-modal-filename');

  const certificatesData = {
    nitk: {
      title: "Certificate of Appreciation — 2nd Place",
      event: "Build for Billions 24-Hour Hackathon",
      issuer: "NIT Karnataka, Web Enthusiasts' Club NITK, IET NITK & INCUBATE",
      date: "September 26–27, 2026",
      filename: "nitk_build_for_billions_award.png",
      image: "nitk_certificate.png",
      projectTitle: "Rural Micro-Enterprise AI Advisory & Financial Structuring Platform",
      projectUrl: "https://github.com/chinmay-workdesign/Rural-Entrepreneur-Financial-Advisory-BfB",
      downloadUrl: "nitk_certificate.png",
      downloadLabel: "Open Full Resolution Image ↗"
    },
    firstcommit: {
      title: "Certificate of Participation & Project Shipped",
      event: "Bharat Builds Tour · First Commit (Event 01)",
      issuer: "WeMakeDevs with AWS (Amazon Web Services) — Presented by Kunal Kushwaha",
      date: "September 20, 2026",
      filename: "first_commit_aws_certificate.png",
      image: "first_commit_certificate.png",
      projectTitle: "Vitalis — Enterprise Serverless Healthcare Workflow Automation Platform",
      projectUrl: "https://github.com/amoghsamji/Vitalis",
      downloadUrl: "first_commit_certificate.pdf",
      downloadLabel: "Download Original PDF Certificate ↗"
    }
  };

  function attachCursorHover(elements) {
    elements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        isHovering = true;
        cursor.classList.remove('cursor-blink');
        cursor.style.width = '24px';
        cursor.style.height = '24px';
        cursor.style.backgroundColor = '#FFFFFF';
        cursor.style.mixBlendMode = 'difference';
      });

      element.addEventListener('mouseleave', () => {
        isHovering = false;
        cursor.style.width = '10px';
        cursor.style.height = '18px';
        cursor.style.backgroundColor = 'var(--accent-color)';
        cursor.style.mixBlendMode = 'normal';
        if (!isMoving) {
          cursor.classList.add('cursor-blink');
        }
      });
    });
  }

  function openCertModal(certId) {
    const data = certificatesData[certId];
    if (!data || !certModal) return;

    if (certModalTitle) certModalTitle.textContent = data.title;
    if (certModalEvent) certModalEvent.textContent = data.event;
    if (certModalIssuer) certModalIssuer.textContent = data.issuer;
    if (certModalDate) certModalDate.textContent = data.date;
    if (certModalFilename) certModalFilename.textContent = data.filename;

    if (certModalImg) {
      certModalImg.src = data.image;
      certModalImg.alt = `${data.title} - Chinmay B Sabarad`;
    }

    if (certModalProject) {
      certModalProject.href = data.projectUrl;
      certModalProject.textContent = `→ View Project on GitHub`;
    }

    if (certModalDownload) {
      certModalDownload.href = data.downloadUrl;
      certModalDownload.textContent = data.downloadLabel;
      certModalDownload.setAttribute('target', '_blank');
      certModalDownload.setAttribute('rel', 'noopener noreferrer');
    }

    certModal.classList.add('active');
    certModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCertModal() {
    if (!certModal) return;
    certModal.classList.remove('active');
    certModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Trigger modal open on clicks
  const certTriggers = document.querySelectorAll('[data-open-cert]');
  certTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const certId = trigger.getAttribute('data-open-cert');
      openCertModal(certId);
    });
  });

  if (certModalClose) {
    certModalClose.addEventListener('click', closeCertModal);
  }

  if (certModal) {
    certModal.addEventListener('click', (e) => {
      if (e.target === certModal) {
        closeCertModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && certModal.classList.contains('active')) {
        closeCertModal();
      }
    });

    // Ensure buttons inside modal work with custom cursor
    attachCursorHover(certModal.querySelectorAll('a, button'));
  }

});
