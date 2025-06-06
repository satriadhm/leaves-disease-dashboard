// src/utils/auth.js
import apiService from '../services/api.js';

class AuthManager {
  constructor() {
    this.init();
  }

  init() {
    // Check if user is logged in on page load
    this.checkAuthStatus();
    
    // Listen for storage changes (multi-tab support)
    window.addEventListener('storage', (e) => {
      if (e.key === 'authToken' || e.key === 'user') {
        this.checkAuthStatus();
      }
    });
  }

  checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      apiService.updateToken(token);
      this.setAuthState(true, JSON.parse(user));
    } else {
      this.setAuthState(false, null);
    }
  }

  setAuthState(isAuthenticated, user) {
    // Dispatch custom event for components to listen
    window.dispatchEvent(new CustomEvent('authStateChanged', {
      detail: { isAuthenticated, user }
    }));
  }

  async login(credentials) {
    try {
      const response = await apiService.login(credentials);
      this.setAuthState(true, {
        id: response.id,
        username: response.username,
        email: response.email,
        roles: response.roles
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
      await apiService.logout();
      this.setAuthState(false, null);
    } catch (error) {
      // Even if API call fails, clear local storage
      this.setAuthState(false, null);
      throw error;
    }
  }

  async register(userData) {
    return await apiService.register(userData);
  }

  isAuthenticated() {
    return apiService.isAuthenticated();
  }

  getCurrentUser() {
    return apiService.getCurrentUser();
  }

  hasRole(role) {
    return apiService.hasRole(role);
  }

  isAdmin() {
    return apiService.isAdmin();
  }

  isModerator() {
    return apiService.isModerator();
  }

  requireAuth() {
    if (!this.isAuthenticated()) {
      window.dispatchEvent(new CustomEvent('navigate', { detail: '/login' }));
      return false;
    }
    return true;
  }

  requireRole(role) {
    if (!this.requireAuth()) return false;
    
    if (!this.hasRole(role)) {
      window.dispatchEvent(new CustomEvent('showError', { 
        detail: 'You do not have permission to access this page' 
      }));
      return false;
    }
    return true;
  }

  redirectIfAuthenticated() {
    if (this.isAuthenticated()) {
      window.dispatchEvent(new CustomEvent('navigate', { detail: '/' }));
      return true;
    }
    return false;
  }
}

// Create singleton instance
const authManager = new AuthManager();

export default authManager;