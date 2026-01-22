 // Multi-page certificate carousel with slide effect
      const slidesWrapper = document.getElementById('certSlidesWrapper');
      const certDots = document.querySelectorAll('.cert-dot');
      const certPrev = document.querySelector('.cert-prev');
      const certNext = document.querySelector('.cert-next');
      let currentSlide = 0;
      const totalSlides = 3;

      function goToSlide(index) {
        currentSlide = index;
        slidesWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
        certDots.forEach((dot, i) => {
          dot.classList.toggle('active', i === currentSlide);
          dot.style.background = i === currentSlide ? '#00ffcc' : 'rgba(255,255,255,0.3)';
          dot.style.boxShadow = i === currentSlide ? '0 0 8px rgba(0,255,204,0.6)' : 'none';
        });
      }

      function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        goToSlide(currentSlide);
      }

      function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        goToSlide(currentSlide);
      }

      // Auto slide every 10 seconds
      let certInterval = setInterval(nextSlide, 10000);

      certNext.addEventListener('click', () => {
        nextSlide();
        clearInterval(certInterval);
        certInterval = setInterval(nextSlide, 10000);
      });

      certPrev.addEventListener('click', () => {
        prevSlide();
        clearInterval(certInterval);
        certInterval = setInterval(nextSlide, 10000);
      });

      certDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          goToSlide(index);
          clearInterval(certInterval);
          certInterval = setInterval(nextSlide, 10000);
        });
      });

      // Fullscreen modal
      const fullscreen = document.getElementById('certFullscreen');
      const fullImg = document.getElementById('certFullImg');
      const closeBtn = document.getElementById('certCloseFull');
      const clickableCerts = document.querySelectorAll('.cert-clickable');

      clickableCerts.forEach(img => {
        img.addEventListener('click', () => {
          fullImg.src = img.dataset.full;
          fullscreen.style.display = 'flex';
        });
      });

      closeBtn.addEventListener('click', () => {
        fullscreen.style.display = 'none';
      });

      fullscreen.addEventListener('click', (e) => {
        if (e.target === fullscreen) {
          fullscreen.style.display = 'none';
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          fullscreen.style.display = 'none';
        }
      });