import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`
      );
      const data = await response.json();
      
      if (data.meals) {
        setRecipes(data.meals);
      } else {
        setError('No recipes found');
        setRecipes([]);
      }
    } catch (err) {
      setError('Error searching recipes');
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (recipe) => {
    if (favorites.some(fav => fav.idMeal === recipe.idMeal)) {
      setFavorites(favorites.filter(fav => fav.idMeal !== recipe.idMeal));
    } else {
      setFavorites([...favorites, recipe]);
    }
  };

  const isFavorite = (recipe) => {
    return favorites.some(fav => fav.idMeal === recipe.idMeal);
  };

  const openRecipeDetails = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const closeRecipeDetails = () => {
    setSelectedRecipe(null);
  };

  return (
    <div className="app">
      <header>
        <h1>🍽️ Recipe Finder</h1>
        <form onSubmit={handleSearch} className="search-form">
          <label htmlFor="recipe-search" className="visually-hidden">
            Search recipes
          </label>
          <input
            id="recipe-search"
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">Search</button>
        </form>
      </header>

      <main className="main-content">
        {favorites.length > 0 && (
          <section className="favorites-section">
            <h2>⭐ Your Favorites ({favorites.length})</h2>
            <div className="recipe-grid">
              {favorites.map(recipe => (
                <RecipeCard
                  key={recipe.idMeal}
                  recipe={recipe}
                  isFavorite={true}
                  onFavorite={toggleFavorite}
                  onOpenDetails={openRecipeDetails}
                />
              ))}
            </div>
          </section>
        )}

        {searchQuery && (
          <section>
            <h2>Results for "{searchQuery}"</h2>
            
            {loading && <p className="loading">Searching recipes...</p>}
            {error && <p className="error">{error}</p>}
            
            {recipes.length > 0 && (
              <div className="recipe-grid">
                {recipes.map(recipe => (
                  <RecipeCard
                    key={recipe.idMeal}
                    recipe={recipe}
                    isFavorite={isFavorite(recipe)}
                    onFavorite={toggleFavorite}
                    onOpenDetails={openRecipeDetails}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {!searchQuery && favorites.length === 0 && (
          <div className="welcome">
            <h2>Welcome to Recipe Finder!</h2>
            <p>Search for recipes and save your favorites.</p>
          </div>
        )}
      </main>

      {selectedRecipe && (
        <RecipeDetailsModal
          recipe={selectedRecipe}
          isFavorite={isFavorite(selectedRecipe)}
          onFavorite={toggleFavorite}
          onClose={closeRecipeDetails}
        />
      )}
    </div>
  );
}

function RecipeCard({ recipe, isFavorite, onFavorite, onOpenDetails }) {
  return (
    <div className="recipe-card">
      <img src={recipe.strMealThumb} alt={recipe.strMeal} />
      <h3>{recipe.strMeal}</h3>
      <p>{recipe.strCategory}</p>
      
      <div className="recipe-actions">
        <button
          onClick={() => onFavorite(recipe)}
          className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
          aria-pressed={isFavorite}
        >
          {isFavorite ? '★' : '☆'} Favorite
        </button>
        <button
          onClick={() => onOpenDetails(recipe)}
          className="details-btn"
          type="button"
        >
          View details
        </button>
      </div>
    </div>
  );
}

function RecipeDetailsModal({ recipe, isFavorite, onFavorite, onClose }) {
  const ingredients = getIngredients(recipe);

  return (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="recipe-details-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose} type="button" aria-label="Close recipe details">
          ×
        </button>
        <h2 id="recipe-details-title">{recipe.strMeal}</h2>
        <p className="recipe-meta">
          {recipe.strCategory} {recipe.strArea ? `• ${recipe.strArea}` : ''}
        </p>
        <img src={recipe.strMealThumb} alt={recipe.strMeal} className="modal-image" />

        <button
          onClick={() => onFavorite(recipe)}
          className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
          aria-pressed={isFavorite}
          type="button"
        >
          {isFavorite ? '★ Remove from favorites' : '☆ Add to favorites'}
        </button>

        <h3>Ingredients</h3>
        <ul className="ingredients-list">
          {ingredients.map((ingredient) => (
            <li key={ingredient}>{ingredient}</li>
          ))}
        </ul>

        <h3>Instructions</h3>
        <p className="instructions">{recipe.strInstructions || 'No instructions available.'}</p>
      </div>
    </div>
  );
}

function getIngredients(recipe) {
  const ingredientList = [];

  for (let i = 1; i <= 20; i += 1) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      const cleanedMeasure = measure && measure.trim() ? `${measure.trim()} ` : '';
      ingredientList.push(`${cleanedMeasure}${ingredient.trim()}`.trim());
    }
  }

  return ingredientList.length ? ingredientList : ['No ingredients listed.'];
}

export default App;