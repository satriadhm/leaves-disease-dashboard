// src/services/api.js
class ApiService {
  constructor() {
    this.baseURL = process.env.API_URL || 'https://leaves-disease-api.vercel.app';
    this.token = localStorage.getItem('authToken');
  }

  // Helper method to get headers
  getHeaders(includeAuth = false) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.token) {
      headers['x-access-token'] = this.token;
    }

    return headers;
  }

  // Helper method for API calls
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(options.auth),
      ...options,
    };

    // Remove auth from config as it's already processed
    delete config.auth;

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Authentication methods
  async login(credentials) {
    const response = await this.request('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.accessToken) {
      this.token = response.accessToken;
      localStorage.setItem('authToken', this.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.id,
        username: response.username,
        email: response.email,
        roles: response.roles
      }));
    }

    return response;
  }

  async register(userData) {
    return await this.request('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    try {
      await this.request('/api/auth/logout', {
        method: 'POST',
        auth: true,
      });
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      this.token = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  }

  async changePassword(passwordData) {
    return await this.request('/api/auth/change-password', {
      method: 'POST',
      auth: true,
      body: JSON.stringify(passwordData),
    });
  }

  // Prediction methods
  async predictDisease(formData) {
    const url = `${this.baseURL}/api/predict`;
    const headers = {};
    
    if (this.token) {
      headers['x-access-token'] = this.token;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData, // FormData, don't set Content-Type
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  }

  async getPredictionHistory(params = {}) {
    const searchParams = new URLSearchParams(params);
    return await this.request(`/api/predictions/history?${searchParams}`, {
      method: 'GET',
      auth: true,
    });
  }

  async getPredictionDetail(id) {
    return await this.request(`/api/predictions/${id}`, {
      method: 'GET',
      auth: true,
    });
  }

  async deletePrediction(id) {
    return await this.request(`/api/predictions/${id}`, {
      method: 'DELETE',
      auth: true,
    });
  }

  // User methods
  async getUserProfile() {
    return await this.request('/api/user/profile', {
      method: 'GET',
      auth: true,
    });
  }

  async updateUserProfile(profileData) {
    return await this.request('/api/user/profile', {
      method: 'PUT',
      auth: true,
      body: JSON.stringify(profileData),
    });
  }

  async deleteAccount(passwordData) {
    return await this.request('/api/user/account', {
      method: 'DELETE',
      auth: true,
      body: JSON.stringify(passwordData),
    });
  }

  // Admin methods
  async getAllUsers(params = {}) {
    const searchParams = new URLSearchParams(params);
    return await this.request(`/api/admin/users?${searchParams}`, {
      method: 'GET',
      auth: true,
    });
  }

  async getUserById(id) {
    return await this.request(`/api/admin/users/${id}`, {
      method: 'GET',
      auth: true,
    });
  }

  async updateUser(id, userData) {
    return await this.request(`/api/admin/users/${id}`, {
      method: 'PUT',
      auth: true,
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id) {
    return await this.request(`/api/admin/users/${id}`, {
      method: 'DELETE',
      auth: true,
    });
  }

  async getUserStats() {
    return await this.request('/api/admin/users/stats', {
      method: 'GET',
      auth: true,
    });
  }

  async getAllPredictions(params = {}) {
    const searchParams = new URLSearchParams(params);
    return await this.request(`/api/admin/predictions?${searchParams}`, {
      method: 'GET',
      auth: true,
    });
  }

  async getPredictionStats() {
    return await this.request('/api/predictions/stats', {
      method: 'GET',
      auth: true,
    });
  }

  // Health check methods
  async getHealthStatus() {
    return await this.request('/health', {
      method: 'GET',
    });
  }

  async getModelHealth() {
    return await this.request('/api/model/health', {
      method: 'GET',
    });
  }

  async getDatabaseHealth() {
    return await this.request('/health/database', {
      method: 'GET',
    });
  }

  // Utility methods
  isAuthenticated() {
    return !!this.token;
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  hasRole(role) {
    const user = this.getCurrentUser();
    return user && user.roles && user.roles.some(r => r.includes(role.toUpperCase()));
  }

  isAdmin() {
    return this.hasRole('admin');
  }

  isModerator() {
    return this.hasRole('moderator');
  }

  updateToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;