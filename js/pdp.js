// Houdt het huidige Pokémon-ID bij
let currentPokemonId = null;

document.addEventListener("DOMContentLoaded", () => {
  const MAX_POKEMONS = 1000;

  // Haalt de Pokémon ID uit de URL (bijv. ?id=25 voor Pikachu)
  const pokemonID = new URLSearchParams(window.location.search).get("id");
  const id = parseInt(pokemonID, 10);

  // Controleert of het ID geldig is (tussen 1 en 1000), anders wordt de gebruiker teruggestuurd naar index.html
  if (id < 1 || id > MAX_POKEMONS) {
    return (window.location.href = "./index.html");
  }

  currentPokemonId = id;
  loadPokemon(id);
});

// Functie om Pokémon-data op te halen en weer te geven
async function loadPokemon(id) {
  try {
    // Voert 2 API-aanroepen tegelijkertijd uit:
    // 1. Algemene Pokémon data (zoals naam, type, stats, afbeelding)
    // 2. Soort-specifieke data (zoals de beschrijving)
    const [pokemonID, pokemonSpecies] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>
        res.json()
      ),

      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) =>
        res.json()
      ),
    ]);

    // Selecteert het HTML-element waar de abilities worden getoond
    const abilitiesWrapper = document.querySelector(
      ".pokemon-detail-wrap .pokemon-detail.move"
    );

    // Controleert of de huidige Pokémon overeenkomt met de geladen Pokémon
    if (currentPokemonId === id) {
      displayPokemonDetails(pokemonID); // Roept functie aan om details weer te geven

      // Haalt de Engelse beschrijving op
      const flavorText = getEnglishFlavorText(pokemonSpecies);
      document.querySelector(".body3-fonts.pokemon-description").textContent =
        flavorText;

      // Pijlen om te navigeren naar de vorige of volgende Pokémon
      const [leftArrow, rightArrow] = ["#leftArrow", "#rightArrow"].map((sel) =>
        document.querySelector(sel)
      );

      if (leftArrow) {
        leftArrow.removeEventListener("click", navigatePokemon);
        if (id !== 1) {
          leftArrow.addEventListener("click", () => {
            navigatePokemon(id - 1); // Vorige Pokémon
          });
        }
      }

      if (rightArrow) {
        rightArrow.removeEventListener("click", navigatePokemon);
        if (id !== 1000) {
          rightArrow.addEventListener("click", () => {
            navigatePokemon(id + 1); // Volgende Pokémon
          });
        }
      }

      // Update de URL zonder de pagina opnieuw te laden
      window.history.pushState({}, "", `./detail.html?id=${id}`);
    }

    // Leegt het abilities-element voordat nieuwe data wordt toegevoegd
    abilitiesWrapper.innerHTML = "";
  } catch (error) {
    console.error("An error occurred while fetching Pokémon data:", error);
    return false;
  }
}

// Functie om naar een andere Pokémon te navigeren
async function navigatePokemon(id) {
  currentPokemonId = id;
  await loadPokemon(id);
}

// Object dat de type-kleuren koppelt aan hun kleuren in hex
const typeColors = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  fly: "#A890f0",
  psychic: "#F85888",
  bug: "#A8B830",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038f8",
  dark: "#705848",
  steel: "#B8B8B0",
  fairy: "#EE99AC",
};

// Functie om CSS-stijlen toe te passen op een lijst van elementen
function setElementStyles(elements, cssProperty, value) {
  elements.forEach((element) => {
    element.style[cssProperty] = value;
  });
}

// Functie om een hex-kleur om te zetten naar een RGB-string (bijv. "#FF5733" → "255, 87, 51")
function rgbaFromHex(hexColor) {
  return [
    parseInt(hexColor.slice(1, 3), 16),
    parseInt(hexColor.slice(3, 5), 16),
    parseInt(hexColor.slice(5, 7), 16),
  ].join(", ");
}

// Functie om de achtergrondkleur aan te passen aan het type van de Pokémon
function setTypeBackgroundColor(pokemon) {
  const mainType = pokemon.types[0].type.name;
  const color = typeColors[mainType];

  if (!color) {
    console.warn(`Color not defined for type: ${mainType}`);
    return;
  }

  // Past de kleur toe op verschillende elementen
  const detailMainElement = document.querySelector(".detail-main");
  setElementStyles([detailMainElement], "backgroundColor", color);
  setElementStyles([detailMainElement], "borderColor", color);
}

// Zet de eerste letter van een string om naar hoofdletter
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// Functie om een nieuw HTML-element te maken en toe te voegen aan een ouder-element
function createAndAppendElement(parent, tag, options = {}) {
  const element = document.createElement(tag);
  Object.keys(options).forEach((key) => {
    element[key] = options[key];
  });
  parent.appendChild(element);
  return element;
}

// Functie die de Pokémon-details weergeeft op de pagina
function displayPokemonDetails(pokemon) {
  const { name, id, types, weight, height, abilities, stats } = pokemon;
  const capitalizePokemonName = capitalizeFirstLetter(name);

  // Stelt de paginatitel in
  document.querySelector("title").textContent = capitalizePokemonName;

  // Stelt de naam en ID van de Pokémon in
  document.querySelector(".name-wrap .name").textContent =
    capitalizePokemonName;
  document.querySelector(
    ".pokemon-id-wrap .body2-fonts"
  ).textContent = `#${String(id).padStart(3, "0")}`;

  // Stelt de afbeelding in
  const imageElement = document.querySelector(".detail-img-wrapper img");
  imageElement.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  imageElement.alt = name;

  // Stelt de type-elementen in
  const typeWrapper = document.querySelector(".power-wrapper");
  typeWrapper.innerHTML = "";
  types.forEach(({ type }) => {
    createAndAppendElement(typeWrapper, "p", {
      className: `body3-font type ${type.name}`,
      textContent: type.name,
    });
  });

  // Zet de achtergrondkleur op basis van het type
  setTypeBackgroundColor(pokemon);
}

// Haalt de Engelse beschrijving van de Pokémon op
function getEnglishFlavorText(pokemonSpecies) {
  for (let entry of pokemonSpecies.flavor_text_entries) {
    if (entry.language.name === "en") {
      return entry.flavor_text.replace(/\f/g, " "); // Verwijdert ongewenste tekens
    }
  }
  return "";
}
