// Recipe Detail Page JavaScript

// Get recipe ID from URL
function getRecipeId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

// Fetch full recipe details
async function fetchRecipeDetails(id) {
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await response.json();
    return data.meals ? data.meals[0] : null;
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    return null;
  }
}

// Parse ingredients from recipe object
function getIngredients(recipe) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        name: ingredient,
        measure: measure || ''
      });
    }
  }
  return ingredients;
}

// Parse instructions into steps
function parseInstructions(instructions) {
  if (!instructions) return [];
  
  // Split by line breaks or numbered steps
  const steps = instructions
    .split(/\r?\n/)
    .filter(step => step.trim())
    .map(step => step.trim());
  
  // If no line breaks, try to split by periods followed by capital letters
  if (steps.length <= 1) {
    return instructions
      .split(/\.\s+(?=[A-Z])/)
      .filter(step => step.trim())
      .map(step => step.trim() + (step.endsWith('.') ? '' : '.'));
  }
  
  return steps;
}

// Estimate cooking time based on recipe complexity
function estimateCookingTime(recipe) {
  if (!recipe) return '30 min';
  
  const ingredients = getIngredients(recipe);
  const category = recipe.strCategory?.toLowerCase() || '';
  const instructions = recipe.strInstructions?.length || 0;
  
  let baseTime = 30;
  
  // Adjust based on category
  if (category.includes('dessert') || category.includes('pasta')) baseTime = 45;
  if (category.includes('starter') || category.includes('breakfast')) baseTime = 20;
  if (category.includes('beef') || category.includes('pork')) baseTime = 60;
  
  // Adjust based on complexity
  if (ingredients.length > 15 || instructions > 1000) baseTime += 15;
  if (ingredients.length > 10 || instructions > 500) baseTime += 10;
  
  return `${baseTime} min`;
}

// Display recipe
async function displayRecipe() {
  const recipeId = getRecipeId();
  
  if (!recipeId) {
    document.getElementById('recipe-content').innerHTML = 
      '<p style="text-align: center; padding: 40px; color: #666;">Recipe not found.</p>';
    return;
  }
  
  const recipe = await fetchRecipeDetails(recipeId);
  
  if (!recipe) {
    document.getElementById('recipe-content').innerHTML = 
      '<p style="text-align: center; padding: 40px; color: #666;">Recipe not found.</p>';
    return;
  }
  
  const ingredients = getIngredients(recipe);
  const steps = parseInstructions(recipe.strInstructions);
  
  // Build recipe HTML
  const recipeHTML = `
    <div class="recipe-header">
      <h1 class="recipe-title">${recipe.strMeal}</h1>
      
      <div class="recipe-meta">
        <div class="recipe-meta-item">
          <span class="meta-label">Time:</span>
          <span class="meta-value">${estimateCookingTime(recipe)}</span>
        </div>
        <div class="recipe-meta-item">
          <span class="meta-label">Category:</span>
          <span class="meta-value">${recipe.strCategory || 'N/A'}</span>
        </div>
        <div class="recipe-meta-item">
          <span class="meta-label">Cuisine:</span>
          <span class="meta-value">${recipe.strArea || 'N/A'}</span>
        </div>
        ${recipe.strTags ? `
          <div class="recipe-meta-item">
            <span class="meta-label">Tags:</span>
            <span class="meta-value">${recipe.strTags}</span>
          </div>
        ` : ''}
      </div>
    </div>

    <div class="recipe-body">
      <div class="recipe-ingredients">
        <h2>Ingredients</h2>
        <ul class="ingredients-list">
          ${ingredients.map(ing => `
            <li>
              <span class="ingredient-measure">${ing.measure}</span>
              <span class="ingredient-name">${ing.name}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <div class="recipe-instructions">
        <h2>Instructions</h2>
        <ol class="instructions-list">
          ${steps.map(step => `<li>${step}</li>`).join('')}
        </ol>
      </div>
    </div>

    ${recipe.strMealThumb ? `
      <div class="recipe-final-image">
        <img src="${recipe.strMealThumb}" alt="${recipe.strMeal} - Final Result" />
      </div>
    ` : ''}

    ${recipe.strYoutube ? `
      <div class="recipe-video">
        <h2>Video Tutorial</h2>
        <a href="${recipe.strYoutube}" target="_blank" class="video-link">
          Watch on YouTube →
        </a>
      </div>
    ` : ''}
  `;
  
  document.getElementById('recipe-content').innerHTML = recipeHTML;
  
  // Add heart icon to recipe header
  const recipeHeader = document.querySelector('.recipe-header');
  if (recipeHeader) {
    const heartIcon = createHeartIcon(recipe);
    heartIcon.style.position = 'absolute';
    heartIcon.style.top = '20px';
    heartIcon.style.right = '20px';
    recipeHeader.style.position = 'relative';
    recipeHeader.appendChild(heartIcon);
  }
  
  document.getElementById('review-section').style.display = 'block';
}

// Submit review (mock implementation)
function submitReview() {
  const rating = document.querySelector('input[name="rating"]:checked');
  const name = document.getElementById('review-name').value;
  const reviewText = document.getElementById('review-text').value;
  
  if (!rating) {
    alert('Please select a rating');
    return;
  }
  
  if (!name.trim()) {
    alert('Please enter your name');
    return;
  }
  
  if (!reviewText.trim()) {
    alert('Please enter your review');
    return;
  }
  
  // Mock submission - in a real app, this would send to a backend
  alert('Thank you for your review! (Note: This is a demo - reviews are not actually saved)');
  
  // Clear form
  document.querySelector('input[name="rating"]:checked').checked = false;
  document.getElementById('review-name').value = '';
  document.getElementById('review-text').value = '';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  displayRecipe();
});
