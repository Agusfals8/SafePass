const API_URL = process.env.SAFE_PASS_API_URL;

async function fetchPasswords() {
  try {
    const response = await fetch(`${API_URL}/passwords`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to fetch passwords.");
    const data = await response.json();
    displayPasswords(data);
  } catch (error) {
    console.error("Error fetching passwords: ", error);
  }
}

function displayPasswords(passwords) {
  const passwordsList = document.getElementById("passwords-list");
  passwordsList.innerHTML = "";
  passwords.forEach(({ id, name }) => {
    const passwordElement = document.createElement("li");
    passwordElement.textContent = `${name}`;
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => deletePassword(id);
    passwordElement.appendChild(deleteBtn);
    passwordsList.appendChild(passwordElement);
  });
}

async function addPassword(name, password) {
  try {
    const response = await fetch(`${API_URL}/passwords`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password }),
    });
    if (!response.ok) throw new Error("Failed to add password.");
    fetchPasswords();
  } catch (error) {
    console.error("Error adding a new password: ", error);
  }
}

async function deletePassword(passwordId) {
  try {
    const response = await fetch(`${API_URL}/passwords/${passwordId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to delete password.");
    fetchPasswords();
  } catch (error) {
    console.error("Error deleting password: ", error);
  }
}

function setupForm() {
  const addPasswordForm = document.getElementById("add-password-form");
  addPasswordForm.onsubmit = async (e) => {
    e.preventDefault();
    const name = document.getElementById("password-name").value;
    const password = document.getElementById("password-value").value;
    await addPassword(name, password);
    addPasswordForm.reset();
  };
}

function init() {
  fetchPasswords();
}

document.addEventListener("DOMContentLoaded", init);