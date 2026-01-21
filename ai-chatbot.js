// AI Chatbot functionality

class RecipeAIChatbot {
  constructor() {
    this.messages = [];
    this.isOpen = false;
    this.init();
  }

  init() {
    this.createChatbotUI();
    this.attachEventListeners();
    this.addWelcomeMessage();
  }

  createChatbotUI() {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.id = 'ai-chatbot-modal';
    modal.className = 'chatbot-modal';
    modal.innerHTML = `
      <div class="chatbot-container">
        <div class="chatbot-header">
          <div class="chatbot-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>Recipe AI Assistant</span>
          </div>
          <button class="chatbot-close" id="close-chatbot">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="chatbot-messages" id="chatbot-messages"></div>
        <div class="chatbot-suggestions" id="chatbot-suggestions">
          <button class="suggestion-btn" data-text="What can I make with chicken?">🍗 Chicken recipes</button>
          <button class="suggestion-btn" data-text="Suggest a dessert recipe">🍰 Dessert ideas</button>
          <button class="suggestion-btn" data-text="How do I bake bread?">🍞 Baking tips</button>
          <button class="suggestion-btn" data-text="Vegetarian recipe ideas">🥗 Vegetarian</button>
        </div>
        <div class="chatbot-input-area">
          <input 
            type="text" 
            id="chatbot-input" 
            placeholder="Ask me about recipes, ingredients, or cooking tips..."
            autocomplete="off"
          />
          <button id="chatbot-send" class="chatbot-send-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  attachEventListeners() {
    // Open chatbot
    document.querySelectorAll('.action-btn.ai').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openChatbot();
      });
    });

    // Close chatbot
    const closeBtn = document.getElementById('close-chatbot');
    const modal = document.getElementById('ai-chatbot-modal');
    
    closeBtn.addEventListener('click', () => this.closeChatbot());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.closeChatbot();
    });

    // Send message
    const sendBtn = document.getElementById('chatbot-send');
    const input = document.getElementById('chatbot-input');
    
    sendBtn.addEventListener('click', () => this.handleSendMessage());
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleSendMessage();
    });

    // Suggestion buttons
    document.querySelectorAll('.suggestion-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.getAttribute('data-text');
        document.getElementById('chatbot-input').value = text;
        this.handleSendMessage();
      });
    });
  }

  openChatbot() {
    const modal = document.getElementById('ai-chatbot-modal');
    modal.classList.add('active');
    this.isOpen = true;
    document.getElementById('chatbot-input').focus();
  }

  closeChatbot() {
    const modal = document.getElementById('ai-chatbot-modal');
    modal.classList.remove('active');
    this.isOpen = false;
  }

  addWelcomeMessage() {
    this.addMessage('bot', "Hi! I'm your Recipe AI Assistant. I can help you with recipes, cooking tips, ingredient substitutions, and more. How can I help you today?");
  }

  addMessage(sender, text) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${sender}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = sender === 'bot' ? '🤖' : '👤';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    content.textContent = text;
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    this.messages.push({ sender, text, timestamp: new Date() });
  }

  handleSendMessage() {
    const input = document.getElementById('chatbot-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    this.addMessage('user', message);
    input.value = '';
    
    // Show typing indicator
    this.showTypingIndicator();
    
    // Simulate AI response
    setTimeout(() => {
      this.hideTypingIndicator();
      const response = this.generateResponse(message);
      this.addMessage('bot', response);
    }, 1000 + Math.random() * 1000);
  }

  showTypingIndicator() {
    const messagesContainer = document.getElementById('chatbot-messages');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'chatbot-message bot-message';
    typingDiv.innerHTML = `
      <div class="message-avatar">🤖</div>
      <div class="message-content typing-dots">
        <span></span><span></span><span></span>
      </div>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
  }

  generateResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Greetings
    if (message.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
      return "Hello! 👋 I'm here to help with all your cooking and recipe questions. What would you like to make today?";
    }
    
    // Recipe suggestions - Meats & Proteins
    if (message.includes('chicken')) {
      return "Great choice! Here are some popular chicken recipes:\n\n🍗 Grilled Lemon Herb Chicken\n🍗 Creamy Garlic Chicken\n🍗 Honey Mustard Chicken\n🍗 Chicken Stir-Fry\n\nWould you like detailed instructions for any of these?";
    }
    
    if (message.includes('beef') || message.includes('steak')) {
      return "Here are some delicious beef recipes:\n\n🥩 Classic Beef Stew\n🥩 Grilled Steak with Chimichurri\n🥩 Beef Tacos\n🥩 Shepherd's Pie\n🥩 Beef and Broccoli Stir-Fry\n\nWhich sounds appealing?";
    }
    
    if (message.includes('pork')) {
      return "Try these tasty pork dishes:\n\n🥓 Honey Glazed Pork Chops\n🥓 Pulled Pork Sandwiches\n🥓 Sweet and Sour Pork\n🥓 Pork Tenderloin with Apples\n\nLet me know if you want cooking tips!";
    }
    
    if (message.includes('fish') || message.includes('salmon') || message.includes('seafood')) {
      return "Seafood is a great choice! Here are some ideas:\n\n🐟 Baked Salmon with Lemon\n🐟 Fish Tacos\n🐟 Shrimp Scampi\n🐟 Tuna Poke Bowl\n🐟 Grilled Mahi-Mahi\n\nAll healthy and delicious!";
    }
    
    // Desserts
    if (message.includes('dessert') || message.includes('sweet') || message.includes('cake') || message.includes('cookie')) {
      return "I have some delicious dessert ideas for you:\n\n🍰 Chocolate Lava Cake\n🍪 Classic Chocolate Chip Cookies\n🥧 Apple Pie\n🍮 Crème Brûlée\n🍓 Strawberry Cheesecake\n\nWhat sounds good to you?";
    }
    
    // Baking
    if (message.includes('bread') || message.includes('bake') || message.includes('baking')) {
      return "Baking bread is wonderful! Here are some tips:\n\n1. Use warm water (not hot) for yeast activation\n2. Knead the dough for 8-10 minutes\n3. Let it rise in a warm place until doubled\n4. Preheat your oven to 375°F (190°C)\n5. Bake until golden brown and sounds hollow when tapped\n\nWould you like a specific bread recipe?";
    }
    
    // Dietary preferences
    if (message.includes('vegetarian') || message.includes('vegan')) {
      return "Here are some delicious vegetarian options:\n\n🥗 Mediterranean Quinoa Bowl\n🍝 Creamy Mushroom Pasta\n🌮 Black Bean Tacos\n🍛 Thai Green Curry\n🥙 Falafel Wrap\n\nAll these are packed with flavor and nutrients!";
    }
    
    if (message.includes('gluten free') || message.includes('gluten-free')) {
      return "Here are some great gluten-free options:\n\n✨ Grilled chicken with roasted vegetables\n✨ Rice paper spring rolls\n✨ Quinoa salad\n✨ Gluten-free pasta dishes\n✨ Corn tortilla tacos\n\nEating gluten-free can still be delicious!";
    }
    
    // Pasta
    if (message.includes('pasta') || message.includes('spaghetti') || message.includes('noodle')) {
      return "Pasta is always a great choice! Here are some favorites:\n\n🍝 Carbonara - creamy and indulgent\n🍝 Bolognese - hearty meat sauce\n🍝 Aglio e Olio - simple garlic and oil\n🍝 Pesto Pasta - fresh and herbaceous\n🍝 Lasagna - layered perfection\n\nWhich one interests you?";
    }
    
    // Time-based
    if (message.includes('quick') || message.includes('easy') || message.includes('fast') || message.includes('30 min')) {
      return "Looking for something quick? Try these 30-minute recipes:\n\n⚡ Stir-fried vegetables with rice\n⚡ Spaghetti Aglio e Olio\n⚡ Grilled cheese with tomato soup\n⚡ Quesadillas\n⚡ Egg fried rice\n\nAll delicious and ready in no time!";
    }
    
    // Healthy
    if (message.includes('healthy') || message.includes('diet') || message.includes('low calorie') || message.includes('nutritious')) {
      return "Here are some healthy recipe options:\n\n💚 Grilled salmon with vegetables\n💚 Quinoa Buddha Bowl\n💚 Greek salad with grilled chicken\n💚 Zucchini noodles with pesto\n💚 Baked sweet potato with toppings\n\nEating healthy doesn't mean sacrificing flavor!";
    }
    
    // Meals
    if (message.includes('breakfast') || message.includes('morning')) {
      return "Start your day right with these breakfast ideas:\n\n🌅 Fluffy Pancakes\n🌅 Avocado Toast\n🌅 Smoothie Bowl\n🌅 Eggs Benedict\n🌅 French Toast\n🌅 Oatmeal with berries\n\nWhat sounds good this morning?";
    }
    
    if (message.includes('lunch')) {
      return "Here are some great lunch ideas:\n\n🥗 Caesar Salad with Grilled Chicken\n🥪 Club Sandwich\n🍜 Ramen Bowl\n🌯 Chicken Wrap\n🥙 Mediterranean Bowl\n\nPerfect for a midday meal!";
    }
    
    if (message.includes('dinner') || message.includes('supper')) {
      return "Looking for dinner inspiration? Here are some ideas:\n\n🍽️ Roasted Chicken with Vegetables\n🍽️ Beef Stir-Fry\n🍽️ Baked Salmon\n🍽️ Pasta Primavera\n🍽️ Tacos\n\nWhat type of cuisine are you in the mood for?";
    }
    
    if (message.includes('snack') || message.includes('appetizer')) {
      return "Try these tasty snacks and appetizers:\n\n🍿 Homemade Popcorn\n🧀 Cheese Platter\n🥟 Spring Rolls\n🍤 Shrimp Cocktail\n🥨 Soft Pretzels\n\nPerfect for entertaining or snacking!";
    }
    
    // Cooking techniques
    if (message.includes('how to cook') || message.includes('how do i cook') || message.includes('cooking')) {
      return "I can help with cooking techniques! Common methods include:\n\n🔥 Grilling - high heat, great for meats\n🍳 Sautéing - quick cooking in a pan\n🥘 Braising - slow cooking in liquid\n♨️ Steaming - healthy, preserves nutrients\n🌡️ Roasting - dry heat in the oven\n\nWhat specifically would you like to learn about?";
    }
    
    // Ingredients & Substitutions
    if (message.includes('ingredient') || message.includes('substitute') || message.includes('replace')) {
      return "I can help with ingredient substitutions! Common ones include:\n\n• Butter → Coconut oil or Greek yogurt\n• Eggs → Flax eggs or applesauce\n• Milk → Almond, oat, or soy milk\n• Sugar → Honey or maple syrup\n• Flour → Almond flour or oat flour\n\nWhat specific ingredient do you need to substitute?";
    }
    
    // Cuisine types
    if (message.includes('italian')) {
      return "Italian cuisine is amazing! Try these classics:\n\n🇮🇹 Margherita Pizza\n🇮🇹 Risotto\n🇮🇹 Osso Buco\n🇮🇹 Tiramisu\n🇮🇹 Caprese Salad\n\nBuon appetito!";
    }
    
    if (message.includes('mexican')) {
      return "Love Mexican food! Here are some favorites:\n\n🇲🇽 Tacos al Pastor\n🇲🇽 Enchiladas\n🇲🇽 Guacamole\n🇲🇽 Quesadillas\n🇲🇽 Churros\n\n¡Delicioso!";
    }
    
    if (message.includes('asian') || message.includes('chinese') || message.includes('thai')) {
      return "Asian cuisine offers amazing flavors:\n\n🥢 Pad Thai\n🥢 Fried Rice\n🥢 Spring Rolls\n🥢 General Tso's Chicken\n🥢 Tom Yum Soup\n\nWhich style interests you most?";
    }
    
    // Tips & Help
    if (message.includes('tip') || message.includes('advice') || message.includes('trick')) {
      return "Here are some essential cooking tips:\n\n💡 Always read the recipe fully before starting\n💡 Prep all ingredients before cooking (mise en place)\n💡 Season in layers for better flavor\n💡 Let meat rest after cooking\n💡 Taste as you go\n\nNeed tips on something specific?";
    }
    
    if (message.includes('help') || message.includes('what can you')) {
      return "I can help you with:\n\n✓ Recipe suggestions based on ingredients\n✓ Cooking techniques and tips\n✓ Ingredient substitutions\n✓ Meal planning ideas\n✓ Dietary preferences (vegan, vegetarian, etc.)\n✓ Baking advice\n✓ Cuisine recommendations\n\nJust ask me anything about cooking or recipes!";
    }
    
    // Pantry/Ingredients query
    if (message.includes('what can i make') || message.includes('have') && (message.includes('ingredient') || message.includes('food'))) {
      return "Great question! To help you find recipes with what you have:\n\n1. Use the Pantry feature on the left sidebar\n2. Add your available ingredients\n3. Click 'Show recipes' to see matches\n\nOr tell me what ingredients you have, and I'll suggest some recipes!";
    }
    
    // Recipe-specific questions
    if (message.includes('how long') || message.includes('how much time')) {
      return "Cooking times vary by recipe:\n\n⏱️ Quick meals: 15-30 minutes\n⏱️ Standard recipes: 30-60 minutes\n⏱️ Slow-cooked dishes: 2-4 hours\n⏱️ Baking: 20-60 minutes\n\nWhat type of dish are you planning to make?";
    }
    
    if (message.includes('temperature') || message.includes('how hot')) {
      return "Common cooking temperatures:\n\n🌡️ Low: 250-300°F (120-150°C)\n🌡️ Medium: 325-375°F (160-190°C)\n🌡️ High: 400-450°F (200-230°C)\n🌡️ Broil: 500-550°F (260-290°C)\n\nWhat are you cooking?";
    }
    
    // Thanks
    if (message.includes('thank')) {
      return "You're very welcome! Happy cooking! 👨‍🍳 Let me know if you need anything else!";
    }
    
    // Goodbye
    if (message.match(/^(bye|goodbye|see you|later)/)) {
      return "Goodbye! Feel free to come back anytime you need cooking help. Happy cooking! 👋";
    }
    
    // More contextual default responses based on keywords
    if (message.includes('recipe')) {
      return "I'd love to help you find a recipe! What type of dish are you interested in? For example:\n\n• A specific ingredient (chicken, pasta, etc.)\n• Meal type (breakfast, lunch, dinner)\n• Cuisine (Italian, Mexican, Asian)\n• Dietary need (vegetarian, gluten-free)\n\nJust let me know what you're craving!";
    }
    
    if (message.includes('make') || message.includes('cook')) {
      return "What would you like to make? I can suggest recipes for:\n\n🍳 Specific ingredients you have\n⏱️ Quick 30-minute meals\n🥗 Healthy options\n🍰 Desserts and baking\n🌮 International cuisines\n\nTell me more about what you're looking for!";
    }
    
    // Enhanced default response
    return "I'd love to help! Could you tell me more about what you're looking for? For example:\n\n• \"What can I make with chicken?\"\n• \"Suggest a quick dinner recipe\"\n• \"How do I bake bread?\"\n• \"Healthy breakfast ideas\"\n• \"Vegetarian pasta recipes\"\n\nWhat sounds interesting to you?";
  }
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new RecipeAIChatbot();
});
