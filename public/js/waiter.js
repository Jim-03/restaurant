// waiter.js

// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', function () {
  // Get references to DOM elements
  const searchBar = document.getElementById('search-bar');
  const categoryFilter = document.getElementById('categoryFilter');
  const addItemButton = document.getElementById('addItemButton');
  const menuItemsList = document.getElementById('menuItems');
  const menuPreview = document.getElementById('menuPreview');
  const saveDraftButton = document.getElementById('saveDraftButton');
  const publishButton = document.getElementById('publishButton');
  const closeButton = document.getElementById('closeButton');

  // Function to render menu items based on current filters and search term
  function renderMenuItems () {
    const searchTerm = searchBar.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    // Clear the current list of menu items
    menuItemsList.innerHTML = '';

    // Filter and display menu items
    menuItems
      .filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .forEach((item) => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - KSH${item.price.toFixed(2)}`;

        // Add a remove button for each item
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => removeItem(item.id));
        li.appendChild(removeButton);

        menuItemsList.appendChild(li);
      });

    // Update the preview section
    updatePreview();
  }

  // Function to remove an item from the menu
  function removeItem (itemId) {
    const index = menuItems.findIndex((item) => item.id === itemId);
    if (index !== -1) {
      menuItems.splice(index, 1);
      renderMenuItems();
    }
  }

  // Function to update the preview section
  function updatePreview () {
    menuPreview.innerHTML = '<h3>Menu Preview</h3>';
    menuItems.forEach((item) => {
      const p = document.createElement('p');
      p.textContent = `${item.name} - KSH${item.price.toFixed(2)} (${item.category})`;
      menuPreview.appendChild(p);
    });
  }

  // Function to save the current menu as a draft
  function saveDraft () {
    localStorage.setItem('menuDraft', JSON.stringify(menuItems));
    alert('Draft saved successfully!');
  }

  // Function to publish the menu
  function publishMenu () {
    // Here you would typically send the menu data to a server
    alert('Menu published successfully!');
  }

  // Event listeners
  searchBar.addEventListener('input', renderMenuItems);
  categoryFilter.addEventListener('change', renderMenuItems);
  addItemButton.addEventListener('click', addItem);
  saveDraftButton.addEventListener('click', saveDraft);
  publishButton.addEventListener('click', publishMenu);
  closeButton.addEventListener('click', hideFoodForm);

  // Initial render of menu items
  renderMenuItems();
});

function addItem () {
  // Display the new item form
  document.getElementById('foodForm').style.display = 'flex';
}

function hideFoodForm () {
  document.getElementById('foodForm').style.display = 'none';
}
