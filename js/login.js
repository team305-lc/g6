// パスワード "g6-home" の SHA-256 ハッシュ
const PASS_HASH = 'e33270e9de2f1e5f6b65b94dc3031c9a753f0d1c5b50560e38034c794b34174a';

async function sha256(str) {
  const buf    = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem('g6_auth')) {
    window.location.href = 'movie.html';
    return;
  }

  const form  = document.getElementById('login-form');
  const input = document.getElementById('password');
  const err   = document.getElementById('error-msg');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const hash = await sha256(input.value);
    if (hash === PASS_HASH) {
      sessionStorage.setItem('g6_auth', '1');
      window.location.href = 'movie.html';
    } else {
      err.classList.add('show');
      input.value = '';
      input.focus();
    }
  });

  input.addEventListener('input', () => err.classList.remove('show'));
});
