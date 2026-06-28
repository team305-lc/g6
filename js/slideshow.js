document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.hero-slide');
  const dotsEl = document.getElementById('slide-dots');
  let current = 0;

  // ドット生成
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slide-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  });

  function goTo(index) {
    slides[current].classList.remove('active');
    dotsEl.children[current].classList.remove('active');
    current = index;
    slides[current].classList.add('active');
    dotsEl.children[current].classList.add('active');
  }

  // 5秒ごとに自動切り替え
  setInterval(() => goTo((current + 1) % slides.length), 5000);
});
