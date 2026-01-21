// TheMealDB API Integration for Recipe Overview

// Get URL parameters
function getURLParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
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

// Fetch recipes by category
async function fetchRecipesByCategory(category) {
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(category)}`);
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
}

// Fetch all recipes (random selection)
async function fetchAllRecipes() {
  try {
    // TheMealDB doesn't have a "get all" endpoint, so we'll fetch multiple random recipes
    const recipes = [];
    for (let i = 0; i < 20; i++) {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
      const data = await response.json();
      if (data.meals && data.meals[0]) {
        recipes.push(data.meals[0]);
      }
    }
    return recipes;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
}

// Fetch recipe details by ID
async function fetchRecipeById(id) {
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await response.json();
    return data.meals ? data.meals[0] : null;
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    return null;
  }
}

// Fetch recipes by main ingredient
async function fetchRecipesByIngredient(ingredient) {
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredient)}`);
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error('Error fetching recipes by ingredient:', error);
    return [];
  }
}

// Map of generic ingredients to specific API ingredient names
const ingredientMapping = {
  'pasta': ['Spaghetti', 'Penne', 'Rigatoni', 'Linguine', 'Fettuccine', 'Tagliatelle', 'Pasta', 'Lasagne', 'Macaroni'],
  'noodles': ['Rice Noodles', 'Egg Noodles', 'Noodles'],
  'cheese': ['Parmesan', 'Cheddar', 'Mozzarella', 'Feta', 'Cheese'],
  'peppers': ['Red Pepper', 'Green Pepper', 'Bell Pepper', 'Red Chile', 'Green Chile'],
  'mushrooms': ['Mushroom', 'Mushrooms'],
  'tomatoes': ['Tomato', 'Cherry Tomatoes', 'Tomatoes'],
  'potatoes': ['Potato', 'Sweet Potato', 'Potatoes'],
  'onions': ['Onion', 'Red Onion', 'Spring Onions', 'Onions']
};

// Fetch recipes by multiple ingredients
async function fetchRecipesByIngredients(ingredients) {
  try {
    // Fetch recipes for each ingredient
    const allRecipes = new Map(); // Use Map to avoid duplicates by ID
    
    for (const ingredient of ingredients) {
      const ingredientLower = ingredient.toLowerCase();
      
      // Check if we need to search for specific variations
      const searchTerms = ingredientMapping[ingredientLower] || [ingredient];
      
      for (const searchTerm of searchTerms) {
        const recipes = await fetchRecipesByIngredient(searchTerm);
        recipes.forEach(recipe => {
          if (!allRecipes.has(recipe.idMeal)) {
            allRecipes.set(recipe.idMeal, recipe);
          }
        });
      }
    }
    
    return Array.from(allRecipes.values());
  } catch (error) {
    console.error('Error fetching recipes by ingredients:', error);
    return [];
  }
}

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

// Populate recipe grid
async function populateRecipeGrid() {
  const recipeGrid = document.querySelector('.recipe-grid');
  const sectionTitle = document.querySelector('.recipe-overview-section h2');
  
  if (!recipeGrid) return;

  // Check if there's a category filter or ingredients filter
  const category = getURLParameter('category');
  const ingredientsParam = getURLParameter('ingredients');
  
  // If no filters, show categories instead of recipes
  if (!category && !ingredientsParam) {
    if (sectionTitle) {
      sectionTitle.textContent = 'Browse by Category';
    }
    
    const categories = await fetchCategories();
    recipeGrid.innerHTML = '';
    
    categories.forEach(cat => {
      const categoryBox = document.createElement('div');
      categoryBox.className = 'recipe-box';
      categoryBox.style.backgroundImage = `url(${cat.strCategoryThumb})`;
      categoryBox.style.backgroundSize = 'cover';
      categoryBox.style.backgroundPosition = 'center';
      categoryBox.style.cursor = 'pointer';
      categoryBox.style.position = 'relative';
      categoryBox.style.borderRadius = '20px';
      categoryBox.style.overflow = 'hidden';
      
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: absolute;
        inset: 0;
        background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6));
        display: flex;
        align-items: flex-end;
        padding: 15px;
        transition: background 0.3s ease;
      `;
      
      const contentDiv = document.createElement('div');
      contentDiv.style.cssText = 'flex: 1;';
      
      const title = document.createElement('h3');
      title.textContent = cat.strCategory;
      title.style.cssText = `
        color: white;
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
        line-height: 1.3;
      `;
      
      contentDiv.appendChild(title);
      overlay.appendChild(contentDiv);
      categoryBox.appendChild(overlay);
      
      // Click to filter by category
      categoryBox.addEventListener('click', () => {
        window.location.href = `recipe-overview.html?category=${encodeURIComponent(cat.strCategory)}`;
      });
      
      // Hover effect
      categoryBox.addEventListener('mouseenter', () => {
        overlay.style.background = 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7))';
      });
      
      categoryBox.addEventListener('mouseleave', () => {
        overlay.style.background = 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6))';
      });
      
      recipeGrid.appendChild(categoryBox);
    });
    
    return;
  }
  
  // Show recipes based on filters
  let recipes = [];
  
  if (ingredientsParam) {
    const ingredients = ingredientsParam.split(',').map(i => i.trim());
    recipes = await fetchRecipesByIngredients(ingredients);
    if (sectionTitle) {
      sectionTitle.textContent = `Recipes with ${ingredients.join(', ')}`;
    }
  } else if (category) {
    recipes = await fetchRecipesByCategory(category);
    if (sectionTitle) {
      sectionTitle.textContent = `${category} Recipes`;
    }
  }

  // Clear existing placeholder boxes
  recipeGrid.innerHTML = '';

  // Display recipes
  recipes.forEach(recipe => {
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
    
    const title = document.createElement('h3');
    title.textContent = recipe.strMeal;
    title.style.cssText = `
      color: white;
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
      line-height: 1.3;
    `;
    
    overlay.appendChild(title);
    recipeBox.appendChild(overlay);
    
    // Add favorite heart icon
    const heartIcon = createHeartIcon(recipe);
    recipeBox.appendChild(heartIcon);
    
    // Hover effect
    recipeBox.addEventListener('mouseenter', () => {
      overlay.style.background = 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.8))';
    });
    
    recipeBox.addEventListener('mouseleave', () => {
      overlay.style.background = 'linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.7))';
    });
    
    // Click handler (could navigate to recipe details page)
    recipeBox.addEventListener('click', () => {
      window.location.href = `recipe-detail.html?id=${recipe.idMeal}`;
    });
    
    recipeGrid.appendChild(recipeBox);
  });

  // If no recipes found, show a message
  if (recipes.length === 0) {
    const message = document.createElement('p');
    message.textContent = 'No recipes found for this category.';
    message.style.cssText = 'grid-column: 1 / -1; text-align: center; padding: 40px; color: #666;';
    recipeGrid.appendChild(message);
  }
}

// Global variables for filtering
let allRecipes = [];
let allCategories = [];
let allAreas = [];
let currentFilters = {
  search: '',
  category: '',
  area: '',
  sort: 'name-asc'
};

// Fetch all areas from TheMealDB
async function fetchAreas() {
  try {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error('Error fetching areas:', error);
    return [];
  }
}

// Fetch all available recipes from all categories (optimized)
async function fetchAllAvailableRecipes() {
  try {
    // First, fetch all categories
    const categoriesResponse = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
    const categoriesData = await categoriesResponse.json();
    const categories = categoriesData.categories || [];
    
    const allRecipes = new Map(); // Use Map to avoid duplicates
    
    // Fetch recipes from each category
    for (const cat of categories) {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(cat.strCategory)}`);
      const data = await response.json();
      const recipes = data.meals || [];
      
      // Add basic recipe info (we'll fetch full details only when needed)
      for (const recipe of recipes) {
        if (!allRecipes.has(recipe.idMeal)) {
          // Add category and area info to basic recipe data
          recipe.strCategory = cat.strCategory;
          recipe.strArea = cat.strCategory; // Temporary - will be updated if details fetched
          allRecipes.set(recipe.idMeal, recipe);
        }
      }
    }
    
    // Fetch full details for a reasonable number of recipes to get area info
    const recipeArray = Array.from(allRecipes.values());
    const sampleSize = Math.min(50, recipeArray.length);
    
    for (let i = 0; i < sampleSize; i++) {
      const recipe = recipeArray[i];
      try {
        const detailResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipe.idMeal}`);
        const detailData = await detailResponse.json();
        if (detailData.meals && detailData.meals[0]) {
          allRecipes.set(recipe.idMeal, detailData.meals[0]);
        }
      } catch (err) {
        console.warn('Failed to fetch details for recipe', recipe.idMeal);
      }
    }
    
    return Array.from(allRecipes.values());
  } catch (error) {
    console.error('Error fetching all recipes:', error);
    return [];
  }
}

// Apply filters to recipes
function applyFilters(recipes) {
  let filtered = [...recipes];
  
  // Apply search filter
  if (currentFilters.search) {
    const searchTerm = currentFilters.search.toLowerCase();
    filtered = filtered.filter(recipe => 
      recipe.strMeal.toLowerCase().includes(searchTerm) ||
      (recipe.strCategory && recipe.strCategory.toLowerCase().includes(searchTerm)) ||
      (recipe.strArea && recipe.strArea.toLowerCase().includes(searchTerm))
    );
  }
  
  // Apply category filter
  if (currentFilters.category) {
    filtered = filtered.filter(recipe => 
      recipe.strCategory === currentFilters.category
    );
  }
  
  // Apply area filter
  if (currentFilters.area) {
    filtered = filtered.filter(recipe => 
      recipe.strArea === currentFilters.area
    );
  }
  
  // Apply sorting
  switch (currentFilters.sort) {
    case 'name-asc':
      filtered.sort((a, b) => a.strMeal.localeCompare(b.strMeal));
      break;
    case 'name-desc':
      filtered.sort((a, b) => b.strMeal.localeCompare(a.strMeal));
      break;
  }
  
  return filtered;
}

// Update filter status message
function updateFilterStatus(filteredCount, totalCount) {
  const statusDiv = document.getElementById('filter-status');
  if (!statusDiv) return;
  
  const hasActiveFilters = currentFilters.search || currentFilters.category || currentFilters.area;
  
  if (hasActiveFilters) {
    statusDiv.textContent = `Showing ${filteredCount} of ${totalCount} recipes`;
    statusDiv.style.display = 'block';
  } else {
    statusDiv.textContent = `Showing all ${totalCount} recipes`;
    statusDiv.style.display = 'block';
  }
}

// Render recipes to the grid
function renderRecipes(recipes) {
  const recipeGrid = document.querySelector('.recipe-grid');
  if (!recipeGrid) return;
  
  recipeGrid.innerHTML = '';
  
  if (recipes.length === 0) {
    const message = document.createElement('p');
    message.textContent = 'No recipes found matching your filters.';
    message.style.cssText = 'grid-column: 1 / -1; text-align: center; padding: 40px; color: #666; font-size: 16px;';
    recipeGrid.appendChild(message);
    return;
  }
  
  recipes.forEach(recipe => {
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
      flex-direction: column;
      justify-content: flex-end;
      padding: 15px;
      transition: background 0.3s ease;
    `;
    
    const title = document.createElement('h3');
    title.textContent = recipe.strMeal;
    title.style.cssText = `
      color: white;
      margin: 0 0 5px 0;
      font-size: 16px;
      font-weight: 600;
      text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
      line-height: 1.3;
    `;
    
    const metadata = document.createElement('div');
    metadata.style.cssText = `
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    `;
    
    if (recipe.strCategory) {
      const categoryTag = document.createElement('span');
      categoryTag.textContent = recipe.strCategory;
      categoryTag.style.cssText = `
        background: rgba(255, 255, 255, 0.2);
        padding: 2px 8px;
        border-radius: 10px;
        font-size: 11px;
        color: white;
        backdrop-filter: blur(5px);
      `;
      metadata.appendChild(categoryTag);
    }
    
    if (recipe.strArea) {
      const areaTag = document.createElement('span');
      areaTag.textContent = recipe.strArea;
      areaTag.style.cssText = `
        background: rgba(255, 255, 255, 0.2);
        padding: 2px 8px;
        border-radius: 10px;
        font-size: 11px;
        color: white;
        backdrop-filter: blur(5px);
      `;
      metadata.appendChild(areaTag);
    }
    
    overlay.appendChild(title);
    overlay.appendChild(metadata);
    recipeBox.appendChild(overlay);
    
    // Add favorite heart icon
    const heartIcon = createHeartIcon(recipe);
    recipeBox.appendChild(heartIcon);
    
    // Hover effect
    recipeBox.addEventListener('mouseenter', () => {
      overlay.style.background = 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.8))';
    });
    
    recipeBox.addEventListener('mouseleave', () => {
      overlay.style.background = 'linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.7))';
    });
    
    // Click handler
    recipeBox.addEventListener('click', () => {
      window.location.href = `recipe-detail.html?id=${recipe.idMeal}`;
    });
    
    recipeGrid.appendChild(recipeBox);
  });
}

// Initialize filter dropdowns
async function initializeFilters() {
  // Fetch and populate categories
  allCategories = await fetchCategories();
  const categorySelect = document.getElementById('category-filter');
  if (categorySelect && allCategories) {
    allCategories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.strCategory;
      option.textContent = cat.strCategory;
      categorySelect.appendChild(option);
    });
  }
  
  // Fetch and populate areas
  allAreas = await fetchAreas();
  const areaSelect = document.getElementById('area-filter');
  if (areaSelect && allAreas) {
    allAreas.forEach(area => {
      const option = document.createElement('option');
      option.value = area.strArea;
      option.textContent = area.strArea;
      areaSelect.appendChild(option);
    });
  }
}

// Setup filter event listeners
function setupFilterListeners() {
  // Search input
  const searchInput = document.getElementById('recipe-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentFilters.search = e.target.value;
      const filtered = applyFilters(allRecipes);
      renderRecipes(filtered);
      updateFilterStatus(filtered.length, allRecipes.length);
    });
  }
  
  // Category filter
  const categoryFilter = document.getElementById('category-filter');
  if (categoryFilter) {
    categoryFilter.addEventListener('change', (e) => {
      currentFilters.category = e.target.value;
      const filtered = applyFilters(allRecipes);
      renderRecipes(filtered);
      updateFilterStatus(filtered.length, allRecipes.length);
    });
  }
  
  // Area filter
  const areaFilter = document.getElementById('area-filter');
  if (areaFilter) {
    areaFilter.addEventListener('change', (e) => {
      currentFilters.area = e.target.value;
      const filtered = applyFilters(allRecipes);
      renderRecipes(filtered);
      updateFilterStatus(filtered.length, allRecipes.length);
    });
  }
  
  // Sort filter
  const sortFilter = document.getElementById('sort-filter');
  if (sortFilter) {
    sortFilter.addEventListener('change', (e) => {
      currentFilters.sort = e.target.value;
      const filtered = applyFilters(allRecipes);
      renderRecipes(filtered);
      updateFilterStatus(filtered.length, allRecipes.length);
    });
  }
  
  // Clear filters button
  const clearBtn = document.getElementById('clear-filters');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      currentFilters = {
        search: '',
        category: '',
        area: '',
        sort: 'name-asc'
      };
      
      // Reset form controls
      if (searchInput) searchInput.value = '';
      if (categoryFilter) categoryFilter.value = '';
      if (areaFilter) areaFilter.value = '';
      if (sortFilter) sortFilter.value = 'name-asc';
      
      const filtered = applyFilters(allRecipes);
      renderRecipes(filtered);
      updateFilterStatus(filtered.length, allRecipes.length);
    });
  }
}

// Load recipes with filter support
async function loadRecipesWithFilters() {
  const recipeGrid = document.querySelector('.recipe-grid');
  const sectionTitle = document.querySelector('.recipe-overview-section h2');
  
  if (!recipeGrid) return;
  
  // Show loading message
  recipeGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #666;">Loading recipes...</p>';
  
  // Check for URL parameters
  const category = getURLParameter('category');
  const ingredientsParam = getURLParameter('ingredients');
  
  // If viewing categories, use the original behavior
  if (!category && !ingredientsParam) {
    // Fetch ALL available recipes
    try {
      allRecipes = await fetchAllAvailableRecipes();
      
      if (allRecipes.length === 0) {
        recipeGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #f44336;">Failed to load recipes. Please refresh the page.</p>';
        return;
      }
      
      if (sectionTitle) {
        sectionTitle.textContent = 'Recipe Overview';
      }
      
      // Initialize filters
      await initializeFilters();
      setupFilterListeners();
      
      // Render initial recipes
      const filtered = applyFilters(allRecipes);
      renderRecipes(filtered);
      updateFilterStatus(filtered.length, allRecipes.length);
    } catch (error) {
      console.error('Error loading recipes:', error);
      recipeGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #f44336;">Failed to load recipes. Please refresh the page.</p>';
    }
  } else {
    // Original behavior for category/ingredient filtering
    await populateRecipeGrid();
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  loadRecipesWithFilters();
});
