// ページの階層に応じたルートパスを判定
const ROOT = location.pathname.includes('/html/') ? '../' : './';

// ===== ヘッダー =====
function buildHeader() {
  const isLoggedIn = !!sessionStorage.getItem('g6_auth');

  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <a class="site-logo" href="${ROOT}index.html">
      <img src="${ROOT}img/logo.png" alt="G6" class="logo-img">
    </a>
    <nav class="site-nav">
      ${location.pathname.includes('/html/')
        ? `<a href="${ROOT}index.html"><button class="nav-btn ghost">トップ</button></a>`
        : ''}
      <a href="${ROOT}html/movie.html"><button class="nav-btn solid">試合動画</button></a>
      ${isLoggedIn
        ? `<button class="nav-btn ghost" onclick="logout()">ログアウト</button>`
        : `<a href="${ROOT}html/login.html"><button class="nav-btn ghost">ログイン</button></a>`}
    </nav>`;

  document.body.prepend(header);
}

// ===== フッター =====
function buildFooter() {
  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML = '&copy; 2026 G6 Basketball Club. All rights reserved.';
  document.body.appendChild(footer);
}

// ===== ログアウト =====
function logout() {
  sessionStorage.removeItem('g6_auth');
  location.href = ROOT + 'index.html';
}

// ===== 実行 =====
document.addEventListener('DOMContentLoaded', () => {
  buildHeader();
  buildFooter();
});
