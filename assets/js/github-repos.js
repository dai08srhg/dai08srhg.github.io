/**
 * Renders the most-starred public repositories into #github-repos.
 * The account comes from the container's data-user attribute; card styling
 * lives in assets/css/main.css (.repo).
 */
(function () {
  var container = document.getElementById('github-repos');
  if (!container) return;

  var user = container.dataset.user;
  if (!user) return;

  var profileUrl = 'https://github.com/' + user;
  var MAX = 4;

  var icon = {
    star: '<svg class="repo__icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path></svg>',
    fork: '<svg class="repo__icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path></svg>'
  };

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function showFallback() {
    container.insertAdjacentHTML(
      'afterend',
      '<p class="repos__fallback">リポジトリを読み込めませんでした。' +
        '<a href="' + profileUrl + '" target="_blank" rel="noopener noreferrer">GitHub で見る</a></p>'
    );
  }

  fetch('https://api.github.com/users/' + user + '/repos?sort=stars&direction=desc&per_page=100')
    .then(function (response) {
      if (!response.ok) throw new Error('GitHub API returned ' + response.status);
      return response.json();
    })
    .then(function (data) {
      var repos = data
        .filter(function (repo) { return !repo.fork && repo.stargazers_count > 0; })
        .sort(function (a, b) { return b.stargazers_count - a.stargazers_count; })
        .slice(0, MAX);

      if (!repos.length) {
        showFallback();
        return;
      }

      repos.forEach(function (repo) {
        var card = document.createElement('div');
        card.className = 'repo';
        card.innerHTML =
          '<h3 class="repo__name"><a href="' + escapeHtml(repo.html_url) + '" target="_blank" rel="noopener noreferrer">' +
            escapeHtml(repo.name) + '</a></h3>' +
          '<p class="repo__desc">' + escapeHtml(repo.description || '説明なし') + '</p>' +
          '<p class="repo__meta">' +
            '<span title="Stars">' + icon.star + repo.stargazers_count + '</span>' +
            '<span title="Forks">' + icon.fork + repo.forks_count + '</span>' +
            (repo.language ? '<span>' + escapeHtml(repo.language) + '</span>' : '') +
          '</p>';
        container.appendChild(card);
      });
    })
    .catch(function (error) {
      console.error('Error fetching repos:', error);
      showFallback();
    });
})();
