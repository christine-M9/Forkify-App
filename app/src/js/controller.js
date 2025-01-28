import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { debouncedLoadSearchResults } from './model';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// Control for recipes
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // Loading recipe
    await model.loadRecipe(id);

    // Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function (query) {
  try {
    resultsView.renderSpinner();  // Show loading spinner

    // Ensure we proceed only if the query is non-empty
    if (!query) return;

    // Call the search function with the complete query
    await model.loadSearchResults(query);

    // Render the results
    resultsView.render(model.state.search.results);
    paginationView.render(model.state.search);

  } catch (err) {
    console.log(err);
  }
};



// Control for pagination
const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};

// Control for servings
const controlServings = function (newServings) {
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
};

// Control for adding/removing bookmarks
const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
};

// Control for rendering bookmarks
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

// Control for adding a new recipe
const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    recipeView.render(model.state.recipe);
    addRecipeView.renderMessage();
    bookmarksView.render(model.state.bookmarks);
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

// Initialize the debounced search functionality
const initSearchInput = function () {
  const searchInput = document.querySelector('.search__field');
  if (!searchInput) {
    console.error("The '.search__field' element was not found.");
    return;
  }

  searchInput.addEventListener('input', (event) => {
    debouncedLoadSearchResults(event.target.value);
  });
};

// Initialize all event listeners
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  document.addEventListener('DOMContentLoaded', initSearchInput);
};

init();
