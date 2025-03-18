import { notify } from './util.js';

document.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Fetch the user's details
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username) {
    notify('rejected', 'Provide the username!');
    return;
  }

  if (!password) {
    notify('rejected', 'Provide the password!');
    return;
  }

  // Authenticate the user
  const user = await authenticateUser({
    username,
    password
  });

  if (!user) return;

  switch (user.status) {
    case 'rejected':
    case 'not_found':
      notify(user.status, user.message);
      return;
    case 'success':
      notify('success', user.message);

      // Redirect based on user role
      const role = user.data.role.name;
      role ? window.location.href = `/${role}` : window.location.href = '/';
      return;
    default:
      alert(user.message);
  }
});

/**
 * Authenticates the user to grant them access to the system
 * @param {{username: string, password: string}} user The user's credentials
 * @returns {{status: ("success" | "error" | "rejected" | "not_found"), message: string, data: Object}} An object response from the backend
 */
async function authenticateUser (user) {
  try {
    const response = await fetch('/api/user/authenticate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });

    return await response.json();
  } catch (error) {
    console.error(error);
    notify(
      'rejected',
      'An error occurred while logging you in. Please try again.'
    );
    return null;
  }
}
