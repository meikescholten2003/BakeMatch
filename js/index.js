// TheMealDB API Integration for Homepage

// Fetch categories from TheMealDB
async function fetchCategories() {
  try {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
    const data = await response.json();
    return data.categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Populate theme cards with actual categories
async function populateThemeCards() {
  const themeGrid = document.querySelector('.recipe-categories .theme-grid');
  if (!themeGrid) return;

  const categories = await fetchCategories();
  
  // Select 4 specific categories to display
  const selectedCategories = categories.slice(0, 4);
  
  themeGrid.innerHTML = '';
  
  selectedCategories.forEach(category => {
    const themeBox = document.createElement('div');
    themeBox.className = 'theme-box';
    themeBox.style.backgroundImage = `url(${category.strCategoryThumb})`;
    themeBox.style.backgroundSize = 'cover';
    themeBox.style.backgroundPosition = 'center';
    themeBox.style.cursor = 'pointer';
    
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5));
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      transition: background 0.3s ease;
      text-align: center;
    `;
    
    const categoryLabel = document.createElement('div');
    categoryLabel.textContent = 'Category';
    categoryLabel.style.cssText = `
      color: white;
      margin: 0 0 8px 0;
      font-size: 14px;
      font-weight: 400;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      opacity: 0.95;
      text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
    `;
    
    const title = document.createElement('h3');
    title.textContent = category.strCategory;
    title.style.cssText = `
      color: white;
      margin: 0;
      font-size: 28px;
      font-weight: 600;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    `;
    
    overlay.appendChild(categoryLabel);
    overlay.appendChild(title);
    themeBox.appendChild(overlay);
    
    // Make clickable - navigate to recipe overview with category filter
    themeBox.addEventListener('click', () => {
      window.location.href = `recipe-overview.html?category=${encodeURIComponent(category.strCategory)}`;
    });
    
    // Hover effect
    themeBox.addEventListener('mouseenter', () => {
      overlay.style.background = 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))';
    });
    
    themeBox.addEventListener('mouseleave', () => {
      overlay.style.background = 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5))';
    });
    
    themeGrid.appendChild(themeBox);
  });
}

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

// Fetch specific recipe by name
async function fetchRecipeByName(name) {
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(name)}`);
    const data = await response.json();
    return data.meals ? data.meals[0] : null;
  } catch (error) {
    console.error(`Error fetching recipe ${name}:`, error);
    return null;
  }
}

// Populate the two random recipe boxes
async function populateRandomRecipes() {
  const twoSquares = document.querySelector('.random-recipes .two-squares');
  if (!twoSquares) return;

  const recipeNames = ['Creamy Tomato Soup', 'Pancakes'];
  
  twoSquares.innerHTML = '';
  
  for (const name of recipeNames) {
    const recipe = await fetchRecipeByName(name);
    
    if (recipe) {
      const square = document.createElement('div');
      square.className = 'square';
      square.style.backgroundImage = `url(${recipe.strMealThumb})`;
      square.style.backgroundSize = 'cover';
      square.style.backgroundPosition = 'center';
      square.style.cursor = 'pointer';
      square.style.position = 'relative';
      square.style.overflow = 'hidden';
      square.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
      square.style.boxShadow = '0 4px 8px rgba(0,0,0,0.05)';
      
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: absolute;
        inset: 0;
        background: linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.6));
        display: flex;
        align-items: flex-end;
        padding: 20px;
        transition: background 0.3s ease;
      `;
      
      const contentDiv = document.createElement('div');
      contentDiv.style.cssText = 'flex: 1;';
      
      const title = document.createElement('h3');
      title.textContent = recipe.strMeal;
      title.style.cssText = `
        color: white;
        margin: 0 0 8px 0;
        font-size: 20px;
        font-weight: 600;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
      `;
      
      const timeSpan = document.createElement('span');
      timeSpan.textContent = estimateCookingTime(recipe);
      timeSpan.style.cssText = `
        color: white;
        font-size: 14px;
        opacity: 0.9;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
      `;
      
      contentDiv.appendChild(title);
      contentDiv.appendChild(timeSpan);
      overlay.appendChild(contentDiv);
      square.appendChild(overlay);
      
      // Add favorite heart icon
      const heartIcon = createHeartIcon(recipe);
      square.appendChild(heartIcon);
      
      // Click handler
      square.addEventListener('click', () => {
        window.location.href = `recipe-detail.html?id=${recipe.idMeal}`;
      });
      
      // Hover effect
      square.addEventListener('mouseenter', () => {
        overlay.style.background = 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7))';
        square.style.transform = 'translateY(-5px)';
        square.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
      });
      
      square.addEventListener('mouseleave', () => {
        overlay.style.background = 'linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.6))';
        square.style.transform = 'translateY(0)';
        square.style.boxShadow = '0 4px 8px rgba(0,0,0,0.05)';
      });
      
      twoSquares.appendChild(square);
    }
  }
}

// Fetch random recipe
async function fetchRandomRecipe() {
  try {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const data = await response.json();
    return data.meals ? data.meals[0] : null;
  } catch (error) {
    console.error('Error fetching random recipe:', error);
    return null;
  }
}

// Populate the four placeholder boxes at the bottom
async function populatePlaceholderBoxes() {
  const placeholderGrid = document.querySelector('.theme-placeholders .placeholder-grid');
  if (!placeholderGrid) return;

  placeholderGrid.innerHTML = '';
  
  // Fetch 4 random recipes
  for (let i = 0; i < 4; i++) {
    const recipe = await fetchRandomRecipe();
    
    if (recipe) {
      const box = document.createElement('div');
      box.className = 'placeholder-box';
      box.style.backgroundImage = `url(${recipe.strMealThumb})`;
      box.style.backgroundSize = 'cover';
      box.style.backgroundPosition = 'center';
      box.style.cursor = 'pointer';
      box.style.position = 'relative';
      box.style.overflow = 'hidden';
      box.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
      box.style.boxShadow = '0 4px 8px rgba(0,0,0,0.03)';
      
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: absolute;
        inset: 0;
        background: linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.6));
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
        text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
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
      box.appendChild(overlay);
      
      // Add favorite heart icon
      const heartIcon = createHeartIcon(recipe);
      box.appendChild(heartIcon);
      
      // Click handler
      box.addEventListener('click', () => {
        window.location.href = `recipe-detail.html?id=${recipe.idMeal}`;
      });
      
      // Hover effect
      box.addEventListener('mouseenter', () => {
        overlay.style.background = 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7))';
        box.style.transform = 'translateY(-5px)';
        box.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
      });
      
      box.addEventListener('mouseleave', () => {
        overlay.style.background = 'linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.6))';
        box.style.transform = 'translateY(0)';
        box.style.boxShadow = '0 4px 8px rgba(0,0,0,0.03)';
      });
      
      placeholderGrid.appendChild(box);
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  populateThemeCards();
  populateRandomRecipes();
  populatePlaceholderBoxes();
});
