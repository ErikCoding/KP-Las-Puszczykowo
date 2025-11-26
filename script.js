// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVsfqKhjWC8Fdmr5xxNlqtGzfEhyaYaEA",
  authDomain: "kp-las-puszczykowo.firebaseapp.com",
  databaseURL: "https://kp-las-puszczykowo-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "kp-las-puszczykowo",
  storageBucket: "kp-las-puszczykowo.firebasestorage.app",
  messagingSenderId: "756811498454",
  appId: "1:756811498454:web:532a4171b9def370055a77",
}

const firebase = window.firebase
let firebaseInitialized = false
let db = null

function initFirebase() {
  try {
    if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig)
      }
      db = firebase.database()
      firebaseInitialized = true
      console.log("[v0] Firebase initialized successfully")
    } else {
      console.log("[v0] Firebase not configured - using localStorage fallback")
    }
  } catch (error) {
    console.error("[v0] Firebase initialization error:", error)
  }
}

// Data Storage
let newsData = []
let matchesData = []
let playersData = []
let galleryData = []
let sponsorsData = []

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  showPageLoader()

  initFirebase()

  // Wait a bit to ensure Firebase is ready
  setTimeout(() => {
    setupNavigation()
    setupMobileMenu()
    setupHiddenAdminButton()
    setupHeroSlideshow()
    setupParallax()
    setupScrollIndicator()
    setupScrollAnimations()
    setupNavbarScrollEffect()
    loadAllContent()
    setupContactForm()
    setupGalleryModal()
    updateFooterYear()

    const newsModal = document.getElementById("newsModal")
    const closeNewsModal = document.getElementById("closeNewsModal")
    const newsModalOverlay = document.getElementById("newsModalOverlay")

    closeNewsModal.addEventListener("click", () => {
      newsModal.classList.remove("active")
    })

    newsModalOverlay.addEventListener("click", () => {
      newsModal.classList.remove("active")
    })

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && newsModal.classList.contains("active")) {
        newsModal.classList.remove("active")
      }
    })

    setTimeout(() => {
      hidePageLoader()
    }, 500)
  }, 100)
})

function showPageLoader() {
  const loader = document.createElement("div")
  loader.className = "page-loader"
  loader.innerHTML = '<div class="loader-spinner"></div>'
  document.body.appendChild(loader)
}

function hidePageLoader() {
  const loader = document.querySelector(".page-loader")
  if (loader) {
    loader.classList.add("hidden")
    setTimeout(() => {
      loader.remove()
    }, 500)
  }
}

function setupNavbarScrollEffect() {
  const navbar = document.querySelector(".navbar")

  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }
  })
}

function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
      }
    })
  }, observerOptions)

  // Observe all animated elements
  const animatedElements = document.querySelectorAll(
    ".section-title, .section-subtitle, .about-card, .stat-item, .news-card, .match-card, .gallery-item, .sponsor-item",
  )

  animatedElements.forEach((el) => {
    observer.observe(el)
  })
}

// Initialize default data
function initializeData() {
  const defaultPlayers = [
    {
      id: 1,
      name: "Jan Kowalski",
      number: 1,
      position: "GK",
      age: 28,
      nationality: "Polska",
      height: "188 cm",
      stats: { matches: 15, goals: 0, assists: 0 },
    },
    {
      id: 2,
      name: "Michał Nowak",
      number: 2,
      position: "DF",
      age: 25,
      nationality: "Polska",
      height: "182 cm",
      stats: { matches: 14, goals: 1, assists: 2 },
    },
    {
      id: 3,
      name: "Piotr Wiśniewski",
      number: 3,
      position: "DF",
      age: 27,
      nationality: "Polska",
      height: "185 cm",
      stats: { matches: 15, goals: 2, assists: 1 },
    },
    {
      id: 4,
      name: "Krzysztof Wójcik",
      number: 4,
      position: "DF",
      age: 26,
      nationality: "Polska",
      height: "180 cm",
      stats: { matches: 13, goals: 0, assists: 3 },
    },
    {
      id: 5,
      name: "Tomasz Kamiński",
      number: 5,
      position: "DF",
      age: 24,
      nationality: "Polska",
      height: "183 cm",
      stats: { matches: 12, goals: 1, assists: 1 },
    },
    {
      id: 6,
      name: "Adam Lewandowski",
      number: 6,
      position: "MF",
      age: 23,
      nationality: "Polska",
      height: "178 cm",
      stats: { matches: 15, goals: 3, assists: 5 },
    },
    {
      id: 7,
      name: "Marek Zieliński",
      number: 7,
      position: "MF",
      age: 25,
      nationality: "Polska",
      height: "175 cm",
      stats: { matches: 14, goals: 4, assists: 6 },
    },
    {
      id: 8,
      name: "Paweł Szymański",
      number: 8,
      position: "MF",
      age: 26,
      nationality: "Polska",
      height: "180 cm",
      stats: { matches: 15, goals: 2, assists: 7 },
    },
    {
      id: 9,
      name: "Wojciech Dąbrowski",
      number: 9,
      position: "FW",
      age: 22,
      nationality: "Polska",
      height: "185 cm",
      stats: { matches: 15, goals: 12, assists: 3 },
    },
    {
      id: 10,
      name: "Łukasz Kozłowski",
      number: 10,
      position: "FW",
      age: 24,
      nationality: "Polska",
      height: "182 cm",
      stats: { matches: 14, goals: 10, assists: 5 },
    },
  ]

  if (!localStorage.getItem("players")) {
    localStorage.setItem("players", JSON.stringify(defaultPlayers))
  }
}

// Event Listeners
function setupNavigation() {
  // Smooth scroll for nav links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      if (link.getAttribute("href").startsWith("#")) {
        e.preventDefault()
        const target = document.querySelector(link.getAttribute("href"))
        if (target) {
          target.scrollIntoView({ behavior: "smooth" })
        }
      }
    })
  })
}

function setupMobileMenu() {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn")
  const navLinks = document.getElementById("navLinks")

  mobileMenuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active")
    mobileMenuBtn.textContent = navLinks.classList.contains("active") ? "×" : "☰"
  })
}

function setupHiddenAdminButton() {
  let adminClickCount = 0
  const adminBtn = document.getElementById("hiddenAdminBtn")
  adminBtn.addEventListener("click", (e) => {
    e.preventDefault()
    adminClickCount++
    if (adminClickCount >= 5) {
      window.location.href = "admin-login.html"
    }
    setTimeout(() => {
      adminClickCount = 0
    }, 2000)
  })
}

function setupScrollIndicator() {
  const scrollIndicator = document.querySelector(".scroll-indicator")

  if (scrollIndicator) {
    scrollIndicator.addEventListener("click", () => {
      const aboutSection = document.getElementById("about")
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: "smooth" })
      }
    })

    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        scrollIndicator.style.opacity = "0"
        scrollIndicator.style.pointerEvents = "none"
      } else {
        scrollIndicator.style.opacity = "1"
        scrollIndicator.style.pointerEvents = "auto"
      }
    })
  }
}

function setupContactForm() {
  const contactForm = document.getElementById("contactForm")
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    const formData = new FormData(contactForm)

    const message = {
      id: Date.now(),
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
      date: new Date().toISOString(),
      read: false,
    }

    console.log("[v0] Attempting to send message")
    console.log("[v0] Firebase initialized:", firebaseInitialized)
    console.log("[v0] DB object exists:", !!db)

    if (firebaseInitialized && db) {
      try {
        console.log("[v0] Saving to Firebase Realtime Database...")
        await db.ref(`messages/${message.id}`).set(message)
        console.log("[v0] Message saved to Firebase successfully!")
      } catch (error) {
        console.error("[v0] Firebase save failed:", error.message)
        console.error("[v0] Full error:", error)
      }
    } else {
      console.error("[v0] Firebase not ready - firebaseInitialized:", firebaseInitialized, "db:", !!db)
    }

    document.getElementById("formSuccess").style.display = "block"
    setTimeout(() => {
      document.getElementById("formSuccess").style.display = "none"
      contactForm.reset()
    }, 3000)
  })
}

function setupGalleryModal() {
  document.getElementById("closeGalleryModal").addEventListener("click", () => {
    document.getElementById("galleryModal").classList.remove("active")
  })

  // Close modal on background click
  document.getElementById("galleryModal").addEventListener("click", (e) => {
    if (e.target.id === "galleryModal" || e.target.id === "galleryModalOverlay") {
      document.getElementById("galleryModal").classList.remove("active")
    }
  })

  // Close modal on ESC key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.getElementById("galleryModal").classList.remove("active")
    }
  })
}

function setupHeroSlideshow() {
  const heroBg = document.getElementById("heroBg")

  const images = [
    "https://scontent-waw2-2.xx.fbcdn.net/v/t39.30808-6/579346311_1410024237794073_7552477781595665059_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_ohc=GQyzNJck9xcQ7kNvwEjFCE0&_nc_oc=AdlJgP0KdsfwYt9usD5glwclotELzaZCm7UtMZm0OChENLNdKUh59LjCPI2tNSRMyg0&_nc_zt=23&_nc_ht=scontent-waw2-2.xx&_nc_gid=prrToiwyxpwZXYNTqKI3DQ&oh=00_AfhzqEvPUI7_7DPiD-NqmfKQOfiihy9NrstiSfMPi8V0SQ&oe=692C1322",
    "https://scontent-waw2-2.xx.fbcdn.net/v/t39.30808-6/580634285_1410024461127384_5793941288335673739_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_ohc=BzHjdQQf8oEQ7kNvwHwFvRx&_nc_oc=Adn0SmmKEPU9YC2fxNVzafJiNBLki8aTEBnP9CxIFl8ZuD33-bl4xdaIG8m5yEvZFKo&_nc_zt=23&_nc_ht=scontent-waw2-2.xx&_nc_gid=G9hNadHr8KFO4gErEbdZvw&oh=00_Afh1pNcm043StYUHWcORKS72LymYwPqDWiSJ_ZKElIVjQg&oe=692ABAD1",
    "https://scontent-waw2-1.xx.fbcdn.net/v/t39.30808-6/583666310_1416925130437317_8222392288335673739_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=pOc_3FUZkR0Q7kNvwGKevX2&_nc_oc=Adk8Yb5Hv26ljGzWrXTqsRqrh-TkK5mknjGaNt-_-76IbX0syN5iGTkbPHFPypf5Ljk&_nc_zt=23&_nc_ht=scontent-waw2-1.xx&_nc_gid=Tg2207mRJYy1vCf7UlQRiQ&oh=00_AfhE1aKnCPftYKZY9mugwPBFrk1d3AjHc2T0spzlxKRtDQ&oe=692A968C",
  ]

  let currentIndex = 0

  // Set initial image
  heroBg.style.backgroundImage = `url("${images[currentIndex]}")`

  setInterval(() => {
    currentIndex = (currentIndex + 1) % images.length
    heroBg.style.opacity = "0"

    setTimeout(() => {
      heroBg.style.backgroundImage = `url("${images[currentIndex]}")`
      heroBg.style.opacity = "1"
    }, 750)
  }, 5000)
}

function setupParallax() {
  const heroBg = document.getElementById("heroBg")

  let ticking = false

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.pageYOffset
        const heroHeight = window.innerHeight

        if (scrolled < heroHeight) {
          const parallaxFactor = scrolled * 0.5
          heroBg.style.transform = `translateY(${parallaxFactor}px)`
        }
        ticking = false
      })
      ticking = true
    }
  })

  document.addEventListener("mousemove", (e) => {
    const heroSection = document.getElementById("hero")
    if (!heroSection) return

    const rect = heroSection.getBoundingClientRect()
    if (rect.top > window.innerHeight || rect.bottom < 0) return

    const mouseX = (e.clientX / window.innerWidth - 0.5) * 30
    const mouseY = (e.clientY / window.innerHeight - 0.5) * 30

    heroBg.style.transform = `translateY(${window.pageYOffset * 0.5}px) translate(${mouseX}px, ${mouseY}px)`
  })
}

// Load all data from Firebase or localStorage
async function loadAllContent() {
  if (firebaseInitialized) {
    try {
      const newsSnapshot = await db.ref("news").once("value")
      newsData = newsSnapshot.val() ? Object.values(newsSnapshot.val()) : []

      const matchesSnapshot = await db.ref("matches").once("value")
      matchesData = matchesSnapshot.val() ? Object.values(matchesSnapshot.val()) : []

      const playersSnapshot = await db.ref("players").once("value")
      playersData = playersSnapshot.val() ? Object.values(playersSnapshot.val()) : []

      const gallerySnapshot = await db.ref("gallery").once("value")
      galleryData = gallerySnapshot.val() ? Object.values(gallerySnapshot.val()) : []

      const sponsorsSnapshot = await db.ref("sponsors").once("value")
      sponsorsData = sponsorsSnapshot.val() ? Object.values(sponsorsSnapshot.val()) : []

      console.log("[v0] Data loaded from Firebase")
    } catch (error) {
      console.error("[v0] Firebase load error:", error)
      loadFromLocalStorage()
    }
  } else {
    loadFromLocalStorage()
  }

  renderNews()
  renderMatches()
  renderPlayers()
  renderGallery()
  renderSponsors()
}

// Fallback to localStorage
function loadFromLocalStorage() {
  newsData = JSON.parse(localStorage.getItem("news")) || []
  matchesData = JSON.parse(localStorage.getItem("matches")) || []
  playersData = JSON.parse(localStorage.getItem("players")) || []
  galleryData = JSON.parse(localStorage.getItem("gallery")) || []
  sponsorsData = JSON.parse(localStorage.getItem("sponsors")) || []
}

// Render News
function renderNews() {
  const newsGrid = document.getElementById("newsGrid")

  if (newsData.length === 0) {
    newsGrid.innerHTML = '<p class="empty-message">Brak aktualności. Dodaj nowe w panelu admina.</p>'
    return
  }

  newsGrid.innerHTML = newsData
    .slice(0, 3)
    .map(
      (news, index) => `
        <div class="news-card" style="animation-delay: ${index * 0.1}s" onclick="showNewsModal(${JSON.stringify(news).replace(/"/g, "&quot;")})">
            <div class="news-card-img">
                <img src="${news.imageUrl || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80"}" alt="${news.title}" onerror="this.src='https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80'">
            </div>
            <div class="news-card-content">
                <p class="news-card-date">${new Date(news.date).toLocaleDateString("pl-PL")}</p>
                <h3 class="news-card-title">${news.title}</h3>
                <p class="news-card-text">${news.content.substring(0, 100)}...</p>
            </div>
        </div>
    `,
    )
    .join("")

  // Re-observe new elements
  setupScrollAnimations()
}

// Render Matches
function renderMatches() {
  const matchesList = document.getElementById("matchesList")

  if (matchesData.length === 0) {
    matchesList.innerHTML = '<p class="empty-message">Brak wyników meczów. Dodaj nowe w panelu admina.</p>'
    return
  }

  matchesList.innerHTML = matchesData
    .slice(0, 3)
    .map(
      (match, index) => `
        <div class="match-card" style="animation-delay: ${index * 0.1}s">
            <div class="match-teams">
                <div class="match-team home">${match.homeTeam}</div>
                <div class="match-score">
                    <span class="${match.homeScore > match.awayScore ? "win" : ""}">${match.homeScore}</span>
                    <span>:</span>
                    <span class="${match.awayScore > match.homeScore ? "win" : ""}">${match.awayScore}</span>
                </div>
                <div class="match-team away">${match.awayTeam}</div>
            </div>
            <p class="match-date">${new Date(match.date).toLocaleDateString("pl-PL")}</p>
        </div>
    `,
    )
    .join("")

  setupScrollAnimations()
}

// Render Players on Field
function renderPlayers() {
  const field = document.getElementById("footballField")

  const playersByPosition = { GK: [], DF: [], MF: [], FW: [] }
  playersData.forEach((player) => {
    if (playersByPosition[player.position] !== undefined) {
      playersByPosition[player.position].push(player)
    }
  })

  field.innerHTML = `
    <svg class="field-lines" viewBox="0 0 100 160" preserveAspectRatio="xMidYMid meet" style="position: absolute; inset: 0; width: 100%; height: 100%; z-index: 2;">
      <!-- Field border -->
      <rect x="0" y="0" width="100" height="160" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="0.5" vector-effect="non-scaling-stroke"/>
      
      <!-- Center line (horizontal line dividing halves) -->
      <line x1="0" y1="80" x2="100" y2="80" stroke="rgba(255,255,255,0.5)" stroke-width="0.5" vector-effect="non-scaling-stroke"/>
      
      <!-- Center circle -->
      <circle cx="50" cy="80" r="10" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="0.5" vector-effect="non-scaling-stroke"/>
      <!-- Center spot -->
      <circle cx="50" cy="80" r="1" fill="rgba(255,255,255,0.5)"/>
      
      <!-- Top (goal area 1) penalty area -->
      <rect x="15" y="0" width="70" height="20" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="0.5" vector-effect="non-scaling-stroke"/>
      <!-- Top goal area (small box) -->
      <rect x="30" y="0" width="40" height="8" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="0.5" vector-effect="non-scaling-stroke"/>
      
      <!-- Bottom (goal area 2) penalty area -->
      <rect x="15" y="140" width="70" height="20" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="0.5" vector-effect="non-scaling-stroke"/>
      <!-- Bottom goal area (small box) -->
      <rect x="30" y="152" width="40" height="8" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="0.5" vector-effect="non-scaling-stroke"/>
      
      <!-- Top corner arcs -->
      <path d="M 15 0 Q 10 0 10 5" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="0.5" vector-effect="non-scaling-stroke"/>
      <path d="M 85 0 Q 90 0 90 5" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="0.5" vector-effect="non-scaling-stroke"/>
      
      <!-- Bottom corner arcs -->
      <path d="M 15 160 Q 10 160 10 155" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="0.5" vector-effect="non-scaling-stroke"/>
      <path d="M 85 160 Q 90 160 90 155" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="0.5" vector-effect="non-scaling-stroke"/>
    </svg>
  `

  playersData.forEach((player) => {
    let x, y

    if (player.x !== undefined && player.y !== undefined) {
      x = player.x
      y = player.y
    } else {
      const positionGroup = playersByPosition[player.position] || []
      const playerIndex = positionGroup.findIndex((p) => p.id === player.id)
      const indexToUse = playerIndex >= 0 ? playerIndex : 0

      const pos = calculatePlayerPosition(player.position, indexToUse, positionGroup.length, player.id)
      x = pos.x
      y = pos.y
    }

    const playerDiv = document.createElement("div")
    playerDiv.className = "player"
    playerDiv.style.left = `${x}%`
    playerDiv.style.top = `${y}%`
    playerDiv.style.zIndex = "10"

    playerDiv.innerHTML = `
      <div class="player-circle ${player.position.toLowerCase()}">
        ${player.number}
      </div>
      <div class="player-name">
        <div class="player-name-tag">${player.name}</div>
      </div>
      <div class="player-hover-card">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
          <div class="player-circle ${player.position.toLowerCase()}" style="width: 48px; height: 48px; font-size: 1.25rem;">
            ${player.number}
          </div>
          <div>
            <h3 style="font-size: 1.125rem; font-weight: 700;">${player.name}</h3>
            <p style="color: var(--color-gray-600); font-size: 0.875rem;">${player.position}</p>
          </div>
        </div>
        <div style="font-size: 0.875rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: var(--color-gray-600);">Wiek:</span>
            <span style="font-weight: 600;">${player.age} lat</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: var(--color-gray-600);">Narodowość:</span>
            <span style="font-weight: 600;">${player.nationality}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="color: var(--color-gray-600);">Wzrost:</span>
            <span style="font-weight: 600;">${player.height}</span>
          </div>
          <div style="padding-top: 12px; border-top: 1px solid var(--border-color);">
            <p style="color: var(--color-gray-600); margin-bottom: 8px; font-size: 0.75rem;">Statystyki sezonu:</p>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
              <div style="text-align: center;">
                <p style="font-size: 1.5rem; font-weight: 700; color: var(--color-accent);">${player.stats.matches}</p>
                <p style="font-size: 0.75rem; color: var(--color-gray-600);">Mecze</p>
              </div>
              <div style="text-align: center;">
                <p style="font-size: 1.5rem; font-weight: 700; color: var(--color-accent);">${player.stats.goals}</p>
                <p style="font-size: 0.75rem; color: var(--color-gray-600);">Gole</p>
              </div>
              <div style="text-align: center;">
                <p style="font-size: 1.5rem; font-weight: 700; color: var(--color-accent);">${player.stats.assists}</p>
                <p style="font-size: 0.75rem; color: var(--color-gray-600);">Asysty</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `

    playerDiv.addEventListener("click", () => showPlayerModal(player))
    field.appendChild(playerDiv)
  })
}

// Show Player Modal
function showPlayerModal(player) {
  const modal = document.getElementById("playerModal")
  const content = document.getElementById("playerModalContent")

  content.innerHTML = `
    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
      <div class="player-circle ${player.position.toLowerCase()}" style="width: 80px; height: 80px; font-size: 2.5rem;">
        ${player.number}
      </div>
      <div>
        <h2 style="font-size: 1.875rem; font-weight: 700;">${player.name}</h2>
        <p style="font-size: 1.125rem; color: var(--color-gray-600);">${player.position}</p>
      </div>
    </div>
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <div style="display: flex; justify-between; padding: 1rem 0; border-bottom: 1px solid var(--border-color);">
        <span style="color: var(--color-gray-600);">Wiek:</span>
        <span style="font-weight: 600; font-size: 1.125rem;">${player.age} lat</span>
      </div>
      <div style="display: flex; justify-between; padding: 1rem 0; border-bottom: 1px solid var(--border-color);">
        <span style="color: var(--color-gray-600);">Narodowość:</span>
        <span style="font-weight: 600; font-size: 1.125rem;">${player.nationality}</span>
      </div>
      <div style="display: flex; justify-between; padding: 1rem 0; border-bottom: 1px solid var(--border-color);">
        <span style="color: var(--color-gray-600);">Wzrost:</span>
        <span style="font-weight: 600; font-size: 1.125rem;">${player.height}</span>
      </div>
      <div style="padding-top: 1rem;">
        <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem;">Statystyki sezonu</h3>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
          <div style="background: var(--bg-color); padding: 1rem; border-radius: 12px; text-align: center;">
            <p style="font-size: 2.5rem; font-weight: 700; color: var(--color-accent); margin-bottom: 4px;">${player.stats.matches}</p>
            <p style="font-size: 0.875rem; color: var(--color-gray-600);">Mecze</p>
          </div>
          <div style="background: var(--bg-color); padding: 1rem; border-radius: 12px; text-align: center;">
            <p style="font-size: 2.5rem; font-weight: 700; color: var(--color-accent); margin-bottom: 4px;">${player.stats.goals}</p>
            <p style="font-size: 0.875rem; color: var(--color-gray-600);">Gole</p>
          </div>
          <div style="background: var(--bg-color); padding: 1rem; border-radius: 12px; text-align: center;">
            <p style="font-size: 2.5rem; font-weight: 700; color: var(--color-accent); margin-bottom: 4px;">${player.stats.assists}</p>
            <p style="font-size: 0.875rem; color: var(--color-gray-600);">Asysty</p>
          </div>
        </div>
      </div>
    </div>
    <button onclick="document.getElementById('playerModal').classList.remove('active')" class="btn btn-primary btn-block" style="margin-top: 1.5rem;">Zamknij</button>
  `

  modal.classList.add("active")
}

// Updated renderGallery function
function renderGallery() {
  const galleryGrid = document.getElementById("galleryGrid")

  if (galleryData.length === 0) {
    galleryGrid.innerHTML = '<p class="empty-message">Brak zdjęć w galerii.</p>'
    return
  }

  galleryGrid.innerHTML = galleryData
    .map(
      (image, index) => `
        <div class="gallery-item" style="animation-delay: ${index * 0.05}s" onclick="showGalleryModal('${image.url}', '${image.caption}', '${image.date}')">
            <img src="${image.url}" alt="${image.caption}">
            <div class="gallery-overlay">
                <div class="gallery-caption">${image.caption}</div>
                <div class="gallery-date">${new Date(image.date).toLocaleDateString("pl-PL")}</div>
            </div>
        </div>
    `,
    )
    .join("")

  setupScrollAnimations()
}

// Updated showGalleryModal function
function showGalleryModal(url, caption, date) {
  const modal = document.getElementById("galleryModal")
  document.getElementById("galleryModalImage").src = url
  document.getElementById("galleryModalCaption").textContent = caption
  document.getElementById("galleryModalDate").textContent = new Date(date).toLocaleDateString("pl-PL")
  modal.classList.add("active")
}

// Render Sponsors
function renderSponsors() {
  const sponsorsGrid = document.getElementById("sponsorsGrid")

  if (sponsorsData.length === 0) {
    sponsorsGrid.innerHTML = '<p class="empty-message">Brak sponsorów do wyświetlenia.</p>'
    return
  }

  sponsorsGrid.innerHTML = sponsorsData
    .map(
      (sponsor, index) => `
        <a href="${sponsor.website || "#"}" class="sponsor-item" style="animation-delay: ${index * 0.05}s" target="_blank" rel="noopener noreferrer">
            <img src="${sponsor.logo}" alt="${sponsor.name}">
        </a>
    `,
    )
    .join("")

  setupScrollAnimations()
}

// Helper function to save messages to localStorage
function saveMessageToLocalStorage(message) {
  const messages = JSON.parse(localStorage.getItem("messages")) || []
  messages.push(message)
  localStorage.setItem("messages", JSON.stringify(messages))
  console.log("[v0] Message saved to localStorage (Firebase fallback)")
}

function calculatePlayerPosition(position, playerIndex, totalPlayers, playerId) {
  const positions = {
    GK: [{ x: 50, y: 97 }],
    DF: [
      { x: 15, y: 70 },
      { x: 37, y: 72 },
      { x: 63, y: 72 },
      { x: 85, y: 70 },
    ],
    MF: [
      { x: 25, y: 45 },
      { x: 50, y: 40 },
      { x: 75, y: 45 },
    ],
    FW: [
      { x: 35, y: 17 },
      { x: 65, y: 17 },
    ],
  }

  const positionArray = positions[position] || []

  const slotIndex = playerIndex % positionArray.length
  let pos = positionArray[slotIndex]

  if (playerIndex >= positionArray.length) {
    const offsetY = ((playerIndex - positionArray.length) * 8) % 30
    pos = { x: pos.x, y: pos.y + offsetY }
  }

  console.log("[v0] Position:", position, "PlayerIndex:", playerIndex, "TotalPlayers:", totalPlayers, "Result:", pos)
  return pos
}

// Update Footer Year
function updateFooterYear() {
  document.getElementById("currentYear").textContent = new Date().getFullYear()
}

function showNewsModal(news) {
  const newsModal = document.getElementById("newsModal")
  const newsModalImage = document.getElementById("newsModalImage")
  const newsModalTitle = document.getElementById("newsModalTitle")
  const newsModalContent = document.getElementById("newsModalContent")
  const newsModalDate = document.getElementById("newsModalDate")

  newsModalImage.src = news.imageUrl || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80"
  newsModalImage.alt = news.title

  newsModalTitle.textContent = news.title
  newsModalContent.textContent = news.content
  newsModalDate.textContent = new Date(news.date).toLocaleDateString("pl-PL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  newsModal.classList.add("active")
}
