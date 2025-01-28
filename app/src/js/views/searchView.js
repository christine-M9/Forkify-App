class SearchView {
  _parentElement = document.querySelector('.search__field');

  // Attach the handler to the input event of the search field
  addHandlerSearch(handler) {
    this._parentElement.addEventListener('input', function (e) {
      const query = e.target.value.trim();
      if (query) {
        handler(query);  // Pass the full query string
      }
    });
  }

  // Retrieve the full search query from the input field
  getQuery() {
    return this._parentElement.value.trim();  // Return the full query string
  }
}


export default new SearchView();
