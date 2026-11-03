/**
 * Light / dark toggle.
 * The chosen scheme is stored in localStorage and applied as data-theme on
 * <html>; with nothing stored the CSS falls back to prefers-color-scheme.
 */
document.addEventListener('DOMContentLoaded', function () {
  var button = document.querySelector('.theme-toggle');
  if (!button) return;

  var root = document.documentElement;

  function currentTheme() {
    var stored = root.getAttribute('data-theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  button.addEventListener('click', function () {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch (e) {
      /* storage unavailable (private mode) - the choice just won't persist */
    }
  });
});
