const inputElemnt = document.querySelector("#search-input");
const search_icon = document.querySelector("#search-close-icon");
const sort_wrapper = document.querySelector(".sort-wrapper");

inputElemnt.addEventListener("input", () => {
  handleInputChange();
});
