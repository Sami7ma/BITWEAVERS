(function() {
  'use strict';

  // DOM Elements
  const docEl = document.documentElement;
  const themeToggle = document.querySelector('.theme-toggle');
  const yearEl = document.getElementById('year');
  const loadingOverlay = document.getElementById('loading-overlay');
  const nav = document.querySelector('.nav');

  // Set current year
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Hide loading overlay when page is ready
  function hideLoadingOverlay() {
    if (loadingOverlay && !loadingOverlay.classList.contains('hidden')) {
      loadingOverlay.classList.add('hidden');
      // Remove from DOM after animation completes
      setTimeout(() => {
        if (loadingOverlay && loadingOverlay.parentNode) {
          loadingOverlay.remove();
        }
      }, 300);
    }
  }

  // Hide loading overlay when everything is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hideLoadingOverlay);
  } else {
    hideLoadingOverlay();
  }

  // Fallback: hide loading overlay after 2 seconds
  setTimeout(hideLoadingOverlay, 2000);

  // Theme Management
  const storedTheme = localStorage.getItem('theme') || 'light';
  docEl.setAttribute('data-theme', storedTheme === 'dark' ? 'dark' : 'light');

  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      const currentTheme = docEl.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';

      // Add pulse animation
      themeToggle.classList.add('theme-pulse');

      // Small delay for animation
      setTimeout(() => {
        docEl.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

      const icon = themeToggle.querySelector('i');
      if (icon) {
          icon.className = newTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
          themeToggle.setAttribute('aria-label', `Switch to ${newTheme === 'light' ? 'dark' : 'light'} theme`);
        }

        // Remove pulse animation
        themeToggle.classList.remove('theme-pulse');
      }, 150);
    });
  }

  // Mobile Navigation
  function createMobileToggle() {
    if (window.innerWidth <= 768 && !document.querySelector('.nav-toggle')) {
      const headerContent = document.querySelector('.header-content');
      const toggle = document.createElement('button');
      toggle.className = 'nav-toggle';
      toggle.innerHTML = '<i class="fas fa-bars"></i>';
      toggle.setAttribute('aria-label', 'Toggle navigation menu');
      toggle.setAttribute('aria-expanded', 'false');

      // Insert toggle button before the nav
      headerContent.insertBefore(toggle, nav);

      toggle.addEventListener('click', function(e) {
        e.stopPropagation();
        const isExpanded = nav.classList.contains('show');
        nav.classList.toggle('show');
        toggle.setAttribute('aria-expanded', !isExpanded);

        // Animate icon
        const icon = toggle.querySelector('i');
        if (icon) {
          icon.style.transform = nav.classList.contains('show') ? 'rotate(90deg)' : 'rotate(0deg)';
        }
      });

      // Close nav when clicking outside or on nav links
      document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && !toggle.contains(e.target)) {
          nav.classList.remove('show');
          toggle.setAttribute('aria-expanded', 'false');
          const icon = toggle.querySelector('i');
          if (icon) icon.style.transform = 'rotate(0deg)';
        }
      });

      // Close nav when clicking on nav links
      nav.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
          nav.classList.remove('show');
          toggle.setAttribute('aria-expanded', 'false');
          const icon = toggle.querySelector('i');
          if (icon) icon.style.transform = 'rotate(0deg)';
        }
      });
    }
  }

  // Handle responsive navigation
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      nav.classList.remove('show');
      const toggle = document.querySelector('.nav-toggle');
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.remove();
      }
    } else {
      createMobileToggle();
    }
  });

  // Initialize mobile nav on load
  if (window.innerWidth <= 768) {
    createMobileToggle();
  }

  // Smooth scrolling for anchor links and close mobile nav
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (href === '#' || href === '#top') return;

    const target = document.querySelector(href);
    if (target) {
    e.preventDefault();

      // Close mobile navigation if open
      if (nav.classList.contains('show')) {
        nav.classList.remove('show');
        const toggle = document.querySelector('.nav-toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }

      // Smooth scroll to target
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // Form submission handling
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const btn = contactForm.querySelector('.btn-primary');
      if (!btn) return;

      const originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;

      // Basic form validation
      const name = contactForm.querySelector('#name').value.trim();
      const email = contactForm.querySelector('#email').value.trim();
      const message = contactForm.querySelector('#message').value.trim();

      if (!name || !email || !message) {
        btn.textContent = 'Please fill all fields';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
        }, 1500);
        return;
      }

      // Simulate form submission
      setTimeout(() => {
        btn.textContent = 'Message Sent! ✓';
        btn.style.background = 'linear-gradient(135deg, #10b981, #34d399)';

        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
          btn.style.background = '';
          contactForm.reset();
        }, 2000);
      }, 1000);
    });
  }

  // Add fade-up animation to sections on scroll
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('fade-up')) {
          entry.target.classList.add('fade-up');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.card, .client-item, .section-header');
    animatedElements.forEach(el => {
      if (el) observer.observe(el);
    });
  }

  console.log('🎨 BitWeavers website loaded successfully!');
})();
