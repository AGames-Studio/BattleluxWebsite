// PlayFab Authentication Module
import PlayFabConfig from './config.js';

class PlayFabAuth {
  constructor() {
    this.sessionTicket = localStorage.getItem(PlayFabConfig.storageKeys.sessionTicket);
    this.playerId = localStorage.getItem(PlayFabConfig.storageKeys.playerId);
    this.playerName = localStorage.getItem(PlayFabConfig.storageKeys.playerName);
  }

  /**
   * Login with an existing custom ID (no auto-create)
   */
  async loginWithCustomId(customId = null) {
    try {
      const storedId = localStorage.getItem(PlayFabConfig.storageKeys.customId);
      const id = customId || storedId;

      if (!id) {
        return { success: false, error: 'Missing custom ID. Please sign up first.' };
      }
      
      const response = await fetch(`${PlayFabConfig.apiUrl}${PlayFabConfig.endpoints.loginCustom}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-PlayFabSDK': 'JavaScriptSDK-1.169.230322',
        },
        body: JSON.stringify({
          TitleId: PlayFabConfig.titleId,
          CustomId: id,
          CreateAccount: false,
        }),
      });

      const data = await response.json();

      if (data.code === 200) {
        this.handleLoginSuccess(data.data, id);
        return { success: true, data: data.data };
      } else {
        return { success: false, error: data.errorMessage || 'Login failed' };
      }
    } catch (error) {
      console.error('PlayFab login error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Login with email/password (hard login, no account creation)
   */
  async loginWithEmail(email, password) {
    try {
      const response = await fetch(`${PlayFabConfig.apiUrl}${PlayFabConfig.endpoints.loginEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-PlayFabSDK': 'JavaScriptSDK-1.169.230322',
        },
        body: JSON.stringify({
          TitleId: PlayFabConfig.titleId,
          Email: email,
          Password: password,
          InfoRequestParameters: {
            GetPlayerProfile: true,
          },
        }),
      });

      const data = await response.json();

      if (data.code === 200) {
        this.handleLoginSuccess(data.data);
        return { success: true, data: data.data };
      } else {
        return { success: false, error: data.errorMessage || 'Login failed' };
      }
    } catch (error) {
      console.error('PlayFab email login error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Register a new account with email and password
   */
  async registerAccount(email, password, displayName) {
    try {
      const response = await fetch(`${PlayFabConfig.apiUrl}${PlayFabConfig.endpoints.register}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-PlayFabSDK': 'JavaScriptSDK-1.169.230322',
        },
        body: JSON.stringify({
          TitleId: PlayFabConfig.titleId,
          Email: email,
          Password: password,
          DisplayName: displayName || 'Battlelux Player',
          RequireBothUsernameAndEmail: false,
        }),
      });

      const data = await response.json();

      if (data.code === 200) {
        return { success: true, data: data.data };
      } else {
        return { success: false, error: data.errorMessage || 'Registration failed' };
      }
    } catch (error) {
      console.error('PlayFab registration error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Handle successful login
   */
  handleLoginSuccess(data, customId) {
    this.sessionTicket = data.SessionTicket;
    this.playerId = data.PlayFabId;

    const storedName = localStorage.getItem(PlayFabConfig.storageKeys.playerName);
    const profileName = data.InfoResultPayload?.PlayerProfile?.DisplayName || data.PlayerProfile?.DisplayName;
    this.playerName = profileName || storedName || 'Warrior';

    // Store session info
    localStorage.setItem(PlayFabConfig.storageKeys.sessionTicket, this.sessionTicket);
    localStorage.setItem(PlayFabConfig.storageKeys.playerId, this.playerId);
    localStorage.setItem(PlayFabConfig.storageKeys.playerName, this.playerName);
    if (customId) {
      localStorage.setItem(PlayFabConfig.storageKeys.customId, customId);
    } else {
      localStorage.removeItem(PlayFabConfig.storageKeys.customId);
    }

    // Dispatch custom event for UI updates
    window.dispatchEvent(new CustomEvent('playerLoggedIn', {
      detail: { playerId: this.playerId, playerName: this.playerName }
    }));
  }

  /**
   * Get player profile
   */
  async getPlayerProfile() {
    if (!this.sessionTicket || !this.playerId) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const response = await fetch(`${PlayFabConfig.apiUrl}${PlayFabConfig.endpoints.playerProfile}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-PlayFabSDK': 'JavaScriptSDK-1.169.230322',
        },
        body: JSON.stringify({
          PlayFabId: this.playerId,
          ProfileConstraints: {
            ShowAvatarUrl: true,
            ShowBanned: true,
            ShowCampaignAttributions: true,
            ShowContactEmailAddresses: true,
            ShowCreated: true,
            ShowDisplayName: true,
            ShowExperimentVariants: true,
            ShowLastLogin: true,
            ShowLinkedAccounts: true,
            ShowLocations: true,
            ShowMemberships: true,
            ShowPushNotificationRegistrations: true,
            ShowStatistics: true,
            ShowTags: true,
            ShowTotalValueToDateInUsd: true,
          },
        }),
        headers: {
          'X-Authorization': this.sessionTicket,
        },
      });

      const data = await response.json();

      if (data.code === 200) {
        return { success: true, data: data.data };
      } else {
        return { success: false, error: data.errorMessage || 'Failed to fetch profile' };
      }
    } catch (error) {
      console.error('PlayFab profile error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get player statistics
   */
  async getPlayerStats() {
    if (!this.sessionTicket) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const response = await fetch(`${PlayFabConfig.apiUrl}${PlayFabConfig.endpoints.playerStats}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': this.sessionTicket,
          'X-PlayFabSDK': 'JavaScriptSDK-1.169.230322',
        },
        body: JSON.stringify({
          PlayFabId: this.playerId,
        }),
      });

      const data = await response.json();

      if (data.code === 200) {
        return { success: true, data: data.data.PlayerStatistics || [] };
      } else {
        return { success: false, error: data.errorMessage || 'Failed to fetch stats' };
      }
    } catch (error) {
      console.error('PlayFab stats error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update player statistics
   */
  async updatePlayerStats(stats) {
    if (!this.sessionTicket) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const statsArray = Object.entries(stats).map(([key, value]) => ({
        StatisticName: key,
        Value: value,
      }));

      const response = await fetch(`${PlayFabConfig.apiUrl}${PlayFabConfig.endpoints.updateStats}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': this.sessionTicket,
          'X-PlayFabSDK': 'JavaScriptSDK-1.169.230322',
        },
        body: JSON.stringify({
          Statistics: statsArray,
        }),
      });

      const data = await response.json();

      if (data.code === 200) {
        return { success: true, data: data.data };
      } else {
        return { success: false, error: data.errorMessage || 'Failed to update stats' };
      }
    } catch (error) {
      console.error('PlayFab update stats error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Logout and clear session
   */
  logout() {
    this.sessionTicket = null;
    this.playerId = null;
    this.playerName = null;

    localStorage.removeItem(PlayFabConfig.storageKeys.sessionTicket);
    localStorage.removeItem(PlayFabConfig.storageKeys.playerId);
    localStorage.removeItem(PlayFabConfig.storageKeys.playerName);
    localStorage.removeItem(PlayFabConfig.storageKeys.customId);

    window.dispatchEvent(new CustomEvent('playerLoggedOut'));
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.sessionTicket && !!this.playerId;
  }

  /**
   * Get current player info
   */
  getCurrentPlayer() {
    return {
      playerId: this.playerId,
      playerName: this.playerName,
      isAuthenticated: this.isAuthenticated(),
    };
  }
}

// Export singleton instance
export default new PlayFabAuth();
