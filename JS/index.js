/* =========================
       Inisialisasi & Data Dummy
       ========================= */

    // ----- PENTING (konfigurasi komentar publik) -----
    const PUBLIC_COMMENTS_URL = ''; // <-- isi jika mau komentar publik

    // Contoh daftar projek (12 + 12). Kamu bisa ganti data ini.
    const sampleProjects = Array.from({length:12},(_,i)=>({
      id: 'p'+(i+1),
      title: `Projek PPLG #${i+1}`,
      desc: `Deskripsi singkat tentang projek PPLG ${i+1}. Fokus: pemrograman, database, UI/UX.`,
      img: `https://picsum.photos/seed/p${i+1}/600/400`,
      category: ['web','game','db','uiux'][i % 4]
    }));
    const sampleWIP = Array.from({length:12},(_,i)=>({
      id: 'w'+(i+1),
      title: `WIP Projek #${i+1}`,
      desc: `Proses pengembangan fitur untuk projek ${i+1}.`,
      img: `https://picsum.photos/seed/w${i+1}/600/400`,
      category: ['web','game','db','uiux'][i % 4]
    }));

    /* =========================
       Loading Screen Logic
       ========================= */
    (function loadingSequence(){
      const progressBar = document.getElementById('progressBar');
      const loadingScreen = document.getElementById('loadingScreen');

      let value = 0;
      const duration = 3000 + Math.floor(Math.random()*1200);
      const step = 50;
      const increments = duration / step;
      const per = 100 / increments;

      const timer = setInterval(()=>{
        value += per;
        if (value >= 100) value = 100;
        progressBar.style.width = value + '%';
        progressBar.parentElement.setAttribute('aria-valuenow', Math.round(value));
        if (value >= 100) {
          clearInterval(timer);
          // apply fade-out class for smoother exit
          loadingScreen.classList.add('fade-out');
          // after fade-out, remove node and perform special finish animation
          setTimeout(()=>{
            try{ loadingScreen.remove(); }catch(e){}
            // focus main content
            const main = document.getElementById('home'); if(main) main.focus();
            // special hero pulse to celebrate load completion
            const hero = document.querySelector('.hero');
            if(hero){ hero.classList.add('hero-finish-pulse'); setTimeout(()=> hero.classList.remove('hero-finish-pulse'), 1200); }
            // stagger reveal project cards (if any exist in DOM)
            const lists = document.querySelectorAll('.grid');
            lists.forEach((g,i)=>{
              // add helper class and then trigger revealed after small delay
              g.classList.add('stagger-reveal');
              setTimeout(()=>{ g.classList.add('revealed');
                // animate children with incremental delay
                Array.from(g.children).forEach((child, idx)=>{ child.style.animationDelay = (idx*40)+'ms'; });
              }, 240 + i*80);
            });
          }, 520);
        }
      }, step);
    })();

    /* =========================
       Navbar behavior (scroll + mobile offcanvas)
       ========================= */
    const header = document.getElementById('siteHeader');
    window.addEventListener('scroll', ()=>{
      if (window.scrollY > 20) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    });

    // Offcanvas open/close
    const offcanvas = document.getElementById('offcanvasMenu');
    const hambBtn = document.getElementById('hambBtn');
    const closeOff = document.getElementById('closeOff');

    function openOff(){offcanvas.classList.add('open');offcanvas.setAttribute('aria-hidden','false');}
    function closeOffcanvas(){offcanvas.classList.remove('open');offcanvas.setAttribute('aria-hidden','true');hambBtn.focus();}
    hambBtn.addEventListener('click', openOff);
    closeOff.addEventListener('click', closeOffcanvas);

    /* ========== Generate 'My Other Website' mini-cards for mobile offcanvas ========== */
    const mobileOtherSites = document.getElementById('mobileOtherSites');
    const otherSitesData = [
      {name:'Blog Foto', img:'https://picsum.photos/seed/site1/200/200', href:'#'},
      {name:'CV Online', img:'https://picsum.photos/seed/site2/200/200', href:'#'},
      {name:'Projek Game', img:'https://picsum.photos/seed/site3/200/200', href:'#'},
      {name:'Repo Git', img:'https://picsum.photos/seed/site4/200/200', href:'#'}
    ];

    otherSitesData.forEach(s=>{
      const el = document.createElement('div');
      el.className='site-card';
      el.innerHTML = `<a href="${s.href}" target="_blank" rel="noopener noreferrer"><img src="${s.img}" alt="${s.name}" style="width:100%;height:80px;object-fit:cover;border-radius:6px;margin-bottom:6px"><div style="font-weight:700">${s.name}</div></a>`;
      mobileOtherSites.appendChild(el);
    });

    // 'My Other Website' button (desktop): buka modal kecil
    document.getElementById('otherSitesBtn').addEventListener('click', ()=>{
      const modal = document.createElement('div');
      modal.style.position='fixed';modal.style.left='50%';modal.style.top='50%';modal.style.transform='translate(-50%,-50%)';
      modal.style.zIndex=2000;modal.style.width='min(720px,92%)';
      modal.style.background='linear-gradient(180deg,#111,#090909)';modal.style.borderRadius='12px';modal.style.boxShadow='0 10px 40px rgba(0,0,0,0.7)';
      modal.style.padding='18px';
      modal.setAttribute('role','dialog');
      modal.setAttribute('aria-modal','true');
      modal.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center"><strong style="font-size:18px">My Other Website</strong><button id="closeModal" style="background:transparent;border:none;color:${getComputedStyle(document.documentElement).getPropertyValue('--muted')};font-size:18px;cursor:pointer" aria-label="Tutup">✕</button></div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-top:12px">${otherSitesData.map(s=>`<div style="background:rgba(255,255,255,0.03);padding:10px;border-radius:10px;text-align:center"><img src="${s.img}" alt="${s.name}" style="width:100%;height:90px;object-fit:cover;border-radius:6px"><div style="font-weight:700;margin-top:8px">${s.name}</div><a href="${s.href}" target="_blank" rel="noopener noreferrer" style="display:inline-block;margin-top:8px;padding:6px 8px;border-radius:8px;background:linear-gradient(90deg,#ffd166,#6ef0a6);color:#000;font-weight:700">Kunjungi</a></div>`).join('')}</div>`;
      const overlay = document.createElement('div');
      overlay.style.position='fixed';overlay.style.inset='0';overlay.style.background='rgba(0,0,0,0.6)';overlay.style.zIndex=1999;
      overlay.tabIndex = -1;
      document.body.appendChild(overlay);
      document.body.appendChild(modal);
      modal.focus?.();
      document.body.style.overflow='hidden';
      document.getElementById('closeModal').addEventListener('click', ()=>{modal.remove();overlay.remove();document.body.style.overflow='';document.getElementById('otherSitesBtn').focus();});
      overlay.addEventListener('click', ()=>{modal.remove();overlay.remove();document.body.style.overflow='';document.getElementById('otherSitesBtn').focus();});
      document.addEventListener('keydown', function escHandler(e){ if (e.key === 'Escape'){ modal.remove(); overlay.remove(); document.body.style.overflow=''; document.getElementById('otherSitesBtn').focus(); document.removeEventListener('keydown', escHandler); }});
    });

    /* ========== Avatar Flip Behavior ========== */
    const avatarInner = document.getElementById('avatarInner');
    const avatar = document.getElementById('avatar');
    function toggleAvatar(){
      const flipped = avatarInner.classList.toggle('flipped');
      avatar.setAttribute('aria-pressed', flipped ? 'true' : 'false');
    }
    avatar.addEventListener('click', toggleAvatar);
    avatar.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleAvatar(); } });

    /* ========== Prepare DOM references ========== */
    const projectsGrid = document.getElementById('projectsGrid');
    const workInProgressGrid = document.getElementById('workInProgressGrid');

    /* ========== IntersectionObserver untuk animasi masuk card ========== */
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(ent=>{
        if (ent.isIntersecting) ent.target.classList.add('visible');
      });
    },{threshold:0.12});

    /* ========== Generate Project Cards ========== */

    // Buat card tanpa tombol hapus (sesuai permintaan)
    function makeCard(item){
      const c = document.createElement('article');
      c.className = 'card';
      c.setAttribute('data-id', item.id);
      c.innerHTML = `
        <div class="thumb"><img src="${item.img}" alt="${item.title}"></div>
        <h4>${item.title}</h4>
        <p>${item.desc}</p>
        <div class="actions">
          <button class="btn btn-primary btn-detail" style="font-size:13px">Detail</button>
        </div>
      `;
      return c;
    }

    // render semua (tampilkan awal beberapa, sisanya lazy load)
    let projectsLoaded = 6;
    function renderProjects(filter='all'){
      projectsGrid.innerHTML = '';
      const list = sampleProjects.filter(p => filter === 'all' ? true : p.category === filter);
      const toShow = list.slice(0, projectsLoaded);
      toShow.forEach(p => {
        const c = makeCard(p);
        projectsGrid.appendChild(c);
        obs.observe(c); // observe untuk animasi masuk
      });
    }

    let wipLoaded = sampleWIP.length; // tampilkan semua WIP
    function renderWIP(){
      workInProgressGrid.innerHTML = '';
      sampleWIP.forEach(p => {
        const c = makeCard(p);
        workInProgressGrid.appendChild(c);
        obs.observe(c);
      });
    }

    // inisialisasi awal
    renderProjects();
    renderWIP();

    // handle Detail button contoh: modal
    document.body.addEventListener('click', (e)=>{
      if (e.target.matches('.btn-detail')){
        const card = e.target.closest('.card');
        const title = card.querySelector('h4').textContent;
        const desc = card.querySelector('p').textContent;
        const modal = document.createElement('div');
        modal.style.position='fixed';modal.style.left='50%';modal.style.top='50%';modal.style.transform='translate(-50%,-50%)';
        modal.style.zIndex=2100; modal.style.width='min(720px,92%)';
        modal.style.background='linear-gradient(180deg,#111,#0b0b0b)';modal.style.borderRadius='12px';modal.style.boxShadow='0 10px 40px rgba(0,0,0,0.7)';modal.style.padding='18px';
        modal.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center"><strong style="font-size:18px">${escapeHtml(title)}</strong><button id="closeDetail" style="background:transparent;border:none;color:${getComputedStyle(document.documentElement).getPropertyValue('--muted')};font-size:18px;cursor:pointer">✕</button></div>
          <div style="margin-top:12px;color:var(--muted)">${escapeHtml(desc)}</div>`;
        const overlay = document.createElement('div');
        overlay.style.position='fixed';overlay.style.inset='0';overlay.style.background='rgba(0,0,0,0.6)';overlay.style.zIndex=2099;
        document.body.appendChild(overlay);
        document.body.appendChild(modal);
        document.body.style.overflow='hidden';
        document.getElementById('closeDetail').addEventListener('click', ()=>{modal.remove();overlay.remove();document.body.style.overflow='';});
        overlay.addEventListener('click', ()=>{modal.remove();overlay.remove();document.body.style.overflow='';});
      }
    });

    // Muat lebih banyak projek
    document.getElementById('loadMoreProjects').addEventListener('click', ()=>{
      projectsLoaded += 6;
      const sel = document.getElementById('filterProjects').value;
      renderProjects(sel);
    });

    // Filter projek
    document.getElementById('filterProjects').addEventListener('change', (e)=>{
      const sel = e.target.value;
      renderProjects(sel);
    });

    /* ========== COMMENTS (localStorage OR PUBLIC) ========== */
    const commentForm = document.getElementById('commentForm');
    const localCommentsKey = 'malik_comments_v1';
    const commentsList = document.getElementById('commentsList');
    const clearBtn = document.getElementById('clearComments');

    // Utility escape
    function escapeHtml(s){ return String(s).replace(/[&<>"']/g, (m)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m])); }

    function isRemoteMode(){ return typeof PUBLIC_COMMENTS_URL === 'string' && PUBLIC_COMMENTS_URL.trim().length > 0; }
    function getRemoteBase(){ if (!isRemoteMode()) return null; return PUBLIC_COMMENTS_URL.replace(/\/?\.?json?$/,'').replace(/\/$/,''); }

    async function loadComments(){
      if (isRemoteMode()){
        try{
          const res = await fetch(PUBLIC_COMMENTS_URL, {cache:'no-store'});
          if (!res.ok) throw new Error('Gagal mengambil komentar publik');
          const data = await res.json();
          if (Array.isArray(data)) return data.filter(Boolean).map(x=>({ ...x, id: x.id || x.ts || null }));
          else if (data && typeof data === 'object') return Object.keys(data).map(k => ({ ...data[k], id: k }));
          else return [];
        }catch(err){
          console.error('Error load public comments:', err);
          const raw = localStorage.getItem(localCommentsKey);
          return raw ? JSON.parse(raw) : [];
        }
      } else {
        const raw = localStorage.getItem(localCommentsKey);
        return raw ? JSON.parse(raw) : [];
      }
    }

    async function saveComment(comment){
      if (isRemoteMode()){
        try{
          const base = getRemoteBase();
          const postUrl = base.endsWith('.json') ? base : base + '.json';
          const res = await fetch(postUrl, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(comment)
          });
          if (!res.ok) throw new Error('Gagal mengirim komentar ke server');
          const data = await res.json();
          return { ...comment, id: data.name || null };
        }catch(err){
          console.error('Error save public comment:', err);
          const list = loadCommentsSync();
          list.push(comment);
          saveCommentsSync(list);
          return comment;
        }
      } else {
        const list = loadCommentsSync();
        list.push(comment);
        saveCommentsSync(list);
        return comment;
      }
    }

    async function deleteComment(id){
      if (isRemoteMode()){
        try{
          const base = getRemoteBase();
          if (!base) throw new Error('Remote base invalid');
          const delUrl = base + '/' + encodeURIComponent(id) + '.json';
          const res = await fetch(delUrl, {method:'DELETE'});
          if (!res.ok) throw new Error('Gagal menghapus komentar publik');
          return true;
        }catch(err){
          console.error('Error delete public comment:', err);
          return false;
        }
      } else {
        let list = loadCommentsSync();
        list = list.filter(c => String(c.ts) !== String(id));
        saveCommentsSync(list);
        return true;
      }
    }

    function loadCommentsSync(){ const raw = localStorage.getItem(localCommentsKey); return raw ? JSON.parse(raw) : []; }
    function saveCommentsSync(list){ localStorage.setItem(localCommentsKey, JSON.stringify(list)); }

    async function renderComments(){
      const list = await loadComments();
      if (!list || !list.length) {
        commentsList.innerHTML = '<div style="color:var(--muted)">Belum ada komentar. Tulis komentar di form.</div>';
        return;
      }
      commentsList.innerHTML = '';
      list.slice().reverse().forEach((c,idx)=>{
        const id = c.id || c.ts || ('local-'+(c.ts||Date.now()));
        const el = document.createElement('div');
        el.className = 'comment';
        el.innerHTML = `<div style="width:44px;height:44px;border-radius:8px;background:rgba(255,255,255,0.04);display:flex;align-items:center;justify-content:center;font-weight:700">${escapeHtml((c.name||'U').charAt(0).toUpperCase())}</div>
          <div style="flex:1">
            <div class="meta">${escapeHtml(c.name||'Anonim')} <small style="color:var(--muted);font-weight:600"> - ${new Date(c.ts||Date.now()).toLocaleString()}</small></div>
            <div class="text">${escapeHtml(c.msg)}</div>
          </div>
          <div style="margin-left:8px;display:flex;flex-direction:column;gap:8px">
            <button class="btn btn-outline btn-delete-comment" data-id="${escapeHtml(id)}" style="font-size:13px">Hapus</button>
          </div>`;
        commentsList.appendChild(el);
      });
    }

    commentForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const msg = document.getElementById('message').value.trim();
      if (!name || !msg) return alert('Nama dan pesan wajib diisi');
      const payload = { name, msg, ts: Date.now() };
      await saveComment(payload);
      await renderComments();
      commentForm.reset();
    });

    commentsList.addEventListener('click', async (e)=>{
      if (e.target.matches('.btn-delete-comment')){
        const id = e.target.getAttribute('data-id');
        if (!confirm('Hapus komentar ini?')) return;
        const ok = await deleteComment(id);
        if (ok) await renderComments();
        else alert('Gagal menghapus komentar (periksa konfigurasi PUBLIC_COMMENTS_URL atau koneksi).');
      }
    });

    clearBtn.addEventListener('click', async ()=>{
      if (isRemoteMode()){
        if (!confirm('Mode publik aktif. Penghapusan semua komentar publik tidak didukung dari UI ini. Ingin menghapus lokal saja?')) return;
      }
      if (confirm('Hapus semua komentar yang tersimpan di browser ini?')){
        localStorage.removeItem(localCommentsKey);
        await renderComments();
      }
    });

    renderComments();

    /* ========== UTILITY & FINAL TOUCH ========== */
    document.getElementById('year').textContent = new Date().getFullYear();

    document.addEventListener('keydown',(e)=>{ if (e.key === 'Escape'){ closeOffcanvas(); } });

    // small entrance animations for header and early sections (fade-in)
    document.addEventListener('DOMContentLoaded', ()=>{
      const header = document.getElementById('siteHeader');
      const firstSections = document.querySelectorAll('.hero, .section');
      // header fade-in
      if(header){ header.classList.add('fade-in'); }
      // stagger first sections
      firstSections.forEach((s, i)=>{ setTimeout(()=> s.classList.add('fade-in'), 120 + i*120); });
    });

    /* =========================
       Catatan:
       - Perbaikan utama: IntersectionObserver (obs) dideklarasikan sebelum dipakai,
         dan variabel grid WIP dibuat sebagai workInProgressGrid (konsisten).
       - Kalau masih kosong: buka DevTools (F12) → Console. Kalau ada error tunjukkan ke aku.
       - Mau aku perbaiki supaya auto-scroll ke bagian proyek kalau page dibuka dengan hash #myprojek? Bisa.
       ========================= */
       
const waLink = window.__ENV?.NOMOR_MALIK || "#";

// Navbar link
const contactLink = document.getElementById("contactLink");
if (contactLink) contactLink.href = waLink;

// Tombol hero
const contactBtn = document.getElementById("contactBtn");
if (contactBtn) {
  contactBtn.textContent = "Hubungi via WhatsApp";
  contactBtn.onclick = () => window.open(waLink, "_blank");
}


