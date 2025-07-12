// Single-card carousel logic for Campaigns and Blog sections

function setupSingleCardCarousel(scrollContainerId, leftBtnId, rightBtnId) {
  const scrollContainer = document.getElementById(scrollContainerId);
  const cards = scrollContainer.querySelectorAll('.card');
  const leftBtn = document.getElementById(leftBtnId);
  const rightBtn = document.getElementById(rightBtnId);
  let currentIndex = 0;

  function updateCarousel() {
    cards.forEach((card, idx) => {
      if (idx === currentIndex) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
  }

  leftBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  rightBtn.addEventListener('click', () => {
    if (currentIndex < cards.length - 1) {
      currentIndex++;
      updateCarousel();
    }
  });

  // Initialize
  updateCarousel();
}

// Campaigns carousel: only one card visible at a time
function setupCampaignsCarousel() {
  const scrollContainer = document.getElementById('campaign-scroll');
  const cards = Array.from(scrollContainer.querySelectorAll('.card'));
  const leftBtn = document.getElementById('campaign-left');
  const rightBtn = document.getElementById('campaign-right');
  let currentIndex = 0;
  const cardsPerView = 3;

  function renderCarousel() {
    // Remove all cards
    const cardsContainer = scrollContainer.querySelector('.cards');
    cardsContainer.innerHTML = '';
    // Show 3 cards, wrapping around
    for (let i = 0; i < cardsPerView; i++) {
      const cardIndex = (currentIndex + i) % cards.length;
      const cardClone = cards[cardIndex].cloneNode(true);
      cardsContainer.appendChild(cardClone);
    }
  }

  leftBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    renderCarousel();
  });

  rightBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % cards.length;
    renderCarousel();
  });

  // Initialize
  renderCarousel();
}

setupCampaignsCarousel();

// Setup carousels for both sections
//setupSingleCardCarousel('blog-scroll', 'blog-left', 'blog-right');

// === NGO Articles Carousel Logic (Revised) ===
let ngoCurrentIndex = 0;
let ngoAutoSlideInterval = null;

function showNgoArticle(index) {
  const cards = document.querySelectorAll('#carouselTrack .article-card');
  const dots = document.querySelectorAll('#dotsContainer .dot');
  if (!cards.length) return;
  ngoCurrentIndex = index;
  if (ngoCurrentIndex < 0) ngoCurrentIndex = 0;
  if (ngoCurrentIndex > cards.length - 1) ngoCurrentIndex = cards.length - 1;
  cards.forEach((card, idx) => {
    card.classList.toggle('active', idx === ngoCurrentIndex);
  });
  dots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx === ngoCurrentIndex);
  });
}

function scrollNgoCarousel(direction) {
  const cards = document.querySelectorAll('#carouselTrack .article-card');
  showNgoArticle((ngoCurrentIndex + direction + cards.length) % cards.length);
}

function setupNgoArticlesCarousel() {
  const cards = document.querySelectorAll('#carouselTrack .article-card');
  const dotsContainer = document.getElementById('dotsContainer');
  const leftBtn = document.getElementById('article-left');
  const rightBtn = document.getElementById('article-right');
  const carousel = document.querySelector('.article-carousel-section');
  dotsContainer.innerHTML = '';
  cards.forEach((_, idx) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (idx === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to article ' + (idx + 1));
    dot.addEventListener('click', () => {
      showNgoArticle(idx);
      resetNgoAutoSlide();
    });
    dotsContainer.appendChild(dot);
  });
  leftBtn.onclick = () => { scrollNgoCarousel(-1); resetNgoAutoSlide(); };
  rightBtn.onclick = () => { scrollNgoCarousel(1); resetNgoAutoSlide(); };
  // Auto-slide logic
  function startNgoAutoSlide() {
    ngoAutoSlideInterval = setInterval(() => {
      scrollNgoCarousel(1);
    }, 5000);
  }
  function stopNgoAutoSlide() {
    clearInterval(ngoAutoSlideInterval);
  }
  function resetNgoAutoSlide() {
    stopNgoAutoSlide();
    startNgoAutoSlide();
  }
  carousel.addEventListener('mouseenter', stopNgoAutoSlide);
  carousel.addEventListener('mouseleave', startNgoAutoSlide);
  // Show first card
  showNgoArticle(0);
  startNgoAutoSlide();
}

document.addEventListener('DOMContentLoaded', () => {
  setupNgoArticlesCarousel();
});
  