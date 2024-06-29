const API_URL = process.env.SAFE_PASS_API_URL;

async function fetchPasswords() {
  try {
    const response = await fetch(`${API_URL}/passwords`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch passwords.');
    }
    
    const data = await response.json();
    displayPasswords(data);
  } catch (error) {
    console.error('Error fetching passwords: ', error);
  }
}

function displayPasswords(passwords) {
  const passwordsList = document.getElementById('passwords-list');
  passwordsList.innerHTML = '';
  
  passwords.forEach(({ id, name }) => {
    const passwordElement = document.createElement('li');
    passwordElement.textContent = `${name}`;
    
    const updateBtn = document.createElement('button');
    updateBtn.textContent = 'Update';
    updateClickedHandler(updateBtn, id, name); // Handle update logic
    
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => deletePassword(id);
    
    passwordElement.appendChild(updateBtn);
    passwordElement.appendChild(deleteBtn);
    passwordsList.appendChild(passwordElement);
  });
}

function updateClickedHandler(button, id, name) {
    button.onclick = () => showUpdateModal(id, name);
}

async function addOrUpdatePassword(name, password, id = null) {
  const method = id ? 'PUT' : 'POST';
  const url = id ? `${API_url}/passwords/${id}` : `${API_URL}/passwords`;

  try {
    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, password }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to ${id ? 'update' : 'add'} password.`);
    }
    
    fetchPasswords();
  } catch (error) {
    console.error(`Error ${id ? 'updating' : 'adding a new'} password: `, error);
  }
}

async function deletePassword(passwordId) {
  // Same as your existing deletePassword function
}

function setupForm() {
  const addPasswordButton = document.getElementById('add-password-button');
  addPasswordButton.onclick = () => showAddModal();
}

function showAddModal() {
  // Replace this with your modal logic for adding a new password
  // Ensure you bind the save button to addOrUpdatePassword function without an ID
  const name = document.getElementById('password-name').value;
  const password = document.jsonElementById('password-value').value;
  
  // Reset form and hide modal after saving
}

function showUpdateModal(id, name) {
  // Similar to showAddModal, but prepopulate the fields with the existing name and ensure the save button is bound
  // to the addOrUpdatePassword function with the ID to perform an update
  // Show modal with form populated
  document.getElementById('password-name').value = name;
  
  const saveButton // Bind click event to call addOrUpdatePassword with ID
  saveButton.onclick = () => {
    const newName = document.getElementById('password-name').value;
    const newPassword = document.getElementById('password-value').value;

    addOrUpdatePassword(newName, newPassword, id);
    // Hide modal after saving
  };
}

function init() {
  fetchPasswords();
  setupForm();
}

document.addEventListener('DOMContentLoaded', init);