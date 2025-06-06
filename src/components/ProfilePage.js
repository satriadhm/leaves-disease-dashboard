// src/components/ProfilePage.js
import apiService from '../services/api.js';
import authManager from '../utils/auth.js';

export default class ProfilePage {
  constructor() {
    this.user = authManager.getCurrentUser() || {};
    this.profileData = null;
    this.isLoading = false;
    this.isEditing = false;
    this.activeTab = 'profile';
  }

  render() {
    return `
      <div class="profile-container">
        <div class="profile-header">
          <div class="header-content">
            <button class="btn btn-secondary back-btn" id="backBtn">
              ← Kembali
            </button>
            <div class="header-text">
              <h1>👤 Profil Pengguna</h1>
              <p>Kelola informasi akun dan pengaturan Anda</p>
            </div>
          </div>
        </div>

        <div class="profile-navigation">
          <div class="nav-tabs">
            <button class="tab-btn ${this.activeTab === 'profile' ? 'active' : ''}" 
                    data-tab="profile">
              👤 Profil
            </button>
            <button class="tab-btn ${this.activeTab === 'security' ? 'active' : ''}" 
                    data-tab="security">
              🔒 Keamanan
            </button>
            <button class="tab-btn ${this.activeTab === 'statistics' ? 'active' : ''}" 
                    data-tab="statistics">
              📊 Statistik
            </button>
          </div>
        </div>

        <div class="profile-content">
          <!-- Profile Tab -->
          <div class="tab-panel ${this.activeTab === 'profile' ? 'active' : ''}" 
               id="profilePanel">
            ${this.renderProfileTab()}
          </div>

          <!-- Security Tab -->
          <div class="tab-panel ${this.activeTab === 'security' ? 'active' : ''}" 
               id="securityPanel">
            ${this.renderSecurityTab()}
          </div>

          <!-- Statistics Tab -->
          <div class="tab-panel ${this.activeTab === 'statistics' ? 'active' : ''}" 
               id="statisticsPanel">
            ${this.renderStatisticsTab()}
          </div>
        </div>
      </div>
    `;
  }

  renderProfileTab() {
    if (this.isLoading) {
      return `
        <div class="loading-state">
          <div class="loading-spinner-large"></div>
          <p>Memuat data profil...</p>
        </div>
      `;
    }

    const profile = this.profileData?.profile || {};
    const userData = this.profileData || this.user;

    return `
      <div class="profile-section">
        <div class="profile-card">
          <div class="profile-avatar-section">
            <div class="avatar-container">
              <div class="user-avatar large">
                ${userData.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <button class="avatar-edit-btn" id="editAvatarBtn" title="Ganti Avatar">
                📷
              </button>
            </div>
            <div class="user-basic-info">
              <h2>${profile.firstName || ''} ${profile.lastName || ''} ${!profile.firstName && !profile.lastName ? userData.username || 'User' : ''}</h2>
              <p class="user-email">${userData.email || ''}</p>
              <div class="user-role-badge">
                ${this.getUserRoleBadge()}
              </div>
            </div>
          </div>

          <div class="profile-form-section">
            <div class="section-header">
              <h3>📝 Informasi Profil</h3>
              <button class="btn btn-outline" id="editProfileBtn">
                ${this.isEditing ? '❌ Batal' : '✏️ Edit Profil'}
              </button>
            </div>

            <form class="profile-form" id="profileForm">
              <div class="form-row">
                <div class="form-group">
                  <label for="firstName">Nama Depan</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    name="firstName" 
                    value="${profile.firstName || ''}"
                    ${this.isEditing ? '' : 'readonly'}
                    placeholder="Masukkan nama depan"
                  >
                </div>
                <div class="form-group">
                  <label for="lastName">Nama Belakang</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    name="lastName" 
                    value="${profile.lastName || ''}"
                    ${this.isEditing ? '' : 'readonly'}
                    placeholder="Masukkan nama belakang"
                  >
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="username">Username</label>
                  <input 
                    type="text" 
                    id="username" 
                    name="username" 
                    value="${userData.username || ''}"
                    ${this.isEditing ? '' : 'readonly'}
                    placeholder="Username"
                  >
                </div>
                <div class="form-group">
                  <label for="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value="${userData.email || ''}"
                    ${this.isEditing ? '' : 'readonly'}
                    placeholder="Email"
                  >
                </div>
              </div>

              <div class="form-group">
                <label for="phone">Nomor Telepon</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  value="${profile.phone || ''}"
                  ${this.isEditing ? '' : 'readonly'}
                  placeholder="Nomor telepon"
                >
              </div>

              <div class="form-group">
                <label for="address">Alamat</label>
                <textarea 
                  id="address" 
                  name="address" 
                  rows="3"
                  ${this.isEditing ? '' : 'readonly'}
                  placeholder="Alamat lengkap"
                >${profile.address || ''}</textarea>
              </div>

              ${
                this.isEditing
                  ? `
                <div class="form-actions">
                  <button type="submit" class="btn btn-primary">
                    💾 Simpan Perubahan
                  </button>
                  <button type="button" class="btn btn-secondary" id="cancelEditBtn">
                    ❌ Batal
                  </button>
                </div>
              `
                  : ''
              }
            </form>
          </div>

          <div class="profile-info-section">
            <h3>ℹ️ Informasi Akun</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">📅 Bergabung:</span>
                <span class="info-value">${this.formatDate(userData.createdAt)}</span>
              </div>
              <div class="info-item">
                <span class="info-label">🕐 Login Terakhir:</span>
                <span class="info-value">${this.formatDate(userData.lastLogin) || 'Tidak diketahui'}</span>
              </div>
              <div class="info-item">
                <span class="info-label">🏷️ Status:</span>
                <span class="info-value">
                  <span class="status-badge ${userData.status === 'active' ? 'active' : 'inactive'}">
                    ${userData.status === 'active' ? '✅ Aktif' : '❌ Tidak Aktif'}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderSecurityTab() {
    return `
      <div class="security-section">
        <div class="security-card">
          <div class="section-header">
            <h3>🔒 Ubah Password</h3>
            <p>Pastikan password Anda kuat dan unik</p>
          </div>

          <form class="security-form" id="passwordForm">
            <div class="form-group">
              <label for="currentPassword">Password Saat Ini</label>
              <div class="input-group">
                <input 
                  type="password" 
                  id="currentPassword" 
                  name="currentPassword" 
                  required
                  placeholder="Masukkan password saat ini"
                >
                <button type="button" class="password-toggle" data-target="currentPassword">
                  👁️
                </button>
              </div>
              <span class="error-message" id="currentPasswordError"></span>
            </div>

            <div class="form-group">
              <label for="newPassword">Password Baru</label>
              <div class="input-group">
                <input 
                  type="password" 
                  id="newPassword" 
                  name="newPassword" 
                  required
                  placeholder="Masukkan password baru"
                >
                <button type="button" class="password-toggle" data-target="newPassword">
                  👁️
                </button>
              </div>
              <span class="error-message" id="newPasswordError"></span>
              <div class="password-strength" id="passwordStrength">
                <div class="strength-bar">
                  <div class="strength-fill"></div>
                </div>
                <span class="strength-text">Minimal 6 karakter</span>
              </div>
            </div>

            <div class="form-group">
              <label for="confirmPassword">Konfirmasi Password Baru</label>
              <div class="input-group">
                <input 
                  type="password" 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  required
                  placeholder="Ulangi password baru"
                >
                <button type="button" class="password-toggle" data-target="confirmPassword">
                  👁️
                </button>
              </div>
              <span class="error-message" id="confirmPasswordError"></span>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary">
                🔐 Ubah Password
              </button>
            </div>
          </form>
        </div>

        <div class="security-tips">
          <h4>🛡️ Tips Keamanan:</h4>
          <ul class="tips-list">
            <li>Gunakan kombinasi huruf besar, kecil, angka, dan simbol</li>
            <li>Minimal 8 karakter untuk keamanan optimal</li>
            <li>Jangan gunakan informasi pribadi sebagai password</li>
            <li>Ganti password secara berkala</li>
            <li>Jangan bagikan password kepada orang lain</li>
          </ul>
        </div>

        <div class="danger-zone">
          <h4>⚠️ Zona Berbahaya</h4>
          <p>Tindakan berikut tidak dapat dibatalkan dan akan menghapus semua data Anda.</p>
          <button class="btn btn-danger" id="deleteAccountBtn">
            🗑️ Hapus Akun
          </button>
        </div>
      </div>
    `;
  }

  renderStatisticsTab() {
    return `
      <div class="statistics-section">
        <div class="stats-overview">
          <h3>📊 Statistik Penggunaan</h3>
          
          <div class="stats-grid" id="statsGrid">
            <div class="stat-card">
              <div class="stat-icon">📈</div>
              <div class="stat-content">
                <div class="stat-value" id="totalPredictions">-</div>
                <div class="stat-label">Total Prediksi</div>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">🌱</div>
              <div class="stat-content">
                <div class="stat-value" id="healthyCount">-</div>
                <div class="stat-label">Tanaman Sehat</div>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">🦠</div>
              <div class="stat-content">
                <div class="stat-value" id="diseasedCount">-</div>
                <div class="stat-label">Penyakit Terdeteksi</div>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">🎯</div>
              <div class="stat-content">
                <div class="stat-value" id="avgConfidence">-</div>
                <div class="stat-label">Rata-rata Confidence</div>
              </div>
            </div>
          </div>
        </div>

        <div class="recent-activity">
          <h4>🕐 Aktivitas Terbaru</h4>
          <div class="activity-list" id="activityList">
            <div class="loading-state">
              <div class="loading-spinner"></div>
              <p>Memuat aktivitas...</p>
            </div>
          </div>
        </div>

        <div class="statistics-actions">
          <button class="btn btn-primary" id="viewHistoryBtn">
            📊 Lihat Riwayat Lengkap
          </button>
          <button class="btn btn-secondary" id="exportStatsBtn">
            📥 Export Statistik
          </button>
        </div>
      </div>
    `;
  }

  getUserRoleBadge() {
    if (authManager.isAdmin()) {
      return '<span class="role-badge admin">👑 Administrator</span>';
    } else if (authManager.isModerator()) {
      return '<span class="role-badge moderator">🛡️ Moderator</span>';
    }
    return '<span class="role-badge user">👤 User</span>';
  }

  formatDate(dateString) {
    if (!dateString) {return null;}

    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Tidak valid';
    }
  }

  async afterRender() {
    if (!authManager.requireAuth()) {return;}

    this.bindEvents();
    await this.loadProfile();
    this.loadStatistics();
  }

  bindEvents() {
    // Navigation
    const backBtn = document.getElementById('backBtn');
    backBtn?.addEventListener('click', () => this.navigateBack());

    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', e => this.switchTab(e));
    });

    // Profile editing
    const editProfileBtn = document.getElementById('editProfileBtn');
    const profileForm = document.getElementById('profileForm');
    const cancelEditBtn = document.getElementById('cancelEditBtn');

    editProfileBtn?.addEventListener('click', () => this.toggleEdit());
    profileForm?.addEventListener('submit', e => this.handleProfileSubmit(e));
    cancelEditBtn?.addEventListener('click', () => this.cancelEdit());

    // Password form
    const passwordForm = document.getElementById('passwordForm');
    passwordForm?.addEventListener('submit', e => this.handlePasswordSubmit(e));

    // Password toggles
    const passwordToggles = document.querySelectorAll('.password-toggle');
    passwordToggles.forEach(toggle => {
      toggle.addEventListener('click', e => this.togglePassword(e));
    });

    // Password strength
    const newPasswordInput = document.getElementById('newPassword');
    newPasswordInput?.addEventListener('input', e => this.updatePasswordStrength(e));

    // Delete account
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    deleteAccountBtn?.addEventListener('click', () => this.handleDeleteAccount());

    // Statistics actions
    const viewHistoryBtn = document.getElementById('viewHistoryBtn');
    const exportStatsBtn = document.getElementById('exportStatsBtn');

    viewHistoryBtn?.addEventListener('click', () => this.navigateToHistory());
    exportStatsBtn?.addEventListener('click', () => this.exportStatistics());
  }

  switchTab(e) {
    const tab = e.target.dataset.tab;
    if (tab === this.activeTab) {return;}

    this.activeTab = tab;

    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    e.target.classList.add('active');

    // Update tab panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.remove('active');
    });
    const targetPanel = document.getElementById(`${tab  }Panel`);
    if (targetPanel) {
      targetPanel.classList.add('active');
    }

    // Load data for specific tabs
    if (tab === 'statistics') {
      this.loadStatistics();
    }
  }

  async loadProfile() {
    try {
      this.setLoadingState(true);

      const response = await apiService.getUserProfile();
      this.profileData = response.data;

      // Re-render profile tab
      const profilePanel = document.getElementById('profilePanel');
      if (profilePanel) {
        profilePanel.innerHTML = this.renderProfileTab();
        this.rebindProfileEvents();
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      window.dispatchEvent(
        new CustomEvent('showError', {
          detail: 'Gagal memuat data profil',
        }),
      );
    } finally {
      this.setLoadingState(false);
    }
  }

  rebindProfileEvents() {
    const editProfileBtn = document.getElementById('editProfileBtn');
    const profileForm = document.getElementById('profileForm');
    const cancelEditBtn = document.getElementById('cancelEditBtn');

    editProfileBtn?.addEventListener('click', () => this.toggleEdit());
    profileForm?.addEventListener('submit', e => this.handleProfileSubmit(e));
    cancelEditBtn?.addEventListener('click', () => this.cancelEdit());
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;

    // Re-render profile tab with edit state
    const profilePanel = document.getElementById('profilePanel');
    if (profilePanel) {
      profilePanel.innerHTML = this.renderProfileTab();
      this.rebindProfileEvents();
    }
  }

  cancelEdit() {
    this.isEditing = false;
    this.loadProfile(); // Reload original data
  }

  async handleProfileSubmit(e) {
    e.preventDefault();

    try {
      const formData = new FormData(e.target);
      const profileData = {
        username: formData.get('username'),
        email: formData.get('email'),
        profile: {
          firstName: formData.get('firstName'),
          lastName: formData.get('lastName'),
          phone: formData.get('phone'),
          address: formData.get('address'),
        }
      };

      window.dispatchEvent(
        new CustomEvent('showLoading', {
          detail: { message: 'Menyimpan perubahan...' },
        }),
      );

      await apiService.updateUserProfile(profileData);

      window.dispatchEvent(
        new CustomEvent('showSuccess', {
          detail: 'Profil berhasil diperbarui!',
        }),
      );

      this.isEditing = false;
      await this.loadProfile();
    } catch (error) {
      window.dispatchEvent(
        new CustomEvent('showError', {
          detail: 'Gagal memperbarui profil',
        }),
      );
    } finally {
      window.dispatchEvent(new CustomEvent('hideLoading'));
    }
  }

  async handlePasswordSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');

    // Validate passwords
    if (!this.validatePasswords(currentPassword, newPassword, confirmPassword)) {
      return;
    }

    try {
      window.dispatchEvent(
        new CustomEvent('showLoading', {
          detail: { message: 'Mengubah password...' },
        }),
      );

      await apiService.changePassword({
        currentPassword,
        newPassword,
      });

      window.dispatchEvent(
        new CustomEvent('showSuccess', {
          detail: 'Password berhasil diubah!',
        }),
      );

      // Reset form
      e.target.reset();
    } catch (error) {
      let errorMessage = 'Gagal mengubah password';

      if (error.message.includes('incorrect') || error.message.includes('current')) {
        errorMessage = 'Password saat ini salah';
      }

      window.dispatchEvent(
        new CustomEvent('showError', {
          detail: errorMessage,
        }),
      );
    } finally {
      window.dispatchEvent(new CustomEvent('hideLoading'));
    }
  }

  validatePasswords(currentPassword, newPassword, confirmPassword) {
    let isValid = true;

    // Clear errors
    document.getElementById('currentPasswordError').textContent = '';
    document.getElementById('newPasswordError').textContent = '';
    document.getElementById('confirmPasswordError').textContent = '';

    if (!currentPassword) {
      document.getElementById('currentPasswordError').textContent = 'Password saat ini harus diisi';
      isValid = false;
    }

    if (!newPassword) {
      document.getElementById('newPasswordError').textContent = 'Password baru harus diisi';
      isValid = false;
    } else if (newPassword.length < 6) {
      document.getElementById('newPasswordError').textContent = 'Password minimal 6 karakter';
      isValid = false;
    }

    if (!confirmPassword) {
      document.getElementById('confirmPasswordError').textContent =
        'Konfirmasi password harus diisi';
      isValid = false;
    } else if (newPassword !== confirmPassword) {
      document.getElementById('confirmPasswordError').textContent = 'Password tidak cocok';
      isValid = false;
    }

    return isValid;
  }

  togglePassword(e) {
    const targetId = e.target.dataset.target;
    const input = document.getElementById(targetId);
    const icon = e.target;

    if (input.type === 'password') {
      input.type = 'text';
      icon.textContent = '🙈';
    } else {
      input.type = 'password';
      icon.textContent = '👁️';
    }
  }

  updatePasswordStrength(e) {
    const password = e.target.value;
    const strengthElement = document.getElementById('passwordStrength');
    const strengthFill = strengthElement.querySelector('.strength-fill');
    const strengthText = strengthElement.querySelector('.strength-text');

    const strength = this.calculatePasswordStrength(password);

    strengthFill.style.width = `${strength.percentage}%`;
    strengthFill.className = `strength-fill strength-${strength.level}`;
    strengthText.textContent = strength.text;
  }

  calculatePasswordStrength(password) {
    if (!password) {
      return { percentage: 0, level: 'weak', text: 'Minimal 6 karakter' };
    }

    let score = 0;

    // Length
    if (password.length >= 6) {score += 20;}
    if (password.length >= 8) {score += 10;}
    if (password.length >= 12) {score += 10;}

    // Character types
    if (/[a-z]/.test(password)) {score += 15;}
    if (/[A-Z]/.test(password)) {score += 15;}
    if (/[0-9]/.test(password)) {score += 15;}
    if (/[^A-Za-z0-9]/.test(password)) {score += 15;}

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

  async handleDeleteAccount() {
    const confirmed = confirm(
      'PERINGATAN: Tindakan ini akan menghapus akun Anda secara permanen!\n\n' +
        'Semua data termasuk riwayat prediksi akan hilang dan tidak dapat dipulihkan.\n\n' +
        'Apakah Anda yakin ingin melanjutkan?',
    );

    if (!confirmed) {return;}

    const password = prompt('Masukkan password Anda untuk konfirmasi:');
    if (!password) {return;}

    try {
      window.dispatchEvent(
        new CustomEvent('showLoading', {
          detail: { message: 'Menghapus akun...' },
        }),
      );

      await apiService.deleteAccount({ password });

      window.dispatchEvent(
        new CustomEvent('showSuccess', {
          detail: 'Akun berhasil dihapus. Terima kasih telah menggunakan layanan kami.',
        }),
      );

      // Logout and redirect
      setTimeout(async () => {
        await authManager.logout();
        window.dispatchEvent(new CustomEvent('navigate', { detail: '/login' }));
      }, 2000);
    } catch (error) {
      let errorMessage = 'Gagal menghapus akun';

      if (error.message.includes('password')) {
        errorMessage = 'Password yang Anda masukkan salah';
      }

      window.dispatchEvent(
        new CustomEvent('showError', {
          detail: errorMessage,
        }),
      );
    } finally {
      window.dispatchEvent(new CustomEvent('hideLoading'));
    }
  }

  async loadStatistics() {
    try {
      // Load prediction history for statistics
      const response = await apiService.getPredictionHistory({ limit: 50 });
      const predictions = response.data.predictions || [];

      this.updateStatisticsDisplay(predictions);
      this.updateActivityList(predictions.slice(0, 5));
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  }

  updateStatisticsDisplay(predictions) {
    const total = predictions.length;
    const healthy = predictions.filter(p =>
      p.predictedClass.toLowerCase().includes('healthy'),
    ).length;
    const diseased = total - healthy;
    const avgConfidence =
      total > 0 ? Math.round(predictions.reduce((sum, p) => sum + p.confidence, 0) / total) : 0;

    document.getElementById('totalPredictions').textContent = total;
    document.getElementById('healthyCount').textContent = healthy;
    document.getElementById('diseasedCount').textContent = diseased;
    document.getElementById('avgConfidence').textContent = `${avgConfidence}%`;
  }

  updateActivityList(recentPredictions) {
    const activityList = document.getElementById('activityList');

    if (!recentPredictions || recentPredictions.length === 0) {
      activityList.innerHTML = `
        <div class="empty-state">
          <p>Belum ada aktivitas terbaru</p>
        </div>
      `;
      return;
    }

    activityList.innerHTML = recentPredictions
      .map(
        prediction => `
      <div class="activity-item">
        <div class="activity-icon">
          ${prediction.predictedClass.toLowerCase().includes('healthy') ? '🌱' : '🦠'}
        </div>
        <div class="activity-content">
          <div class="activity-title">
            Prediksi: ${this.formatDiseaseName(prediction.predictedClass)}
          </div>
          <div class="activity-meta">
            ${this.formatDate(prediction.createdAt)} • ${Math.round(prediction.confidence)}% confidence
          </div>
        </div>
      </div>
    `,
      )
      .join('');
  }

  formatDiseaseName(disease) {
    return disease
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .trim();
  }

  async exportStatistics() {
    try {
      const response = await apiService.getPredictionHistory({ limit: 1000 });
      const predictions = response.data.predictions || [];

      const csvData = this.convertStatsToCSV(predictions);
      this.downloadCSV(csvData, 'my-statistics.csv');

      window.dispatchEvent(
        new CustomEvent('showSuccess', {
          detail: 'Statistik berhasil diekspor',
        }),
      );

    } catch (error) {
      window.dispatchEvent(
        new CustomEvent('showError', {
          detail: 'Gagal mengekspor statistik',
        }),
      );
    }
  }

  convertStatsToCSV(predictions) {
    if (!predictions || predictions.length === 0) {return '';}

    const headers = ['Tanggal', 'Prediksi', 'Confidence (%)', 'Status', 'Catatan'];
    const rows = predictions.map(pred => [
      new Date(pred.createdAt).toLocaleString('id-ID'),
      this.formatDiseaseName(pred.predictedClass),
      Math.round(pred.confidence),
      pred.predictedClass.toLowerCase().includes('healthy') ? 'Sehat' : 'Penyakit',
      pred.notes || '',
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    return csvContent;
  }

  downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  setLoadingState(loading) {
    this.isLoading = loading;
  }

  navigateBack() {
    window.dispatchEvent(new CustomEvent('navigate', { detail: '/' }));
  }

  navigateToHistory() {
    window.dispatchEvent(new CustomEvent('navigate', { detail: '/history' }));
  }
}
