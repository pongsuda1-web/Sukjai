// auth.js - Simple client‑side authentication for Nan Sukjai tracking system
// NOTE: This is a mock implementation for demo purposes only.
// Users must be pre‑approved by an Admin and stored in localStorage under the key "approvedUsers".
// Each user object: { username: string, password: string, name: string }

// -------------------------------------------------------------------
// Initialise some demo approved users if not present (for first‑time load).
// In a real system this data would come from a secure backend.
// -------------------------------------------------------------------
(function initDemoUsers() {
  if (!localStorage.getItem('approvedUsers')) {
    const demoUsers = [
      { username: 'admin', password: 'admin123', name: 'ผู้ดูแลระบบ' },
      { username: 'doctor1', password: 'doc2023', name: 'คุณหมอสุข' },
      { username: 'jhw01', password: 'jhwpass', name: 'อสม. สมหมาย' }
    ];
    localStorage.setItem('approvedUsers', JSON.stringify(demoUsers));
  }
})();

/**
 * Attempt to log in a user.
 * @param {string} username
 * @param {string} password
 * @returns {boolean} true if credentials are valid and user is approved.
 */
function login(username, password) {
  const users = JSON.parse(localStorage.getItem('approvedUsers') || '[]');
  const matched = users.find(u => u.username === username && u.password === password);
  if (matched) {
    // Store logged‑in user information for the session.
    localStorage.setItem('currentUser', JSON.stringify({ username: matched.username, name: matched.name }));
    return true;
  }
  return false;
}

/**
 * Retrieve the currently logged‑in user object.
 * @returns {{username:string,name:string}|null}
 */
function getCurrentUser() {
  const data = localStorage.getItem('currentUser');
  return data ? JSON.parse(data) : null;
}

/**
 * Log out the current user.
 */
function logout() {
  localStorage.removeItem('currentUser');
  // Optionally redirect to login page.
  window.location.href = 'login.html';
}

// Export functions for other scripts.
window.login = login;
window.getCurrentUser = getCurrentUser;
window.logout = logout;
