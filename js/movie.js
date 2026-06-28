// ===== 日付フォーマット =====
function formatDate(folder) {
  const y = folder.slice(0, 4);
  const m = folder.slice(4, 6);
  const d = folder.slice(6, 8);
  return `${y}年${m}月${d}日`;
}

// ===== 動画一覧取得（videos.json から読み込み） =====
async function fetchVideos() {
  const res = await fetch('../movie/videos.json');
  if (!res.ok) throw new Error('videos.json の読み込みに失敗しました。');
  return res.json();
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
  grid.innerHTML = '<p style="color:#fff;text-align:center;grid-column:1/-1">読み込み中...</p>';

  try {
    const videos = await fetchVideos();
    grid.innerHTML = '';
    if (videos.length === 0) {
      grid.innerHTML = '<p style="color:#fff;text-align:center;grid-column:1/-1">動画はまだありません。</p>';
      return;
    }
    videos.forEach(v => grid.appendChild(buildCard(v)));
  } catch (e) {
    grid.innerHTML = `<p style="color:#fca5a5;text-align:center;grid-column:1/-1">動画の取得に失敗しました。<br><small>${e.message}</small></p>`;
  }

  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
});
