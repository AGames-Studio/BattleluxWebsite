// PlayFab Configuration
const PlayFabConfig = {
  // Replace with your actual PlayFab Title ID
  titleId: 'B6103',
  
  // PlayFab API endpoints
  apiUrl: 'https://B6103.playfabapi.com',
  
  // Local storage keys
  storageKeys: {
    sessionTicket: 'battlelux_session_ticket',
    playerId: 'battlelux_player_id',
    playerName: 'battlelux_player_name',
    customId: 'battlelux_custom_id',
  },

  // API endpoints
  endpoints: {
    loginCustom: '/Client/LoginWithCustomID',
    loginEmail: '/Client/LoginWithEmailAddress',
    register: '/Client/RegisterPlayFabUser',
    playerProfile: '/Client/GetPlayerProfile',
    playerStats: '/Client/GetPlayerStatistics',
    updateStats: '/Client/UpdatePlayerStatistics',
    logout: '/Client/ForgetAllBrowserIDs',
  },
};

// Export for use in other modules
export default PlayFabConfig;
