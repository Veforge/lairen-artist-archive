const state = {
    artists: [],
    cards: [],
    selectedArtist: null,
    search: ""
};

// =====================
// CARGA DE DATOS
// =====================

async function loadCards() {
    const response = await fetch("data/cards.json");
    state.cards = await response.json();
}

// =====================
// PROCESAR ARTISTAS
// =====================

function normalizeArtistKey(name) {

    return name
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "");

}

function extractArtists() {

    const artistsMap = new Map();

    state.cards.forEach(card => {

       if (!card.artista || card.artista.trim() === "") return;

const key = normalizeArtistKey(card.artista);

if (!artistsMap.has(key)) {

    const layouts = [
    "small",
    "medium",
    "medium",
    "medium",
    "tall",
    "wide"
];

artistsMap.set(key, {

    name: card.artista.trim(),

    cards: [],

    layout: layouts[
        Math.floor(Math.random() * layouts.length)
    ]

});

}

artistsMap.get(key).cards.push(card);

    });

    state.artists = Array.from(artistsMap.values());

    state.artists.sort((a, b) => a.name.localeCompare(b.name));

    document.getElementById("artistCount").textContent = state.artists.length;
    const illustratedCards = state.cards.filter(card =>
    card.artista && card.artista.trim() !== ""
);

document.getElementById("cardCount").textContent = illustratedCards.length;

}

// =====================
// LISTA DE ARTISTAS
// =====================

function renderArtistList() {

    const artistList = document.getElementById("artistList");

    artistList.innerHTML = "";

    const filteredArtists = state.artists.filter(artist =>
    artist.name
        .toLowerCase()
        .includes(state.search.toLowerCase())
);

filteredArtists.forEach(artist => {

        // Elegimos una carta al azar como portada
        const cover =
            artist.cards[
                Math.floor(Math.random() * artist.cards.length)
            ];

        const card = document.createElement("div");

        card.className = `artist-card ${artist.layout}`;

        card.innerHTML = `
            <img
                class="artist-cover"
                src="${cover.urlImagen}"
                alt="${artist.name}"
                loading="lazy"
            >

            <div class="artist-overlay">

                <h3>${artist.name}</h3>

                <span>${artist.cards.length} ilustraciones</span>

            </div>
        `;

        card.addEventListener("click", () => {

            state.selectedArtist = artist;

            renderArtistDetail();

            document
                .getElementById("artistDetail")
                .scrollIntoView({
                    behavior: "smooth"
                });

        });

        artistList.appendChild(card);

    });

}

// =====================
// DETALLE DEL ARTISTA
// =====================

function renderArtistDetail() {

    const detail = document.getElementById("artistDetail");

    if (!state.selectedArtist) {

        detail.innerHTML = "<h2>Seleccioná un artista</h2>";

        return;

    }

    let html = `
        <h2>${state.selectedArtist.name}</h2>
        <p>${state.selectedArtist.cards.length} cartas ilustradas</p>
        <hr>
        <div class="card-grid">
    `;

    state.selectedArtist.cards.forEach(card => {

        html += `
            <div class="card">
                <img
                    src="${card.urlImagen}"
                    alt="${card.nombreCarta}"
                    title="${card.nombreCarta}"
                    loading="lazy"
                >
            </div>
        `;

    });

    html += "</div>";

    detail.innerHTML = html;

    setupCardClicks();

}

// =====================
// MODAL
// =====================

function setupCardClicks() {

    document.querySelectorAll(".card img").forEach(img => {

        img.addEventListener("click", () => {

            document.getElementById("modalImage").src = img.src;

            document.getElementById("imageModal").classList.remove("hidden");

        });

    });

}

function setupModal() {

    document.getElementById("closeModal").addEventListener("click", () => {

        document.getElementById("imageModal").classList.add("hidden");

    });

    document.getElementById("imageModal").addEventListener("click", (event) => {

        if (event.target.id === "imageModal") {

            document.getElementById("imageModal").classList.add("hidden");

        }

    });

}

// =====================
// INICIO
// =====================

async function init() {

    await loadCards();

    extractArtists();

    // Solo al cargar la página
    state.artists.sort(() => Math.random() - 0.5);

    renderArtistList();

    const search = document.getElementById("searchInput");

    search.addEventListener("input", (event) => {

        state.search = event.target.value;

        renderArtistList();

    });

    document
        .getElementById("shuffleButton")
        .addEventListener("click", () => {

            // Solo cambia las portadas
            renderArtistList();

        });

    setupModal();

}

init();