import './style.css'

/* ─────────────────────────────────────────────
   OPENING — buka kado
───────────────────────────────────────────── */
function bukaKado() {
  const opening = document.getElementById('opening-screen')
  const main    = document.getElementById('main-content')
  const navbar  = document.getElementById('navbar')

  opening.classList.add('is-closing')

  setTimeout(() => {
    opening.style.display = 'none'
    main.classList.remove('hidden')
    navbar.classList.remove('navbar--hidden')
    navbar.classList.add('navbar--visible')

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
  '/':        'home',
  '/beranda': 'home',
  '/galeri':  'galeri',
  '/surat':   'pesan',
  '/lagu':    'lagu',
}

const pageToPath = {
  'home':   '/beranda',
  'galeri': '/galeri',
  'pesan':  '/surat',
  'lagu':   '/lagu',
}

function getHalamanDariURL() {
  const path = window.location.pathname
  return routeMap[path] ?? 'home'
}

/* ─────────────────────────────────────────────
   NAVIGATION
───────────────────────────────────────────── */
function pindahHalaman(target) {
  const path = pageToPath[target] ?? '/beranda'
  history.pushState({ halaman: target }, '', path)
  tampilkanHalaman(target, true)
}

function tampilkanHalaman(target, scroll = true) {
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'))

  const page = document.getElementById('page-' + target)
  if (page) page.classList.remove('hidden')

  if (target === 'pesan') {
    const seal = document.getElementById('wax-seal')
    const card = document.querySelector('.letter-card')
    if (seal) { seal.style.animation = 'none'; seal.offsetHeight; seal.style.animation = '' }
    if (card) { card.style.animation = 'none'; card.offsetHeight; card.style.animation = '' }
  }

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('nav-btn--active', btn.dataset.page === target)
  })

  if (scroll) window.scrollTo({ top: 0, behavior: 'smooth' })
}

window.bukaKado      = bukaKado
window.pindahHalaman = pindahHalaman

/* ─────────────────────────────────────────────
   STARS
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
   INIT
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
})