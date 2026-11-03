/**
 * Highlights the entry in the index for the section currently being read.
 */
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.toc__link'));
  if (!links.length) return;

  var items = [];
  links.forEach(function (link) {
    var section = document.getElementById(link.getAttribute('href').slice(1));
    if (section) items.push({ link: link, section: section });
  });
  if (!items.length) return;

  // A section counts as current once its heading passes this line.
  var OFFSET = 120;
  var active = null;

  function update() {
    var current = items[0];
    items.forEach(function (item) {
      if (item.section.getBoundingClientRect().top <= OFFSET) current = item;
    });

    // The final section is often too short to ever cross the line, so pin it
    // once the page is scrolled all the way down.
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      current = items[items.length - 1];
    }

    if (current === active) return;
    if (active) active.link.classList.remove('is-active');
    current.link.classList.add('is-active');
    active = current;
  }

  // Measuring a handful of sections is cheap enough to do on the scroll
  // event itself, which keeps this working wherever rAF is throttled.
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
})();
