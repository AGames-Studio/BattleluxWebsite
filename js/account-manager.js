// Account UI Management Module
import PlayFabAuth from './auth.js';

class AccountManager {
  constructor() {
    this.currentPlayer = null;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.checkAuthStatus();
  }

  setupEventListeners() {
    // Wait for elements to be in DOM before adding listeners
    const setupWhenReady = () => {
      const loginClose = document.getElementById('loginClose');
      const signupClose = document.getElementById('signupClose');
      const loginForm = document.getElementById('loginForm');
      const signupForm = document.getElementById('signupForm');
      const userProfileBtn = document.getElementById('userProfileBtn');
      const logoutBtn = document.getElementById('logoutBtn');
      const loginModal = document.getElementById('loginModal');
      const signupModal = document.getElementById('signupModal');

      // Check if all elements exist
      if (!loginClose || !signupClose || !loginForm || !signupForm || 
          !userProfileBtn || !logoutBtn || !loginModal || !signupModal) {
        setTimeout(setupWhenReady, 100);
        return;
      }

      // Modal close buttons
      loginClose.addEventListener('click', () => this.closeModal('login'));
      signupClose.addEventListener('click', () => this.closeModal('signup'));

      // Form submissions
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
      signupForm.addEventListener('submit', (e) => this.handleSignup(e));

      // User menu
      userProfileBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!PlayFabAuth.isAuthenticated()) {
          this.openModal('login');
        } else {
          this.toggleUserDropdown();
        }
      });
      logoutBtn.addEventListener('click', () => this.handleLogout());

      // Close modal when clicking outside
      loginModal.addEventListener('click', (e) => {
        if (e.target.id === 'loginModal') this.closeModal('login');
      });
      signupModal.addEventListener('click', (e) => {
        if (e.target.id === 'signupModal') this.closeModal('signup');
      });

      // Listen for auth events
      window.addEventListener('playerLoggedIn', (e) => this.onPlayerLoggedIn(e.detail));
      window.addEventListener('playerLoggedOut', () => this.onPlayerLoggedOut());
    };

    setupWhenReady();
  }

  checkAuthStatus() {
    if (PlayFabAuth.isAuthenticated()) {
      this.currentPlayer = PlayFabAuth.getCurrentPlayer();
      this.updateUIForLoggedIn();
    } else {
      this.updateUIForLoggedOut();
    }
  }

  async handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    this.clearErrors();

    if (!email || !password) {
      this.showError('loginEmail', 'Email and password are required');
      return;
    }

    const submitBtn = document.getElementById('loginSubmit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing In...';

    // Hard login with email/password (no account creation)
    const result = await PlayFabAuth.loginWithEmail(email, password);

    if (result.success) {
      this.closeModal('login');
      document.getElementById('loginForm').reset();
    } else {
      this.showError('loginEmail', result.error || 'Login failed');
    }

    submitBtn.disabled = false;
    submitBtn.textContent = 'Sign In';
  }

  async handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirm = document.getElementById('signupConfirm').value;

    this.clearErrors();

    if (!name || !email || !password || !confirm) {
      this.showError('signupName', 'All fields are required');
      return;
    }

    if (password !== confirm) {
      this.showError('signupConfirm', 'Passwords do not match');
      return;
    }

    if (password.length < 8) {
      this.showError('signupPassword', 'Password must be at least 8 characters');
      return;
    }

    const submitBtn = document.getElementById('signupSubmit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating Account...';

    const result = await PlayFabAuth.registerAccount(email, password, name);

    if (result.success) {
      this.closeModal('signup');
      document.getElementById('signupForm').reset();
      // Login after signup with the same credentials
      const loginResult = await PlayFabAuth.loginWithEmail(email, password);
      if (loginResult.success) {
        this.updateUIForLoggedIn();
      } else {
        this.showError('signupEmail', loginResult.error || 'Login failed after signup');
      }
    } else {
      this.showError('signupEmail', result.error || 'Signup failed');
    }

    submitBtn.disabled = false;
    submitBtn.textContent = 'Create Account';
  }

  handleLogout() {
    PlayFabAuth.logout();
    this.updateUIForLoggedOut();
    this.toggleUserDropdown();
  }

  onPlayerLoggedIn(detail) {
    this.currentPlayer = detail;
    this.updateUIForLoggedIn();
  }

  onPlayerLoggedOut() {
    this.currentPlayer = null;
    this.updateUIForLoggedOut();
  }

  updateUIForLoggedIn() {
    const player = PlayFabAuth.getCurrentPlayer();
    if (!player || !player.playerName) return;
    
    const firstLetter = player.playerName[0].toUpperCase();

    // Update navbar
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const userDropdown = document.getElementById('userDropdown');
    
    if (userAvatar) userAvatar.textContent = firstLetter;
    if (userName) userName.textContent = player.playerName;
    if (userDropdown) userDropdown.classList.remove('active');

    // Update profile page
    const profileAvatar = document.getElementById('profileAvatar');
    const profileName = document.getElementById('profileName');
    const profileId = document.getElementById('profileId');
    
    if (profileAvatar) profileAvatar.textContent = firstLetter;
    if (profileName) profileName.textContent = player.playerName;
    if (profileId) profileId.textContent = `ID: ${player.playerId}`;

    // Update profile stats (demo values)
    const statWins = document.getElementById('statWins');
    const statElim = document.getElementById('statEliminations');
    const statTime = document.getElementById('statPlayTime');
    
    if (statWins) statWins.textContent = '5';
    if (statElim) statElim.textContent = '42';
    if (statTime) statTime.textContent = '24';
  }

  updateUIForLoggedOut() {
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const userDropdown = document.getElementById('userDropdown');
    const profilePage = document.getElementById('profilePage');

    if (userAvatar) userAvatar.textContent = '?';
    if (userName) userName.textContent = 'Sign In';
    if (userDropdown) userDropdown.classList.remove('active');
    if (profilePage) profilePage.style.display = 'none';

    const userProfileBtn = document.getElementById('userProfileBtn');
    if (userProfileBtn) {
      userProfileBtn.removeEventListener('click', this.userProfileBtnClickHandler);
      this.userProfileBtnClickHandler = () => this.openModal('login');
      userProfileBtn.addEventListener('click', this.userProfileBtnClickHandler);
    }
  }

  openModal(type) {
    const modal = document.getElementById(`${type}Modal`);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal(type) {
    const modal = document.getElementById(`${type}Modal`);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }

  switchModal(from, to) {
    this.closeModal(from);
    this.openModal(to);
  }

  toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
      dropdown.classList.toggle('active');
    }
  }

  showError(fieldId, message) {
    const errorEl = document.getElementById(`${fieldId}Error`);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
    }
  }

  clearErrors() {
    document.querySelectorAll('.form-error').forEach(el => {
      el.textContent = '';
      el.style.display = 'none';
    });
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.accountManager = new AccountManager();
    window.switchModal = (from, to) => window.accountManager.switchModal(from, to);
  });
} else {
  window.accountManager = new AccountManager();
  window.switchModal = (from, to) => window.accountManager.switchModal(from, to);
}

export default AccountManager;
