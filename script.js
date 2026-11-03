/**
 * Personal Portfolio — Interactive Behaviors
 * Clean, lightweight, zero-dependency JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initScrollReveal();
  initActiveNav();
  initMobileMenu();
  initSkillsFilter();
  initCopyEmail();
  initYear();
});

/* ==========================================================================
   1. Reading Progress Bar
   ========================================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  const header = document.getElementById('site-header');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;

    // Add subtle shadow to header when scrolled
    if (header) {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }, { passive: true });
}

/* ==========================================================================
   2. Scroll Reveal Animations (IntersectionObserver)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if (!('IntersectionObserver' in window)) {
    // Fallback: make all visible immediately
    revealElements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target); // Reveal once
      }
    });
  }, {
    root: null,
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   3. Active Navigation Link on Scroll
   ========================================================================== */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-20% 0px -65% 0px'
  });

  sections.forEach(section => sectionObserver.observe(section));
}

/* ==========================================================================
   4. Mobile Menu Toggle
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
  });

  // Close when clicking a nav link
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target) && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ==========================================================================
   5. Skills Category Filter
   ========================================================================== */
function initSkillsFilter() {
  const tabs = document.querySelectorAll('.filter-tab');
  const blocks = document.querySelectorAll('.skill-category-block');
  const twoColRow = document.querySelector('.skills-two-column-row');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const target = tab.dataset.target;

      blocks.forEach(block => {
        const category = block.dataset.category;
        if (target === 'all' || category === target) {
          block.classList.remove('is-hidden');
        } else {
          block.classList.add('is-hidden');
        }
      });

      // Special handling for the two-column row
      if (twoColRow) {
        if (target === 'programming' || target === 'tools') {
          twoColRow.style.display = 'none';
        } else {
          twoColRow.style.display = 'grid';
        }
      }
    });
  });
}

/* ==========================================================================
   6. 1-Click Copy Email & Toast Notification
   ========================================================================== */
function initCopyEmail() {
  const copyBtn = document.getElementById('copy-email-btn');
  const emailElem = document.getElementById('display-email');
  if (!copyBtn || !emailElem) return;

  copyBtn.addEventListener('click', () => {
    const emailToCopy = emailElem.textContent.trim();
    if (!emailToCopy) return;

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(emailToCopy).then(() => {
        handleCopySuccess(copyBtn);
      }).catch(() => fallbackCopy(emailToCopy, copyBtn));
    } else {
      fallbackCopy(emailToCopy, copyBtn);
    }
  });
}

function handleCopySuccess(button) {
  const originalHtml = button.innerHTML;
  button.innerHTML = '<span class="copy-text">Copied &check;</span>';
  showToast('Email address copied to clipboard');
  setTimeout(() => {
    button.innerHTML = originalHtml;
  }, 2200);
}

function fallbackCopy(text, button) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    handleCopySuccess(button);
  } catch (err) {
    showToast('Failed to copy. Please copy manually.');
  }
  document.body.removeChild(textArea);
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* ==========================================================================
   7. Dynamic Year in Footer
   ========================================================================== */
function initYear() {
  const yearElem = document.getElementById('current-year');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }
}
