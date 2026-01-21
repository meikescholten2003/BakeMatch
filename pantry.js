// Pantry Management System for BakeMatch

// Ingredient categories with common ingredients
const ingredientCategories = {
  'Proteins': ['Chicken', 'Beef', 'Pork', 'Salmon', 'Tuna', 'Eggs', 'Bacon', 'Lamb', 'Turkey', 'Prawns', 'Cod', 'Shrimp', 'Sausages', 'Ham', 'Duck', 'Chorizo', 'Prosciutto', 'Mussels', 'Clams', 'Crab', 'Lobster', 'Anchovies', 'Tofu'],
  'Dairy': ['Milk', 'Cheese', 'Butter', 'Cream', 'Yogurt', 'Mozzarella', 'Parmesan', 'Cheddar Cheese', 'Feta', 'Cream Cheese', 'Sour Cream', 'Ricotta', 'Gouda', 'Brie', 'Blue Cheese', 'Gruyere', 'Condensed Milk', 'Coconut Milk'],
  'Vegetables': ['Tomatoes', 'Onions', 'Garlic', 'Potatoes', 'Carrots', 'Mushrooms', 'Peppers', 'Spinach', 'Broccoli', 'Celery', 'Cabbage', 'Lettuce', 'Cucumber', 'Zucchini', 'Peas', 'Green Beans', 'Corn', 'Aubergine', 'Sweet Potato', 'Asparagus', 'Kale', 'Leeks', 'Beetroot', 'Squash', 'Pumpkin', 'Bean Sprouts', 'Bok Choy', 'Red Onion', 'Spring Onions', 'Shallots'],
  'Grains & Pasta': ['Rice', 'Pasta', 'Flour', 'Bread', 'Spaghetti', 'Noodles', 'Couscous', 'Quinoa', 'Oats', 'Penne', 'Macaroni', 'Lasagne', 'Rigatoni', 'Barley', 'Bulgur', 'Polenta', 'Fettuccine', 'Tagliatelle'],
  'Fruits': ['Lemon', 'Apple', 'Banana', 'Strawberries', 'Blueberries', 'Orange', 'Lime', 'Peach', 'Pear', 'Mango', 'Pineapple', 'Grapes', 'Raspberries', 'Avocado', 'Watermelon', 'Cherries', 'Cranberries', 'Apricot', 'Plum', 'Kiwi', 'Pomegranate', 'Coconut'],
  'Herbs & Spices': ['Salt', 'Pepper', 'Basil', 'Oregano', 'Thyme', 'Paprika', 'Cumin', 'Parsley', 'Rosemary', 'Cinnamon', 'Ginger', 'Nutmeg', 'Chili Powder', 'Coriander', 'Turmeric', 'Cayenne Pepper', 'Bay Leaves', 'Mint', 'Dill', 'Chives', 'Tarragon', 'Sage', 'Fennel Seeds', 'Cardamom', 'Cloves', 'Allspice', 'Garlic Powder', 'Onion Powder'],
  'Oils & Sauces': ['Olive Oil', 'Vegetable Oil', 'Soy Sauce', 'Tomato Sauce', 'Vinegar', 'Sesame Oil', 'Coconut Oil', 'Worcestershire Sauce', 'Hot Sauce', 'Mustard', 'Ketchup', 'Mayonnaise', 'BBQ Sauce', 'Fish Sauce', 'Oyster Sauce', 'Hoisin Sauce', 'Teriyaki Sauce', 'Pesto', 'Balsamic Vinegar', 'Apple Cider Vinegar', 'Rice Vinegar'],
  'Baking': ['Sugar', 'Baking Powder', 'Vanilla', 'Cocoa', 'Chocolate', 'Honey', 'Brown Sugar', 'Icing Sugar', 'Baking Soda', 'Vanilla Extract', 'Yeast', 'Maple Syrup', 'Corn Starch', 'Cornflour', 'Golden Syrup', 'Treacle', 'Almond Extract', 'Chocolate Chips'],
  'Nuts & Seeds': ['Almonds', 'Walnuts', 'Peanuts', 'Cashews', 'Sesame Seeds', 'Sunflower Seeds', 'Pine Nuts', 'Pistachios', 'Pecans', 'Hazelnuts', 'Peanut Butter', 'Almond Butter', 'Tahini', 'Chia Seeds', 'Flax Seeds', 'Pumpkin Seeds'],
  'Legumes': ['Chickpeas', 'Lentils', 'Black Beans', 'Kidney Beans', 'White Beans', 'Cannellini Beans', 'Pinto Beans', 'Navy Beans', 'Lima Beans', 'Split Peas'],
  'Condiments': ['Olives', 'Pickles', 'Capers', 'Relish', 'Horseradish', 'Chutney', 'Jam', 'Marmalade', 'Salsa', 'Tabasco', 'Sriracha'],
  'Stock & Broth': ['Chicken Stock', 'Beef Stock', 'Vegetable Stock', 'Fish Stock', 'Chicken Broth', 'Beef Broth'],
  'Asian': ['Curry Paste', 'Mirin', 'Rice Wine', 'Sake', 'Miso', 'Nori', 'Wasabi', 'Sushi Rice', 'Rice Noodles', 'Gochujang', 'Kimchi'],
  'Alcohol': ['Red Wine', 'White Wine', 'Beer', 'Brandy', 'Rum', 'Vodka', 'Sherry', 'Vermouth', 'Marsala']
};

// Selected ingredients storage
let selectedIngredients = new Set();

// Initialize pantry
function initializePantry() {
  const pantryContainer = document.getElementById('pantry-categories');
  const searchInput = document.getElementById('pantry-search');
  const showRecipesBtn = document.getElementById('show-recipes-btn');
  const statusDiv = document.getElementById('pantry-status');

  if (!pantryContainer) return;

  // Render categories
  renderPantryCategories(pantryContainer);

  // Search functionality
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      filterIngredients(e.target.value.toLowerCase());
    });
  }

  // Show recipes button
  if (showRecipesBtn) {
    showRecipesBtn.addEventListener('click', () => {
      if (selectedIngredients.size === 0) {
        alert('Please select at least one ingredient');
        return;
      }
      const ingredients = Array.from(selectedIngredients).join(',');
      window.location.href = `recipe-overview.html?ingredients=${encodeURIComponent(ingredients)}`;
    });
  }

  // Update status initially
  updateStatus(statusDiv);
}

// Render pantry categories
function renderPantryCategories(container) {
  container.innerHTML = '';
  
  Object.keys(ingredientCategories).forEach(category => {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'pantry-category';
    categoryDiv.style.cssText = 'margin-bottom: 16px;';
    
    const categoryHeader = document.createElement('div');
    categoryHeader.className = 'pantry-category-header';
    categoryHeader.style.cssText = `
      font-weight: 600;
      font-size: 13px;
      color: #333;
      margin-bottom: 8px;
      padding: 0 4px;
      cursor: pointer;
      user-select: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
    `;
    
    const categoryName = document.createElement('span');
    categoryName.textContent = category;
    
    const toggle = document.createElement('span');
    toggle.textContent = '▼';
    toggle.style.cssText = 'font-size: 10px; transition: transform 0.2s;';
    
    categoryHeader.appendChild(categoryName);
    categoryHeader.appendChild(toggle);
    
    const ingredientsList = document.createElement('div');
    ingredientsList.className = 'pantry-ingredients-list';
    ingredientsList.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
      gap: 6px;
      padding: 0 4px;
    `;
    
    const allIngredients = ingredientCategories[category];
    const visibleCount = 6;
    const hasMore = allIngredients.length > visibleCount;
    
    // Add first 6 ingredients
    allIngredients.slice(0, visibleCount).forEach(ingredient => {
      const ingredientBtn = createIngredientButton(ingredient);
      ingredientsList.appendChild(ingredientBtn);
    });
    
    // Add expand button if there are more than 6 ingredients
    if (hasMore) {
      const expandBtn = document.createElement('button');
      expandBtn.className = 'expand-ingredients-btn';
      expandBtn.textContent = `+${allIngredients.length - visibleCount}`;
      expandBtn.style.cssText = `
        background: #f5f5f5;
        color: #666;
        border: 1px solid rgba(0,0,0,0.1);
        border-radius: 8px;
        padding: 8px 6px;
        font-size: 11px;
        cursor: pointer;
        transition: all 0.2s ease;
        text-align: center;
        font-weight: 600;
      `;
      
      let isExpanded = false;
      
      expandBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        if (!isExpanded) {
          // Remove the expand button temporarily
          expandBtn.remove();
          
          // Add remaining ingredients
          allIngredients.slice(visibleCount).forEach(ingredient => {
            const ingredientBtn = createIngredientButton(ingredient);
            ingredientsList.appendChild(ingredientBtn);
          });
          
          // Change button to "Show less"
          expandBtn.textContent = '−';
          ingredientsList.appendChild(expandBtn);
          isExpanded = true;
        } else {
          // Remove all ingredients after the first 6
          const buttons = Array.from(ingredientsList.querySelectorAll('.ingredient-btn'));
          buttons.slice(visibleCount).forEach(btn => btn.remove());
          
          // Update expand button
          expandBtn.textContent = `+${allIngredients.length - visibleCount}`;
          expandBtn.remove();
          ingredientsList.appendChild(expandBtn);
          isExpanded = false;
        }
      });
      
      expandBtn.addEventListener('mouseenter', () => {
        expandBtn.style.background = '#e8e8e8';
      });
      
      expandBtn.addEventListener('mouseleave', () => {
        expandBtn.style.background = '#f5f5f5';
      });
      
      ingredientsList.appendChild(expandBtn);
    }
    
    // Toggle functionality for collapsing the entire category
    categoryHeader.addEventListener('click', () => {
      const isHidden = ingredientsList.style.display === 'none';
      ingredientsList.style.display = isHidden ? 'grid' : 'none';
      toggle.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(-90deg)';
    });
    
    categoryDiv.appendChild(categoryHeader);
    categoryDiv.appendChild(ingredientsList);
    container.appendChild(categoryDiv);
  });
}

// Create ingredient button
function createIngredientButton(ingredient) {
  const btn = document.createElement('button');
  btn.className = 'ingredient-btn';
  btn.textContent = ingredient;
  btn.dataset.ingredient = ingredient.toLowerCase();
  
  const isSelected = selectedIngredients.has(ingredient);
  
  btn.style.cssText = `
    background: ${isSelected ? '#926e54' : 'white'};
    color: ${isSelected ? 'white' : '#333'};
    border: 1px solid ${isSelected ? '#926e54' : 'rgba(0,0,0,0.1)'};
    border-radius: 8px;
    padding: 8px 6px;
    font-size: 11px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
    font-weight: ${isSelected ? '600' : '400'};
  `;
  
  btn.addEventListener('click', () => {
    toggleIngredient(ingredient, btn);
  });
  
  btn.addEventListener('mouseenter', () => {
    if (!selectedIngredients.has(ingredient)) {
      btn.style.background = '#f5f5f5';
    }
  });
  
  btn.addEventListener('mouseleave', () => {
    if (!selectedIngredients.has(ingredient)) {
      btn.style.background = 'white';
    }
  });
  
  return btn;
}

// Toggle ingredient selection
function toggleIngredient(ingredient, btn) {
  if (selectedIngredients.has(ingredient)) {
    selectedIngredients.delete(ingredient);
    btn.style.background = 'white';
    btn.style.color = '#333';
    btn.style.borderColor = 'rgba(0,0,0,0.1)';
    btn.style.fontWeight = '400';
  } else {
    selectedIngredients.add(ingredient);
    btn.style.background = '#926e54';
    btn.style.color = 'white';
    btn.style.borderColor = '#926e54';
    btn.style.fontWeight = '600';
  }
  
  const statusDiv = document.getElementById('pantry-status');
  updateStatus(statusDiv);
}

// Update status display
function updateStatus(statusDiv) {
  if (!statusDiv) return;
  
  const count = selectedIngredients.size;
  if (count === 0) {
    statusDiv.textContent = 'No ingredients selected';
  } else {
    statusDiv.textContent = `${count} ingredient${count > 1 ? 's' : ''} selected`;
  }
}

// Filter ingredients by search
function filterIngredients(searchTerm) {
  const allButtons = document.querySelectorAll('.ingredient-btn');
  const categories = document.querySelectorAll('.pantry-category');
  
  if (!searchTerm) {
    allButtons.forEach(btn => btn.style.display = '');
    categories.forEach(cat => cat.style.display = '');
    return;
  }
  
  categories.forEach(categoryDiv => {
    const buttons = categoryDiv.querySelectorAll('.ingredient-btn');
    let hasVisibleItems = false;
    
    buttons.forEach(btn => {
      const ingredient = btn.dataset.ingredient;
      if (ingredient.includes(searchTerm)) {
        btn.style.display = '';
        hasVisibleItems = true;
      } else {
        btn.style.display = 'none';
      }
    });
    
    categoryDiv.style.display = hasVisibleItems ? '' : 'none';
  });
}

// Get selected ingredients (for other scripts to use)
function getSelectedIngredients() {
  return Array.from(selectedIngredients);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePantry);
} else {
  initializePantry();
}
