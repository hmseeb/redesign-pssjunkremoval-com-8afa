/* PSS Junk Removal — interactions */
(function () {
  'use strict';

  /* ---- Mobile navigation ---- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  function closeNav() {
    if (!nav) return;
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) closeNav();
    });
  }

  /* ---- Sticky header shadow ---- */
  var header = document.getElementById('header');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('is-stuck', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Scroll reveal ---- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          var el = entry.target;
          el.style.transitionDelay = Math.min(i * 70, 280) + 'ms';
          el.classList.add('in');
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Active nav link on scroll ---- */
  var sections = Array.prototype.slice.call(
    document.querySelectorAll('main section[id]')
  );
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.nav > a[href^="#"]')
  );

  function setActive() {
    var pos = window.scrollY + 140;
    var current = '';
    sections.forEach(function (sec) {
      if (sec.offsetTop <= pos) current = sec.id;
    });
    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', setActive, { passive: true });
  setActive();

  /* ---- Footer year ---- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---- Quote form (client-side only, no external APIs) ---- */
  var form = document.getElementById('quoteForm');
  var note = document.getElementById('formNote');

  if (form && note) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = form.querySelector('#name');
      var phone = form.querySelector('#phone');
      var valid = true;

      [name, phone].forEach(function (input) {
        var ok = input.value.trim().length >= (input === phone ? 7 : 2);
        input.classList.toggle('err', !ok);
        if (!ok) valid = false;
      });

      if (!valid) {
        note.textContent = 'Please add your name and a phone number we can reach you on.';
        note.className = 'form-note bad';
        return;
      }

      var service = form.querySelector('#service').value;
      var city = form.querySelector('#city').value.trim() || 'Los Angeles';
      var details = form.querySelector('#details').value.trim();

      var body =
        'Quote request from ' + name.value.trim() + '\n' +
        'Phone: ' + phone.value.trim() + '\n' +
        'City: ' + city + '\n' +
        'Service: ' + service + '\n' +
        'Details: ' + (details || 'n/a');

      note.textContent = 'Thanks, ' + name.value.trim().split(' ')[0] +
        '! Opening your email app so we get the details — or call (213) 330-9863 for an instant price.';
      note.className = 'form-note ok';

      window.location.href =
        'mailto:Info@psspropertysolutions.com' +
        '?subject=' + encodeURIComponent('Junk Removal Quote – ' + service + ' (' + city + ')') +
        '&body=' + encodeURIComponent(body);

      form.reset();
    });

    form.addEventListener('input', function (e) {
      if (e.target.classList) e.target.classList.remove('err');
    });
  }
})();
