// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVsfqKhjWC8Fdmr5xxNlqtGzfEhyaYaEA",
  authDomain: "kp-las-puszczykowo.firebaseapp.com",
  databaseURL: "https://kp-las-puszczykowo-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "kp-las-puszczykowo",
  storageBucket: "kp-las-puszczykowo.firebasestorage.app",
  messagingSenderId: "756811498454",
  appId: "1:756811498454:web:532a4171b9def370055a77"
};

const firebase = window.firebase
let firebaseInitialized = false
let db = null

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

// Data Storage
let newsData = []
let matchesData = []
let playersData = []
let galleryData = []
let sponsorsData = []

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  initializeData()
  setupEventListeners()
  loadAllData()
  setupParallax()
  document.getElementById("currentYear").textContent = new Date().getFullYear()
})

// Initialize default data
function initializeData() {
  // Default Players
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
      x: 50,
      y: 90,
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
      x: 25,
      y: 75,
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
      x: 42,
      y: 75,
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
      x: 58,
      y: 75,
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
      x: 75,
      y: 75,
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
      x: 35,
      y: 50,
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
      x: 50,
      y: 45,
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
      x: 65,
      y: 50,
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
      x: 40,
      y: 20,
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
      x: 60,
      y: 20,
    },
  ]

  if (!localStorage.getItem("players")) {
    localStorage.setItem("players", JSON.stringify(defaultPlayers))
  }
}

// Event Listeners
function setupEventListeners() {
  // Mobile menu
  const mobileMenuBtn = document.getElementById("mobileMenuBtn")
  const navLinks = document.getElementById("navLinks")

  mobileMenuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active")
    mobileMenuBtn.textContent = navLinks.classList.contains("active") ? "×" : "☰"
  })

  // Smooth scroll for nav links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      if (link.getAttribute("href").startsWith("#")) {
        e.preventDefault()
        const target = document.querySelector(link.getAttribute("href"))
        if (target) {
          target.scrollIntoView({ behavior: "smooth" })
          navLinks.classList.remove("active")
          mobileMenuBtn.textContent = "☰"
        }
      }
    })
  })

  // Hidden admin button (5 clicks)
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

  // Contact form
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

  // Modal close
  document.getElementById("closePlayerModal").addEventListener("click", () => {
    document.getElementById("playerModal").classList.remove("active")
  })

  document.getElementById("closeLightbox").addEventListener("click", () => {
    document.getElementById("lightbox").classList.remove("active")
  })

  // Close modals on background click
  document.getElementById("playerModal").addEventListener("click", (e) => {
    if (e.target.id === "playerModal") {
      document.getElementById("playerModal").classList.remove("active")
    }
  })

  document.getElementById("lightbox").addEventListener("click", (e) => {
    if (e.target.id === "lightbox") {
      document.getElementById("lightbox").classList.remove("active")
    }
  })
}

// Parallax Effect
function setupParallax() {
  const heroBg = document.getElementById("heroBg")

  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const heroHeight = window.innerHeight

    if (scrolled < heroHeight) {
      const scale = 1 + (scrolled / heroHeight) * 0.2
      const translateY = scrolled * 0.5
      heroBg.style.transform = `scale(${scale}) translateY(${translateY}px)`
    }
  })
}

// Load all data from Firebase or localStorage
async function loadAllData() {
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
      (news) => `
        <div class="news-card">
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
      (match) => `
        <div class="match-card">
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
}

// Render Players on Field
function renderPlayers() {
  const field = document.getElementById("footballField")

  // Add field SVG lines with higher z-index
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

  // Add players with z-index: 10
  playersData.forEach((player) => {
    const playerDiv = document.createElement("div")
    playerDiv.className = "player"
    playerDiv.style.left = `${player.x}%`
    playerDiv.style.top = `${player.y}%`
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
                        <p style="color: var(--color-gray); font-size: 0.875rem;">${player.position}</p>
                    </div>
                </div>
                <div style="font-size: 0.875rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: var(--color-gray);">Wiek:</span>
                        <span style="font-weight: 600;">${player.age} lat</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: var(--color-gray);">Narodowość:</span>
                        <span style="font-weight: 600;">${player.nationality}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                        <span style="color: var(--color-gray);">Wzrost:</span>
                        <span style="font-weight: 600;">${player.height}</span>
                    </div>
                    <div style="padding-top: 12px; border-top: 1px solid var(--border-color);">
                        <p style="color: var(--color-gray); margin-bottom: 8px; font-size: 0.75rem;">Statystyki sezonu:</p>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
                            <div style="text-align: center;">
                                <p style="font-size: 1.5rem; font-weight: 700; color: var(--color-green);">${player.stats.matches}</p>
                                <p style="font-size: 0.75rem; color: var(--color-gray);">Mecze</p>
                            </div>
                            <div style="text-align: center;">
                                <p style="font-size: 1.5rem; font-weight: 700; color: var(--color-green);">${player.stats.goals}</p>
                                <p style="font-size: 0.75rem; color: var(--color-gray);">Gole</p>
                            </div>
                            <div style="text-align: center;">
                                <p style="font-size: 1.5rem; font-weight: 700; color: var(--color-green);">${player.stats.assists}</p>
                                <p style="font-size: 0.75rem; color: var(--color-gray);">Asysty</p>
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
                <p style="font-size: 1.125rem; color: var(--color-gray);">${player.position}</p>
            </div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div style="display: flex; justify-between; padding: 1rem 0; border-bottom: 1px solid var(--border-color);">
                <span style="color: var(--color-gray);">Wiek:</span>
                <span style="font-weight: 600; font-size: 1.125rem;">${player.age} lat</span>
            </div>
            <div style="display: flex; justify-between; padding: 1rem 0; border-bottom: 1px solid var(--border-color);">
                <span style="color: var(--color-gray);">Narodowość:</span>
                <span style="font-weight: 600; font-size: 1.125rem;">${player.nationality}</span>
            </div>
            <div style="display: flex; justify-between; padding: 1rem 0; border-bottom: 1px solid var(--border-color);">
                <span style="color: var(--color-gray);">Wzrost:</span>
                <span style="font-weight: 600; font-size: 1.125rem;">${player.height}</span>
            </div>
            <div style="padding-top: 1rem;">
                <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem;">Statystyki sezonu</h3>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
                    <div style="background: var(--bg-color); padding: 1rem; border-radius: 12px; text-align: center;">
                        <p style="font-size: 2.5rem; font-weight: 700; color: var(--color-green); margin-bottom: 4px;">${player.stats.matches}</p>
                        <p style="font-size: 0.875rem; color: var(--color-gray);">Mecze</p>
                    </div>
                    <div style="background: var(--bg-color); padding: 1rem; border-radius: 12px; text-align: center;">
                        <p style="font-size: 2.5rem; font-weight: 700; color: var(--color-green); margin-bottom: 4px;">${player.stats.goals}</p>
                        <p style="font-size: 0.875rem; color: var(--color-gray);">Gole</p>
                    </div>
                    <div style="background: var(--bg-color); padding: 1rem; border-radius: 12px; text-align: center;">
                        <p style="font-size: 2.5rem; font-weight: 700; color: var(--color-green); margin-bottom: 4px;">${player.stats.assists}</p>
                        <p style="font-size: 0.875rem; color: var(--color-gray);">Asysty</p>
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
      (image) => `
        <div class="gallery-item" onclick="showLightbox('${image.url}', '${image.caption}', '${image.date}')">
            <img src="${image.url}" alt="${image.caption}">
            <div class="gallery-overlay">
                <div class="gallery-caption">${image.caption}</div>
                <div class="gallery-date">${new Date(image.date).toLocaleDateString("pl-PL")}</div>
            </div>
        </div>
    `,
    )
    .join("")
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
      (sponsor) => `
        <a href="${sponsor.website || "#"}" target="_blank" class="sponsor-item">
            <img src="${sponsor.logo}" alt="${sponsor.name}">
        </a>
    `,
    )
    .join("")
}

// Helper function to save messages to localStorage
function saveMessageToLocalStorage(message) {
  const messages = JSON.parse(localStorage.getItem("messages")) || []
  messages.push(message)
  localStorage.setItem("messages", JSON.stringify(messages))
}
