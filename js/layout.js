const ROOT = location.pathname.includes('/html/') ? '../' : './';

// ===== ヘッダー =====
function buildHeader() {
  const isLoggedIn = !!sessionStorage.getItem('g6_auth');

  const navItems = [
    location.pathname.includes('/html/')
      ? `<a class="menu-item" href="${ROOT}index.html">トップ</a>` : '',
    !location.pathname.includes('movie.html')
      ? `<a class="menu-item" href="${ROOT}html/movie.html">試合動画</a>` : '',
    isLoggedIn
      ? `<button class="menu-item" onclick="logout()">ログアウト</button>`
      : `<a class="menu-item" href="${ROOT}html/login.html">ログイン</a>`,
  ].join('');

  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <a class="site-logo" href="${ROOT}index.html">
      <img src="${ROOT}img/logo.png" alt="G6" class="logo-img">
    </a>

    <!-- PC ナビ -->
    <nav class="site-nav">
      ${location.pathname.includes('/html/')
        ? `<a href="${ROOT}index.html"><button class="nav-btn ghost">トップ</button></a>` : ''}
      ${!location.pathname.includes('movie.html')
        ? `<a href="${ROOT}html/movie.html"><button class="nav-btn solid">試合動画</button></a>` : ''}
      ${isLoggedIn
        ? `<button class="nav-btn ghost" onclick="logout()">ログアウト</button>`
        : `<a href="${ROOT}html/login.html"><button class="nav-btn ghost">ログイン</button></a>`}
    </nav>

    <!-- ハンバーガーボタン -->
    <button class="hamburger" id="hamburger" aria-label="メニュー">
      <span></span><span></span><span></span>
    </button>

    <!-- モバイルメニュー -->
    <div class="mobile-menu" id="mobile-menu">
      ${navItems}
    </div>`;

  document.body.prepend(header);

  // ハンバーガー開閉
  const btn  = header.querySelector('#hamburger');
  const menu = header.querySelector('#mobile-menu');

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.classList.toggle('open', open);
  });

  // メニュー外タップで閉じる
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) {
      menu.classList.remove('open');
      btn.classList.remove('open');
    }
  });
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
