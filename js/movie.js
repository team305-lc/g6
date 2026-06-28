// ===== GitHub リポジトリ設定（GitHub Pages公開後に設定） =====
const GITHUB_USER = 'YOUR_USERNAME';
const GITHUB_REPO = 'YOUR_REPO';

// ===== 環境判定 =====
const IS_LOCAL = location.hostname === 'localhost' || location.hostname === '127.0.0.1';

// ===== 日付フォーマット =====
function formatDate(folder) {
  const y = folder.slice(0, 4);
  const m = folder.slice(4, 6);
  const d = folder.slice(6, 8);
  return `${y}年${m}月${d}日`;
}

// ===== 動画一覧取得 =====
async function fetchVideos() {
  if (IS_LOCAL) {
    // ローカル: 簡易サーバーの API を使用
    const res = await fetch('/api/videos');
    if (!res.ok) throw new Error('ローカルサーバーに接続できません。npm start で起動してください。');
    return res.json();
  } else {
    // GitHub Pages: Contents API を使用
    const base = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/movie`;
    const res  = await fetch(base);
    if (!res.ok) throw new Error(`GitHub API エラー (${res.status})。GITHUB_USER / GITHUB_REPO を確認してください。`);

    const entries = await res.json();
    const folders = entries
      .filter(e => e.type === 'dir' && /^\d{8}$/.test(e.name))
      .sort((a, b) => b.name.localeCompare(a.name));

    const videos = [];
    for (const folder of folders) {
      const fRes  = await fetch(`${base}/${folder.name}`);
      const files = await fRes.json();
      files
        .filter(f => f.type === 'file' && /\.mp4$/i.test(f.name))
        .forEach(f => videos.push({ folder: folder.name, file: f.name }));
    }
    return videos;
  }
}

// ===== カード生成 =====
function buildCard(v) {
  const src   = `../movie/${v.folder}/${v.file}`;
  const title = v.file.replace(/\.mp4$/i, '');
  const date  = formatDate(v.folder);

  const card = document.createElement('div');
  card.className = 'movie-card';
  card.innerHTML = `
    <div class="movie-thumb">
      <video src="${src}" preload="metadata" muted playsinline></video>
      <div class="play-overlay"><div class="play-icon">▶</div></div>
    </div>
    <div class="movie-info">
      <div class="movie-date">📅 ${date}</div>
      <div class="movie-title">${title}</div>
    </div>`;

  card.addEventListener('click', () => openModal(src, `${date}｜${title}`));
  return card;
}

// ===== モーダル =====
function openModal(src, label) {
  const overlay = document.getElementById('modal-overlay');
  const video   = document.getElementById('modal-video');
  const title   = document.getElementById('modal-title');
  video.src         = src;
  title.textContent = label;
  overlay.classList.add('active');
  video.play();
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  const video   = document.getElementById('modal-video');
  overlay.classList.remove('active');
  video.pause();
  video.src = '';
}

// ===== 初期化 =====
document.addEventListener('DOMContentLoaded', async () => {
  requireLogin();

  const grid = document.getElementById('movie-grid');
  grid.innerHTML = '<p style="color:#999;text-align:center;grid-column:1/-1">読み込み中...</p>';

  try {
    const videos = await fetchVideos();
    grid.innerHTML = '';
    if (videos.length === 0) {
      grid.innerHTML = '<p style="color:#999;text-align:center;grid-column:1/-1">動画はまだありません。</p>';
      return;
    }
    videos.forEach(v => grid.appendChild(buildCard(v)));
  } catch (e) {
    grid.innerHTML = `<p style="color:#c62828;text-align:center;grid-column:1/-1">動画の取得に失敗しました。<br><small>${e.message}</small></p>`;
  }

  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
});
