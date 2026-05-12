import './style.css'

/* ─────────────────────────────────────────────
   KONFIGURASI PLAYLIST INFINITY LOOP
───────────────────────────────────────────── */
const playlist = ['/ShapeOfMyHeart.mp3', '/bixby-distance.mp3'];
let currentSongIndex = 0;

/* ─────────────────────────────────────────────
   OPENING — buka kado
───────────────────────────────────────────── */
function bukaKado() {
  const opening = document.getElementById('opening-screen')
  const main    = document.getElementById('main-content')
  const navbar  = document.getElementById('navbar')

  if(opening) opening.classList.add('is-closing')

  setTimeout(() => {
    if(opening) opening.style.display = 'none'
    if(main) main.classList.remove('hidden')
    if(navbar) {
        navbar.classList.remove('navbar--hidden')
        navbar.classList.add('navbar--visible')
    }

    // --- MUNCULKAN & PUTAR MUSIK SECARA LANGSUNG (LAGU 1) ---
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    
    if (musicToggle) {
        musicToggle.classList.add('is-visible');
        musicToggle.style.opacity = '1';
        musicToggle.style.pointerEvents = 'auto';
        musicToggle.style.transform = 'translateY(0) scale(1)';
    }
    
    if (bgMusic) {
        currentSongIndex = 0;
        bgMusic.src = playlist[currentSongIndex];
        bgMusic.play().then(() => {
            if (musicToggle) musicToggle.classList.add('is-playing');
        }).catch(err => console.log('Browser butuh interaksi: ', err));
    }
    // --------------------------------------------------------

    sessionStorage.setItem('sudah-dibuka', 'ya')

    spawnBubbles()
    spawnFloatingHearts()
    initMosaicParallax()
    initScrollReveal()
    initCinema()
    initReasons()
    showFooter()

    const halaman = getHalamanDariURL()
    tampilkanHalaman(halaman, false)
  }, 920)
}

/* ─────────────────────────────────────────────
   URL ROUTING HELPERS
───────────────────────────────────────────── */
const routeMap = {
  '':           'home',
  '#/beranda':  'home',
  '#/galeri':   'galeri',
  '#/surat':    'pesan',
  '#/lagu':     'lagu',
  '#/animasi':  'animasi',
}

const pageToPath = {
  'home':   '#/beranda',
  'galeri': '#/galeri',
  'pesan':  '#/surat',
  'lagu':   '#/lagu',
  'animasi': '#/animasi',
}

function getHalamanDariURL() {
  const hash = window.location.hash
  return routeMap[hash] ?? 'home'
}

/* ─────────────────────────────────────────────
   NAVIGATION
───────────────────────────────────────────── */
function pindahHalaman(target) {
  if (target === 'animasi') {
    window.location.href = 'https://mitaachan.github.io/animasi/'; // Pastikan URL ini benar
    return;
  }
  
  const hash = pageToPath[target] ?? '#/beranda'
  window.location.hash = hash // Secara otomatis menangani history
  tampilkanHalaman(target, true)
}

// Tambahkan listener untuk mendeteksi perubahan hash secara manual
window.addEventListener('hashchange', () => {
  const halaman = getHalamanDariURL()
  tampilkanHalaman(halaman, false)
})

function tampilkanHalaman(target, scroll = true) {
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'))

  const page = document.getElementById('page-' + target)
  if (page) page.classList.remove('hidden')

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('nav-btn--active', btn.dataset.page === target)
  })

  if (scroll) window.scrollTo({ top: 0, behavior: 'smooth' })
}

window.bukaKado      = bukaKado
window.pindahHalaman = pindahHalaman

/* ─────────────────────────────────────────────
   DEKORASI & ANIMASI (STARS, BUBBLES, DLL)
───────────────────────────────────────────── */
function spawnStars () {
  const c = document.getElementById('stars-container')
  if (!c) return
  for (let i = 0; i < 70; i++) {
    const el = document.createElement('div')
    el.className = 'star'
    const size = rand(.8, 2.5)
    el.style.cssText = `left:${rand(0,100)}%;top:${rand(0,100)}%;width:${size}px;height:${size}px;--d:${rand(2,5).toFixed(1)}s;--dl:${rand(0,5).toFixed(1)}s;`
    c.appendChild(el)
  }
}

function spawnBubbles () {
  for (let i = 0; i < 14; i++) {
    const el = document.createElement('div')
    el.className = 'bubble'
    const size = rand(8, 24)
    el.style.cssText = `width:${size}px;height:${size}px;left:${rand(0,100)}%;bottom:0;--d:${rand(7,13).toFixed(1)}s;--dl:${rand(0,12).toFixed(1)}s;--drift:${(Math.random()-.5)*80}px;`
    document.body.appendChild(el)
  }
}

function spawnFloatingHearts () {
  const c = document.getElementById('floating-hearts')
  if (!c) return
  const emojis = ['❤️','🐳','💕','🌸','✨','💖','🐋']
  for (let i = 0; i < 10; i++) {
    const el = document.createElement('div')
    el.className = 'heart-float'
    el.style.cssText = `left:${rand(3,95)}%;--d:${rand(5,9).toFixed(1)}s;--dl:${rand(0,10).toFixed(1)}s;--sz:${rand(.8,1.6).toFixed(2)}rem;--rot:${(Math.random()-.5)*50}deg;`
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)]
    c.appendChild(el)
  }
}

function initMosaicParallax () {
  const row1 = document.querySelector('.mosaic-row--1')
  const row2 = document.querySelector('.mosaic-row--2')
  const section = document.querySelector('.mosaic-section')
  if (!row1 || !row2 || !section) return
  function onScroll () {
    const rect = section.getBoundingClientRect()
    const visible = rect.top < window.innerHeight && rect.bottom > 0
    if (!visible) return
    const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
    const offset = (progress - 0.5) * 60
    row1.style.transform = `translateY(${-offset * 0.6}px)`
    row2.style.transform = `translateY(${offset * 0.4}px)`
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
}

function initScrollReveal () {
  const heading = document.querySelector('.tl-heading')
  if (heading) {
    heading.style.opacity = '0'
    heading.style.transform = 'translateY(30px)'
    heading.style.transition = 'opacity .8s ease, transform .8s ease'
  }
  document.querySelectorAll('.tl-feat').forEach(el => { el.style.opacity = '0' })
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return
      const el = entry.target
      if (el.classList.contains('tl-heading')) {
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      }
      if (el.classList.contains('tl-feat')) el.style.animation = ''
      io.unobserve(el)
    })
  }, { threshold: .25 })
  if (heading) io.observe(heading)
  document.querySelectorAll('.tl-feat').forEach(el => io.observe(el))
}

function initCinema () {
  const nameEl = document.getElementById('cinema-name')
  if (nameEl) {
    const text = nameEl.textContent.trim()
    nameEl.textContent = ''
    text.split('').forEach((ch, i) => {
      const span = document.createElement('span')
      span.className = 'cn-letter'
      span.textContent = ch === ' ' ? '\u00a0' : ch
      const rotations = [-4, 3, -2, 5, -3, 2, -4, 3]
      span.style.setProperty('--rot', (rotations[i % rotations.length] ?? 0) + 'deg')
      span.style.setProperty('--ld', (.25 + i * .07) + 's')
      nameEl.appendChild(span)
    })
  }
  const bg = document.getElementById('cinema-bg')
  const section = document.querySelector('.cinema-section')
  if (!bg || !section) return
  function onScroll () {
    const rect = section.getBoundingClientRect()
    const progress = 1 - (rect.bottom / (window.innerHeight + rect.height))
    const shift = (progress - .5) * 10
    bg.style.transform = `scale(1.08) translateY(${shift}%)`
  }
  window.addEventListener('scroll', onScroll, { passive: true })
}

function initReasons () {
  const cards = document.querySelectorAll('.reason-card')
  if (!cards.length) return
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        io.unobserve(entry.target)
      }
    })
  }, { threshold: .15 })
  cards.forEach(card => {
    io.observe(card)
    card.addEventListener('click', () => card.classList.toggle('flipped'))
  })
}

function showFooter () {
  const footer = document.getElementById('site-footer')
  if (!footer) return
  footer.classList.remove('hidden')
  const c = document.getElementById('footer-stars')
  if (c) {
    for (let i = 0; i < 55; i++) {
      const el = document.createElement('div')
      el.className = 'star'
      const size = rand(.8, 2.2)
      el.style.cssText = `left:${rand(0,100)}%;top:${rand(0,100)}%;width:${size}px;height:${size}px;--d:${rand(2,5).toFixed(1)}s;--dl:${rand(0,5).toFixed(1)}s;`
      c.appendChild(el)
    }
  }
}

function rand (min, max) { return Math.random() * (max - min) + min }

/* ─────────────────────────────────────────────
   INIT & SEMUA EVENT LISTENER
───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  spawnStars()

  const sudahDibuka = sessionStorage.getItem('sudah-dibuka')

  if (sudahDibuka === 'ya') {
    const opening = document.getElementById('opening-screen')
    const main    = document.getElementById('main-content')
    const navbar  = document.getElementById('navbar')

    if (opening) opening.style.display = 'none'
    if (main)    main.classList.remove('hidden')
    if (navbar)  {
      navbar.classList.remove('navbar--hidden')
      navbar.classList.add('navbar--visible')
    }
    
    // --- MUNCULKAN & PUTAR MUSIK OTOMATIS SAAT REFRESH ---
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    
    if (musicToggle) {
        musicToggle.classList.add('is-visible');
        musicToggle.style.opacity = '1';
        musicToggle.style.pointerEvents = 'auto';
        musicToggle.style.transform = 'translateY(0) scale(1)';
    }
    
    if (bgMusic) {
        bgMusic.src = playlist[currentSongIndex];
        bgMusic.play().then(() => {
            if (musicToggle) musicToggle.classList.add('is-playing');
        }).catch(() => console.log("Menunggu klik user untuk menyalakan musik"));
    }
    // -----------------------------------------------------

    spawnBubbles()
    spawnFloatingHearts()
    initMosaicParallax()
    initScrollReveal()
    initCinema()
    initReasons()
    showFooter()

    const halaman = getHalamanDariURL()
    tampilkanHalaman(halaman, false)
  }

  window.addEventListener('popstate', (e) => {
    const halaman = e.state?.halaman ?? getHalamanDariURL()
    tampilkanHalaman(halaman, false)
  })

  const giftBox = document.getElementById('gift-box')
  if (giftBox) giftBox.addEventListener('click', bukaKado)

  document.querySelectorAll('.nav-btn[data-page]').forEach(btn => {
    btn.addEventListener('click', () => pindahHalaman(btn.dataset.page))
  })

  const navLogo = document.querySelector('.nav-logo')
  if (navLogo) navLogo.addEventListener('click', () => pindahHalaman('home'))

  const btnPesan  = document.querySelector('.hero-actions .btn-primary')
  const btnGaleri = document.querySelector('.hero-actions .btn-ghost')
  if (btnPesan)  btnPesan.addEventListener('click',  () => pindahHalaman('pesan'))
  if (btnGaleri) btnGaleri.addEventListener('click', () => pindahHalaman('galeri'))

  const topBtn = document.querySelector('.footer-top-btn')
  if (topBtn) topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }))
  
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navLinksContainer = document.getElementById('nav-links');

  if (hamburgerBtn && navLinksContainer) {
    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('is-active');
      navLinksContainer.classList.toggle('is-open');
    });
    document.querySelectorAll('.nav-btn[data-page]').forEach(btn => {
      btn.addEventListener('click', () => {
        hamburgerBtn.classList.remove('is-active');
        navLinksContainer.classList.remove('is-open');
      });
    });
  }

  const photoModal = document.getElementById('photo-modal');
  const modalCloseBtn = document.getElementById('modal-close');
  const modalPhotoContainer = document.getElementById('modal-photo');
  const modalCaption = document.getElementById('modal-caption');

  if (photoModal) {
    document.querySelectorAll('.polaroid').forEach(card => {
      card.addEventListener('click', () => {
        const photoContent = card.querySelector('.polaroid-photo').innerHTML;
        const captionText = card.querySelector('.polaroid-caption').textContent;
        modalPhotoContainer.innerHTML = photoContent;
        modalCaption.textContent = captionText;
        photoModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        setTimeout(() => photoModal.classList.add('is-open'), 10);
      });
    });

    const closeModal = () => {
      photoModal.classList.remove('is-open');
      document.body.style.overflow = '';
      setTimeout(() => photoModal.classList.add('hidden'), 400);
    };

    if(modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    photoModal.addEventListener('click', (e) => {
      if (e.target === photoModal) closeModal();
    });
  }

  // --- LOGIKA EVENT DELEGATION GLOBAL (SURAT & MUSIK) ---
  document.body.addEventListener('click', (e) => {
    
    // 1. LOGIKA ON/OFF TOMBOL MUSIK
    const btnMusik = e.target.closest('#music-toggle');
    if (btnMusik) {
        const bgMusic = document.getElementById('bg-music');
        if (bgMusic) {
            if (bgMusic.paused) {
                bgMusic.play();
                btnMusik.classList.add('is-playing');
            } else {
                bgMusic.pause();
                btnMusik.classList.remove('is-playing');
            }
        }
    }

    // 2. LOGIKA POP UP SURAT
    const letterCard = e.target.closest('.letter-item');
    if (letterCard) {
        const title = letterCard.querySelector('.li-title')?.textContent || 'Sebuah Surat';
        const date = letterCard.querySelector('.li-date')?.textContent || '';
        const contentHTML = letterCard.querySelector('.li-content')?.innerHTML || '';

        const letterModal = document.getElementById('letter-modal');
        const lmTitle = document.getElementById('lm-title');
        const lmDate = document.getElementById('lm-date');
        const lmContent = document.getElementById('lm-content');
        const lmWaxSeal = document.getElementById('modal-wax-seal');
        const lmCardInner = document.querySelector('#letter-modal .letter-card');

        if (letterModal) {
            if (lmTitle) lmTitle.textContent = title;
            if (lmDate) lmDate.textContent = date;
            if (lmContent) lmContent.innerHTML = contentHTML;

            if (lmWaxSeal) { lmWaxSeal.style.animation = 'none'; lmWaxSeal.offsetHeight; lmWaxSeal.style.animation = ''; }
            if (lmCardInner) { lmCardInner.style.animation = 'none'; lmCardInner.offsetHeight; lmCardInner.style.animation = ''; }

            letterModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; 
            setTimeout(() => letterModal.classList.add('is-open'), 10);
        }
    }

    // 3. TUTUP POP UP SURAT
    if (e.target.closest('#letter-modal-close') || e.target.id === 'letter-modal') {
        const letterModal = document.getElementById('letter-modal');
        if (letterModal) {
            letterModal.classList.remove('is-open');
            document.body.style.overflow = ''; 
            setTimeout(() => letterModal.classList.add('hidden'), 400);
        }
    }

  });

  // --- LOGIKA PLAYLIST INFINITY LOOP ---
  const bgMusic = document.getElementById('bg-music');
  if (bgMusic) {
      bgMusic.addEventListener('ended', () => {
          // Lanjut ke lagu berikutnya, jika habis kembali ke 0
          currentSongIndex = (currentSongIndex + 1) % playlist.length;
          bgMusic.src = playlist[currentSongIndex];
          
          const musicToggle = document.getElementById('music-toggle');
          bgMusic.play().then(() => {
              if (musicToggle) musicToggle.classList.add('is-playing');
          }).catch(err => console.log('Gagal melanjutkan lagu: ', err));
      });
  }

  // --- MATIKAN BACKGROUND MUSIC JIKA ADA AUDIO LAIN YANG DI-PLAY (MISAL VIDEO LAIN) ---
  document.addEventListener('play', (e) => {
      if (e.target.id !== 'bg-music') {
          if (bgMusic && !bgMusic.paused) {
              bgMusic.pause();
              const musicToggle = document.getElementById('music-toggle');
              if (musicToggle) musicToggle.classList.remove('is-playing');
          }
      }
  }, true);

  // --- SPOTIFY IFRAME API (DETEKSI PLAY/PAUSE SPOTIFY DENGAN CERDAS) ---
  const spotifyIframe = document.querySelector('.spotify-frame');
  if (spotifyIframe) {
      const script = document.createElement('script');
      script.src = "https://open.spotify.com/embed/iframe-api/v1"; // Link API Spotify resmi
      script.async = true;
      document.body.appendChild(script);

      window.onSpotifyIframeApiReady = (IFrameAPI) => {
          const element = spotifyIframe;
          
          let uri = '';
          try {
              const srcUrl = new URL(element.src);
              const pathParts = srcUrl.pathname.split('/');
              if (pathParts.length >= 4 && pathParts[1] === 'embed') {
                  uri = `spotify:${pathParts[2]}:${pathParts[3]}`; 
              }
          } catch (e) {
              console.log('Gagal membaca URI Spotify');
          }

          const options = {
              uri: uri,
              width: '100%',
              height: '380'
          };
          
          const callback = (EmbedController) => {
              EmbedController.addListener('playback_update', e => {
                  const musicToggle = document.getElementById('music-toggle');
                  
                  if (!e.data.isPaused) {
                      // KONDISI 1: JIKA SPOTIFY DIPUTAR -> Matikan musik latar web
                      if (bgMusic && !bgMusic.paused) {
                          bgMusic.pause();
                          if (musicToggle) musicToggle.classList.remove('is-playing');
                          sessionStorage.setItem('spotify_playing', 'true');
                      }
                  } else {
                      // KONDISI 2: JIKA SPOTIFY DIJEDA / HABIS -> Nyalakan lagi musik latar web
                      if (sessionStorage.getItem('spotify_playing') === 'true') {
                          if (bgMusic && bgMusic.paused) {
                              bgMusic.play().then(() => {
                                  if (musicToggle) musicToggle.classList.add('is-playing');
                              }).catch(err => console.log(err));
                          }
                          sessionStorage.removeItem('spotify_playing');
                      }
                  }
              });
          };
          
          IFrameAPI.createController(element, options, callback);
      };
  }
})