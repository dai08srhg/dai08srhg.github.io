/**
 * Light / dark toggle.
 * Dark is the default; light is opt-in. The chosen scheme is stored in
 * localStorage and applied as data-theme on <html>, so only data-theme="light"
 * ever needs to be set. The OS setting is deliberately not consulted.
 */
document.addEventListener('DOMContentLoaded', function () {
  var button = document.querySelector('.theme-toggle');
  if (!button) return;

  var root = document.documentElement;

  function currentTheme() {
    return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
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
