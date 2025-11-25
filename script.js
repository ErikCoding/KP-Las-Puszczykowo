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
      firebase.initializeApp(firebaseConfig)
      db = firebase.database()
      firebaseInitialized = true
      console.log("[v0] Firebase initialized on main page")
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
  setupLightbox()
  updateFooterYear()

  setTimeout(() => {
    hidePageLoader()
  }, 500)
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

    // Save to Firebase or localStorage
    if (firebaseInitialized) {
      try {
        await db.ref(`messages/${message.id}`).set(message)
        console.log("[v0] Message saved to Firebase")
      } catch (error) {
        console.error("[v0] Firebase save error:", error)
        saveMessageToLocalStorage(message)
      }
    } else {
      saveMessageToLocalStorage(message)
    }

    document.getElementById("formSuccess").style.display = "block"
    setTimeout(() => {
      document.getElementById("formSuccess").style.display = "none"
      contactForm.reset()
    }, 3000)
  })
}

function setupLightbox() {
  document.getElementById("closeLightbox").addEventListener("click", () => {
    document.getElementById("lightbox").classList.remove("active")
  })

  // Close modals on background click
  document.getElementById("lightbox").addEventListener("click", (e) => {
    if (e.target.id === "lightbox") {
      document.getElementById("lightbox").classList.remove("active")
    }
  })
}

function setupHeroSlideshow() {
  const heroBg = document.getElementById("heroBg")

  const images = [
    "https://scontent-waw2-1.xx.fbcdn.net/v/t39.30808-6/568952751_1393068179489679_1242343292601629705_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=7fWcfM_xYeMQ7kNvwEWcAS6&_nc_oc=AdlMoMdnsfq5EWaDwOgFP3O7T280xCFJ7qHSq1MEM4VgLam43oEZyuJ16CM1w3Zn_ac&_nc_zt=23&_nc_ht=scontent-waw2-1.xx&_nc_gid=BtWJPL6OmZNCdEMAQ9Tl7Q&oh=00_Afhxk_vNhAujSy-4wtm6YhZbEVgvdPe_uvZnh2guxdWfsA&oe=692AA157",
    "https://scontent-waw2-1.xx.fbcdn.net/v/t39.30808-6/584686196_1416924913770672_2254237206894719496_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_ohc=yOqaJVeNDZ4Q7kNvwG5HXO-&_nc_oc=Adk9oMDJdCAzomM4y3IEVQNlmiVAqMJNFvHV1I0ig2W1KMSotRdffF82AxS_UPM0Pg8&_nc_zt=23&_nc_ht=scontent-waw2-1.xx&_nc_gid=CS3OqvscGu0STvv31IucSw&oh=00_AfgNaK8enU8rxktmo6srMdZrGIAPczbsKxoQQFoi0evRTw&oe=692ADFA6",
    "https://scontent-waw2-2.xx.fbcdn.net/v/t39.30808-6/580634285_1410024461127384_5793941285239069198_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_ohc=BzHjdQQf8oEQ7kNvwHwFvRx&_nc_oc=Adn0SmmKEPU9YC2fxNVzafJiNBLki8aTEBnP9CxIFl8ZuD33-bl4xdaIG8m5yEvZFKo&_nc_zt=23&_nc_ht=scontent-waw2-2.xx&_nc_gid=G9hNadHr8KFO4gErEbdZvw&oh=00_Afh1pNcm043StYUHWcORKS72LymYwPqDWiSJ_ZKElIVjQg&oe=692ABAD1",
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

  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const heroHeight = window.innerHeight

    if (scrolled < heroHeight) {
      const scale = 1.1 + (scrolled / heroHeight) * 0.15
      const translateY = scrolled * 0.5
      heroBg.style.transform = `scale(${scale}) translateY(${translateY}px)`
    }
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
        <div class="news-card" style="animation-delay: ${index * 0.1}s">
            <div class="news-card-img">
                <img src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80" alt="${news.title}">
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

  // Count players by position
  const positionCounts = { GK: 0, DF: 0, MF: 0, FW: 0 }
  playersData.forEach((player) => {
    if (positionCounts[player.position] !== undefined) {
      positionCounts[player.position]++
    }
  })

  // Track indices for each position
  const positionIndices = { GK: 0, DF: 0, MF: 0, FW: 0 }

  field.innerHTML = `
    <svg class="field-lines" viewBox="0 0 100 100" preserveAspectRatio="none" style="z-index: 2;">
      <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.5)" stroke-width="0.4"/>
      <circle cx="50" cy="50" r="10" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="0.4"/>
      <circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.5)"/>
      <rect x="20" y="0" width="60" height="18" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="0.4"/>
      <rect x="20" y="82" width="60" height="18" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="0.4"/>
      <rect x="35" y="0" width="30" height="8" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="0.4"/>
      <rect x="35" y="92" width="30" height="8" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="0.4"/>
      <path d="M 30 18 Q 50 23 70 18" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="0.4"/>
      <path d="M 30 82 Q 50 77 70 82" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="0.4"/>
    </svg>
  `

  playersData.forEach((player) => {
    // Use manual position if provided, otherwise calculate automatically
    let x, y
    if (player.x !== undefined && player.y !== undefined) {
      x = player.x
      y = player.y
    } else {
      const pos = calculatePlayerPosition(
        player.position,
        positionIndices[player.position],
        positionCounts[player.position],
      )
      x = pos.x
      y = pos.y
      positionIndices[player.position]++
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

// Render Gallery
function renderGallery() {
  const galleryGrid = document.getElementById("galleryGrid")

  if (galleryData.length === 0) {
    galleryGrid.innerHTML = '<p class="empty-message">Brak zdjęć w galerii.</p>'
    return
  }

  galleryGrid.innerHTML = galleryData
    .map(
      (image, index) => `
        <div class="gallery-item" style="animation-delay: ${index * 0.05}s" onclick="showLightbox('${image.url}', '${image.caption}', '${image.date}')">
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

// Show Lightbox
function showLightbox(url, caption, date) {
  const lightbox = document.getElementById("lightbox")
  document.getElementById("lightboxImg").src = url
  document.getElementById("lightboxCaption").textContent = caption
  document.getElementById("lightboxDate").textContent = new Date(date).toLocaleDateString("pl-PL")
  lightbox.classList.add("active")
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
}

// Automatic player positioning function based on position
function calculatePlayerPosition(position, index, total) {
  const positions = {
    GK: [{ x: 50, y: 93 }],
    DF: [
      { x: 20, y: 75 },
      { x: 40, y: 78 },
      { x: 60, y: 78 },
      { x: 80, y: 75 },
    ],
    MF: [
      { x: 25, y: 50 },
      { x: 50, y: 48 },
      { x: 75, y: 50 },
    ],
    FW: [
      { x: 35, y: 22 },
      { x: 65, y: 22 },
    ],
  }

  const positionArray = positions[position] || []
  return positionArray[index % positionArray.length] || { x: 50, y: 50 }
}

// Update Footer Year
function updateFooterYear() {
  document.getElementById("currentYear").textContent = new Date().getFullYear()
}
