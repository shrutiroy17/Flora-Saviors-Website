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

// === Collaborators Carousel Logic ===
let collaboratorsCurrentIndex = 0;
let collaboratorsAutoSlideInterval = null;
let collaboratorsPauseTimeout = null;

function showCollaboratorsSlide(index) {
  const track = document.querySelector('.collaborators-track');
  const dots = document.querySelectorAll('#collaboratorsDots .dot');
  const items = document.querySelectorAll('.collaborator-item');

  const cardWidth = 250;
  const gap = 32; // 2rem gap
  const visibleCards = 4;
  const totalCards = items.length;

  // Only two valid positions: 0 (first 4), 4 (last 4)
  let slideIndex = index === 0 ? 0 : totalCards - visibleCards;
  collaboratorsCurrentIndex = slideIndex;

  // Mobile: show only 4 as a 2x2 grid, hide others
  if (window.innerWidth <= 600) {
    items.forEach((item, idx) => {
      if (idx >= slideIndex && idx < slideIndex + visibleCards) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
    // No transform on mobile
    track.style.transform = 'none';
  } else {
    // Desktop: show all, use carousel transform
    items.forEach(item => item.style.display = '');
    const translateX = -(slideIndex * (cardWidth + gap));
    track.style.transform = `translateX(${translateX}px)`;
  }

  // Update active dot
  const activeDotIndex = slideIndex === 0 ? 0 : 1;
  dots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx === activeDotIndex);
  });
}

function scrollCollaboratorsCarousel(direction) {
  // Toggle between 0 and 4 (first 4 and next 4)
  if (collaboratorsCurrentIndex === 0) {
    showCollaboratorsSlide(4);
  } else {
    showCollaboratorsSlide(0);
  }
}
document.addEventListener('DOMContentLoaded', () => {
  try {
    console.log('DOMContentLoaded event fired');
    setupNgoArticlesCarousel();
    setupCollaboratorsCarousel();
    setupFlipCards();
    setupSmoothScrolling();
  } catch (e) {
    console.error('Error in DOMContentLoaded handler:', e);
  }
});
function setupCollaboratorsCarousel() {
  const items = document.querySelectorAll('.collaborator-item');
  const dotsContainer = document.getElementById('collaboratorsDots');
  const carousel = document.querySelector('.collaborators-carousel');

  // Create dots
  dotsContainer.innerHTML = '';
  const totalDots = Math.ceil(items.length / 4);
  for (let i = 0; i < totalDots; i++) {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    dot.addEventListener('click', () => {
      const targetIndex = i * 4;
      showCollaboratorsSlide(targetIndex);
      resetCollaboratorsAutoSlide();
    });
    dotsContainer.appendChild(dot);
  }

  // Auto-scroll logic
  function startCollaboratorsAutoSlide() {
    collaboratorsAutoSlideInterval = setInterval(() => {
      if (collaboratorsCurrentIndex === 0) {
        showCollaboratorsSlide(4);
      } else {
        showCollaboratorsSlide(0);
      }
      resetCollaboratorsAutoSlide(); // Always reset after scroll
    }, 4000);
  }

  function stopCollaboratorsAutoSlide() {
    clearInterval(collaboratorsAutoSlideInterval);
  }

  function resetCollaboratorsAutoSlide() {
    stopCollaboratorsAutoSlide();
    startCollaboratorsAutoSlide();
  }

  carousel.addEventListener('mouseenter', stopCollaboratorsAutoSlide);
  carousel.addEventListener('mouseleave', startCollaboratorsAutoSlide);

  collaboratorsCurrentIndex = 0;
  showCollaboratorsSlide(0);
  startCollaboratorsAutoSlide();
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
  setupCollaboratorsCarousel();
  setupFlipCards();
  setupSmoothScrolling();
});
