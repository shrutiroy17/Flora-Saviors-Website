// Single-card carousel logic for Campaigns and Blog sections
console.log('index.js loaded');

let ngoCurrentIndex = 0;
let autoSlideInterval = null;

function setupNgoCarousel() {
  const track = document.getElementById('carouselTrack');
  const cards = document.querySelectorAll('#carouselTrack .article-card');
  const leftBtn = document.getElementById('article-left');
  const rightBtn = document.getElementById('article-right');
  const dotsContainer = document.getElementById('dotsContainer');
  const totalCards = cards.length;
  const visibleCards = window.innerWidth <= 600 ? 1 : window.innerWidth <= 992 ? 2 : 3;
  const maxIndex = Math.ceil(totalCards / visibleCards) - 1;

  function updateCarousel(index) {
    const cardWidth = cards[0].offsetWidth + 24; // card width + gap
    track.style.transform = `translateX(-${index * (cardWidth * visibleCards)}px)`;
    ngoCurrentIndex = index;
    updateDots(index);
  }

  function updateDots(index) {
    const dots = document.querySelectorAll('#dotsContainer .dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  function createDots() {
    dotsContainer.innerHTML = '';
    for (let i = 0; i <= maxIndex; i++) {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => {
        updateCarousel(i);
        resetAutoSlide();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function scrollCarousel(dir) {
    ngoCurrentIndex = (ngoCurrentIndex + dir + maxIndex + 1) % (maxIndex + 1);
    updateCarousel(ngoCurrentIndex);
  }

  function startAutoSlide() {
    autoSlideInterval = setInterval(() => scrollCarousel(1), 5000);
  }

  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
  }

  leftBtn.onclick = () => { scrollCarousel(-1); resetAutoSlide(); };
  rightBtn.onclick = () => { scrollCarousel(1); resetAutoSlide(); };

  createDots();
  updateCarousel(0);
  startAutoSlide();

  document.querySelector('.article-carousel-section').addEventListener('mouseenter', stopAutoSlide);
  document.querySelector('.article-carousel-section').addEventListener('mouseleave', startAutoSlide);
}

window.addEventListener('load', setupNgoCarousel);
window.addEventListener('resize', setupNgoCarousel);

// Smooth Scrolling for Navigation
function setupSmoothScrolling() {
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Flip Card Functionality
function setupFlipCards() {
  const teamGrid = document.querySelector('.team-grid');

  function handleFlipCardClick(e) {
    // Only on mobile (600px and below)
    if (window.innerWidth > 600) return;
    const card = e.target.closest('.flip-card');
    if (card && teamGrid.contains(card)) {
      card.classList.toggle('flipped');
    }
  }

  function updateFlipHandlers() {
    if (window.innerWidth <= 600) {
      teamGrid.addEventListener('click', handleFlipCardClick);
    } else {
      // On larger screens, remove click listener and any ".flipped" classes
      document.querySelectorAll('.flip-card.flipped').forEach(card => card.classList.remove('flipped'));
      teamGrid.removeEventListener('click', handleFlipCardClick);
    }
  }

  updateFlipHandlers();
  window.addEventListener('resize', updateFlipHandlers);
}

document.addEventListener('DOMContentLoaded', () => {
  // Founder Modal logic
  const founderModalOverlay = document.getElementById('founderModalOverlay');
  const founderModalClose = document.getElementById('founderModalClose');
  if (founderModalOverlay && founderModalClose) {
    founderModalOverlay.style.display = 'flex';
    founderModalClose.addEventListener('click', () => {
      founderModalOverlay.style.display = 'none';
    });
  }

  // Gift a Tree notification logic
  const giftTreeBtn = document.querySelector('.gift-tree-nav-btn');
  const giftTreeNotification = document.getElementById('giftTreeNotification');
  if (giftTreeBtn && giftTreeNotification) {
    giftTreeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const url = this.getAttribute('href');
      window.open(url, '_blank');
      // Show notification
      giftTreeNotification.classList.add('show');
      giftTreeNotification.style.display = 'flex';
      setTimeout(() => {
        giftTreeNotification.classList.remove('show');
        setTimeout(() => {
          giftTreeNotification.style.display = 'none';
        }, 300);
      }, 3000);
    });
  }

  // Hamburger/mobile nav logic
  const hamburger = document.getElementById('hamburgerMenu');
  const mobileMenu = document.getElementById('mobileNavMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function(e) {
      e.stopPropagation();
      mobileMenu.classList.toggle('show');
    });
    // Close menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('show');
      });
    });
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (mobileMenu.classList.contains('show') && !mobileMenu.contains(e.target) && e.target !== hamburger) {
        mobileMenu.classList.remove('show');
      }
    });
  }

  setupFlipCards();
  setupSmoothScrolling();
});
