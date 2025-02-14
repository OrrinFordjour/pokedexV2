const MAX_POKEMON = 1000; // Maximaal aantal Pokémon dat wordt opgehaald
const listWrapper = document.querySelector(".list-wrapper"); // Container waarin de Pokémon worden getoond
const searchInput = document.querySelector("#search-input"); // Zoekveld voor filteren
const numberFilter = document.querySelector("#number"); // Radio-button voor zoeken op nummer
const nameFilter = document.querySelector("#name"); // Radio-button voor zoeken op naam
const notFoundMessage = document.querySelector("#not-found-message"); // Bericht dat wordt getoond als er geen resultaten zijn

let allPokemons = []; // Hierin worden alle Pokémon opgeslagen na het ophalen

// Pokémon ophalen van de API
fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
  .then((response) => response.json()) // JSON-response omzetten naar een object
  .then((data) => {
    allPokemons = data.results; // Opslaan van de opgehaalde Pokémon
    displayPokemons(allPokemons); // Weergave van de Pokémon in de lijst
  });

// Haalt data van een specifieke Pokémon op vóór de redirect
async function fetchPokemonBeforeRedirect(id) {
  try {
    const [pokemonID, pokemonSpecies] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>
        res.json()
      ),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) =>
        res.json()
      ),
    ]);
    return true; // Geeft aan dat de data succesvol is opgehaald
  } catch (error) {
    console.error("Failed to fetch pokemon before redirect"); // Logt een foutmelding als de fetch mislukt
  }
}

// Toont een lijst van Pokémon in de UI
function displayPokemons(pokemon) {
  listWrapper.innerHTML = ""; // Leegt de lijst voordat nieuwe items worden toegevoegd

  pokemon.forEach((pokemon) => {
    const pokemonID = pokemon.url.split("/")[6]; // Extract het ID van de Pokémon uit de URL
    const listItem = document.createElement("div"); // Creëert een nieuw div-element voor de Pokémon
    listItem.className = "list-item"; // Geeft de div een class voor styling
    listItem.innerHTML = `
    <div class="number-wrap">
        <p class="caption-fonts">#${pokemonID}</p>
    </div>
    <div class="img-wrap">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonID}.png" alt="${pokemon.name}" />
    </div>
    <div class="name-wrap">
        <p class="body3-fonts">#${pokemon.name}</p>
    </div>
    `;

    // Wanneer op een Pokémon wordt geklikt, haal data op en navigeer naar de detailpagina
    listItem.addEventListener("click", async () => {
      const success = await fetchPokemonBeforeRedirect(pokemonID);

      if (success) {
        window.location.href = `./pdp.html?id=${pokemonID}`; // Navigeert naar de detailpagina
      }
    });

    listWrapper.appendChild(listItem); // Voeg de Pokémon toe aan de lijst
  });
}

// Luistert naar toetsenbordinvoer in het zoekveld
searchInput.addEventListener("keyup", handleSearch);

function handleSearch() {
  const searchTerm = searchInput.value.toLowerCase(); // Zet de input om naar kleine letters
  let filteredPokemons;

  // Als zoeken op nummer is geselecteerd, filter op ID
  if (numberFilter.checked) {
    filteredPokemons = allPokemons.filter((pokemon) => {
      const pokemonID = pokemon.url.split("/")[6];
      return pokemonID.startsWith(searchTerm);
    });
  }
  // Als zoeken op naam is geselecteerd, filter op naam
  else if (nameFilter.checked) {
    filteredPokemons = allPokemons.filter((pokemon) => {
      return pokemon.name.toLowerCase().startsWith(searchTerm);
    });
  }
  // Als geen filter is geselecteerd, toon alle Pokémon
  else {
    filteredPokemons = allPokemons;
  }

  displayPokemons(filteredPokemons); // Toon de gefilterde resultaten

  // Als er geen resultaten zijn, toon "niet gevonden" bericht
  if (filteredPokemons.length === 0) {
    notFoundMessage.style.display = "block";
  } else {
    notFoundMessage.style.display = "none";
  }
}

// Selecteer de zoek-resetknop en koppel de clear-functie
const closeButton = document.querySelector(".search-close-icon");
closeButton.addEventListener("click", clearSearch);

// Leegt de zoekinput en toont alle Pokémon weer
function clearSearch() {
  searchInput.value = ""; // Wis het zoekveld
  displayPokemons(allPokemons); // Toon alle Pokémon opnieuw
  notFoundMessage.style.display = "none"; // Verberg het "niet gevonden" bericht
}
