// Single-card carousel logic for Campaigns and Blog sections
console.log('index.js loaded');
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
  const flipCards = document.querySelectorAll('.flip-card');
  
  // Only add click handlers for mobile devices
  if (window.innerWidth <= 767) {
    flipCards.forEach(card => {
      card.addEventListener('click', function() {
        this.classList.toggle('flipped');
      });
    });
  }
  
  // Handle window resize to add/remove click handlers
  window.addEventListener('resize', function() {
    flipCards.forEach(card => {
      // Remove existing click listeners
      card.replaceWith(card.cloneNode(true));
    });
    
    // Re-select cards after cloning
    const newFlipCards = document.querySelectorAll('.flip-card');
    
    if (window.innerWidth <= 767) {
      newFlipCards.forEach(card => {
        card.addEventListener('click', function() {
          this.classList.toggle('flipped');
        });
      });
    }
  });
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

  setupNgoArticlesCarousel();
  setupFlipCards();
  setupSmoothScrolling();
});
  
