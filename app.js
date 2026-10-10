/**
 * CHINMAY B SABARAD - PORTFOLIO INTERACTIVE SCRIPTS
 * Theme: Terminal Noir meets Editorial Print
 */

// ==========================================================================
// CONFIGURATION CONSTANTS
// ==========================================================================
const DEMO_VIDEO = ""; // Provide video URL (mp4 path or YouTube/Vimeo link) to enable Rural Advisor demo facade

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 0. LEGACY HASH REDIRECTS (#certificates, #credentials, #education)
  // ==========================================================================
  function handleHashRedirect() {
    const rawHash = window.location.hash ? window.location.hash.toLowerCase() : '';
    if (rawHash === '#certificates' || rawHash === '#credentials') {
      window.history.replaceState(null, '', '#projects');
      const target = document.getElementById('projects');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (rawHash === '#education') {
      window.history.replaceState(null, '', '#about');
      const target = document.getElementById('about');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  window.addEventListener('hashchange', handleHashRedirect);
  handleHashRedirect();

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
    if (cursor && (cursor.style.opacity === '0' || !cursor.style.opacity)) {
      cursor.style.opacity = '1';
    }

    mouseX = e.clientX;
    mouseY = e.clientY;

    if (cursor) {
      isMoving = true;
      cursor.classList.remove('cursor-blink');

      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        isMoving = false;
        if (!isHovering) {
          cursor.classList.add('cursor-blink');
        }
      }, 400);
    }
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    if (cursor) cursor.style.opacity = '0';
  });

  // Reveal cursor when entering window
  document.addEventListener('mouseenter', () => {
    if (cursor) cursor.style.opacity = '1';
  });

  // Lerp loop for fluid motion
  function updateCursor() {
    if (cursor) {
      const ease = 0.16;
      cursorX += (mouseX - cursorX) * ease;
      cursorY += (mouseY - cursorY) * ease;

      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
    }
    requestAnimationFrame(updateCursor);
  }
  requestAnimationFrame(updateCursor);

  function attachCursorHover(elements) {
    if (!cursor) return;
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

  // Hover states over interactive elements
  attachCursorHover(document.querySelectorAll('a, button, .email-cmd, [role="button"]'));

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
    if (!typewriterElement) return;
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500;
    }

    setTimeout(type, typingSpeed);
  }

  if (typewriterElement) {
    setTimeout(type, 1000);
  }

  // ==========================================================================
  // 3. STICKY HEADER & ACTIVE SECTION NAV TRACKING (4 SECTIONS)
  // ==========================================================================
  const header = document.getElementById('main-header');
  const sectionIds = ['about', 'projects', 'skills', 'contact'];
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (header) {
      if (window.scrollY > 40) {
        header.classList.remove('header-minimal');
        header.classList.add('header-full');
      } else {
        header.classList.remove('header-full');
        header.classList.add('header-minimal');
      }
    }

    let currentActiveSectionId = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
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
        observer.unobserve(entry.target);
      }
    });
  };

  const revealOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(revealCallback, revealOptions);
  document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));

  // ==========================================================================
  // 5. COPY TO CLIPBOARD EMAIL INTERACTIVE COMMAND
  // ==========================================================================
  const emailButton = document.getElementById('email-btn');
  const copyHint = document.getElementById('copy-hint');

  if (emailButton) {
    emailButton.addEventListener('click', () => {
      const emailText = "sabaradchinmay2006@gmail.com";
      navigator.clipboard.writeText(emailText).then(() => {
        if (copyHint) {
          copyHint.textContent = "→ [copied!]";
          copyHint.style.color = "var(--accent-color)";
          setTimeout(() => {
            copyHint.textContent = "→ click to copy";
            copyHint.style.color = "var(--text-muted)";
          }, 2500);
        }
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

    navLinksList.querySelectorAll('.nav-link, .nav-logo').forEach(link => {
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
  // 7. VISUALS & MEDIA BLOCKS (TASK 3)
  // ==========================================================================
  // 7.1 Robust image fallback: remove media block if screenshot fails to load
  document.querySelectorAll('.project-media-img, .facade-poster').forEach(img => {
    img.addEventListener('error', () => {
      const frame = img.closest('.project-media-frame');
      if (frame) frame.remove();
    });
  });

  // 7.2 Rural Advisor Video Facade (rendered conditionally based on DEMO_VIDEO)
  const ruralMediaBlock = document.getElementById('rural-media-block');
  const ruralFacade = document.getElementById('rural-facade');
  if (ruralMediaBlock) {
    if (!DEMO_VIDEO || !DEMO_VIDEO.trim()) {
      ruralMediaBlock.remove();
    } else {
      ruralMediaBlock.style.display = 'block';

      // Insert Demo button at the start of actions
      const ruralCard = ruralMediaBlock.closest('.project-card');
      const actions = ruralCard?.querySelector('.project-actions');
      if (actions && !actions.querySelector('.demo-action-btn')) {
        const demoBtn = document.createElement('a');
        demoBtn.href = DEMO_VIDEO;
        demoBtn.target = '_blank';
        demoBtn.rel = 'noopener noreferrer';
        demoBtn.className = 'project-action-btn btn-accent demo-action-btn';
        demoBtn.textContent = '→ Demo';
        actions.prepend(demoBtn);
        attachCursorHover([demoBtn]);
      }

      if (ruralFacade) {
        ruralFacade.addEventListener('click', () => {
          const viewport = ruralFacade.parentElement;
          if (!viewport) return;

          if (DEMO_VIDEO.includes('youtube.com') || DEMO_VIDEO.includes('youtu.be') || DEMO_VIDEO.includes('vimeo.com')) {
            const embedUrl = DEMO_VIDEO.includes('watch?v=')
              ? DEMO_VIDEO.replace('watch?v=', 'embed/') + '?autoplay=1'
              : DEMO_VIDEO;
            const iframe = document.createElement('iframe');
            iframe.src = embedUrl;
            iframe.title = "Rural Advisor Video Demonstration";
            iframe.className = "project-media-video";
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
            iframe.allowFullscreen = true;
            iframe.style.border = "none";
            viewport.innerHTML = '';
            viewport.appendChild(iframe);
          } else {
            const video = document.createElement('video');
            video.src = DEMO_VIDEO;
            video.controls = true;
            video.autoplay = true;
            video.className = "project-media-video";
            viewport.innerHTML = '';
            viewport.appendChild(video);
          }
        });
      }
    }
  }

  // 7.3 Intrvyu & CMS Video Loop Detection & Offscreen Pausing
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setupProjectVideo(cardElement, videoSrc, posterSrc, altText) {
    if (!cardElement) return;
    const viewport = cardElement.querySelector('.project-media-viewport');
    if (!viewport) return;

    fetch(videoSrc, { method: 'HEAD' })
      .then(res => {
        if (res.ok && res.status === 200) {
          const video = document.createElement('video');
          video.src = videoSrc;
          video.poster = posterSrc;
          video.muted = true;
          video.loop = true;
          video.playsInline = true;
          video.preload = 'none';
          video.className = 'project-media-video';
          video.setAttribute('aria-label', altText);

          if (!prefersReducedMotion) {
            video.autoplay = true;
          }

          viewport.innerHTML = '';
          viewport.appendChild(video);

          // Pause video when scrolled out of view
          const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting && !prefersReducedMotion) {
                video.play().catch(() => {});
              } else {
                video.pause();
              }
            });
          }, { threshold: 0.15 });

          videoObserver.observe(video);
        }
      })
      .catch(() => {
        // Fallback remains the image
      });
  }

  document.querySelectorAll('.project-card').forEach(card => {
    if (card.querySelector('a[href*="intrvyu-ai"]')) {
      setupProjectVideo(card, 'assets/video/intrvyu-loop.mp4', 'assets/screens/intrvyu.webp', 'Intrvyu AI Voice Demo');
    } else if (card.querySelector('a[href*="kle-cms"]')) {
      setupProjectVideo(card, 'assets/video/cms-loop.mp4', 'assets/screens/cms.webp', 'Grievance Redressal Portal Demo');
    }
  });

  // ==========================================================================
  // 8. INTERACTIVE CERTIFICATE MODAL LIGHTBOX
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
      issuer: "National Institute of Technology (NITK), Web Enthusiasts' Club NITK, IET NITK & INCUBATE",
      date: "September 26–27, 2026",
      filename: "nitk_build_for_billions_award.png",
      image: "nitk_certificate.webp",
      width: 2500,
      height: 1768,
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
      image: "first_commit_certificate.webp",
      width: 2000,
      height: 1125,
      projectTitle: "Vitalis — Enterprise Serverless Healthcare Workflow Automation Platform",
      projectUrl: "https://github.com/amoghsamji/Vitalis",
      downloadUrl: "first_commit_certificate.pdf",
      downloadLabel: "Download Original PDF Certificate ↗"
    }
  };

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
      certModalImg.width = data.width;
      certModalImg.height = data.height;
      certModalImg.loading = "lazy";
      certModalImg.decoding = "async";
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
  document.querySelectorAll('[data-open-cert]').forEach(trigger => {
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

    attachCursorHover(certModal.querySelectorAll('a, button'));
  }

});

