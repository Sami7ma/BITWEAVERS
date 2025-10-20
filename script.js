(function() {
  const docEl = document.documentElement;
  const themeToggle = document.querySelector('.theme-toggle');
  const navToggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('primary-menu');
  const yearEl = document.getElementById('year');

  // Set current year
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Theme initialization
  const storedTheme = localStorage.getItem('tbw-theme');
  if (storedTheme === 'dark' || storedTheme === 'light') {
    docEl.setAttribute('data-theme', storedTheme);
  } else {
    // Always start in light mode by default
    docEl.setAttribute('data-theme', 'light'); 
  }

  // Theme toggle
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      const next = docEl.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      docEl.setAttribute('data-theme', next);
      localStorage.setItem('tbw-theme', next);

      // update icon
      const icon = themeToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-moon', next === 'light');
        icon.classList.toggle('fa-sun', next === 'dark');
      }
    });
  }

  // Mobile nav toggle
  if (navToggle && menu) {
    navToggle.addEventListener('click', function() {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      menu.classList.toggle('show');
    });

    // Close on link click (mobile)
    menu.addEventListener('click', function(e) {
      const target = e.target;
      if (target && target.tagName === 'A' && menu.classList.contains('show')) {
        menu.classList.remove('show');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Smooth scroll for internal links (beyond CSS behavior for better offset control)
  document.addEventListener('click', function(e) {
    const target = e.target;
    if (!(target instanceof Element)) return;
    const link = target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href');
    if (!id || id === '#' || id === '#top') return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    const top = el.getBoundingClientRect().top + window.scrollY - 70; // offset for sticky header
    window.scrollTo({ top, behavior: 'smooth' });
  });

  // No dynamic logo loading; using local assets only as requested
})();
