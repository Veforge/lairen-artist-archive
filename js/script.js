const state = {
    artists: [],
    cards: [],
    selectedArtist: null
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

function extractArtists() {

    const artistsMap = new Map();

    state.cards.forEach(card => {

        if (!card.artista || card.artista.trim() === "") return;

        if (!artistsMap.has(card.artista)) {
            artistsMap.set(card.artista, {
                name: card.artista,
                cards: []
            });
        }

        artistsMap.get(card.artista).cards.push(card);

    });

    state.artists = Array.from(artistsMap.values());

    state.artists.sort((a, b) => a.name.localeCompare(b.name));

    document.getElementById("artistCount").textContent = state.artists.length;
    document.getElementById("cardCount").textContent = state.cards.length;

}

// =====================
// LISTA DE ARTISTAS
// =====================

function renderArtistList() {

    const artistList = document.getElementById("artistList");

    artistList.innerHTML = "";

    state.artists.forEach(artist => {

        const item = document.createElement("div");

        item.className = "artist-item";
        item.textContent = `${artist.name} (${artist.cards.length})`;

        item.addEventListener("click", () => {

            state.selectedArtist = artist;

            renderArtistDetail();

        });

        artistList.appendChild(item);

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

    renderArtistList();

    setupModal();

}

init();