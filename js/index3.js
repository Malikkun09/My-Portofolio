/* ========== SMOOTH SCROLL FUNCTION ========== */
    function smoothScrollTo(targetY, duration){
      const startY = window.pageYOffset;
      const distance = targetY - startY;
      let startTime = null;

      function animation(currentTime){
        if(startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        // Easing function (easeOutCubic)
        const easeProgress = 1 - Math.pow(1 - progress, 3);

        window.scrollTo(0, startY + distance * easeProgress);

        if(progress < 1){
          requestAnimationFrame(animation);
        }
      }

      requestAnimationFrame(animation);
    }

    /* ========== NAVBAR INDICATOR ========== */
    const navLinks = document.querySelectorAll('nav.menu a');
    const indicator = document.getElementById('navIndicator');

    function moveIndicatorTo(link){
      if(!link || !indicator) return;
      // Use offsetLeft for position relative to parent, not viewport
      const left = link.offsetLeft;
      const width = link.offsetWidth;
      indicator.style.transform = `translateX(${left}px)`;
      indicator.style.width = width + 'px';
    }

    function initNavbarIndicator(){
      if(navLinks.length === 0) return;

      // Set initial position
      moveIndicatorTo(navLinks[0]);

      // Click handler with enhanced smooth scroll
      navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = link.getAttribute('href');
          const target = document.querySelector(targetId);
          if(target){
            const offsetTop = target.offsetTop - 80;

            // Visual feedback
            document.body.style.cursor = 'progress';
            setTimeout(() => {
              document.body.style.cursor = 'default';
            }, 800);

            smoothScrollTo(offsetTop, 800);
            moveIndicatorTo(link);
          }
        });
      });

      // Enhanced scroll observer with debounce
      const sections = Array.from(navLinks).map(a => document.querySelector(a.getAttribute('href')));
      let scrollTimeout;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if(entry.isIntersecting){
            const index = sections.indexOf(entry.target);
            if(index >= 0){
              // Debounce scroll spy updates
              clearTimeout(scrollTimeout);
              scrollTimeout = setTimeout(() => {
                navLinks.forEach(l => l.classList.remove('active'));
                navLinks[index].classList.add('active');
                moveIndicatorTo(navLinks[index]);
              }, 100);
            }
          }
        });
      }, { threshold: 0.5 });

      sections.forEach(section => section && observer.observe(section));
    }

    /* ========== SKILL BARS ANIMATION ========== */
    function initSkillBars(){
      const skillBars = document.querySelectorAll('.progress-fill[data-skill]');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if(entry.isIntersecting){
            const bar = entry.target;
            const percentage = bar.getAttribute('data-skill') || '0';
            setTimeout(() => {
              bar.style.width = percentage + '%';
            }, 200);

            // Update percentage text
            const percentageEl = bar.parentElement.parentElement.querySelector('.skill-percentage');
            if(percentageEl){
              percentageEl.textContent = percentage + '%';
            }

            observer.unobserve(bar);
          }
        });
      }, { threshold: 0.25 });

      skillBars.forEach(bar => observer.observe(bar));
    }

    /* ========== MOBILE NAVIGATION ========== */
    const hamburger = document.getElementById('hamburger');
    const menu = document.querySelector('nav.menu');
    const mobileOverlay = document.getElementById('mobileOverlay');

    function initMobileNav(){
      if(!hamburger || !menu) return;

      hamburger.addEventListener('click', () => {
        menu.classList.toggle('open');
        mobileOverlay.classList.toggle('active');
        const isOpen = menu.classList.contains('open');
        hamburger.setAttribute('aria-expanded', isOpen);

        // Prevent body scroll when menu is open
        if(isOpen){
          document.body.style.overflow = 'hidden';
        }else{
          document.body.style.overflow = '';
        }
      });

      // Close menu when clicking a link
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          menu.classList.remove('open');
          mobileOverlay.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
          // Restore scroll
          document.body.style.overflow = '';
        });
      });

      // Close menu when clicking overlay
      mobileOverlay.addEventListener('click', () => {
        menu.classList.remove('open');
        mobileOverlay.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        // Restore scroll
        document.body.style.overflow = '';
      });
    }


    /* ========== FADE IN ANIMATION ========== */
    function initFadeInAnimation(){
      const elements = document.querySelectorAll('section .fade-in, section > *');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if(entry.isIntersecting){
            entry.target.classList.add('visible');
          }
        });
      }, { threshold: 0.1 });

      elements.forEach(el => observer.observe(el));
    }

    /* ========== CHECK PROJECT DEMO AVAILABILITY ========== */
    async function checkDemoAvailability() {
      const projectCards = document.querySelectorAll('.project-card.project-loading');
      let completedChecks = 0;
      const totalChecks = projectCards.length;

      console.log(`📋 Checking ${totalChecks} projects...`);

      projectCards.forEach((card) => {
        const demoUrl = card.getAttribute('data-url');
        const loadingOverlay = card.querySelector('.card-loading-overlay');
        console.log(`🔍 Checking: ${demoUrl}`);

        // Flag untuk mencegah double execution
        let checked = false;

        // Fungsi tandai berhasil
        function markSuccess() {
          if (checked) return;
          checked = true;
          clearTimeout(domainTimeout);
          console.log(`🟢 SUCCESS: ${demoUrl}`);
          loadingOverlay.classList.remove('visible');
          // Tampilkan tombol demo (jika ada)
          const demoBtn = card.querySelector('.status-demo-btn');
          if (demoBtn) {
            demoBtn.style.display = 'inline-flex';
          }
          // Tambah badge online
          const statusBadge = document.createElement('span');
          statusBadge.innerHTML = '🟢 Online';
          statusBadge.style.cssText = `
            position: absolute;
            top: 12px;
            right: 12px;
            padding: 4px 10px;
            background: rgba(147, 255, 138, 0.15);
            border: 1px solid rgba(147, 255, 138, 0.4);
            border-radius: 20px;
            font-size: 0.7rem;
            color: #93ff8a;
            z-index: 10;
          `;
          card.style.position = 'relative';
          card.appendChild(statusBadge);

          // Update status button untuk Chat Live
          const statusDot = card.querySelector('.status-dot');
          const statusText = card.querySelector('.status-text');
          if (statusDot) {
            statusDot.classList.add('online');
            statusDot.classList.remove('offline');
          }
          if (statusText) {
            statusText.textContent = 'Online';
            statusText.classList.add('online');
            statusText.classList.remove('offline');
          }
          completedChecks++;
        }

        // Fungsi tandai error
        function markError() {
          if (checked) return;
          checked = true;
          clearTimeout(domainTimeout);
          console.log(`🔴 ERROR: ${demoUrl}`);
          loadingOverlay.classList.remove('visible');
          // Card jadi merah
          card.style.boxShadow = '0 0 20px rgba(255, 63, 52, 0.4)';
          card.style.borderColor = 'rgba(255, 63, 52, 0.5)';
          // Tambah error badge
          const errorBadge = document.createElement('span');
          errorBadge.innerHTML = '🔴 Demo Tidak Tersedia';
          errorBadge.style.cssText = `
            position: absolute;
            top: 12px;
            right: 12px;
            padding: 4px 10px;
            background: rgba(255, 63, 52, 0.15);
            border: 1px solid rgba(255, 63, 52, 0.4);
            border-radius: 20px;
            font-size: 0.7rem;
            color: #ff3f34;
            z-index: 10;
          `;
          card.style.position = 'relative';
          card.appendChild(errorBadge);
          // Hapus hanya tombol demo (status-demo-btn), BUKAN GitHub
          const demoBtn = card.querySelector('.status-demo-btn');
          if (demoBtn) demoBtn.remove();

          // Update status button untuk Chat Live
          const statusDot = card.querySelector('.status-dot');
          const statusText = card.querySelector('.status-text');
          if (statusDot) {
            statusDot.classList.add('offline');
            statusDot.classList.remove('online');
          }
          if (statusText) {
            statusText.textContent = 'Offline';
            statusText.classList.add('offline');
            statusText.classList.remove('online');
          }
          completedChecks++;
        }

        // Timeout 10 detik - sama seperti error (demo tidak tersedia)
        const domainTimeout = setTimeout(() => {
          if (checked) return;
          checked = true;
          console.log(`🔴 TIMEOUT: ${demoUrl}`);
          loadingOverlay.classList.remove('visible');
          // Card jadi merah
          card.style.boxShadow = '0 0 20px rgba(255, 63, 52, 0.4)';
          card.style.borderColor = 'rgba(255, 63, 52, 0.5)';
          // Tambah error badge
          const errorBadge = document.createElement('span');
          errorBadge.innerHTML = '🔴 Demo Tidak Tersedia';
          errorBadge.style.cssText = `
            position: absolute;
            top: 12px;
            right: 12px;
            padding: 4px 10px;
            background: rgba(255, 63, 52, 0.15);
            border: 1px solid rgba(255, 63, 52, 0.4);
            border-radius: 20px;
            font-size: 0.7rem;
            color: #ff3f34;
            z-index: 10;
          `;
          card.style.position = 'relative';
          card.appendChild(errorBadge);
          // Hapus tombol demo jika ada
          const demoBtn = card.querySelector('.status-demo-btn');
          if (demoBtn) demoBtn.remove();
          completedChecks++;
        }, 10000);

        // Parallel checks: favicon + fetch
        let successCount = 0;
        function checkSuccess() {
          successCount++;
          if (successCount >= 1 && !checked) {
            markSuccess();
          }
        }

        // Check 1: Favicon (paling reliable)
        const img = new Image();
        img.onload = () => checkSuccess();
        img.onerror = () => {};
        img.src = new URL(demoUrl).origin + '/favicon.ico?t=' + Date.now();

        // Check 2: Fetch (backup)
        fetch(demoUrl, { method: 'HEAD', mode: 'no-cors', cache: 'no-cache' })
          .then(() => checkSuccess())
          .catch(() => {});
      });
    }

    /* ========== INITIALIZE ========== */
    document.addEventListener('DOMContentLoaded', () => {
      initNavbarIndicator();
      initSkillBars();
      initMobileNav();
      initFadeInAnimation();
    });

    /* ========== SMOOTH SCROLL FOR ALL ANCHORS ========== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if(href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if(target){
          const offsetTop = target.offsetTop - 80;
          smoothScrollTo(offsetTop, 800);
        }
      });
    });