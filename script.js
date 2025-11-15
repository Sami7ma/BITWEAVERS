(function() {
  'use strict';

  // DOM Elements
  const docEl = document.documentElement;
  const themeToggle = document.querySelector('.theme-toggle');
  const yearEl = document.getElementById('year');
  const nav = document.querySelector('.nav');

  // Set current year
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Loading overlay removed — no-op

  // Theme Management: apply stored theme and use delegated clicks so it works after DOM moves
  (function initTheme(){
    const stored = localStorage.getItem('theme');
    if (stored) docEl.setAttribute('data-theme', stored);
    if (!docEl.getAttribute('data-theme')) docEl.setAttribute('data-theme','light');

    // Delegated click handler for theme toggle — works even if the button is moved in DOM
    document.addEventListener('click', function(e){
      const btn = e.target.closest('.theme-toggle');
      if (!btn) return;
      const cur = docEl.getAttribute('data-theme') || 'light';
      const next = cur === 'dark' ? 'light' : 'dark';
      docEl.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      const icon = btn.querySelector('i');
      if (icon) icon.className = next === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      btn.setAttribute('aria-label', next === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    });
  })();

  // Mobile Navigation (minimal)
  function createMobileToggle(){
    if (window.innerWidth > 768) return;
    if (document.querySelector('.nav-toggle')) return;
    const headerContent = document.querySelector('.header-content');
    const toggle = document.createElement('button');
    toggle.className = 'nav-toggle';
    toggle.innerHTML = '<i class="fas fa-bars"></i>';
    toggle.setAttribute('aria-label','Toggle menu');
    headerContent.insertBefore(toggle, nav);
    // ensure themeToggle visible on mobile
    if (themeToggle && headerContent && !headerContent.contains(themeToggle)) headerContent.insertBefore(themeToggle, nav);
    toggle.addEventListener('click', (e)=>{
      e.stopPropagation(); nav.classList.toggle('show'); toggle.setAttribute('aria-expanded', nav.classList.contains('show'));
    });
    document.addEventListener('click', (e)=>{ if (!nav.contains(e.target) && !toggle.contains(e.target)) nav.classList.remove('show'); });
    nav.addEventListener('click', (e)=>{ if (e.target.tagName==='A') nav.classList.remove('show'); });
  }

  // Responsive nav handling
  window.addEventListener('resize', ()=>{
    if (window.innerWidth > 768){ nav.classList.remove('show'); const t = document.querySelector('.nav-toggle'); if (t) t.remove(); if (themeToggle && nav && !nav.contains(themeToggle)) nav.appendChild(themeToggle);} else createMobileToggle();
  });
  // init
  createMobileToggle();

  // Smooth scroll for internal links
  document.addEventListener('click', function(e){
    const a = e.target.closest('a[href^="#"]'); if (!a) return; const href = a.getAttribute('href'); if (href==='#' || href==='#top') return; const t = document.querySelector(href); if (t){ e.preventDefault(); if (nav.classList.contains('show')) nav.classList.remove('show'); t.scrollIntoView({behavior:'smooth',block:'start'}); }
  });

  // Simple contact form handling (simulate)
  (function initContact(){
    const form = document.querySelector('.contact-form'); if (!form) return; form.addEventListener('submit', (e)=>{ e.preventDefault(); const btn = form.querySelector('.btn-primary'); if (!btn) return; const n = form.querySelector('#name').value.trim(), em = form.querySelector('#email').value.trim(), m = form.querySelector('#message').value.trim(); if (!n||!em||!m){ btn.textContent='Please fill all fields'; setTimeout(()=>btn.textContent='Send Message',1400); return;} btn.textContent='Sending...'; btn.disabled=true; setTimeout(()=>{ btn.textContent='Message Sent ✓'; setTimeout(()=>{ btn.textContent='Send Message'; btn.disabled=false; form.reset(); },1200); },900); });
  })();

  // Add fade-up animation to sections on scroll
  // Scroll reveal and staggered animation using IntersectionObserver
  // Scroll reveal (minimal)
  if ('IntersectionObserver' in window){
    const obs = new IntersectionObserver((ents)=>{ ents.forEach(en=>{ if(en.isIntersecting) en.target.classList.add('in-view'); }); }, {threshold:0.35});
    document.querySelectorAll('.card,.client-item,.section-header').forEach(el=>obs.observe(el));
  } else { document.querySelectorAll('.card,.client-item,.section-header').forEach(el=>el.classList.add('in-view')); }

  // Back-to-top: appear immediately on any scroll and smooth-scroll to top on click
  (function initBackTop(){
    const b = document.querySelector('.back-top');
    if (!b) return;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 0) b.classList.add('show'); else b.classList.remove('show');
    }, { passive: true });
    b.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  })();

  console.log('🎨 BitWeavers website loaded successfully!');
})();
