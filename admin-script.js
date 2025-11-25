// Firebase Configuration (User needs to add their config)
const firebaseConfig = {
  apiKey: "AIzaSyCVsfqKhjWC8Fdmr5xxNlqtGzfEhyaYaEA",
  authDomain: "kp-las-puszczykowo.firebaseapp.com",
  databaseURL: "https://kp-las-puszczykowo-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "kp-las-puszczykowo",
  storageBucket: "kp-las-puszczykowo.firebasestorage.app",
  messagingSenderId: "756811498454",
  appId: "1:756811498454:web:532a4171b9def370055a77",
}

// Import Firebase
const firebase = window.firebase

// Initialize Firebase
let firebaseInitialized = false
let db = null
let storage = null

try {
  if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
    firebase.initializeApp(firebaseConfig)
    db = firebase.database()
    storage = firebase.storage()
    firebaseInitialized = true
    console.log("[v0] Firebase initialized successfully")
  } else {
    console.log("[v0] Firebase not configured - using localStorage fallback")
  }
} catch (error) {
  console.error("[v0] Firebase initialization error:", error)
}

// Check Authentication
document.addEventListener("DOMContentLoaded", () => {
  const isAuthenticated = sessionStorage.getItem("adminAuthenticated")
  if (!isAuthenticated) {
    window.location.href = "admin-login.html"
    return
  }

  initializeAdmin()
})

// Initialize Admin Panel
function initializeAdmin() {
  setupTabs()
  setupForms()
  loadAllData()
  setupLogout()
}

// Setup Tabs
function setupTabs() {
  const navButtons = document.querySelectorAll(".nav-btn")
  const tabContents = document.querySelectorAll(".tab-content")

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetTab = btn.dataset.tab

      navButtons.forEach((b) => b.classList.remove("active"))
      tabContents.forEach((tab) => tab.classList.remove("active"))

      btn.classList.add("active")
      document.getElementById(`${targetTab}Tab`).classList.add("active")

      // Update page title
      const titles = {
        dashboard: "Dashboard",
        news: "Zarządzanie Aktualnościami",
        matches: "Zarządzanie Meczami",
        players: "Zarządzanie Zawodnikami",
        gallery: "Zarządzanie Galerią",
        sponsors: "Zarządzanie Sponsorami",
        messages: "Wiadomości z Formularza",
      }
      document.getElementById("pageTitle").textContent = titles[targetTab]
    })
  })
}

// Setup Forms
function setupForms() {
  // News Form
  document.getElementById("newsForm").addEventListener("submit", async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const newsItem = {
      id: Date.now(),
      title: formData.get("title"),
      content: formData.get("content"),
      date: formData.get("date"),
    }

    await saveData("news", newsItem)
    e.target.reset()
    loadNews()
  })

  // Match Form
  document.getElementById("matchForm").addEventListener("submit", async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const matchItem = {
      id: Date.now(),
      homeTeam: formData.get("homeTeam"),
      awayTeam: formData.get("awayTeam"),
      homeScore: Number.parseInt(formData.get("homeScore")),
      awayScore: Number.parseInt(formData.get("awayScore")),
      date: formData.get("date"),
    }

    await saveData("matches", matchItem)
    e.target.reset()
    loadMatches()
  })

  // Player Form
  document.getElementById("playerForm").addEventListener("submit", async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const playerItem = {
      id: Date.now(),
      name: formData.get("name"),
      number: Number.parseInt(formData.get("number")),
      position: formData.get("position"),
      age: Number.parseInt(formData.get("age")),
      height: formData.get("height"),
      nationality: formData.get("nationality"),
      stats: { matches: 0, goals: 0, assists: 0 },
    }

    await saveData("players", playerItem)
    e.target.reset()
    loadPlayers()
  })

  // Gallery Form
  document.getElementById("galleryForm").addEventListener("submit", async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const fileInput = document.getElementById("galleryImageFile")
    const file = fileInput.files[0]

    let imageUrl = formData.get("url")

    // If file is uploaded, use that instead of URL
    if (file) {
      const reader = new FileReader()
      reader.onload = async (event) => {
        imageUrl = event.target.result

        const galleryItem = {
          id: Date.now(),
          url: imageUrl,
          caption: formData.get("caption"),
          date: formData.get("date"),
        }

        await saveData("gallery", galleryItem)
        e.target.reset()
        fileInput.value = ""
        document.getElementById("galleryImagePreview").style.display = "none"
        loadGallery()
      }
      reader.readAsDataURL(file)
    } else if (imageUrl) {
      // Use URL if provided
      const galleryItem = {
        id: Date.now(),
        url: imageUrl,
        caption: formData.get("caption"),
        date: formData.get("date"),
      }

      await saveData("gallery", galleryItem)
      e.target.reset()
      loadGallery()
    } else {
      alert("Proszę dodać zdjęcie (plik lub URL)")
    }
  })

  // Sponsor Form
  document.getElementById("sponsorForm").addEventListener("submit", async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const fileInput = document.getElementById("sponsorLogoFile")
    const file = fileInput.files[0]

    let logoUrl = formData.get("logo")

    // If file is uploaded, use that instead of URL
    if (file) {
      const reader = new FileReader()
      reader.onload = async (event) => {
        logoUrl = event.target.result

        const sponsorItem = {
          id: Date.now(),
          name: formData.get("name"),
          logo: logoUrl,
          website: formData.get("website"),
        }

        await saveData("sponsors", sponsorItem)
        e.target.reset()
        fileInput.value = ""
        document.getElementById("sponsorLogoPreview").style.display = "none"
        loadSponsors()
      }
      reader.readAsDataURL(file)
    } else if (logoUrl) {
      // Use URL if provided
      const sponsorItem = {
        id: Date.now(),
        name: formData.get("name"),
        logo: logoUrl,
        website: formData.get("website"),
      }

      await saveData("sponsors", sponsorItem)
      e.target.reset()
      loadSponsors()
    } else {
      alert("Proszę dodać logo (plik lub URL)")
    }
  })
}

// Save Data (Firebase or localStorage)
async function saveData(collection, item) {
  if (firebaseInitialized) {
    try {
      await db.ref(`${collection}/${item.id}`).set(item)
      console.log(`[v0] Saved to Firebase: ${collection}/${item.id}`)
    } catch (error) {
      console.error("[v0] Firebase save error:", error)
      saveToLocalStorage(collection, item)
    }
  } else {
    saveToLocalStorage(collection, item)
  }
}

// Save to localStorage
function saveToLocalStorage(collection, item) {
  const data = JSON.parse(localStorage.getItem(collection)) || []
  data.push(item)
  localStorage.setItem(collection, JSON.stringify(data))
}

// Load All Data
async function loadAllData() {
  await loadNews()
  await loadMatches()
  await loadPlayers()
  await loadGallery()
  await loadSponsors()
  await loadMessages()
  await updateDashboard()
}

// Load Data (Firebase or localStorage)
async function loadData(collection) {
  if (firebaseInitialized) {
    try {
      const snapshot = await db.ref(collection).once("value")
      const data = snapshot.val()
      return data ? Object.values(data) : []
    } catch (error) {
      console.error("[v0] Firebase load error:", error)
      return JSON.parse(localStorage.getItem(collection)) || []
    }
  } else {
    return JSON.parse(localStorage.getItem(collection)) || []
  }
}

// Delete Data
async function deleteData(collection, id) {
  if (firebaseInitialized) {
    try {
      await db.ref(`${collection}/${id}`).remove()
      console.log(`[v0] Deleted from Firebase: ${collection}/${id}`)
    } catch (error) {
      console.error("[v0] Firebase delete error:", error)
      deleteFromLocalStorage(collection, id)
    }
  } else {
    deleteFromLocalStorage(collection, id)
  }
}

// Delete from localStorage
function deleteFromLocalStorage(collection, id) {
  const data = JSON.parse(localStorage.getItem(collection)) || []
  const filtered = data.filter((item) => item.id !== id)
  localStorage.setItem(collection, JSON.stringify(filtered))
}

// Load News
async function loadNews() {
  const news = await loadData("news")
  const newsList = document.getElementById("newsList")

  if (news.length === 0) {
    newsList.innerHTML = '<p class="empty-message">Brak aktualności</p>'
    return
  }

  newsList.innerHTML = news
    .map(
      (item) => `
        <div class="item-card">
            <div class="item-info">
                <div class="item-title">${item.title}</div>
                <div class="item-meta">${item.content.substring(0, 100)}...</div>
                <div class="item-meta">${new Date(item.date).toLocaleDateString("pl-PL")}</div>
            </div>
            <div class="item-actions">
                <button class="btn-delete" onclick="deleteNews(${item.id})">🗑️ Usuń</button>
            </div>
        </div>
    `,
    )
    .join("")
}

async function deleteNews(id) {
  if (confirm("Czy na pewno chcesz usunąć tę aktualność?")) {
    await deleteData("news", id)
    loadNews()
  }
}

// Load Matches
async function loadMatches() {
  const matches = await loadData("matches")
  const matchesList = document.getElementById("matchesList")

  if (matches.length === 0) {
    matchesList.innerHTML = '<p class="empty-message">Brak wyników meczów</p>'
    return
  }

  matchesList.innerHTML = matches
    .map(
      (match) => `
        <div class="item-card">
            <div class="item-info">
                <div class="item-title">${match.homeTeam} ${match.homeScore} : ${match.awayScore} ${match.awayTeam}</div>
                <div class="item-meta">${new Date(match.date).toLocaleDateString("pl-PL")}</div>
            </div>
            <div class="item-actions">
                <button class="btn-delete" onclick="deleteMatch(${match.id})">🗑️ Usuń</button>
            </div>
        </div>
    `,
    )
    .join("")
}

async function deleteMatch(id) {
  if (confirm("Czy na pewno chcesz usunąć ten mecz?")) {
    await deleteData("matches", id)
    loadMatches()
  }
}

// Load Players
async function loadPlayers() {
  const players = await loadData("players")
  const playersList = document.getElementById("playersList")

  if (players.length === 0) {
    playersList.innerHTML = '<p class="empty-message">Brak zawodników</p>'
    return
  }

  playersList.innerHTML = players
    .map(
      (player) => `
        <div class="player-card">
            <div class="player-number ${player.position.toLowerCase()}">${player.number}</div>
            <div class="player-name">${player.name}</div>
            <div class="player-position">${player.position} | ${player.age} lat</div>
            <div class="player-stats">
                <div class="stat-box">
                    <div class="stat-value">${player.stats.matches}</div>
                    <div class="stat-label-small">Mecze</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${player.stats.goals}</div>
                    <div class="stat-label-small">Gole</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${player.stats.assists}</div>
                    <div class="stat-label-small">Asysty</div>
                </div>
            </div>
            <button class="btn-edit" onclick="editPlayerStats(${player.id}, '${player.name}', ${player.stats.matches}, ${player.stats.goals}, ${player.stats.assists})">✏️ Edytuj Statystyki</button>
            <button class="btn-delete" onclick="deletePlayer(${player.id})">🗑️ Usuń</button>
        </div>
    `,
    )
    .join("")
}

async function editPlayerStats(playerId, playerName, currentMatches, currentGoals, currentAssists) {
  const matches = prompt(`Edytuj liczbę meczów dla ${playerName}:`, currentMatches)
  if (matches === null) return

  const goals = prompt(`Edytuj liczbę goli dla ${playerName}:`, currentGoals)
  if (goals === null) return

  const assists = prompt(`Edytuj liczbę asyst dla ${playerName}:`, currentAssists)
  if (assists === null) return

  // Update player stats
  if (firebaseInitialized) {
    try {
      await db.ref(`players/${playerId}/stats`).update({
        matches: Number.parseInt(matches) || 0,
        goals: Number.parseInt(goals) || 0,
        assists: Number.parseInt(assists) || 0,
      })
      console.log(`[v0] Updated stats for player ${playerId}`)
    } catch (error) {
      console.error("[v0] Firebase update error:", error)
      updateStatsLocalStorage(playerId, matches, goals, assists)
    }
  } else {
    updateStatsLocalStorage(playerId, matches, goals, assists)
  }

  loadPlayers()
  updateDashboard()
}

function updateStatsLocalStorage(playerId, matches, goals, assists) {
  const players = JSON.parse(localStorage.getItem("players")) || []
  const playerIndex = players.findIndex((p) => p.id === playerId)
  if (playerIndex !== -1) {
    players[playerIndex].stats = {
      matches: Number.parseInt(matches) || 0,
      goals: Number.parseInt(goals) || 0,
      assists: Number.parseInt(assists) || 0,
    }
    localStorage.setItem("players", JSON.stringify(players))
  }
}

// Load Gallery
async function loadGallery() {
  const gallery = await loadData("gallery")
  const galleryList = document.getElementById("galleryList")

  if (gallery.length === 0) {
    galleryList.innerHTML = '<p class="empty-message">Brak zdjęć</p>'
    return
  }

  galleryList.innerHTML = gallery
    .map(
      (image) => `
        <div class="gallery-card">
            <img src="${image.url}" alt="${image.caption}">
            <div class="gallery-card-overlay">
                <div class="gallery-card-title">${image.caption}</div>
                <div class="gallery-card-date">${new Date(image.date).toLocaleDateString("pl-PL")}</div>
            </div>
            <button class="gallery-card-delete" onclick="deleteGallery(${image.id})">×</button>
        </div>
    `,
    )
    .join("")
}

async function deleteGallery(id) {
  if (confirm("Czy na pewno chcesz usunąć to zdjęcie?")) {
    await deleteData("gallery", id)
    loadGallery()
  }
}

// Load Sponsors
async function loadSponsors() {
  const sponsors = await loadData("sponsors")
  const sponsorsList = document.getElementById("sponsorsList")

  if (sponsors.length === 0) {
    sponsorsList.innerHTML = '<p class="empty-message">Brak sponsorów</p>'
    return
  }

  sponsorsList.innerHTML = sponsors
    .map(
      (sponsor) => `
        <div class="sponsor-card">
            <img src="${sponsor.logo}" alt="${sponsor.name}">
            <div class="sponsor-name">${sponsor.name}</div>
            <button class="btn-delete" onclick="deleteSponsor(${sponsor.id})">🗑️ Usuń</button>
        </div>
    `,
    )
    .join("")
}

async function deleteSponsor(id) {
  if (confirm("Czy na pewno chcesz usunąć tego sponsora?")) {
    await deleteData("sponsors", id)
    loadSponsors()
  }
}

// Load Messages
async function loadMessages() {
  const messages = await loadData("messages")
  const messagesList = document.getElementById("messagesList")

  if (messages.length === 0) {
    messagesList.innerHTML = '<p class="empty-message">Brak wiadomości</p>'
    return
  }

  // Sort by date (newest first)
  messages.sort((a, b) => new Date(b.date) - new Date(a.date))

  messagesList.innerHTML = messages
    .map(
      (msg) => `
        <div class="message-card ${msg.read ? "read" : "unread"}">
            <div class="message-header">
                <div>
                    <div class="message-from">${msg.name}</div>
                    <div class="message-email">${msg.email}</div>
                </div>
                <div class="message-date">${new Date(msg.date).toLocaleString("pl-PL")}</div>
            </div>
            <div class="message-subject">${msg.subject}</div>
            <div class="message-text">${msg.message}</div>
            <div class="message-actions">
                ${!msg.read ? `<button class="btn-primary" onclick="markAsRead(${msg.id})">✓ Oznacz jako przeczytane</button>` : ""}
                <button class="btn-delete" onclick="deleteMessage(${msg.id})">🗑️ Usuń</button>
            </div>
        </div>
    `,
    )
    .join("")
}

// Mark As Read
async function markAsRead(id) {
  if (firebaseInitialized) {
    try {
      await db.ref(`messages/${id}/read`).set(true)
    } catch (error) {
      console.error("[v0] Firebase update error:", error)
      markAsReadLocalStorage(id)
    }
  } else {
    markAsReadLocalStorage(id)
  }
  loadMessages()
  updateDashboard()
}

function markAsReadLocalStorage(id) {
  const messages = JSON.parse(localStorage.getItem("messages")) || []
  const message = messages.find((m) => m.id === id)
  if (message) {
    message.read = true
    localStorage.setItem("messages", JSON.stringify(messages))
  }
}

// Delete Message
async function deleteMessage(id) {
  if (confirm("Czy na pewno chcesz usunąć tę wiadomość?")) {
    await deleteData("messages", id)
    loadMessages()
    updateDashboard()
  }
}

// Update Dashboard
async function updateDashboard() {
  const news = await loadData("news")
  const matches = await loadData("matches")
  const players = await loadData("players")
  const gallery = await loadData("gallery")
  const sponsors = await loadData("sponsors")
  const messages = await loadData("messages")

  // Update stats
  document.getElementById("statsNews").textContent = news.length
  document.getElementById("statsMatches").textContent = matches.length
  document.getElementById("statsPlayers").textContent = players.length
  document.getElementById("statsGallery").textContent = gallery.length
  document.getElementById("statsSponsors").textContent = sponsors.length

  const unreadMessages = messages.filter((m) => !m.read).length
  document.getElementById("statsMessages").textContent = `${unreadMessages}/${messages.length}`

  // Update recent news
  const dashboardNewsList = document.getElementById("dashboardNewsList")
  if (news.length === 0) {
    dashboardNewsList.innerHTML = '<p class="empty-message">Brak aktualności</p>'
  } else {
    dashboardNewsList.innerHTML = news
      .slice(0, 3)
      .map(
        (item) => `
        <div class="dashboard-item">
          <div class="dashboard-item-title">${item.title}</div>
          <div class="dashboard-item-date">${new Date(item.date).toLocaleDateString("pl-PL")}</div>
        </div>
      `,
      )
      .join("")
  }

  // Update recent matches
  const dashboardMatchesList = document.getElementById("dashboardMatchesList")
  if (matches.length === 0) {
    dashboardMatchesList.innerHTML = '<p class="empty-message">Brak meczów</p>'
  } else {
    dashboardMatchesList.innerHTML = matches
      .slice(0, 3)
      .map(
        (match) => `
        <div class="dashboard-item">
          <div class="dashboard-item-title">${match.homeTeam} ${match.homeScore} : ${match.awayScore} ${match.awayTeam}</div>
          <div class="dashboard-item-date">${new Date(match.date).toLocaleDateString("pl-PL")}</div>
        </div>
      `,
      )
      .join("")
  }
}

// Logout
function setupLogout() {
  document.getElementById("logoutBtn").addEventListener("click", () => {
    sessionStorage.removeItem("adminAuthenticated")
    window.location.href = "admin-login.html"
  })
}

// File upload handling for gallery images
document.getElementById("galleryImageFile").addEventListener("change", (e) => {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (event) => {
      document.getElementById("galleryPreviewImg").src = event.target.result
      document.getElementById("galleryPreviewName").textContent = file.name
      document.getElementById("galleryPreviewSize").textContent = `${(file.size / 1024).toFixed(2)} KB`
      document.getElementById("galleryImagePreview").style.display = "flex"
    }
    reader.readAsDataURL(file)
  }
})

// File upload handling for sponsor logos
document.getElementById("sponsorLogoFile").addEventListener("change", (e) => {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (event) => {
      document.getElementById("sponsorPreviewImg").src = event.target.result
      document.getElementById("sponsorPreviewName").textContent = file.name
      document.getElementById("sponsorPreviewSize").textContent = `${(file.size / 1024).toFixed(2)} KB`
      document.getElementById("sponsorLogoPreview").style.display = "flex"
    }
    reader.readAsDataURL(file)
  }
})

// Make functions globally accessible
window.deletePlayer = deletePlayer
window.deleteNews = deleteNews
window.deleteMatch = deleteMatch
window.deleteGallery = deleteGallery
window.deleteSponsor = deleteSponsor
window.deleteMessage = deleteMessage
window.markAsRead = markAsRead
window.editPlayerStats = editPlayerStats

async function deletePlayer(id) {
  if (confirm("Czy na pewno chcesz usunąć tego zawodnika?")) {
    await deleteData("players", id)
    await loadPlayers()
    await updateDashboard()
  }
}
