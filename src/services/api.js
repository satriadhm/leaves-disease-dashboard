class ApiService {
  constructor() {
    this.baseURL = process.env.API_URL || 'https://leaves-disease-api-production.up.railway.app';
    this.token = localStorage.getItem('authToken');
    this.maxRetries = 3;
    this.retryDelay = 1000; // 1 second base delay
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

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Check if error is retryable
  isRetryableError(error) {
    // Retry on network errors, timeouts, and specific server errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return true; // Network error
    }
    
    if (error.message.includes('timeout') || error.message.includes('buffering')) {
      return true; // Database timeout
    }
    
    if (error.message.includes('503') || error.message.includes('Service Unavailable')) {
      return true; // Service temporarily unavailable
    }
    
    if (error.message.includes('502') || error.message.includes('Bad Gateway')) {
      return true; // Bad gateway
    }
    
    if (error.message.includes('504') || error.message.includes('Gateway Timeout')) {
      return true; // Gateway timeout
    }

    return false;
  }

  async request(endpoint, options = {}, retryCount = 0) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(options.auth),
      timeout: options.timeout || 15000, // 15 second default timeout
      ...options,
    };

    delete config.auth;
    delete config.timeout;

    try {
      console.log(`🚀 API Request: ${config.method || 'GET'} ${endpoint} (attempt ${retryCount + 1})`);
      
      const controller = new AbortController();
      config.signal = controller.signal;
      
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, options.timeout || 15000);

      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { message: text || `HTTP ${response.status}` };
      }

      if (!response.ok) {
        const error = new Error(data.message || `HTTP error! status: ${response.status}`);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      console.log(`✅ API Success: ${endpoint}`);
      return data;

    } catch (error) {
      console.error(`❌ API Error (${endpoint}, attempt ${retryCount + 1}):`, error.message);
      
      if (error.name === 'AbortError') {
        error.message = 'Request timeout - server took too long to respond';
      }
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        error.message = 'Network error - check your internet connection';
      }

      if (this.isRetryableError(error) && retryCount < this.maxRetries) {
        const delay = this.retryDelay * Math.pow(2, retryCount); // Exponential backoff
        console.log(`⏳ Retrying ${endpoint} in ${delay}ms... (${retryCount + 1}/${this.maxRetries})`);
        
        await this.sleep(delay);
        return this.request(endpoint, options, retryCount + 1);
      }

      throw error;
    }
  }

  async login(credentials) {
    try {
      const response = await this.request('/api/auth/signin', {
        method: 'POST',
        body: JSON.stringify(credentials),
        timeout: 20000 // Longer timeout for login
      });

      if (response.accessToken) {
        this.token = response.accessToken;
        localStorage.setItem('authToken', this.token);
        localStorage.setItem(
          'user',
          JSON.stringify({
            id: response.id,
            username: response.username,
            email: response.email,
            roles: response.roles,
          })
        );
      }

      return response;
    } catch (error) {
      if (error.status === 404) {
        throw new Error('Username tidak ditemukan');
      } else if (error.status === 401) {
        throw new Error('Password salah');
      } else if (error.status === 403) {
        throw new Error('Akun tidak aktif');
      } else if (error.message.includes('timeout') || error.message.includes('buffering')) {
        throw new Error('Koneksi timeout. Silakan coba lagi.');
      } else if (error.message.includes('Network error')) {
        throw new Error('Masalah jaringan. Periksa koneksi internet Anda.');
      }
      throw error;
    }
  }

  async register(userData) {
    try {
      return await this.request('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(userData),
        timeout: 25000 // Longer timeout for registration
      });
    } catch (error) {
      if (error.status === 400) {
        if (error.message.includes('Username')) {
          throw new Error('Username sudah digunakan');
        } else if (error.message.includes('Email')) {
          throw new Error('Email sudah terdaftar');
        } else if (error.message.includes('validation')) {
          throw new Error('Data tidak valid. Periksa kembali form Anda.');
        }
      } else if (error.status === 503) {
        throw new Error('Server sedang sibuk. Silakan coba lagi dalam beberapa saat.');
      } else if (error.message.includes('timeout') || error.message.includes('buffering')) {
        throw new Error('Pendaftaran timeout. Silakan coba lagi.');
      } else if (error.message.includes('Network error')) {
        throw new Error('Masalah jaringan. Periksa koneksi internet Anda.');
      }
      throw error;
    }
  }

  async logout() {
    try {
      await this.request('/api/auth/logout', {
        method: 'POST',
        auth: true,
        timeout: 5000 // Short timeout for logout
      });
    } catch (error) {
      console.warn('Logout API call failed (continuing anyway):', error.message);
    } finally {
      this.token = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  }

  async changePassword(passwordData) {
    try {
      return await this.request('/api/auth/change-password', {
        method: 'POST',
        auth: true,
        body: JSON.stringify(passwordData),
        timeout: 15000
      });
    } catch (error) {
      if (error.status === 401) {
        throw new Error('Password lama salah');
      } else if (error.status === 400) {
        throw new Error('Password baru tidak valid');
      }
      throw error;
    }
  }

  async predictDisease(formData) {
    try {
      const url = `${this.baseURL}/api/predict`;
      const headers = {};

      if (this.token) {
        headers['x-access-token'] = this.token;
      }

      let lastError;
      for (let attempt = 0; attempt < this.maxRetries; attempt++) {
        try {
          console.log(`🔮 Predicting disease (attempt ${attempt + 1})...`);
          
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout for file upload

          const response = await fetch(url, {
            method: 'POST',
            headers,
            body: formData,
            signal: controller.signal
          });

          clearTimeout(timeoutId);

          const data = await response.json();

          if (!response.ok) {
            const error = new Error(data.message || `HTTP error! status: ${response.status}`);
            error.status = response.status;
            throw error;
          }

          console.log('✅ Disease prediction successful');
          return data;

        } catch (error) {
          lastError = error;
          
          if (error.name === 'AbortError') {
            error.message = 'Upload timeout - file might be too large or connection slow';
          }

          if (error.status >= 400 && error.status < 500) {
            break;
          }

          if (attempt < this.maxRetries - 1 && this.isRetryableError(error)) {
            const delay = this.retryDelay * Math.pow(2, attempt);
            console.log(`⏳ Retrying prediction in ${delay}ms...`);
            await this.sleep(delay);
            continue;
          }
          
          break;
        }
      }

      if (lastError.status === 400) {
        throw new Error('File tidak valid. Gunakan gambar JPG, PNG, atau WebP (max 5MB)');
      } else if (lastError.message.includes('timeout')) {
        throw new Error('Upload timeout. Periksa ukuran file dan koneksi internet.');
      } else if (lastError.message.includes('Network error')) {
        throw new Error('Masalah jaringan. Periksa koneksi internet Anda.');
      }

      throw lastError;

    } catch (error) {
      console.error('Prediction error:', error);
      throw error;
    }
  }

  async getPredictionHistory(params = {}) {
    try {
      const searchParams = new URLSearchParams(params);
      return await this.request(`/api/predictions/history?${searchParams}`, {
        method: 'GET',
        auth: true,
        timeout: 15000
      });
    } catch (error) {
      if (error.status === 401) {
        throw new Error('Silakan login untuk melihat riwayat prediksi');
      }
      throw error;
    }
  }

  async getPredictionDetail(id) {
    try {
      return await this.request(`/api/predictions/${id}`, {
        method: 'GET',
        auth: true,
        timeout: 10000
      });
    } catch (error) {
      if (error.status === 404) {
        throw new Error('Prediksi tidak ditemukan');
      } else if (error.status === 401) {
        throw new Error('Akses ditolak');
      }
      throw error;
    }
  }

  async deletePrediction(id) {
    try {
      return await this.request(`/api/predictions/${id}`, {
        method: 'DELETE',
        auth: true,
        timeout: 10000
      });
    } catch (error) {
      if (error.status === 404) {
        throw new Error('Prediksi tidak ditemukan');
      } else if (error.status === 401) {
        throw new Error('Akses ditolak');
      }
      throw error;
    }
  }

  async getUserProfile() {
    try {
      return await this.request('/api/user/profile', {
        method: 'GET',
        auth: true,
        timeout: 10000
      });
    } catch (error) {
      if (error.status === 401) {
        throw new Error('Silakan login untuk melihat profil');
      }
      throw error;
    }
  }

  async updateUserProfile(profileData) {
    try {
      return await this.request('/api/user/profile', {
        method: 'PUT',
        auth: true,
        body: JSON.stringify(profileData),
        timeout: 15000
      });
    } catch (error) {
      if (error.status === 400) {
        if (error.message.includes('Username')) {
          throw new Error('Username sudah digunakan');
        } else if (error.message.includes('Email')) {
          throw new Error('Email sudah terdaftar');
        }
      }
      throw error;
    }
  }

  async deleteAccount(passwordData) {
    try {
      return await this.request('/api/user/account', {
        method: 'DELETE',
        auth: true,
        body: JSON.stringify(passwordData),
        timeout: 15000
      });
    } catch (error) {
      if (error.status === 401) {
        throw new Error('Password salah');
      }
      throw error;
    }
  }
  async getAllUsers(params = {}) {
    try {
      const searchParams = new URLSearchParams(params);
      return await this.request(`/api/admin/users?${searchParams}`, {
        method: 'GET',
        auth: true,
        timeout: 15000
      });
    } catch (error) {
      if (error.status === 403) {
        throw new Error('Admin access required');
      }
      throw error;
    }
  }

  async getUserById(id) {
    try {
      return await this.request(`/api/admin/users/${id}`, {
        method: 'GET',
        auth: true,
        timeout: 10000
      });
    } catch (error) {
      if (error.status === 403) {
        throw new Error('Admin access required');
      } else if (error.status === 404) {
        throw new Error('User not found');
      }
      throw error;
    }
  }

  async updateUser(id, userData) {
    try {
      return await this.request(`/api/admin/users/${id}`, {
        method: 'PUT',
        auth: true,
        body: JSON.stringify(userData),
        timeout: 15000
      });
    } catch (error) {
      if (error.status === 403) {
        throw new Error('Admin access required');
      } else if (error.status === 404) {
        throw new Error('User not found');
      }
      throw error;
    }
  }

  async deleteUser(id) {
    try {
      return await this.request(`/api/admin/users/${id}`, {
        method: 'DELETE',
        auth: true,
        timeout: 10000
      });
    } catch (error) {
      if (error.status === 403) {
        throw new Error('Admin access required');
      } else if (error.status === 404) {
        throw new Error('User not found');
      }
      throw error;
    }
  }

  async getPredictionStats() {
    try {
      return await this.request('/api/predictions/stats', {
        method: 'GET',
        auth: true,
        timeout: 15000
      });
    } catch (error) {
      if (error.status === 403) {
        throw new Error('Admin access required');
      }
      throw error;
    }
  }

  async getAllPredictions(params = {}) {
    try {
      const searchParams = new URLSearchParams(params);
      return await this.request(`/api/admin/predictions?${searchParams}`, {
        method: 'GET',
        auth: true,
        timeout: 15000
      });
    } catch (error) {
      if (error.status === 403) {
        throw new Error('Admin access required');
      }
      throw error;
    }
  }

  async getHealthStatus() {
    try {
      return await this.request('/health', {
        method: 'GET',
        timeout: 8000
      });
    } catch (error) {
      throw new Error('Server tidak merespons');
    }
  }

  async getModelHealth() {
    try {
      return await this.request('/api/model/health', {
        method: 'GET',
        timeout: 8000
      });
    } catch (error) {
      throw new Error('Model AI tidak tersedia');
    }
  }


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

  // Connection test method
  async testConnection() {
    try {
      const start = Date.now();
      await this.getHealthStatus();
      const latency = Date.now() - start;
      return { status: 'connected', latency };
    } catch (error) {
      return { status: 'disconnected', error: error.message };
    }
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;