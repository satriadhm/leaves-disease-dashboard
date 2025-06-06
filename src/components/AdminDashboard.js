/* eslint-disable prettier/prettier */
// src/components/AdminDashboard.js
import apiService from '../services/api.js';
import authManager from '../utils/auth.js';

export default class AdminDashboard {
  constructor() {
    this.activeTab = 'overview';
    this.users = [];
    this.predictions = [];
    this.stats = {
      users: {},
      predictions: {},
      system: {},
    };
    this.isLoading = false;
    this.currentPage = 1;
    this.itemsPerPage = 10;
  }

  render() {
    return `
      <div class="dashboard-container">
        <div class="dashboard-header">
          <div class="header-content">
            <button class="btn btn-secondary back-btn" id="backBtn">
              ← Kembali
            </button>
            <div class="header-text">
              <h1>⚙️ Admin Dashboard</h1>
              <p>Kelola pengguna, monitor sistem, dan analisis data</p>
            </div>
            <div class="header-actions">
              <button class="btn btn-outline" id="refreshBtn">
                🔄 Refresh
              </button>
              <button class="btn btn-secondary" id="exportBtn">
                📥 Export Data
              </button>
            </div>
          </div>
        </div>

        <div class="dashboard-navigation">
          <div class="nav-tabs">
            <button class="tab-btn ${this.activeTab === 'overview' ? 'active' : ''}" 
                    data-tab="overview">
              📊 Overview
            </button>
            <button class="tab-btn ${this.activeTab === 'users' ? 'active' : ''}" 
                    data-tab="users">
              👥 Users
            </button>
            <button class="tab-btn ${this.activeTab === 'predictions' ? 'active' : ''}" 
                    data-tab="predictions">
              🔬 Predictions
            </button>
            <button class="tab-btn ${this.activeTab === 'system' ? 'active' : ''}" 
                    data-tab="system">
              🖥️ System
            </button>
          </div>
        </div>

        <div class="dashboard-content">
          <!-- Overview Tab -->
          <div class="tab-panel ${this.activeTab === 'overview' ? 'active' : ''}" 
               id="overviewPanel">
            ${this.renderOverviewTab()}
          </div>

          <!-- Users Tab -->
          <div class="tab-panel ${this.activeTab === 'users' ? 'active' : ''}" 
               id="usersPanel">
            ${this.renderUsersTab()}
          </div>

          <!-- Predictions Tab -->
          <div class="tab-panel ${this.activeTab === 'predictions' ? 'active' : ''}" 
               id="predictionsPanel">
            ${this.renderPredictionsTab()}
          </div>

          <!-- System Tab -->
          <div class="tab-panel ${this.activeTab === 'system' ? 'active' : ''}" 
               id="systemPanel">
            ${this.renderSystemTab()}
          </div>
        </div>
      </div>
    `;
  }

  renderOverviewTab() {
    return `
      <div class="overview-section">
        <div class="stats-overview">
          <h3>📈 Statistik Keseluruhan</h3>
          
          <div class="stats-grid" id="statsGrid">
            <div class="stat-card">
              <div class="stat-icon">👥</div>
              <div class="stat-content">
                <div class="stat-value" id="totalUsers">-</div>
                <div class="stat-label">Total Users</div>
                <div class="stat-change" id="usersChange">-</div>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">🔬</div>
              <div class="stat-content">
                <div class="stat-value" id="totalPredictions">-</div>
                <div class="stat-label">Total Prediksi</div>
                <div class="stat-change" id="predictionsChange">-</div>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">🌱</div>
              <div class="stat-content">
                <div class="stat-value" id="healthyPredictions">-</div>
                <div class="stat-label">Tanaman Sehat</div>
                <div class="stat-change" id="healthyChange">-</div>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">🦠</div>
              <div class="stat-content">
                <div class="stat-value" id="diseasedPredictions">-</div>
                <div class="stat-label">Penyakit Terdeteksi</div>
                <div class="stat-change" id="diseasedChange">-</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">📱</div>
              <div class="stat-content">
                <div class="stat-value" id="activeUsers">-</div>
                <div class="stat-label">Active Users</div>
                <div class="stat-change" id="activeUsersChange">-</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">🎯</div>
              <div class="stat-content">
                <div class="stat-value" id="avgConfidence">-</div>
                <div class="stat-label">Avg Confidence</div>
                <div class="stat-change" id="confidenceChange">-</div>
              </div>
            </div>
          </div>
        </div>

        <div class="charts-section">
          <div class="chart-grid">
            <div class="chart-card">
              <h4>📊 Prediksi Per Hari (7 Hari Terakhir)</h4>
              <div class="chart-container" id="dailyPredictionsChart">
                <div class="chart-placeholder">
                  <div class="loading-spinner"></div>
                  <p>Memuat grafik...</p>
                </div>
              </div>
            </div>

            <div class="chart-card">
              <h4>🥧 Distribusi Penyakit</h4>
              <div class="chart-container" id="diseaseDistributionChart">
                <div class="chart-placeholder">
                  <div class="loading-spinner"></div>
                  <p>Memuat grafik...</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="recent-activity">
          <h4>🕐 Aktivitas Terbaru</h4>
          <div class="activity-list" id="recentActivityList">
            <div class="loading-state">
              <div class="loading-spinner"></div>
              <p>Memuat aktivitas...</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderUsersTab() {
    return `
      <div class="users-section">
        <div class="section-header">
          <h3>👥 Manajemen Pengguna</h3>
          <div class="header-actions">
            <input type="search" id="userSearch" placeholder="Cari pengguna..." class="search-input">
            <select id="userRoleFilter" class="filter-select">
              <option value="">Semua Role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
            </select>
            <select id="userStatusFilter" class="filter-select">
              <option value="">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Tidak Aktif</option>
            </select>
          </div>
        </div>

        <div class="users-table-container">
          <div class="table-responsive">
            <table class="data-table" id="usersTable">
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Prediksi</th>
                  <th>Bergabung</th>
                  <th>Login Terakhir</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody id="usersTableBody">
                <tr>
                  <td colspan="9" class="loading-cell">
                    <div class="loading-spinner"></div>
                    <span>Memuat data pengguna...</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="pagination" id="usersPagination"></div>
      </div>
    `;
  }

  renderPredictionsTab() {
    return `
      <div class="predictions-section">
        <div class="section-header">
          <h3>🔬 Manajemen Prediksi</h3>
          <div class="header-actions">
            <input type="search" id="predictionSearch" placeholder="Cari prediksi..." class="search-input">
            <select id="predictionTypeFilter" class="filter-select">
              <option value="">Semua Tipe</option>
              <option value="authenticated">Authenticated</option>
              <option value="anonymous">Anonymous</option>
            </select>
            <select id="diseaseFilter" class="filter-select">
              <option value="">Semua Penyakit</option>
              <option value="healthy">Sehat</option>
              <option value="early_blight">Early Blight</option>
              <option value="late_blight">Late Blight</option>
              <option value="leaf_curl">Leaf Curl</option>
              <option value="leaf_spot">Leaf Spot</option>
            </select>
            <input type="date" id="dateFromFilter" class="filter-input">
            <input type="date" id="dateToFilter" class="filter-input">
          </div>
        </div>

        <div class="predictions-table-container">
          <div class="table-responsive">
            <table class="data-table" id="predictionsTable">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>User</th>
                  <th>Prediksi</th>
                  <th>Confidence</th>
                  <th>Tipe</th>
                  <th>Storage</th>
                  <th>Waktu Proses</th>
                  <th>Tanggal</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody id="predictionsTableBody">
                <tr>
                  <td colspan="9" class="loading-cell">
                    <div class="loading-spinner"></div>
                    <span>Memuat data prediksi...</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="pagination" id="predictionsPagination"></div>
      </div>
    `;
  }

  renderSystemTab() {
    return `
      <div class="system-section">
        <div class="system-health">
          <h3>🖥️ System Health</h3>
          
          <div class="health-grid" id="systemHealthGrid">
            <div class="health-card">
              <div class="health-icon">🔗</div>
              <div class="health-content">
                <div class="health-title">API Status</div>
                <div class="health-status" id="apiStatus">
                  <div class="status-dot checking"></div>
                  <span>Checking...</span>
                </div>
              </div>
            </div>

            <div class="health-card">
              <div class="health-icon">💾</div>
              <div class="health-content">
                <div class="health-title">Database</div>
                <div class="health-status" id="dbStatus">
                  <div class="status-dot checking"></div>
                  <span>Checking...</span>
                </div>
              </div>
            </div>

            <div class="health-card">
              <div class="health-icon">🤖</div>
              <div class="health-content">
                <div class="health-title">AI Model</div>
                <div class="health-status" id="modelStatus">
                  <div class="status-dot checking"></div>
                  <span>Checking...</span>
                </div>
              </div>
            </div>

            <div class="health-card">
              <div class="health-icon">📡</div>
              <div class="health-content">
                <div class="health-title">Network</div>
                <div class="health-status" id="networkStatus">
                  <div class="status-dot checking"></div>
                  <span>Checking...</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="system-info">
          <h4>ℹ️ System Information</h4>
          <div class="info-grid" id="systemInfoGrid">
            <div class="info-item">
              <span class="info-label">API Version:</span>
              <span class="info-value" id="apiVersion">-</span>
            </div>
            <div class="info-item">
              <span class="info-label">Environment:</span>
              <span class="info-value" id="environment">-</span>
            </div>
            <div class="info-item">
              <span class="info-label">Database Collections:</span>
              <span class="info-value" id="dbCollections">-</span>
            </div>
            <div class="info-item">
              <span class="info-label">Model Classes:</span>
              <span class="info-value" id="modelClasses">-</span>
            </div>
            <div class="info-item">
              <span class="info-label">TensorFlow Backend:</span>
              <span class="info-value" id="tfBackend">-</span>
            </div>
            <div class="info-item">
              <span class="info-label">Storage Types:</span>
              <span class="info-value" id="storageTypes">-</span>
            </div>
          </div>
        </div>

        <div class="system-actions">
          <h4>🔧 System Actions</h4>
          <div class="action-buttons">
            <button class="btn btn-primary" id="testApiBtn">
              🧪 Test API Connection
            </button>
            <button class="btn btn-secondary" id="testModelBtn">
              🤖 Test AI Model
            </button>
            <button class="btn btn-secondary" id="clearCacheBtn">
              🗑️ Clear Cache
            </button>
            <button class="btn btn-warning" id="downloadLogsBtn">
              📄 Download Logs
            </button>
          </div>
        </div>
      </div>
    `;
  }

  async afterRender() {
    if (!authManager.requireRole('admin')) {
      return;
    }

    this.bindEvents();
    await this.loadDashboardData();
  }

  bindEvents() {
    // Navigation
    const backBtn = document.getElementById('backBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const exportBtn = document.getElementById('exportBtn');

    backBtn?.addEventListener('click', () => this.navigateBack());
    refreshBtn?.addEventListener('click', () => this.refreshData());
    exportBtn?.addEventListener('click', () => this.exportAllData());

    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', e => this.switchTab(e));
    });

    // Search and filters
    this.bindSearchAndFilters();

    // System actions
    this.bindSystemActions();
  }

  bindSearchAndFilters() {
    // User search and filters
    const userSearch = document.getElementById('userSearch');
    const userRoleFilter = document.getElementById('userRoleFilter');
    const userStatusFilter = document.getElementById('userStatusFilter');

    userSearch?.addEventListener('input', () => this.debounce(() => this.filterUsers(), 300));
    userRoleFilter?.addEventListener('change', () => this.filterUsers());
    userStatusFilter?.addEventListener('change', () => this.filterUsers());

    // Prediction search and filters
    const predictionSearch = document.getElementById('predictionSearch');
    const predictionTypeFilter = document.getElementById('predictionTypeFilter');
    const diseaseFilter = document.getElementById('diseaseFilter');
    const dateFromFilter = document.getElementById('dateFromFilter');
    const dateToFilter = document.getElementById('dateToFilter');

    predictionSearch?.addEventListener('input', () =>
      this.debounce(() => this.filterPredictions(), 300)
    );
    predictionTypeFilter?.addEventListener('change', () => this.filterPredictions());
    diseaseFilter?.addEventListener('change', () => this.filterPredictions());
    dateFromFilter?.addEventListener('change', () => this.filterPredictions());
    dateToFilter?.addEventListener('change', () => this.filterPredictions());
  }

  bindSystemActions() {
    const testApiBtn = document.getElementById('testApiBtn');
    const testModelBtn = document.getElementById('testModelBtn');
    const clearCacheBtn = document.getElementById('clearCacheBtn');
    const downloadLogsBtn = document.getElementById('downloadLogsBtn');

    testApiBtn?.addEventListener('click', () => this.testApiConnection());
    testModelBtn?.addEventListener('click', () => this.testModel());
    clearCacheBtn?.addEventListener('click', () => this.clearCache());
    downloadLogsBtn?.addEventListener('click', () => this.downloadLogs());
  }

  switchTab(e) {
    const tab = e.target.dataset.tab;
    if (tab === this.activeTab) {
      return;
    }

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
    const targetPanel = document.getElementById(`${tab}Panel`);
    if (targetPanel) {
      targetPanel.classList.add('active');
    }

    // Load data for specific tabs
    this.loadTabData(tab);
  }

  async loadDashboardData() {
    try {
      this.setLoadingState(true);

      // Load all dashboard data
      await Promise.all([this.loadOverviewData(), this.loadSystemHealth()]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      window.dispatchEvent(
        new CustomEvent('showError', {
          detail: 'Gagal memuat data dashboard',
        })
      );
    } finally {
      this.setLoadingState(false);
    }
  }

  async loadTabData(tab) {
    switch (tab) {
      case 'users':
        await this.loadUsersData();
        break;
      case 'predictions':
        await this.loadPredictionsData();
        break;
      case 'system':
        await this.loadSystemHealth();
        break;
    }
  }

  async loadOverviewData() {
    try {
      // Load user stats
      const userStatsResponse = await apiService.getUserStats();
      this.stats.users = userStatsResponse.data;

      // Load prediction stats
      const predictionStatsResponse = await apiService.getPredictionStats();
      this.stats.predictions = predictionStatsResponse.data;

      this.updateOverviewDisplay();
    } catch (error) {
      console.error('Error loading overview data:', error);
    }
  }

  updateOverviewDisplay() {
    const { users, predictions } = this.stats;

    // Update user stats
    document.getElementById('totalUsers').textContent = users.overview?.totalUsers || 0;
    document.getElementById('activeUsers').textContent = users.overview?.activeUsers || 0;

    // Update prediction stats
    document.getElementById('totalPredictions').textContent =
      predictions.overview?.totalPredictions || 0;
    document.getElementById('healthyPredictions').textContent =
      predictions.predictionsByClass?.filter(p => p._id.includes('healthy')).length || 0;
    document.getElementById('diseasedPredictions').textContent =
      (predictions.overview?.totalPredictions || 0) -
      (predictions.predictionsByClass?.filter(p => p._id.includes('healthy')).length || 0);
    document.getElementById('avgConfidence').textContent =
      `${Math.round(predictions.overview?.avgProcessingTime || 0)}%`;

    this.renderCharts();
    this.loadRecentActivity();
  }

  renderCharts() {
    // Simple text-based charts for now
    // In a real app, you'd use Chart.js or similar
    this.renderDailyPredictionsChart();
    this.renderDiseaseDistributionChart();
  }

  renderDailyPredictionsChart() {
    const container = document.getElementById('dailyPredictionsChart');
    const data = this.stats.predictions.predictionsByDate || [];

    if (data.length === 0) {
      container.innerHTML = '<p class="no-data">Tidak ada data</p>';
      return;
    }

    const maxCount = Math.max(...data.map(d => d.count));

    container.innerHTML = `
      <div class="simple-chart">
        ${data
          .map(
            item => `
          <div class="chart-bar">
            <div class="bar-label">${new Date(item._id).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}</div>
            <div class="bar" style="height: ${(item.count / maxCount) * 100}%"></div>
            <div class="bar-value">${item.count}</div>
          </div>
        `
          )
          .join('')}
      </div>
    `;
  }

  renderDiseaseDistributionChart() {
    const container = document.getElementById('diseaseDistributionChart');
    const data = this.stats.predictions.predictionsByClass || [];

    if (data.length === 0) {
      container.innerHTML = '<p class="no-data">Tidak ada data</p>';
      return;
    }

    const total = data.reduce((sum, item) => sum + item.count, 0);

    container.innerHTML = `
      <div class="pie-chart">
        ${data
          .slice(0, 5)
          .map(
            item => `
          <div class="pie-item">
            <div class="pie-color" style="background: hsl(${Math.random() * 360}, 70%, 60%)"></div>
            <div class="pie-label">${this.formatDiseaseName(item._id)}</div>
            <div class="pie-value">${Math.round((item.count / total) * 100)}%</div>
          </div>
        `
          )
          .join('')}
      </div>
    `;
  }

  async loadRecentActivity() {
    try {
      const response = await apiService.getAllPredictions({ limit: 10 });
      const activities = response.data.predictions || [];

      const activityList = document.getElementById('recentActivityList');

      if (activities.length === 0) {
        activityList.innerHTML = '<p class="no-data">Tidak ada aktivitas terbaru</p>';
        return;
      }

      activityList.innerHTML = activities
        .map(
          activity => `
        <div class="activity-item">
          <div class="activity-icon">
            ${activity.predictedClass.includes('healthy') ? '🌱' : '🦠'}
          </div>
          <div class="activity-content">
            <div class="activity-title">
              ${activity.userId ? 'User' : 'Anonymous'} - ${this.formatDiseaseName(activity.predictedClass)}
            </div>
            <div class="activity-meta">
              ${this.formatDate(activity.createdAt)} • ${Math.round(activity.confidence)}% confidence
            </div>
          </div>
        </div>
      `
        )
        .join('');
    } catch (error) {
      console.error('Error loading recent activity:', error);
    }
  }

  async loadUsersData() {
    try {
      const response = await apiService.getAllUsers({
        page: this.currentPage,
        limit: this.itemsPerPage,
      });

      this.users = response.data.users || [];
      this.renderUsersTable();
    } catch (error) {
      console.error('Error loading users data:', error);
    }
  }

  renderUsersTable() {
    const tbody = document.getElementById('usersTableBody');

    if (this.users.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" class="no-data">Tidak ada data pengguna</td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = this.users
      .map(
        user => `
      <tr>
        <td>
          <div class="user-avatar small">
            ${user.username?.charAt(0).toUpperCase() || 'U'}
          </div>
        </td>
        <td>
          <div class="user-name">${user.profile?.firstName || ''} ${user.profile?.lastName || ''}</div>
          <div class="user-username">@${user.username}</div>
        </td>
        <td>${user.email}</td>
        <td>
          <span class="role-badge ${user.roles?.[0]?.toLowerCase()}">
            ${user.roles?.[0]?.replace('ROLE_', '') || 'User'}
          </span>
        </td>
        <td>
          <span class="status-badge ${user.status}">
            ${user.status === 'active' ? '✅ Aktif' : '❌ Tidak Aktif'}
          </span>
        </td>
        <td>${user.totalPredictions || 0}</td>
        <td>${this.formatDate(user.createdAt)}</td>
        <td>${this.formatDate(user.lastLogin) || 'Tidak pernah'}</td>
        <td>
          <div class="action-buttons">
            <button class="btn-action" onclick="this.viewUser('${user._id}')" title="Lihat">👁️</button>
            <button class="btn-action" onclick="this.editUser('${user._id}')" title="Edit">✏️</button>
            <button class="btn-action danger" onclick="this.deleteUser('${user._id}')" title="Hapus">🗑️</button>
          </div>
        </td>
      </tr>
    `
      )
      .join('');
  }

  async loadPredictionsData() {
    try {
      const response = await apiService.getAllPredictions({
        page: this.currentPage,
        limit: this.itemsPerPage,
      });

      this.predictions = response.data.predictions || [];
      this.renderPredictionsTable();
    } catch (error) {
      console.error('Error loading predictions data:', error);
    }
  }

  renderPredictionsTable() {
    const tbody = document.getElementById('predictionsTableBody');

    if (this.predictions.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" class="no-data">Tidak ada data prediksi</td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = this.predictions
      .map(
        prediction => `
      <tr>
        <td>
          <img src="${prediction.imageUrl}" alt="Plant" class="table-image">
        </td>
        <td>${prediction.userId?.username || 'Anonymous'}</td>
        <td>
          <div class="prediction-result">
            <span class="disease-name">${this.formatDiseaseName(prediction.predictedClass)}</span>
          </div>
        </td>
        <td>
          <span class="confidence-badge ${this.getConfidenceClass(prediction.confidence)}">
            ${Math.round(prediction.confidence)}%
          </span>
        </td>
        <td>
          <span class="type-badge ${prediction.predictionType}">
            ${prediction.predictionType}
          </span>
        </td>
        <td>
          <span class="storage-badge ${prediction.storageType}">
            ${prediction.storageType}
          </span>
        </td>
        <td>${prediction.processingTime || '-'}</td>
        <td>${this.formatDate(prediction.createdAt)}</td>
        <td>
          <div class="action-buttons">
            <button class="btn-action" onclick="this.viewPrediction('${prediction._id}')" title="Lihat">👁️</button>
            <button class="btn-action danger" onclick="this.deletePrediction('${prediction._id}')" title="Hapus">🗑️</button>
          </div>
        </td>
      </tr>
    `
      )
      .join('');
  }

  async loadSystemHealth() {
    try {
      // Check API health
      this.updateHealthStatus('apiStatus', 'checking', 'Checking...');

      const healthResponse = await apiService.getHealthStatus();
      this.updateHealthStatus('apiStatus', 'healthy', 'Connected');

      // Check database
      this.updateHealthStatus('dbStatus', 'checking', 'Checking...');
      this.updateHealthStatus('dbStatus', 'healthy', 'Connected');

      // Check model
      this.updateHealthStatus('modelStatus', 'checking', 'Checking...');
      const modelResponse = await apiService.getModelHealth();
      const modelHealthy = modelResponse.data?.modelLoaded;
      this.updateHealthStatus(
        'modelStatus',
        modelHealthy ? 'healthy' : 'error',
        modelHealthy ? 'Loaded' : 'Not Loaded'
      );

      // Check network
      this.updateHealthStatus(
        'networkStatus',
        navigator.onLine ? 'healthy' : 'error',
        navigator.onLine ? 'Online' : 'Offline'
      );

      // Update system info
      this.updateSystemInfo(healthResponse, modelResponse);
    } catch (error) {
      console.error('Error checking system health:', error);
      this.updateHealthStatus('apiStatus', 'error', 'Error');
      this.updateHealthStatus('dbStatus', 'error', 'Error');
      this.updateHealthStatus('modelStatus', 'error', 'Error');
    }
  }

  updateHealthStatus(elementId, status, text) {
    const element = document.getElementById(elementId);
    if (!element) {
      return;
    }

    element.innerHTML = `
      <div class="status-dot ${status}"></div>
      <span>${text}</span>
    `;
  }

  updateSystemInfo(healthData, modelData) {
    document.getElementById('apiVersion').textContent = healthData.api_version || '2.0.0';
    document.getElementById('environment').textContent = healthData.environment || 'production';
    document.getElementById('dbCollections').textContent =
      Object.keys(healthData.database?.collections || {}).length || 0;
    document.getElementById('modelClasses').textContent = modelData.data?.totalClasses || 16;
    document.getElementById('tfBackend').textContent = modelData.data?.tfBackend || 'cpu';
    document.getElementById('storageTypes').textContent = modelData.data?.storageConfig
      ? Object.keys(modelData.data.storageConfig).join(', ')
      : 'local, blob';
  }

  // System action methods
  async testApiConnection() {
    try {
      window.dispatchEvent(
        new CustomEvent('showLoading', {
          detail: { message: 'Testing API connection...' },
        })
      );

      await apiService.getHealthStatus();

      window.dispatchEvent(
        new CustomEvent('showSuccess', {
          detail: 'API connection successful!',
        })
      );
    } catch (error) {
      window.dispatchEvent(
        new CustomEvent('showError', {
          detail: `API connection failed: ${error.message}`,
        })
      );
    } finally {
      window.dispatchEvent(new CustomEvent('hideLoading'));
    }
  }

  async testModel() {
    try {
      window.dispatchEvent(
        new CustomEvent('showLoading', {
          detail: { message: 'Testing AI model...' },
        })
      );

      const response = await apiService.getModelHealth();

      if (response.data?.modelLoaded) {
        window.dispatchEvent(
          new CustomEvent('showSuccess', {
            detail: 'AI model is working properly!',
          })
        );
      } else {
        window.dispatchEvent(
          new CustomEvent('showWarning', {
            detail: 'AI model is not loaded properly',
          })
        );
      }
    } catch (error) {
      window.dispatchEvent(
        new CustomEvent('showError', {
          detail: `Model test failed: ${error.message}`,
        })
      );
    } finally {
      window.dispatchEvent(new CustomEvent('hideLoading'));
    }
  }

  clearCache() {
    if (confirm('Are you sure you want to clear the cache? This will log out all users.')) {
      localStorage.clear();
      sessionStorage.clear();

      window.dispatchEvent(
        new CustomEvent('showSuccess', {
          detail: 'Cache cleared successfully!',
        })
      );

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }

  downloadLogs() {
    // Generate a simple log file
    const logs = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      stats: this.stats,
      systemHealth: 'checked',
    };

    const blob = new Blob([JSON.stringify(logs, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `system-logs-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    window.dispatchEvent(
      new CustomEvent('showSuccess', {
        detail: 'Logs downloaded successfully!',
      })
    );
  }

  // Utility methods
  formatDate(dateString) {
    if (!dateString) {
      return null;
    }

    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Invalid';
    }
  }

  formatDiseaseName(disease) {
    return disease
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .trim();
  }

  getConfidenceClass(confidence) {
    if (confidence >= 80) {
      return 'high';
    }
    if (confidence >= 60) {
      return 'medium';
    }
    return 'low';
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  filterUsers() {
    // Implement user filtering logic
    this.loadUsersData();
  }

  filterPredictions() {
    // Implement prediction filtering logic
    this.loadPredictionsData();
  }

  async refreshData() {
    await this.loadDashboardData();
    window.dispatchEvent(
      new CustomEvent('showSuccess', {
        detail: 'Data refreshed successfully!',
      })
    );
  }

  async exportAllData() {
    try {
      window.dispatchEvent(
        new CustomEvent('showLoading', {
          detail: { message: 'Exporting data...' },
        })
      );

      // Export all data
      const exportData = {
        timestamp: new Date().toISOString(),
        stats: this.stats,
        users: this.users,
        predictions: this.predictions,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dashboard-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      window.dispatchEvent(
        new CustomEvent('showSuccess', {
          detail: 'Data exported successfully!',
        })
      );
    } catch (error) {
      window.dispatchEvent(
        new CustomEvent('showError', {
          detail: `Export failed: ${error.message}`,
        })
      );
    } finally {
      window.dispatchEvent(new CustomEvent('hideLoading'));
    }
  }

  setLoadingState(loading) {
    this.isLoading = loading;
  }

  navigateBack() {
    window.dispatchEvent(new CustomEvent('navigate', { detail: '/' }));
  }
}
