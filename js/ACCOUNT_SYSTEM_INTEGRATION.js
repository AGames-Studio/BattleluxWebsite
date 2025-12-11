// Account System Integration Checklist

/**
 * FILE STRUCTURE & IMPORTS
 * ========================
 * 
 * 1. config.js - Configuration
 *    - Contains PlayFab Title ID: B6103
 *    - Defines API endpoints and storage keys
 *    - Exported as default: PlayFabConfig
 * 
 * 2. auth.js - Authentication Handler
 *    - Imports PlayFabConfig from './config.js'
 *    - Exports singleton: new PlayFabAuth()
 *    - Methods:
 *      * loginWithCustomId() - Anonymous login
 *      * registerAccount() - Email/password signup
 *      * getPlayerProfile() - Fetch player data
 *      * getPlayerStats() - Get player statistics
 *      * updatePlayerStats() - Update player stats
 *      * logout() - Clear session
 *      * isAuthenticated() - Check auth status
 *      * getCurrentPlayer() - Get current player info
 * 
 * 3. account-manager.js - UI Manager
 *    - Imports PlayFabAuth from './auth.js'
 *    - Exports class: AccountManager
 *    - Handles all UI interactions and form management
 *    - Auto-initializes on DOMContentLoaded
 *    - Sets global: window.accountManager
 *    - Sets global: window.switchModal()
 * 
 * 4. index.html - HTML Structure
 *    - Links: css/account.css
 *    - Module script imports: auth.js, account-manager.js
 *    - Sets global: window.PlayFabAuth
 *    - Sets global: window.AccountManager
 * 
 * INITIALIZATION FLOW
 * ===================
 * 
 * 1. Page loads
 * 2. Module script runs (type="module")
 *    - Imports auth.js → creates singleton PlayFabAuth instance
 *    - Imports account-manager.js → exports AccountManager class
 *    - Sets window.PlayFabAuth = PlayFabAuth singleton
 *    - Sets window.AccountManager = AccountManager class
 * 
 * 3. DOM loads (DOMContentLoaded)
 *    - account-manager.js initializes:
 *      * Creates new AccountManager() instance
 *      * Calls init() → setupEventListeners() + checkAuthStatus()
 *      * Sets window.accountManager = new AccountManager()
 *      * Waits for DOM elements before adding listeners
 * 
 * 4. AccountManager setupEventListeners()
 *    - Waits for all DOM elements to exist
 *    - Adds click handlers to modal close buttons
 *    - Adds submit handlers to login/signup forms
 *    - Adds click handler to user profile button
 *    - Sets up logout button
 *    - Listens for custom auth events
 * 
 * EVENT FLOW
 * ===========
 * 
 * User clicks "Sign In":
 *   1. Button click → accountManager.openModal('login')
 *   2. Shows login form
 *   3. User submits → accountManager.handleLogin()
 *   4. Calls PlayFabAuth.loginWithCustomId()
 *   5. Success → handleLoginSuccess() → dispatch 'playerLoggedIn' event
 *   6. accountManager listens → onPlayerLoggedIn() → updateUIForLoggedIn()
 * 
 * User clicks "Sign Out":
 *   1. Dropdown item click → accountManager.handleLogout()
 *   2. Calls PlayFabAuth.logout()
 *   3. Clears localStorage → dispatch 'playerLoggedOut' event
 *   4. accountManager listens → onPlayerLoggedOut() → updateUIForLoggedOut()
 * 
 * GLOBAL VARIABLES AVAILABLE
 * ===========================
 * 
 * window.PlayFabAuth
 *   - The authentication singleton
 *   - Used to check login status, get player info, etc.
 * 
 * window.AccountManager
 *   - The AccountManager class (for reference)
 * 
 * window.accountManager
 *   - The active AccountManager instance
 *   - Has methods: openModal(), closeModal(), switchModal(), toggleUserDropdown()
 * 
 * window.switchModal(from, to)
 *   - Helper function to switch between login/signup modals
 *   - Called from HTML onclick attributes
 * 
 * TESTING CHECKLIST
 * =================
 * 
 * ✓ Check browser console for initialization logs
 * ✓ Click "Sign In" - should open login modal
 * ✓ Click "Create Account" - should open signup modal
 * ✓ Switch between modals using "Sign Up" / "Sign In" links
 * ✓ Close modal by clicking X or clicking outside
 * ✓ Form validation works (required fields, password match)
 * ✓ Login/signup submits to PlayFab (check Network tab)
 * ✓ User dropdown appears after login
 * ✓ Profile page shows user stats
 * ✓ Logout button clears session and updates UI
 * ✓ Page refresh maintains session (localStorage)
 */
