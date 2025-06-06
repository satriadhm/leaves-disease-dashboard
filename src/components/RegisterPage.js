// src/components/RegisterPage.js
import authManager from '../utils/auth.js';

export default class RegisterPage {
  constructor() {
    this.formData = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: ""
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
            <h2>Buat Akun Baru</h2>
            <p class="auth-subtitle">Bergabunglah untuk mengakses fitur deteksi penyakit tanaman</p>
          </div>
          
          <form class="auth-form" id="registerForm">
            <div class="form-row">
              <div class="form-group">
                <label for="firstName">Nama Depan</label>
                <div class="input-group">
                  <span class="input-icon">👤</span>
                  <input 
                    type="text" 
                    id="firstName" 
                    name="firstName" 
                    placeholder="Nama depan"
                    autocomplete="given-name"
                  >
                </div>
                <span class="error-message" id="firstNameError"></span>
              </div>
              
              <div class="form-group">
                <label for="lastName">Nama Belakang</label>
                <div class="input-group">
                  <span class="input-icon">👤</span>
                  <input 
                    type="text" 
                    id="lastName" 
                    name="lastName" 
                    placeholder="Nama belakang"
                    autocomplete="family-name"
                  >
                </div>
                <span class="error-message" id="lastNameError"></span>
              </div>
            </div>
            
            <div class="form-group">
              <label for="username">Username *</label>
              <div class="input-group">
                <span class="input-icon">@</span>
                <input 
                  type="text" 
                  id="username" 
                  name="username" 
                  placeholder="Masukkan username"
                  required 
                  autocomplete="username"
                >
              </div>
              <span class="error-message" id="usernameError"></span>
              <span class="field-hint">Minimal 3 karakter, hanya huruf, angka, dan underscore</span>
            </div>
            
            <div class="form-group">
              <label for="email">Email *</label>
              <div class="input-group">
                <span class="input-icon">📧</span>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="nama@email.com"
                  required 
                  autocomplete="email"
                >
              </div>
              <span class="error-message" id="emailError"></span>
            </div>
            
            <div class="form-group">
              <label for="password">Password *</label>
              <div class="input-group">
                <span class="input-icon">🔒</span>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  placeholder="Buat password"
                  required 
                  autocomplete="new-password"
                >
                <button type="button" class="password-toggle" id="passwordToggle">
                  <span class="password-toggle-icon">👁️</span>
                </button>
              </div>
              <span class="error-message" id="passwordError"></span>
              <div class="password-strength" id="passwordStrength">
                <div class="strength-bar">
                  <div class="strength-fill"></div>
                </div>
                <span class="strength-text">Minimal 6 karakter</span>
              </div>
            </div>
            
            <div class="form-group">
              <label for="confirmPassword">Konfirmasi Password *</label>
              <div class="input-group">
                <span class="input-icon">🔒</span>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  placeholder="Ulangi password"
                  required 
                  autocomplete="new-password"
                >
                <button type="button" class="password-toggle" id="confirmPasswordToggle">
                  <span class="password-toggle-icon">👁️</span>
                </button>
              </div>
              <span class="error-message" id="confirmPasswordError"></span>
            </div>
            
            <div class="form-group">
              <label class="checkbox-container">
                <input type="checkbox" id="agreeTerms" name="agreeTerms" required>
                <span class="checkmark"></span>
                Saya setuju dengan <a href="#" class="link" id="termsLink">Syarat & Ketentuan</a> dan <a href="#" class="link" id="privacyLink">Kebijakan Privasi</a>
              </label>
              <span class="error-message" id="termsError"></span>
            </div>
            
            <button type="submit" class="btn btn-primary" id="registerBtn" ${this.isLoading ? 'disabled' : ''}>
              ${this.isLoading ? 
                '<span class="btn-spinner"></span> Mendaftar...' : 
                'Daftar Sekarang'
              }
            </button>
          </form>
          
          <div class="auth-footer">
            <p>Sudah punya akun? <a href="/login" class="link">Masuk di sini</a></p>
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
    this.setupPasswordToggles();
    this.setupPasswordStrength();
    this.setupRealTimeValidation();
  }

  bindEvents() {
    const form = document.getElementById('registerForm');
    const loginLink = document.querySelector('a[href="/login"]');
    const termsLink = document.getElementById('termsLink');
    const privacyLink = document.getElementById('privacyLink');

    form.addEventListener('submit', (e) => this.handleSubmit(e));
    loginLink.addEventListener('click', (e) => this.handleNavigation(e, '/login'));
    termsLink.addEventListener('click', (e) => this.handleTermsClick(e));
    privacyLink.addEventListener('click', (e) => this.handlePrivacyClick(e));
  }

  setupPasswordToggles() {
    const toggles = [
      { toggle: 'passwordToggle', input: 'password' },
      { toggle: 'confirmPasswordToggle', input: 'confirmPassword' }
    ];

    toggles.forEach(({ toggle, input }) => {
      const toggleElement = document.getElementById(toggle);
      const inputElement = document.getElementById(input);
      
      toggleElement.addEventListener('click', () => {
        const type = inputElement.getAttribute('type');
        const icon = toggleElement.querySelector('.password-toggle-icon');
        
        if (type === 'password') {
          inputElement.setAttribute('type', 'text');
          icon.textContent = '🙈';
        } else {
          inputElement.setAttribute('type', 'password');
          icon.textContent = '👁️';
        }
      });
    });
  }

  setupPasswordStrength() {
    const passwordInput = document.getElementById('password');
    const strengthElement = document.getElementById('passwordStrength');
    const strengthFill = strengthElement.querySelector('.strength-fill');
    const strengthText = strengthElement.querySelector('.strength-text');

    passwordInput.addEventListener('input', (e) => {
      const password = e.target.value;
      const strength = this.calculatePasswordStrength(password);
      
      strengthFill.style.width = `${strength.percentage}%`;
      strengthFill.className = `strength-fill strength-${strength.level}`;
      strengthText.textContent = strength.text;
    });
  }

  calculatePasswordStrength(password) {
    if (!password) {
      return { percentage: 0, level: 'weak', text: 'Minimal 6 karakter' };
    }

    let score = 0;
    let feedback = [];

    // Length
    if (password.length >= 6) score += 20;
    if (password.length >= 8) score += 10;
    if (password.length >= 12) score += 10;

    // Character types
    if (/[a-z]/.test(password)) score += 15;
    if (/[A-Z]/.test(password)) score += 15;
    if (/[0-9]/.test(password)) score += 15;
    if (/[^A-Za-z0-9]/.test(password)) score += 15;

    let level, text;
    if (score < 30) {
      level = 'weak';
      text = 'Password lemah';
    } else if (score < 60) {
      level = 'medium';
      text = 'Password sedang';
    } else if (score < 80) {
      level = 'strong';
      text = 'Password kuat';
    } else {
      level = 'very-strong';
      text = 'Password sangat kuat';
    }

    return { percentage: Math.min(score, 100), level, text };
  }

  setupRealTimeValidation() {
    const fields = ['username', 'email', 'password', 'confirmPassword'];
    
    fields.forEach(field => {
      const input = document.getElementById(field);
      input.addEventListener('blur', () => this.validateField(field));
      input.addEventListener('input', () => this.clearFieldError(field));
    });

    // Special handling for confirm password
    const confirmPassword = document.getElementById('confirmPassword');
    confirmPassword.addEventListener('input', () => {
      const password = document.getElementById('password').value;
      const confirm = confirmPassword.value;
      
      if (confirm && password !== confirm) {
        this.showFieldError('confirmPasswordError', 'Password tidak cocok');
      } else {
        this.clearFieldError('confirmPassword');
      }
    });
  }

  validateField(fieldName) {
    const input = document.getElementById(fieldName);
    const value = input.value.trim();

    switch (fieldName) {
      case 'username':
        if (!value) {
          this.showFieldError('usernameError', 'Username harus diisi');
        } else if (value.length < 3) {
          this.showFieldError('usernameError', 'Username minimal 3 karakter');
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          this.showFieldError('usernameError', 'Username hanya boleh huruf, angka, dan underscore');
        }
        break;

      case 'email':
        if (!value) {
          this.showFieldError('emailError', 'Email harus diisi');
        } else if (!this.isValidEmail(value)) {
          this.showFieldError('emailError', 'Format email tidak valid');
        }
        break;

      case 'password':
        if (!value) {
          this.showFieldError('passwordError', 'Password harus diisi');
        } else if (value.length < 6) {
          this.showFieldError('passwordError', 'Password minimal 6 karakter');
        }
        break;

      case 'confirmPassword':
        const password = document.getElementById('password').value;
        if (!value) {
          this.showFieldError('confirmPasswordError', 'Konfirmasi password harus diisi');
        } else if (password !== value) {
          this.showFieldError('confirmPasswordError', 'Password tidak cocok');
        }
        break;
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    if (this.isLoading) return;
    
    const formData = new FormData(e.target);
    const data = {
      username: formData.get('username').trim(),
      email: formData.get('email').trim(),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
      firstName: formData.get('firstName').trim(),
      lastName: formData.get('lastName').trim(),
      agreeTerms: formData.get('agreeTerms')
    };

    if (this.validateForm(data)) {
      await this.register(data);
    }
  }

  validateForm(data) {
    let isValid = true;

    // Clear previous errors
    this.clearAllErrors();

    // Username validation
    if (!data.username) {
      this.showFieldError('usernameError', 'Username harus diisi');
      isValid = false;
    } else if (data.username.length < 3) {
      this.showFieldError('usernameError', 'Username minimal 3 karakter');
      isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
      this.showFieldError('usernameError', 'Username hanya boleh huruf, angka, dan underscore');
      isValid = false;
    }

    // Email validation
    if (!data.email) {
      this.showFieldError('emailError', 'Email harus diisi');
      isValid = false;
    } else if (!this.isValidEmail(data.email)) {
      this.showFieldError('emailError', 'Format email tidak valid');
      isValid = false;
    }

    // Password validation
    if (!data.password) {
      this.showFieldError('passwordError', 'Password harus diisi');
      isValid = false;
    } else if (data.password.length < 6) {
      this.showFieldError('passwordError', 'Password minimal 6 karakter');
      isValid = false;
    }

    // Confirm password validation
    if (!data.confirmPassword) {
      this.showFieldError('confirmPasswordError', 'Konfirmasi password harus diisi');
      isValid = false;
    } else if (data.password !== data.confirmPassword) {
      this.showFieldError('confirmPasswordError', 'Password tidak cocok');
      isValid = false;
    }

    // Terms validation
    if (!data.agreeTerms) {
      this.showFieldError('termsError', 'Anda harus menyetujui syarat dan ketentuan');
      isValid = false;
    }

    return isValid;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  clearAllErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => element.textContent = '');
  }

  clearFieldError(fieldName) {
    const errorElement = document.getElementById(`${fieldName}Error`);
    if (errorElement) {
      errorElement.textContent = '';
    }
  }

  showFieldError(fieldId, message) {
    const errorElement = document.getElementById(fieldId);
    if (errorElement) {
      errorElement.textContent = message;
    }
  }

  async register(data) {
    try {
      this.setLoadingState(true);
      
      window.dispatchEvent(new CustomEvent('showLoading', {
        detail: { message: 'Membuat akun...' }
      }));

      const userData = {
        username: data.username,
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName
      };

      await authManager.register(userData);
      
      window.dispatchEvent(new CustomEvent('hideLoading'));
      window.dispatchEvent(new CustomEvent('showSuccess', {
        detail: 'Akun berhasil dibuat! Silakan login dengan akun baru Anda.'
      }));

      // Navigate to login page
      setTimeout(() => {
        this.handleNavigation(null, '/login');
      }, 2000);

    } catch (error) {
      window.dispatchEvent(new CustomEvent('hideLoading'));
      this.setLoadingState(false);
      
      let errorMessage = 'Terjadi kesalahan saat membuat akun';
      
      if (error.message.includes('Username') && error.message.includes('exists')) {
        errorMessage = 'Username sudah digunakan';
        this.showFieldError('usernameError', errorMessage);
      } else if (error.message.includes('Email') && error.message.includes('exists')) {
        errorMessage = 'Email sudah terdaftar';
        this.showFieldError('emailError', errorMessage);
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
    const registerBtn = document.getElementById('registerBtn');
    const form = document.getElementById('registerForm');
    
    if (loading) {
      registerBtn.disabled = true;
      registerBtn.innerHTML = '<span class="btn-spinner"></span> Mendaftar...';
      form.classList.add('loading');
    } else {
      registerBtn.disabled = false;
      registerBtn.innerHTML = 'Daftar Sekarang';
      form.classList.remove('loading');
    }
  }

  handleTermsClick(e) {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('showInfo', {
      detail: 'Dengan menggunakan layanan ini, Anda setuju untuk menggunakan aplikasi sesuai dengan ketentuan yang berlaku.'
    }));
  }

  handlePrivacyClick(e) {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('showInfo', {
      detail: 'Kami melindungi privasi data Anda. Data yang dikumpulkan hanya digunakan untuk meningkatkan layanan deteksi penyakit tanaman.'
    }));
  }

  handleNavigation(e, path) {
    if (e) e.preventDefault();
    window.dispatchEvent(new CustomEvent('navigate', { detail: path }));
  }
}