const canvas = document.getElementById('mazeCanvas');
    const ctx = canvas.getContext('2d');
    const loaderWrapper = document.getElementById('loader-wrapper');
    const progressFill = document.getElementById('progressFill');

    // Konfigurasi Desain Kotak-Kotak
    const config = {
      cellSize: 25,       // Ukuran kotak (Pixel)
      wallGap: 2,         // Jarak antar kotak (biar terlihat tile)
      speed: 20,          // Kecepatan gerak ular (ms) - Semakin kecil semakin cepat
      colors: {
        wall: '#2a2a2a',
        path: '#111111',
        head: '#00ffcc',
        body: '#00ccaa',
        exit: '#ff0055'
      }
    };

    // Ukuran Labirin (Disesuaikan agar layar penuh tapi proporsional)
    let cols, rows;
    let maze = [];
    let solutionPath = [];
    let currentStep = 0;
    let isRunning = true;

    function init() {
      // Hitung jumlah kolom/baris berdasarkan ukuran layar
      // Kita buat sedikit lebih kecil dari layar biar rapi
      const maxW = window.innerWidth * 0.9;
      const maxH = window.innerHeight * 0.6;

      cols = Math.floor(maxW / config.cellSize);
      rows = Math.floor(maxH / config.cellSize);

      // Pastikan ganjil untuk algoritma Recursive Backtracker
      if (cols % 2 === 0) cols--;
      if (rows % 2 === 0) rows--;

      // Atur ukuran canvas
      canvas.width = cols * config.cellSize;
      canvas.height = rows * config.cellSize;

      generateMaze();
      solveMaze();
      drawMazeStatic(); // Gambar labirin statis (dinding)
      animateSnake();
    }

    // 1. Algoritma Labirin (Buat banyak jalan mati)
    function generateMaze() {
      maze = Array(rows).fill().map(() => Array(cols).fill(1)); // 1 = Dinding

      const stack = [];
      const start = {x: 1, y: 1};
      maze[start.y][start.x] = 0; // 0 = Jalan
      stack.push(start);

      const dirs = [
        {x: 0, y: -2}, {x: 0, y: 2},
        {x: -2, y: 0}, {x: 2, y: 0}
      ];

      while(stack.length > 0) {
        const current = stack[stack.length - 1];
        const neighbors = [];

        dirs.forEach(d => {
          const nx = current.x + d.x;
          const ny = current.y + d.y;
          if (nx > 0 && nx < cols - 1 && ny > 0 && ny < rows - 1 && maze[ny][nx] === 1) {
            neighbors.push({nx, ny, dx: d.x/2, dy: d.y/2});
          }
        });

        if (neighbors.length > 0) {
          const chosen = neighbors[Math.floor(Math.random() * neighbors.length)];
          maze[current.y + chosen.dy][current.x + chosen.dx] = 0;
          maze[chosen.ny][chosen.nx] = 0;
          stack.push({x: chosen.nx, y: chosen.ny});
        } else {
          stack.pop();
        }
      }
    }

    // 2. Mencari Solusi (Jalan)
    function solveMaze() {
      const visited = Array(rows).fill().map(() => Array(cols).fill(false));
      const path = [];
      const end = {x: cols - 2, y: rows - 2}; // Target pojok kanan bawah

      function dfs(x, y) {
        if (x === end.x && y === end.y) {
          path.push({x, y});
          return true;
        }
        visited[y][x] = true;
        path.push({x, y});

        const dirs = [{x:0, y:-1}, {x:0, y:1}, {x:-1, y:0}, {x:1, y:0}];
        for (let d of dirs) {
          const nx = x + d.x;
          const ny = y + d.y;
          if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && maze[ny][nx] === 0 && !visited[ny][nx]) {
            if (dfs(nx, ny)) return true;
          }
        }
        path.pop();
        return false;
      }

      dfs(1, 1);
      solutionPath = path;
    }

    // 3. Gambar Labirin Dasar (Hanya Dinding)
    function drawMazeStatic() {
      ctx.fillStyle = config.colors.path;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          if (maze[y][x] === 1) {
            drawTile(x, y, config.colors.wall);
          }
        }
      }

      // Gambar Finish
      const end = solutionPath[solutionPath.length - 1];
      drawTile(end.x, end.y, config.colors.exit);
    }

    function drawTile(x, y, color) {
      const gap = config.wallGap;
      const size = config.cellSize - gap;

      ctx.fillStyle = color;
      ctx.fillRect(
        x * config.cellSize + gap/2,
        y * config.cellSize + gap/2,
        size, size
      );
    }

    // 4. Animasi Ular
    let lastTime = 0;
    function animateSnake(timestamp) {
      if (!isRunning) return;

      if (timestamp - lastTime > config.speed) {
        // Bersihkan area ular lama (opsional, tapi karena kita gambar di atas static, kita perlu redraw area jalan)
        // Efisiensi: Redraw seluruh canvas mungkin berat jika besar, tapi untuk modern browser ok.
        // Untuk optimalisasi, kita hanya redraw sel yang dilewati ular sebelumnya.
        // Tapi cara termudah dan aman: Redraw Maze Static dulu.
        drawMazeStatic();

        // Update Progress Bar
        const progress = (currentStep / solutionPath.length) * 100;
        progressFill.style.width = `${progress}%`;

        // Gambar Badan Ular
        // Panjang ekor visual
        const tailLength = 8;
        const startIndex = Math.max(0, currentStep - tailLength);

        for (let i = startIndex; i <= currentStep; i++) {
          const p = solutionPath[i];
          if (i === currentStep) {
            drawTile(p.x, p.y, config.colors.head); // Kepala
          } else {
            drawTile(p.x, p.y, config.colors.body); // Badan
          }
        }

        // Cek Selesai
        if (currentStep < solutionPath.length - 1) {
          currentStep++;
        } else {
          // SELESAI
          finishLoading();
          return;
        }

        lastTime = timestamp;
      }
      requestAnimationFrame(animateSnake);
    }

    function finishLoading() {
      isRunning = false;
      // Delay sebentar biar user lihat ular sampai finish
      setTimeout(() => {
        loaderWrapper.style.opacity = '0';
        // Hilangkan dari DOM setelah fade out selesai
        setTimeout(() => {
          loaderWrapper.style.display = 'none';
          // Enable scroll again
          document.body.style.overflow = '';
          console.log('🚀 Starting project availability check in 5 seconds...');
          // Start project availability check after 5 seconds
          setTimeout(() => {
            console.log('✅ Starting checkDemoAvailability now');
            checkDemoAvailability();
          }, 5000);
        }, 800);
      }, 500);
    }

    // Disable scroll saat loading
    document.body.style.overflow = 'hidden';

    // Mulai saat load
    window.addEventListener('load', init);