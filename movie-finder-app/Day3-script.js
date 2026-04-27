const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const sortSelect = document.getElementById('sortSelect');
const historySelect = document.getElementById('historySelect');
const results = document.getElementById('results');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const noResults = document.getElementById('noResults');
const pagination = document.getElementById('pagination');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageInfo = document.getElementById('pageInfo');
const favoritesList = document.getElementById('favoritesList');
const clearFavoritesBtn = document.getElementById('clearFavoritesBtn');
const movieModal = document.getElementById('movieModal');
const modalOverlay = document.getElementById('modalOverlay');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalBody = document.getElementById('modalBody');

const API_BASE_URL = 'https://www.omdbapi.com/';
const SEARCH_HISTORY_KEY = 'movieSearchHistory';
const FAVORITES_KEY = 'favoriteMovies';
const PAGE_SIZE = 10;

let currentQuery = '';
let currentPage = 1;
let totalResults = 0;
let currentResults = [];
let currentSort = 'default';
let searchHistory = JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY)) || [];
let favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];

searchBtn.addEventListener('click', () => searchMovies(1));
sortSelect.addEventListener('change', () => {
  currentSort = sortSelect.value;
  renderResults();
});
historySelect.addEventListener('change', () => {
  const query = historySelect.value;
  if (!query) return;
  searchInput.value = query;
  searchMovies(1);
});
prevBtn.addEventListener('click', () => {
  if (currentPage > 1) searchMovies(currentPage - 1);
});
nextBtn.addEventListener('click', () => {
  if (currentPage * PAGE_SIZE < totalResults) searchMovies(currentPage + 1);
});
clearFavoritesBtn.addEventListener('click', clearFavorites);
modalOverlay.addEventListener('click', closeModal);
closeModalBtn.addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchMovies(1);
});

async function searchMovies(page = 1) {
  const query = searchInput.value.trim();
  let apiKey = getApiKey();

  if (query === '') {
    showError('Please enter a movie name.');
    return;
  }
  if (!apiKey) return;

  setLoading(true);
  error.classList.add('hidden');
  noResults.classList.add('hidden');

  try {
    let response = await fetch(buildOmdbUrl({ apikey: apiKey, s: query, page }));
    let data = await response.json();

    if (isApiKeyError(data)) {
      localStorage.removeItem('omdbApiKey');
      apiKey = getApiKey(true);
      if (!apiKey) {
        setLoading(false);
        return;
      }
      response = await fetch(buildOmdbUrl({ apikey: apiKey, s: query, page }));
      data = await response.json();
    }

    setLoading(false);

    if (data.Response === 'False') {
      results.innerHTML = '';
      pagination.classList.add('hidden');
      showError(data.Error || 'No movies found');
      noResults.classList.remove('hidden');
      return;
    }

    currentQuery = query;
    currentPage = page;
    totalResults = Number(data.totalResults || data.Search.length);
    currentResults = data.Search || [];
    saveSearchToHistory(query);
    updateHistorySelect();
    renderResults();
  } catch (err) {
    setLoading(false);
    showError('Error searching movies: ' + err.message);
  }
}

function renderResults() {
  results.innerHTML = '';
  const movies = sortMovies([...currentResults], currentSort);

  movies.forEach((movie) => {
    const isFavorite = favorites.some((fav) => fav.imdbID === movie.imdbID);
    const card = document.createElement('article');
    card.className = 'movie-card';
    card.innerHTML = `
      <button class="favorite-btn ${isFavorite ? 'active' : ''}" title="Toggle favorite" data-id="${movie.imdbID}">
        ${isFavorite ? '★' : '☆'}
      </button>
      <img
        src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/200x300?text=No+Poster'}"
        alt="${escapeHtml(movie.Title)}"
        class="movie-poster"
      >
      <div class="movie-info">
        <div class="movie-title">${escapeHtml(movie.Title)}</div>
        <div class="movie-year">${escapeHtml(movie.Year)}</div>
        <span class="movie-type">${escapeHtml(movie.Type)}</span>
      </div>
    `;

    card.querySelector('.favorite-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavorite(movie);
      renderResults();
    });
    card.addEventListener('click', () => getMovieDetails(movie.imdbID));
    results.appendChild(card);
  });

  updatePagination();
}

function updatePagination() {
  if (!currentQuery || totalResults <= PAGE_SIZE) {
    pagination.classList.add('hidden');
    return;
  }
  pagination.classList.remove('hidden');
  const totalPages = Math.ceil(totalResults / PAGE_SIZE);
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  prevBtn.disabled = currentPage <= 1;
  nextBtn.disabled = currentPage >= totalPages;
}

function sortMovies(movies, sortType) {
  if (sortType === 'yearDesc') {
    return movies.sort((a, b) => extractYear(b.Year) - extractYear(a.Year));
  }
  if (sortType === 'yearAsc') {
    return movies.sort((a, b) => extractYear(a.Year) - extractYear(b.Year));
  }
  if (sortType === 'titleAsc') {
    return movies.sort((a, b) => a.Title.localeCompare(b.Title));
  }
  if (sortType === 'ratingDesc') {
    return movies.sort((a, b) => getLocalRating(b.imdbID) - getLocalRating(a.imdbID));
  }
  return movies;
}

function extractYear(yearString) {
  const match = String(yearString).match(/\d{4}/);
  return match ? Number(match[0]) : 0;
}

function getLocalRating(imdbID) {
  const rating = localStorage.getItem(`movieRating:${imdbID}`);
  return rating ? Number(rating) : 0;
}

async function getMovieDetails(imdbID) {
  const apiKey = getApiKey();
  if (!apiKey) return;

  try {
    const response = await fetch(buildOmdbUrl({ apikey: apiKey, i: imdbID, plot: 'full' }));
    const movie = await response.json();
    if (movie.Response === 'False') {
      showError(movie.Error || 'Could not load movie details.');
      return;
    }
    localStorage.setItem(`movieRating:${imdbID}`, movie.imdbRating === 'N/A' ? '0' : movie.imdbRating);
    openMovieModal(movie);
  } catch (err) {
    showError('Error fetching details: ' + err.message);
  }
}

function openMovieModal(movie) {
  modalBody.innerHTML = `
    <div class="modal-layout">
      <img
        src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/280x420?text=No+Poster'}"
        alt="${escapeHtml(movie.Title)}"
        class="modal-poster"
      >
      <div class="modal-text">
        <h2 id="modalTitle">${escapeHtml(movie.Title)}</h2>
        <p class="modal-subtitle">${escapeHtml(movie.Year)} • ${escapeHtml(movie.Runtime)} • ${escapeHtml(movie.Rated)}</p>
        <p><strong>Genre:</strong> ${escapeHtml(movie.Genre || 'N/A')}</p>
        <p><strong>Director:</strong> ${escapeHtml(movie.Director || 'N/A')}</p>
        <p><strong>Actors:</strong> ${escapeHtml(movie.Actors || 'N/A')}</p>
        <p><strong>IMDb:</strong> ${escapeHtml(movie.imdbRating || 'N/A')}</p>
        <p class="modal-plot">${escapeHtml(movie.Plot || 'No plot available.')}</p>
      </div>
    </div>
  `;
  movieModal.classList.remove('hidden');
  document.body.classList.add('modal-open');
}

function closeModal() {
  movieModal.classList.add('hidden');
  document.body.classList.remove('modal-open');
}

function toggleFavorite(movie) {
  const exists = favorites.some((fav) => fav.imdbID === movie.imdbID);
  if (exists) {
    favorites = favorites.filter((fav) => fav.imdbID !== movie.imdbID);
  } else {
    favorites.unshift({
      imdbID: movie.imdbID,
      Title: movie.Title,
      Year: movie.Year,
      Poster: movie.Poster
    });
  }
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  renderFavorites();
}

function renderFavorites() {
  favoritesList.innerHTML = '';
  if (favorites.length === 0) {
    favoritesList.innerHTML = '<p class="empty-favorites">No favorite movies yet.</p>';
    return;
  }

  favorites.forEach((movie) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'favorite-item';
    item.innerHTML = `
      <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/60x90?text=No'}" alt="${escapeHtml(movie.Title)}">
      <div>
        <strong>${escapeHtml(movie.Title)}</strong>
        <span>${escapeHtml(movie.Year)}</span>
      </div>
    `;
    item.addEventListener('click', () => getMovieDetails(movie.imdbID));
    favoritesList.appendChild(item);
  });
}

function clearFavorites() {
  if (favorites.length === 0) return;
  if (!confirm('Clear all favorite movies?')) return;
  favorites = [];
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  renderFavorites();
  renderResults();
}

function saveSearchToHistory(query) {
  searchHistory = [query, ...searchHistory.filter((entry) => entry.toLowerCase() !== query.toLowerCase())].slice(0, 8);
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(searchHistory));
}

function updateHistorySelect() {
  const selected = historySelect.value;
  const options = ['<option value="">Select previous search</option>']
    .concat(searchHistory.map((entry) => `<option value="${escapeHtml(entry)}">${escapeHtml(entry)}</option>`))
    .join('');
  historySelect.innerHTML = options;
  if (searchHistory.includes(selected)) historySelect.value = selected;
}

function setLoading(isLoading) {
  loading.classList.toggle('hidden', !isLoading);
}

function showError(message) {
  error.textContent = message;
  error.classList.remove('hidden');
}

function isApiKeyError(data) {
  return data && data.Response === 'False' && data.Error && data.Error.toLowerCase().includes('api key');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function getApiKey(forcePrompt = false) {
  let apiKey = localStorage.getItem('omdbApiKey');
  if (!apiKey || forcePrompt) {
    apiKey = prompt('Enter your OMDb API key (example format: abc12345). Do not paste a URL.');
    if (!apiKey || apiKey.trim() === '') {
      alert('An OMDb API key is required to search movies.');
      return null;
    }
    apiKey = apiKey.trim();
    if (apiKey.includes('http') || apiKey.includes('omdbapi.com')) {
      alert('Please paste only the API key itself, not the website URL.');
      return null;
    }
    localStorage.setItem('omdbApiKey', apiKey);
  }
  return apiKey;
}

function buildOmdbUrl(params) {
  return `${API_BASE_URL}?${new URLSearchParams(params).toString()}`;
}

updateHistorySelect();
renderFavorites();
