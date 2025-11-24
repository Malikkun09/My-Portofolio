document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Loading Screen ---
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                startTypingEffect();
            }, 500);
        }, 1500); // Durasi loader
    });

    // --- 2. Efek Mengetik di Hero ---
    const words = ["Coding", "Games", "Anime", "Cyber Security", "UI / UX Designer", "Website", "AI Algoritma", "AI Research", "HIDUP JOKOWI"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseTime = 2000;
    const changingTextElement = document.getElementById('changing-text');

    function typeWriter() {
        if (!changingTextElement) return; // Berhenti jika elemen tidak ada

        const currentWord = words[wordIndex];

        if (!isDeleting) {
            changingTextElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === currentWord.length) {
                isDeleting = true;
                setTimeout(typeWriter, pauseTime);
                return;
            }
        } else {
            changingTextElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
            }
        }
        const speed = isDeleting ? deletingSpeed : typingSpeed;
        setTimeout(typeWriter, speed);
    }

    function startTypingEffect() {
        setTimeout(typeWriter, 500);
    }

    // --- 3. Efek Scroll untuk Navbar ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- 4. Toggle Menu Mobile ---
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // --- 5. Efek Animasi Skill Bar Saat Di-Scroll (YANG DIPERBAIKI) ---
    const skillBars = document.querySelectorAll('.progress-fill');

    // Cek apakah ada skill bar di halaman
    if (skillBars.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5 // Memicu saat 50% elemen terlihat
        };

        // Map to hold active timers for each bar so we can stop the loop later
        const activeTimers = new WeakMap();

        function startLoop(bar) {
            if (activeTimers.has(bar)) return; // already running
            const maxWidth = bar.dataset.width || '100%';
            // Start from 0 width
            bar.style.width = '0%';
            let increasing = true;

            // define a step function that toggles the bar width
            const step = () => {
                // if not running, exit
                if (!activeTimers.has(bar)) return;
                bar.style.width = increasing ? maxWidth : '0%';
                increasing = !increasing;
                const delay = 1600; // match CSS transition (1.5s) + margin
                const id = setTimeout(step, delay);
                activeTimers.set(bar, id);
            };

            // kick off the loop
            const id = setTimeout(step, 50);
            activeTimers.set(bar, id);
        }

        function stopLoop(bar) {
            if (!activeTimers.has(bar)) return;
            clearTimeout(activeTimers.get(bar));
            activeTimers.delete(bar);
            // reset to 0 width when leaving the viewport
            bar.style.width = '0%';
        }

        const observerCallback = (entries) => {
            entries.forEach(entry => {
                const progressBar = entry.target;
                if (entry.isIntersecting) {
                    // start looping when visible
                    console.log(`Start looping skill bar: ${progressBar.dataset.width}`);
                    startLoop(progressBar);
                } else {
                    // stop looping when not visible
                    stopLoop(progressBar);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        // Mulai mengamati setiap progress bar
        skillBars.forEach(bar => {
            observer.observe(bar);
        });
    }

    // --- 6. Efek Flip Card ---
    const dreamsCard = document.getElementById('dreamsCard');
    if(dreamsCard) {
        dreamsCard.addEventListener('click', () => {
            dreamsCard.classList.toggle('flipped');
        });
    }
});
