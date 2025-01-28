import View from './View.js';
import previewView from './previewView.js';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again ;)';
  _message = '';

  _generateMarkup() {
    // Generate and return the markup for the results
    return this._data.map(result => previewView.render(result, false)).join('');
  }

  render(data) {
    // Check if data is available
    if (!data || (Array.isArray(data) && data.length === 0)) {
      this._parentElement.innerHTML = this._errorMessage;
      return;
    }
    // Update the view with the data
    this._data = data;
    this._parentElement.innerHTML = this._generateMarkup();
  }

  update(data) {
    // This method should update the results view without re-rendering everything
    if (!data || (Array.isArray(data) && data.length === 0)) {
      this._parentElement.innerHTML = this._errorMessage;
      return;
    }
    this._data = data;
    const newMarkup = this._generateMarkup();
    this._parentElement.innerHTML = newMarkup;
  }
}

export default new ResultsView();
