// src/components/HomePage.js
import CameraCapture from "./CameraCapture.js";
import FileUpload from "./FileUpload.js";
import authManager from '../utils/auth.js';

export default class HomePage {
  constructor() {
    this.user = authManager.getCurrentUser() || {};
    this.activeTab = "upload"; // Default to upload tab
    this.lastPredictionResult = null;
  }

  render() {
    const isAuthenticated = authManager.isAuthenticated();
    const userName = this.user.username || 'Guest';

    return `
      <div class="home-container">
        <header class="header">
          <div class="header-content">
            <div class="header-left">
              <div class="logo">
                <span class="logo-icon">🌱</span>
                <h1>Plant Disease Detection</h1>
              </div>
            </div>
            <div class="header-right">
              ${isAuthenticated ? `
                <div class="user-menu">
                  <div class="user-info">
                    <div class="user-avatar">
                      ${userName.charAt(0).toUpperCase()}
                    </div>
                    <div class="user-details">
                      <span class="user-name">Halo, ${userName}</span>
                      <span class="user-role">${this.getUserRole()}</span>
                    </div>
                  </div>
                  <div class="user-actions">
                    <button class="btn btn-secondary" id="historyBtn" title="Riwayat Prediksi">
                      📊 Riwayat
                    </button>
                    ${authManager.isAdmin() ? `
                      <button class="btn btn-secondary" id="dashboardBtn" title="Dashboard Admin">
                        ⚙️ Dashboard
                      </button>
                    ` : ''}
                    <button class="btn btn-secondary" id="profileBtn" title="Profil">
                      👤 Profil
                    </button>
                    <button class="btn btn-outline" id="logoutBtn" title="Keluar">
                      🚪 Keluar
                    </button>
                  </div>
                </div>
              ` : `
                <div class="auth-buttons">
                  <a href="/login" class="btn btn-outline">Masuk</a>
                  <a href="/register" class="btn btn-primary">Daftar</a>
                </div>
              `}
            </div>
          </div>
        </header>

        <main class="main-content">
          <div class="welcome-section">
            <div class="welcome-content">
              <h2>🔬 Deteksi Penyakit Tanaman dengan AI</h2>
              <p class="welcome-subtitle">
                Dapatkan diagnosis akurat untuk tanaman cabai, jagung, padi, dan tomat 
                menggunakan teknologi kecerdasan buatan terdepan
              </p>
              <div class="welcome-features">
                <div class="feature-item">
                  <span class="feature-icon">⚡</span>
                  <span class="feature-text">Analisis Cepat</span>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">🎯</span>
                  <span class="feature-text">Akurasi Tinggi</span>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">🌍</span>
                  <span class="feature-text">Mudah Digunakan</span>
                </div>
              </div>
            </div>
            <div class="welcome-image">
              <div class="plant-illustration">
                <div class="plant-container">
                  <div class="plant-pot"></div>
                  <div class="plant-stem"></div>
                  <div class="plant-leaves">
                    <div class="leaf leaf-1">🍃</div>
                    <div class="leaf leaf-2">🍃</div>
                    <div class="leaf leaf-3">🍃</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="detection-section">
            <div class="section-header">
              <h3>📸 Pilih Metode Deteksi</h3>
              <p>Upload foto atau gunakan kamera untuk analisis langsung</p>
            </div>

            <div class="tab-navigation">
              <button class="tab-btn ${this.activeTab === 'upload' ? 'active' : ''}" 
                      data-tab="upload">
                <span class="tab-icon">📁</span>
                <span class="tab-text">Upload File</span>
                <span class="tab-desc">Pilih gambar dari perangkat</span>
              </button>
              <button class="tab-btn ${this.activeTab === 'camera' ? 'active' : ''}" 
                      data-tab="camera">
                <span class="tab-icon">📷</span>
                <span class="tab-text">Kamera</span>
                <span class="tab-desc">Ambil foto langsung</span>
              </button>
            </div>

            <div class="tab-content">
              <div class="tab-panel ${this.activeTab === 'upload' ? 'active' : ''}" 
                   id="uploadPanel">
                <div id="uploadComponent"></div>
              </div>
              <div class="tab-panel ${this.activeTab === 'camera' ? 'active' : ''}" 
                   id="cameraPanel">
                <div id="cameraComponent"></div>
              </div>
            </div>
          </div>

          <div class="results-section ${this.lastPredictionResult ? '' : 'hidden'}" 
               id="resultsSection">
            <div class="section-header">
              <h3>🔬 Hasil Analisis</h3>
              <p>Berikut adalah hasil deteksi penyakit tanaman Anda</p>
            </div>
            <div class="result-container" id="resultContainer">
              <!-- Results will be displayed here -->
            </div>
          </div>

          <div class="info-section">
            <div class="info-grid">
              <div class="info-card">
                <div class="info-icon">🌱</div>
                <h4>Tanaman yang Didukung</h4>
                <p>Cabai, Jagung, Padi, Tomat dengan berbagai jenis penyakit</p>
                <ul class="info-list">
                  <li>🌶️ Cabai: Leaf Curl, Leaf Spot, Whitefly</li>
                  <li>🌽 Jagung: Common Rust, Gray Leaf Spot, Northern Leaf Blight</li>
                  <li>🌾 Padi: Brown Spot, Leaf Blast, Neck Blast</li>
                  <li>🍅 Tomat: Early Blight, Late Blight, Yellow Leaf Curl Virus</li>
                </ul>
              </div>
              
              <div class="info-card">
                <div class="info-icon">📋</div>
                <h4>Tips Foto yang Baik</h4>
                <p>Ikuti panduan ini untuk hasil deteksi yang optimal</p>
                <ul class="info-list">
                  <li>📸 Foto daun yang jelas dan fokus</li>
                  <li>💡 Pencahayaan yang cukup</li>
                  <li>📐 Posisi tegak lurus dengan daun</li>
                  <li>🎯 Fokus pada area yang bermasalah</li>
                  <li>📏 Jarak sekitar 10-20 cm dari daun</li>
                </ul>
              </div>
              
              <div class="info-card">
                <div class="info-icon">⚡</div>
                <h4>Teknologi AI</h4>
                <p>Menggunakan deep learning untuk analisis yang akurat</p>
                <ul class="info-list">
                  <li>🧠 Convolutional Neural Network (CNN)</li>
                  <li>📊 Trained dengan ribuan data gambar</li>
                  <li>🎯 Akurasi tinggi dalam deteksi</li>
                  <li>⚡ Analisis dalam hitungan detik</li>
                  <li>🔄 Model terus diperbaharui</li>
                </ul>
              </div>
            </div>
          </div>
        </main>

        <!-- Mobile Navigation -->
        <div class="mobile-nav">
          <button class="mobile-nav-btn" data-tab="upload">
            <span class="nav-icon">📁</span>
            <span class="nav-text">Upload</span>
          </button>
          <button class="mobile-nav-btn" data-tab="camera">
            <span class="nav-icon">📷</span>
            <span class="nav-text">Kamera</span>
          </button>
          ${isAuthenticated ? `
            <button class="mobile-nav-btn" id="mobileHistoryBtn">
              <span class="nav-icon">📊</span>
              <span class="nav-text">Riwayat</span>
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }

  getUserRole() {
    if (authManager.isAdmin()) return 'Administrator';
    if (authManager.isModerator()) return 'Moderator';
    return 'User';
  }

  afterRender() {
    this.bindEvents();
    this.initializeComponents();
    this.bindAuthStateListener();
    
    // Show last prediction result if available
    if (this.lastPredictionResult) {
      this.displayPredictionResult(this.lastPredictionResult);
    }
  }

  bindEvents() {
    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn, .mobile-nav-btn[data-tab]');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => this.handleTabSwitch(e));
    });

    // Navigation buttons
    const logoutBtn = document.getElementById('logoutBtn');
    const historyBtn = document.getElementById('historyBtn');
    const mobileHistoryBtn = document.getElementById('mobileHistoryBtn');
    const dashboardBtn = document.getElementById('dashboardBtn');
    const profileBtn = document.getElementById('profileBtn');

    logoutBtn?.addEventListener('click', () => this.handleLogout());
    historyBtn?.addEventListener('click', () => this.navigateToHistory());
    mobileHistoryBtn?.addEventListener('click', () => this.navigateToHistory());
    dashboardBtn?.addEventListener('click', () => this.navigateToDashboard());
    profileBtn?.addEventListener('click', () => this.navigateToProfile());

    // Auth buttons for non-authenticated users
    const authButtons = document.querySelectorAll('.auth-buttons a');
    authButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const path = e.target.getAttribute('href');
        window.dispatchEvent(new CustomEvent('navigate', { detail: path }));
      });
    });

    // Listen for detection results
    window.addEventListener('detectionResult', (e) => this.handleDetectionResult(e));
  }

  bindAuthStateListener() {
    window.addEventListener('authStateChanged', (e) => {
      const { isAuthenticated, user } = e.detail;
      if (isAuthenticated) {
        this.user = user;
      } else {
        this.user = {};
      }
      // Re-render to update UI
      this.updateHeaderAuth();
    });
  }

  updateHeaderAuth() {
    // Update header without full re-render
    const headerRight = document.querySelector('.header-right');
    if (headerRight) {
      const isAuthenticated = authManager.isAuthenticated();
      const userName = this.user.username || 'Guest';

      if (isAuthenticated) {
        headerRight.innerHTML = `
          <div class="user-menu">
            <div class="user-info">
              <div class="user-avatar">
                ${userName.charAt(0).toUpperCase()}
              </div>
              <div class="user-details">
                <span class="user-name">Halo, ${userName}</span>
                <span class="user-role">${this.getUserRole()}</span>
              </div>
            </div>
            <div class="user-actions">
              <button class="btn btn-secondary" id="historyBtn" title="Riwayat Prediksi">
                📊 Riwayat
              </button>
              ${authManager.isAdmin() ? `
                <button class="btn btn-secondary" id="dashboardBtn" title="Dashboard Admin">
                  ⚙️ Dashboard
                </button>
              ` : ''}
              <button class="btn btn-secondary" id="profileBtn" title="Profil">
                👤 Profil
              </button>
              <button class="btn btn-outline" id="logoutBtn" title="Keluar">
                🚪 Keluar
              </button>
            </div>
          </div>
        `;
      } else {
        headerRight.innerHTML = `
          <div class="auth-buttons">
            <a href="/login" class="btn btn-outline">Masuk</a>
            <a href="/register" class="btn btn-primary">Daftar</a>
          </div>
        `;
      }
      
      // Re-bind events for new elements
      this.bindEvents();
    }
  }

  initializeComponents() {
    // Initialize upload component
    const uploadComponent = new FileUpload();
    const uploadContainer = document.getElementById('uploadComponent');
    if (uploadContainer) {
      uploadContainer.innerHTML = uploadComponent.render();
      uploadComponent.afterRender();
    }

    // Initialize camera component
    const cameraComponent = new CameraCapture();
    const cameraContainer = document.getElementById('cameraComponent');
    if (cameraContainer) {
      cameraContainer.innerHTML = cameraComponent.render();
      cameraComponent.afterRender();
    }
  }

  handleTabSwitch(e) {
    const tab = e.target.closest('[data-tab]').dataset.tab;
    if (tab === this.activeTab) return;

    this.activeTab = tab;

    // Update tab buttons
    document.querySelectorAll('.tab-btn, .mobile-nav-btn[data-tab]').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelectorAll(`[data-tab="${tab}"]`).forEach(btn => {
      btn.classList.add('active');
    });

    // Update tab panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.remove('active');
    });
    const targetPanel = document.getElementById(tab + 'Panel');
    if (targetPanel) {
      targetPanel.classList.add('active');
    }

    // Stop camera if switching away from camera tab
    if (tab !== 'camera') {
      window.dispatchEvent(new CustomEvent('stopCamera'));
    }
  }

  handleDetectionResult(e) {
    const result = e.detail;
    this.lastPredictionResult = result;
    this.displayPredictionResult(result);
  }

  displayPredictionResult(result) {
    const resultsSection = document.getElementById('resultsSection');
    const resultContainer = document.getElementById('resultContainer');

    if (!resultsSection || !resultContainer) return;

    const isHealthy = result.disease === null || 
                     (result.disease && result.disease.toLowerCase().includes('healthy'));
    
    const diseaseDisplay = result.disease || 'Tidak terdeteksi penyakit';
    const confidence = Math.round(result.confidence || 0);
    const recommendation = result.recommendation || 'Tidak ada rekomendasi khusus';

    resultContainer.innerHTML = `
      <div class="result-card">
        <div class="result-image">
          <img src="${result.imageUrl}" alt="Analyzed plant" />
          <div class="result-overlay">
            <div class="confidence-badge ${this.getConfidenceClass(confidence)}">
              ${confidence}% Confidence
            </div>
          </div>
        </div>
        
        <div class="result-info">
          <div class="result-header">
            <div class="disease-status ${isHealthy ? 'healthy' : 'diseased'}">
              <span class="status-icon">${isHealthy ? '🌱' : '🦠'}</span>
              <span class="status-text">${isHealthy ? 'Tanaman Sehat' : 'Penyakit Terdeteksi'}</span>
            </div>
          </div>
          
          <div class="result-details">
            <div class="detail-item">
              <span class="detail-label">Diagnosis:</span>
              <span class="detail-value ${isHealthy ? 'healthy-text' : 'disease-text'}">
                ${this.formatDiseaseName(diseaseDisplay)}
              </span>
            </div>
            
            <div class="detail-item">
              <span class="detail-label">Tingkat Kepercayaan:</span>
              <span class="detail-value">
                <div class="confidence-bar">
                  <div class="confidence-fill ${this.getConfidenceClass(confidence)}" 
                       style="width: ${confidence}%"></div>
                </div>
                <span class="confidence-text">${confidence}%</span>
              </span>
            </div>
            
            <div class="detail-item recommendation">
              <span class="detail-label">💡 Rekomendasi:</span>
              <span class="detail-value">${recommendation}</span>
            </div>
          </div>
          
          <div class="result-actions">
            <button class="btn btn-primary" id="saveResultBtn">
              💾 Simpan Hasil
            </button>
            <button class="btn btn-secondary" id="shareResultBtn">
              📤 Bagikan
            </button>
            <button class="btn btn-outline" id="newAnalysisBtn">
              🔄 Analisis Baru
            </button>
          </div>
        </div>
      </div>
    `;

    // Show results section
    resultsSection.classList.remove('hidden');
    
    // Scroll to results
    resultsSection.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });

    // Bind result action events
    this.bindResultActions();
  }

  bindResultActions() {
    const saveBtn = document.getElementById('saveResultBtn');
    const shareBtn = document.getElementById('shareResultBtn');
    const newAnalysisBtn = document.getElementById('newAnalysisBtn');

    saveBtn?.addEventListener('click', () => this.saveResult());
    shareBtn?.addEventListener('click', () => this.shareResult());
    newAnalysisBtn?.addEventListener('click', () => this.startNewAnalysis());
  }

  formatDiseaseName(disease) {
    if (!disease) return 'Tidak terdeteksi';
    
    return disease
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .trim();
  }

  getConfidenceClass(confidence) {
    if (confidence >= 80) return 'high';
    if (confidence >= 60) return 'medium';
    return 'low';
  }

  async saveResult() {
    if (!authManager.isAuthenticated()) {
      window.dispatchEvent(new CustomEvent('showInfo', {
        detail: 'Silakan login untuk menyimpan hasil prediksi'
      }));
      return;
    }

    try {
      window.dispatchEvent(new CustomEvent('showSuccess', {
        detail: 'Hasil prediksi tersimpan otomatis dalam riwayat Anda!'
      }));
    } catch (error) {
      window.dispatchEvent(new CustomEvent('showError', {
        detail: 'Gagal menyimpan hasil'
      }));
    }
  }

  shareResult() {
    if (navigator.share && this.lastPredictionResult) {
      const result = this.lastPredictionResult;
      const diseaseDisplay = this.formatDiseaseName(result.disease || 'Sehat');
      
      navigator.share({
        title: 'Hasil Deteksi Penyakit Tanaman',
        text: `Hasil analisis: ${diseaseDisplay} dengan confidence ${Math.round(result.confidence)}%`,
        url: window.location.href
      }).catch(() => {
        this.fallbackShare();
      });
    } else {
      this.fallbackShare();
    }
  }

  fallbackShare() {
    const result = this.lastPredictionResult;
    if (!result) return;

    const diseaseDisplay = this.formatDiseaseName(result.disease || 'Sehat');
    const text = `Hasil deteksi penyakit tanaman: ${diseaseDisplay} (${Math.round(result.confidence)}% confidence)`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        window.dispatchEvent(new CustomEvent('showSuccess', {
          detail: 'Hasil berhasil disalin ke clipboard!'
        }));
      });
    } else {
      window.dispatchEvent(new CustomEvent('showInfo', {
        detail: 'Fitur share tidak tersedia di browser ini'
      }));
    }
  }

  startNewAnalysis() {
    // Hide results
    const resultsSection = document.getElementById('resultsSection');
    if (resultsSection) {
      resultsSection.classList.add('hidden');
    }
    
    // Reset last result
    this.lastPredictionResult = null;
    
    // Reset components
    window.dispatchEvent(new CustomEvent('resetComponents'));
    
    window.dispatchEvent(new CustomEvent('showInfo', {
      detail: 'Siap untuk analisis baru!'
    }));
  }

  async handleLogout() {
    const confirmed = confirm('Apakah Anda yakin ingin keluar?');
    if (!confirmed) return;

    try {
      await authManager.logout();
      
      window.dispatchEvent(new CustomEvent('showSuccess', {
        detail: 'Berhasil logout. Sampai jumpa!'
      }));
      
      // Clear any stored results
      this.lastPredictionResult = null;
      
      // Navigate to login page
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('navigate', { detail: '/login' }));
      }, 1000);
      
    } catch (error) {
      window.dispatchEvent(new CustomEvent('showError', {
        detail: 'Gagal logout, namun sesi telah dibersihkan'
      }));
      
      // Force navigation even if API call failed
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('navigate', { detail: '/login' }));
      }, 1000);
    }
  }

  navigateToHistory() {
    if (!authManager.requireAuth()) return;
    window.dispatchEvent(new CustomEvent('navigate', { detail: '/history' }));
  }

  navigateToDashboard() {
    if (!authManager.requireRole('admin')) return;
    window.dispatchEvent(new CustomEvent('navigate', { detail: '/dashboard' }));
  }

  navigateToProfile() {
    if (!authManager.requireAuth()) return;
    window.dispatchEvent(new CustomEvent('navigate', { detail: '/profile' }));
  }
}