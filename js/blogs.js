// Blog page functionality

// Modal elements
const blogModal = document.getElementById('blog-modal');
const reviewModal = document.getElementById('review-modal');
const blogForm = document.getElementById('blog-form');
const reviewForm = document.getElementById('review-form');

// Handle write blog post button
document.getElementById('write-blog-btn').addEventListener('click', function() {
  openModal(blogModal);
});

// Handle write review button
document.getElementById('write-review-btn').addEventListener('click', function() {
  openModal(reviewModal);
});

// Close modal buttons
document.getElementById('close-blog-modal').addEventListener('click', function() {
  closeModal(blogModal);
});

document.getElementById('close-review-modal').addEventListener('click', function() {
  closeModal(reviewModal);
});

// Cancel buttons
document.getElementById('cancel-blog').addEventListener('click', function() {
  if (confirm('Are you sure you want to cancel? Your changes will be lost.')) {
    closeModal(blogModal);
    blogForm.reset();
  }
});

document.getElementById('cancel-review').addEventListener('click', function() {
  if (confirm('Are you sure you want to cancel? Your changes will be lost.')) {
    closeModal(reviewModal);
    reviewForm.reset();
  }
});

// Close modal when clicking outside
window.addEventListener('click', function(e) {
  if (e.target === blogModal) {
    closeModal(blogModal);
  }
  if (e.target === reviewModal) {
    closeModal(reviewModal);
  }
});

// Close modal with Escape key
window.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeModal(blogModal);
    closeModal(reviewModal);
  }
});

// Helper functions to open/close modals
function openModal(modal) {
  modal.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeModal(modal) {
  modal.classList.remove('active');
  document.body.style.overflow = ''; // Restore scrolling
}

// Handle file input display for custom file uploads
document.getElementById('blog-image').addEventListener('change', function(e) {
  const fileName = e.target.files[0] ? e.target.files[0].name : 'No file selected';
  const fileNameSpan = document.getElementById('blog-image-name');
  fileNameSpan.textContent = fileName;
  if (e.target.files[0]) {
    fileNameSpan.classList.add('has-file');
  } else {
    fileNameSpan.classList.remove('has-file');
  }
});

document.getElementById('review-photo').addEventListener('change', function(e) {
  const fileName = e.target.files[0] ? e.target.files[0].name : 'No file selected';
  const fileNameSpan = document.getElementById('review-photo-name');
  fileNameSpan.textContent = fileName;
  if (e.target.files[0]) {
    fileNameSpan.classList.add('has-file');
  } else {
    fileNameSpan.classList.remove('has-file');
  }
});

// Handle blog form submission
blogForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const formData = {
    title: document.getElementById('blog-title').value,
    category: document.getElementById('blog-category').value,
    content: document.getElementById('blog-content').value,
    tags: document.getElementById('blog-tags').value,
    image: document.getElementById('blog-image').files[0]
  };
  
  console.log('Blog post submitted:', formData);
  
  // Show success message
  alert('🎉 Your blog post has been published successfully!\n\nThank you for sharing your baking experience with the community.');
  
  // Reset form and close modal
  blogForm.reset();
  closeModal(blogModal);
  
  // In a real implementation, this would send data to the server
});

// Handle review form submission
reviewForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const rating = document.querySelector('input[name="rating"]:checked');
  
  if (!rating) {
    alert('Please select a star rating for your review.');
    return;
  }
  
  const formData = {
    recipe: document.getElementById('review-recipe').value,
    rating: rating.value,
    title: document.getElementById('review-title').value,
    content: document.getElementById('review-content').value,
    difficulty: document.getElementById('review-difficulty').value,
    time: document.getElementById('review-time').value,
    modifications: document.getElementById('review-modifications').value,
    wouldMakeAgain: document.getElementById('review-again').checked,
    photo: document.getElementById('review-photo').files[0]
  };
  
  console.log('Review submitted:', formData);
  
  // Show success message
  alert(`⭐ Your ${rating.value}-star review has been submitted!\n\nThank you for helping other bakers with your feedback.`);
  
  // Reset form and close modal
  reviewForm.reset();
  closeModal(reviewModal);
  
  // In a real implementation, this would send data to the server
});

// Handle filter checkboxes
const filterCheckboxes = document.querySelectorAll('.filter-checkbox input[type="checkbox"]');
filterCheckboxes.forEach(checkbox => {
  checkbox.addEventListener('change', function() {
    filterBlogPosts();
  });
});

// Handle sort dropdown
const sortSelect = document.getElementById('sort-select');
sortSelect.addEventListener('change', function() {
  sortBlogPosts(this.value);
});

// Function to filter blog posts based on selected categories
function filterBlogPosts() {
  const selectedCategories = Array.from(filterCheckboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.value);
  
  const blogCards = document.querySelectorAll('.blog-card');
  
  blogCards.forEach(card => {
    const category = card.querySelector('.blog-category');
    if (category) {
      const categoryClasses = category.className.split(' ');
      const cardCategory = categoryClasses.find(c => c !== 'blog-category');
      
      if (selectedCategories.includes(cardCategory)) {
        card.style.display = 'grid';
      } else {
        card.style.display = 'none';
      }
    }
  });
  
  // If no filters selected, show all
  if (selectedCategories.length === 0) {
    blogCards.forEach(card => {
      card.style.display = 'grid';
    });
  }
}

// Function to sort blog posts
function sortBlogPosts(sortBy) {
  console.log('Sorting by:', sortBy);
  // In a real implementation, this would re-order the blog posts
  // based on the selected sort option (recent, popular, helpful)
  alert(`Posts will be sorted by: ${sortBy}`);
}

// Handle like buttons (add interactivity to blog stats)
document.addEventListener('click', function(e) {
  if (e.target.closest('.blog-stats span:first-child')) {
    const likeElement = e.target.closest('.blog-stats span:first-child');
    const currentLikes = parseInt(likeElement.textContent.match(/\d+/)[0]);
    likeElement.innerHTML = `❤️ ${currentLikes + 1}`;
    likeElement.style.color = '#d63031';
    
    setTimeout(() => {
      likeElement.style.color = '';
    }, 300);
  }
});

// Load more posts functionality
const loadMoreBtn = document.querySelector('.load-more button');
if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', function() {
    alert('Loading more blog posts... In a real implementation, this would fetch additional posts from the server.');
    // In a real implementation, this would load more blog posts via AJAX
  });
}

// Smooth scroll to top when navigating
window.addEventListener('load', function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
