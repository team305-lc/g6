// ===== Auth Guard =====
// ログイン済みチェック（movie.htmlで使用）
function requireLogin() {
  if (!sessionStorage.getItem('g6_auth')) {
    window.location.href = 'login.html';
  }
}
