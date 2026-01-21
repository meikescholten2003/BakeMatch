// Favorites Management System

// Get favorites from localStorage
function getFavorites() {
  const favorites = localStorage.getItem('bakematch-favorites');
  return favorites ? JSON.parse(favorites) : [];
}

// Save favorites to localStorage
function saveFavorites(favorites) {
  localStorage.setItem('bakematch-favorites', JSON.stringify(favorites));
}

// Check if recipe is favorited
function isFavorited(recipeId) {
  const favorites = getFavorites();
  return favorites.some(fav => fav.idMeal === recipeId);
}

// Add recipe to favorites
function addToFavorites(recipe) {
  const favorites = getFavorites();
  
  // Check if already exists
  if (!favorites.some(fav => fav.idMeal === recipe.idMeal)) {
    favorites.push({
      idMeal: recipe.idMeal,
      strMeal: recipe.strMeal,
      strMealThumb: recipe.strMealThumb,
      addedAt: new Date().toISOString()
    });
    saveFavorites(favorites);
  }
}

// Remove recipe from favorites
function removeFromFavorites(recipeId) {
  let favorites = getFavorites();
  favorites = favorites.filter(fav => fav.idMeal !== recipeId);
  saveFavorites(favorites);
}

// Toggle favorite status
function toggleFavorite(recipe) {
  if (isFavorited(recipe.idMeal)) {
    removeFromFavorites(recipe.idMeal);
    return false;
  } else {
    addToFavorites(recipe);
    return true;
  }
}

// Create heart icon element
function createHeartIcon(recipe) {
  const heartBtn = document.createElement('div');
  heartBtn.className = 'favorite-heart';
  
  if (isFavorited(recipe.idMeal)) {
    heartBtn.classList.add('active');
  }
  
  heartBtn.innerHTML = `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
  `;
  
  heartBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent recipe card click
    const isNowFavorited = toggleFavorite(recipe);
    
    if (isNowFavorited) {
      heartBtn.classList.add('active');
    } else {
      heartBtn.classList.remove('active');
    }
  });
  
  return heartBtn;
}
