// src/components/LoginPage.js
import authManager from '../utils/auth.js';

export default class LoginPage {
  constructor() {
    this.formData = {
      username: "",
      password: "",
    };
    this.isLoading = false;
  }

  render() {
    return `
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-header">
            <div class="logo">
              <span class="logo-icon">🌱</span>
              <h1>Plant Disease Detection</h1>
            </div>
            <h2>Masuk ke Akun Anda</h2>
            <p class="auth-subtitle">Deteksi penyakit tanaman dengan AI yang akurat</p>
          </div>
          
          <form class="auth-form" id="loginForm">
            <div class="form-group">
              <label for="username">Username atau Email</label>
              <div class="input-group">
                <span class="input-icon">👤</span>
                <input 
                  type="text" 
                  id="username" 
                  name="username" 
                  placeholder="Masukkan username atau email"
                  required 
                  autocomplete="username"
                >
              </div>
              <span class="error-message" id="usernameError"></span>
            </div>
            
            <div class="form-group">
              <label for="password">Password</label>
              <div class="input-group">
                <span class="input-icon">🔒</span>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  placeholder="Masukkan password"
                  required 
                  autocomplete="current-password"
                >
                <button type="button" class="password-toggle" id="passwordToggle">
                  <span class="password-toggle-icon">👁️</span>
                </button>
              </div>
              <span class="error-message" id="passwordError"></span>
            </div>
            
            <div class="form-options">
              <label class="checkbox-container">
                <input type="checkbox" id="rememberMe" name="rememberMe">
                <span class="checkmark"></span>
                Ingat saya
              </label>
              <a href="#" class="forgot-link" id="forgotPassword">Lupa password?</a>
            </div>
            
            <button type="submit" class="btn btn-primary" id="loginBtn" ${this.isLoading ? 'disabled' : ''}>
              ${this.isLoading ? 
                '<span class="btn-spinner"></span> Masuk...' : 
                'Masuk'
              }
            </button>
          </form>
          
          <div class="auth-divider">
            <span>atau</span>
          </div>
          
          <div class="demo-credentials">
            <h4>Demo Credentials:</h4>
            <div class="demo-accounts">
              <div class="demo-account">
                <strong>Admin:</strong> admin / adminpassword
                <button class="btn-demo" data-username="admin" data-password="adminpassword">Coba</button>
              </div>
              <div class="demo-account">
                <strong>User:</strong> testuser / userpassword  
                <button class="btn-demo" data-username="testuser" data-password="userpassword">Coba</button>
              </div>
            </div>
          </div>
          
          <div class="auth-footer">
            <p>Belum punya akun? <a href="/register" class="link">Daftar di sini</a></p>
          </div>
        </div>
        
        <div class="auth-background">
          <div class="bg-shape bg-shape-1"></div>
          <div class="bg-shape bg-shape-2"></div>
          <div class="bg-shape bg-shape-3"></div>
        </div>
      </div>
    `;
  }

  afterRender() {
    // Check if already authenticated
    if (authManager.redirectIfAuthenticated()) {
      return;
    }

    this.bindEvents();
    this.setupDemoCredentials();
    this.setupPasswordToggle();
  }

  bindEvents() {
    const form = document.getElementById('loginForm');
    const registerLink = document.querySelector('a[href="/register"]');
    const forgotLink = document.getElementById('forgotPassword');

    form.addEventListener('submit', (e) => this.handleSubmit(e));
    registerLink.addEventListener('click', (e) => this.handleNavigation(e, '/register'));
    forgotLink.addEventListener('click', (e) => this.handleForgotPassword(e));
  }

  setupDemoCredentials() {
    const demoButtons = document.querySelectorAll('.btn-demo');
    demoButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const username = e.target.dataset.username;
        const password = e.target.dataset.password;
        
        document.getElementById('username').value = username;
        document.getElementById('password').value = password;
        
        // Auto submit after a short delay
        setTimeout(() => {
          document.getElementById('loginForm').dispatchEvent(new Event('submit'));
        }, 300);
      });
    });
  }

  setupPasswordToggle() {
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('password');
    
    passwordToggle.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type');
      const icon = passwordToggle.querySelector('.password-toggle-icon');
      
      if (type === 'password') {
        passwordInput.setAttribute('type', 'text');
        icon.textContent = '🙈';
      } else {
        passwordInput.setAttribute('type', 'password');
        icon.textContent = '👁️';
      }
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    if (this.isLoading) return;
    
    const formData = new FormData(e.target);
    const username = formData.get('username').trim();
    const password = formData.get('password');

    if (this.validateForm(username, password)) {
      await this.login(username, password);
    }
  }

  validateForm(username, password) {
    let isValid = true;

    // Clear previous errors
    this.clearErrors();

    if (!username) {
      this.showFieldError('usernameError', 'Username atau email harus diisi');
      isValid = false;
    } else if (username.length < 3) {
      this.showFieldError('usernameError', 'Username minimal 3 karakter');
      isValid = false;
    }

    if (!password) {
      this.showFieldError('passwordError', 'Password harus diisi');
      isValid = false;
    } else if (password.length < 6) {
      this.showFieldError('passwordError', 'Password minimal 6 karakter');
      isValid = false;
    }

    return isValid;
  }

  clearErrors() {
    document.getElementById('usernameError').textContent = '';
    document.getElementById('passwordError').textContent = '';
  }

  showFieldError(fieldId, message) {
    document.getElementById(fieldId).textContent = message;
  }

  async login(username, password) {
    try {
      this.setLoadingState(true);
      
      window.dispatchEvent(new CustomEvent('showLoading', {
        detail: { message: 'Memverifikasi kredensial...' }
      }));

      const response = await authManager.login({ username, password });
      
      window.dispatchEvent(new CustomEvent('hideLoading'));
      window.dispatchEvent(new CustomEvent('showSuccess', {
        detail: `Selamat datang, ${response.username}!`
      }));

      // Navigate to home page
      setTimeout(() => {
        this.handleNavigation(null, '/');
      }, 1000);

    } catch (error) {
      window.dispatchEvent(new CustomEvent('hideLoading'));
      this.setLoadingState(false);
      
      let errorMessage = 'Terjadi kesalahan saat login';
      
      if (error.message.includes('Invalid')) {
        errorMessage = 'Username atau password salah';
      } else if (error.message.includes('not found')) {
        errorMessage = 'Pengguna tidak ditemukan';
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = 'Koneksi bermasalah. Periksa internet Anda';
      }
      
      window.dispatchEvent(new CustomEvent('showError', {
        detail: errorMessage
      }));
    }
  }

  setLoadingState(loading) {
    this.isLoading = loading;
    const loginBtn = document.getElementById('loginBtn');
    const form = document.getElementById('loginForm');
    
    if (loading) {
      loginBtn.disabled = true;
      loginBtn.innerHTML = '<span class="btn-spinner"></span> Masuk...';
      form.classList.add('loading');
    } else {
      loginBtn.disabled = false;
      loginBtn.innerHTML = 'Masuk';
      form.classList.remove('loading');
    }
  }

  handleForgotPassword(e) {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('showInfo', {
      detail: 'Fitur reset password akan segera tersedia. Silakan hubungi admin untuk bantuan.'
    }));
  }

  handleNavigation(e, path) {
    if (e) e.preventDefault();
    window.dispatchEvent(new CustomEvent('navigate', { detail: path }));
  }
}