// Selecteert het invoerveld voor de zoekfunctie
const inputElement = document.querySelector("#search-input");

// Selecteert het sluiticoon naast het zoekveld
const search_icon = document.querySelector("#search-close-icon");

// Selecteert de sorteerknop
const sort_wrapper = document.querySelector(".sort-wrapper");

// Voegt een event listener toe om veranderingen in het invoerveld te detecteren
inputElement.addEventListener("input", () => {
  handleInputChange(inputElement);
});

// Voegt een event listener toe om het zoekveld te wissen bij een klik op het sluiticoon
search_icon.addEventListener("click", handleSearchCloseOnClick);

// Voegt een event listener toe om het filtermenu te openen/sluiten bij een klik op de sorteermenu
sort_wrapper.addEventListener("click", handleSortIconOnClick);

/**
 * Functie om het zoekveld te controleren en het sluiticoon weer te geven/verbergen
 */
function handleInputChange(inputElement) {
  const inputValue = inputElement.value;

  if (inputValue !== "") {
    // Als er tekst in het invoerveld staat, toon het sluiticoon
    document
      .querySelector("#search-close-icon")
      .classList.add("search-close-icon-visible");
  } else {
    // Als het invoerveld leeg is, verberg het sluiticoon
    document
      .querySelector("#search-close-icon")
      .classList.remove("search-close-icon-visible");
  }
}

/**
 * Functie om het zoekveld te wissen en het sluiticoon te verbergen
 */
function handleSearchCloseOnClick() {
  document.querySelector("#search-input").value = ""; // Wis de invoer
  document
    .querySelector("#search-close-icon")
    .classList.remove("search-close-icon-visible"); // Verberg het sluiticoon
}

/**
 * Functie om het filtermenu te openen of te sluiten
 */
function handleSortIconOnClick() {
  document
    .querySelector(".filter-wrapper")
    .classList.toggle("filter-wrapper-open"); // Toggle de klasse om het filtermenu te tonen of verbergen

  document.querySelector("body").classList.toggle("filter-wrapper-overlay"); // Voeg een overlay-effect toe aan de pagina als het filtermenu open is
}
