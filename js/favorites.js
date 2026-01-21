// Favorites Page JavaScript

// Estimate cooking time based on recipe complexity
function estimateCookingTime(recipe) {
  if (!recipe) return '30 min';
  
  // Count ingredients
  let ingredientCount = 0;
  for (let i = 1; i <= 20; i++) {
    if (recipe[`strIngredient${i}`] && recipe[`strIngredient${i}`].trim()) {
      ingredientCount++;
    }
  }
  
  // Base time on ingredient count and category
  const category = recipe.strCategory?.toLowerCase() || '';
  const instructions = recipe.strInstructions?.length || 0;
  
  let baseTime = 30;
  
  // Adjust based on category
  if (category.includes('dessert') || category.includes('pasta')) baseTime = 45;
  if (category.includes('starter') || category.includes('breakfast')) baseTime = 20;
  if (category.includes('beef') || category.includes('pork')) baseTime = 60;
  
  // Adjust based on complexity
  if (ingredientCount > 15 || instructions > 1000) baseTime += 15;
  if (ingredientCount > 10 || instructions > 500) baseTime += 10;
  
  return `${baseTime} min`;
}

// Display favorites
async function displayFavorites() {
  const favoritesGrid = document.querySelector('.favorites-grid');
  const emptyState = document.querySelector('.favorites-empty');
  
  if (!favoritesGrid) return;
  
  const favorites = getFavorites();
  
  if (favorites.length === 0) {
    if (emptyState) {
      emptyState.style.display = 'flex';
    }
    favoritesGrid.style.display = 'none';
    return;
  }
  
  if (emptyState) {
    emptyState.style.display = 'none';
  }
  favoritesGrid.style.display = 'grid';
  
  // Clear existing content
  favoritesGrid.innerHTML = '';
  
  // Display each favorite
  favorites.forEach(recipe => {
    const recipeBox = document.createElement('div');
    recipeBox.className = 'recipe-box';
    recipeBox.style.backgroundImage = `url(${recipe.strMealThumb})`;
    recipeBox.style.backgroundSize = 'cover';
    recipeBox.style.backgroundPosition = 'center';
    recipeBox.style.cursor = 'pointer';
    recipeBox.style.position = 'relative';
    recipeBox.style.borderRadius = '20px';
    recipeBox.style.overflow = 'hidden';
    
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.7));
      display: flex;
      align-items: flex-end;
      padding: 15px;
      transition: background 0.3s ease;
    `;
    
    const contentDiv = document.createElement('div');
    contentDiv.style.cssText = 'flex: 1;';
    
    const title = document.createElement('h3');
    title.textContent = recipe.strMeal;
    title.style.cssText = `
      color: white;
      margin: 0 0 6px 0;
      font-size: 16px;
      font-weight: 600;
      text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
      line-height: 1.3;
    `;
    
    const timeSpan = document.createElement('span');
    timeSpan.textContent = estimateCookingTime(recipe);
    timeSpan.style.cssText = `
      color: white;
      font-size: 12px;
      opacity: 0.9;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
    `;
    
    contentDiv.appendChild(title);
    contentDiv.appendChild(timeSpan);
    overlay.appendChild(contentDiv);
    recipeBox.appendChild(overlay);
    
    // Add favorite heart icon (will be active/red)
    const heartIcon = createHeartIcon(recipe);
    recipeBox.appendChild(heartIcon);
    
    // Listen for favorite removal to refresh the page
    heartIcon.addEventListener('click', () => {
      setTimeout(() => {
        displayFavorites(); // Refresh the favorites display
      }, 100);
    });
    
    // Hover effect
    recipeBox.addEventListener('mouseenter', () => {
      overlay.style.background = 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.8))';
    });
    
    recipeBox.addEventListener('mouseleave', () => {
      overlay.style.background = 'linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.7))';
    });
    
    // Click handler
    recipeBox.addEventListener('click', (e) => {
      // Don't navigate if clicking the heart
      if (e.target.closest('.favorite-heart')) return;
      window.location.href = `recipe-detail.html?id=${recipe.idMeal}`;
    });
    
    favoritesGrid.appendChild(recipeBox);
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  displayFavorites();
});
