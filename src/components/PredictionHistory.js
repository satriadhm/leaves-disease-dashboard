/* eslint-disable prettier/prettier */
// src/components/PredictionHistory.js
import apiService from '../services/api.js';
import authManager from '../utils/auth.js';

export default class PredictionHistory {
  constructor() {
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.totalPages = 1;
    this.predictions = [];
    this.filters = {
      predictedClass: '',
      startDate: '',
      endDate: '',
    };
    this.isLoading = false;
  }

  render() {
    return `
      <div class="history-container">
        <div class="history-header">
          <div class="header-content">
            <div class="header-text">
              <h1>📊 Riwayat Prediksi</h1>
              <p>Lihat dan kelola semua prediksi penyakit tanaman Anda</p>
            </div>
            <div class="header-actions">
              <button class="btn btn-primary" id="newPredictionBtn">
                📷 Prediksi Baru
              </button>
              <button class="btn btn-secondary" id="exportBtn">
                📥 Export Data
              </button>
            </div>
          </div>
        </div>

        <div class="history-filters">
          <div class="filters-row">
            <div class="filter-group">
              <label for="classFilter">Filter Kelas:</label>
              <select id="classFilter" class="filter-select">
                <option value="">Semua Kelas</option>
                <option value="healthy">Sehat</option>
                <option value="early_blight">Early Blight</option>
                <option value="late_blight">Late Blight</option>
                <option value="leaf_curl">Leaf Curl</option>
                <option value="leaf_spot">Leaf Spot</option>
                <option value="common_rust">Common Rust</option>
                <option value="gray_leaf_spot">Gray Leaf Spot</option>
                <option value="northern_leaf_blight">Northern Leaf Blight</option>
                <option value="brown_spot">Brown Spot</option>
                <option value="leaf_blast">Leaf Blast</option>
                <option value="neck_blast">Neck Blast</option>
                <option value="whitefly">Whitefly</option>
                <option value="yellow_leaf_curl_virus">Yellow Leaf Curl Virus</option>
              </select>
            </div>
            
            <div class="filter-group">
              <label for="startDate">Dari Tanggal:</label>
              <input type="date" id="startDate" class="filter-input">
            </div>
            
            <div class="filter-group">
              <label for="endDate">Sampai Tanggal:</label>
              <input type="date" id="endDate" class="filter-input">
            </div>
            
            <div class="filter-actions">
              <button class="btn btn-primary" id="applyFiltersBtn">
                🔍 Terapkan Filter
              </button>
              <button class="btn btn-secondary" id="clearFiltersBtn">
                🗑️ Hapus Filter
              </button>
            </div>
          </div>
        </div>

        <div class="history-stats" id="historyStats">
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
              <div class="stat-value" id="healthyPredictions">-</div>
              <div class="stat-label">Tanaman Sehat</div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">🦠</div>
            <div class="stat-content">
              <div class="stat-value" id="diseasedPredictions">-</div>
              <div class="stat-label">Terdeteksi Penyakit</div>
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

        <div class="history-content">
          <div class="history-list" id="historyList">
            ${this.isLoading ? this.renderLoading() : this.renderPredictions()}
          </div>
          
          <div class="pagination" id="pagination">
            <!-- Pagination will be rendered here -->
          </div>
        </div>

        <!-- Prediction Detail Modal -->
        <div class="modal" id="predictionModal">
          <div class="modal-content">
            <div class="modal-header">
              <h3>Detail Prediksi</h3>
              <button class="modal-close" id="modalClose">&times;</button>
            </div>
            <div class="modal-body" id="modalBody">
              <!-- Detail content will be loaded here -->
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderLoading() {
    return `
      <div class="loading-state">
        <div class="loading-spinner-large"></div>
        <p>Memuat riwayat prediksi...</p>
      </div>
    `;
  }

  renderPredictions() {
    if (!this.predictions || this.predictions.length === 0) {
      return this.renderEmptyState();
    }

    return this.predictions.map(prediction => this.renderPredictionCard(prediction)).join('');
  }

  renderEmptyState() {
    return `
      <div class="empty-state">
        <div class="empty-icon">📊</div>
        <h3>Belum Ada Riwayat Prediksi</h3>
        <p>Mulai dengan melakukan prediksi penyakit tanaman pertama Anda!</p>
        <button class="btn btn-primary" id="startPredictionBtn">
          🚀 Mulai Prediksi
        </button>
      </div>
    `;
  }

  renderPredictionCard(prediction) {
    const date = new Date(prediction.createdAt).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const diseaseDisplay = this.formatDiseaseName(prediction.predictedClass);
    const isHealthy = prediction.predictedClass.toLowerCase().includes('healthy');
    const confidenceColor = this.getConfidenceColor((prediction.confidence * 100).toFixed(2));

    return `
      <div class="prediction-card" data-id="${prediction._id}">
        <div class="card-image">
          <img src="${prediction.imageUrl}" alt="Plant image" loading="lazy">
          <div class="image-overlay">
            <button class="btn-view-detail" data-id="${prediction._id}">
              👁️ Lihat Detail
            </button>
          </div>
        </div>
        
        <div class="card-content">
          <div class="card-header">
            <div class="disease-info">
              <span class="disease-name ${isHealthy ? 'healthy' : 'diseased'}">
                ${isHealthy ? '🌱' : '🦠'} ${diseaseDisplay}
              </span>
              <span class="confidence-badge ${confidenceColor}">
                ${(prediction.confidence * 100).toFixed(2)}%
              </span>
            </div>
            <div class="card-actions">
              <button class="btn-action btn-detail" data-id="${prediction._id}" title="Lihat Detail">
                👁️
              </button>
              <button class="btn-action btn-delete" data-id="${prediction._id}" title="Hapus">
                🗑️
              </button>
            </div>
          </div>
          
          <div class="card-meta">
            <div class="meta-item">
              <span class="meta-icon">📅</span>
              <span class="meta-text">${date}</span>
            </div>
            <div class="meta-item">
              <span class="meta-icon">📁</span>
              <span class="meta-text">${prediction.imageName}</span>
            </div>
            ${
  prediction.processingTime
    ? `
              <div class="meta-item">
                <span class="meta-icon">⚡</span>
                <span class="meta-text">${prediction.processingTime}</span>
              </div>
            `
    : ''
}
          </div>
          
          ${
  prediction.notes
    ? `
            <div class="card-notes">
              <span class="notes-icon">📝</span>
              <span class="notes-text">${prediction.notes}</span>
            </div>
          `
    : ''
}
        </div>
      </div>
    `;
  }

  formatDiseaseName(className) {
    return className
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .trim();
  }

  getConfidenceColor(confidence) {
    if (confidence >= 80) {
      return 'high';
    }
    if (confidence >= 60) {
      return 'medium';
    }
    return 'low';
  }

  renderPagination() {
    if (this.totalPages <= 1) {
      return '';
    }

    const pagination = document.getElementById('pagination');
    if (!pagination) {
      return '';
    }

    let paginationHTML = '<div class="pagination-controls">';

    // Previous button
    paginationHTML += `
      <button class="pagination-btn ${this.currentPage === 1 ? 'disabled' : ''}" 
              data-page="${this.currentPage - 1}" 
              ${this.currentPage === 1 ? 'disabled' : ''}>
        ← Sebelumnya
      </button>
    `;

    // Page numbers
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(this.totalPages, this.currentPage + 2);

    if (startPage > 1) {
      paginationHTML += '<button class="pagination-btn" data-page="1">1</button>';
      if (startPage > 2) {
        paginationHTML += '<span class="pagination-dots">...</span>';
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      paginationHTML += `
        <button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" 
                data-page="${i}">
          ${i}
        </button>
      `;
    }

    if (endPage < this.totalPages) {
      if (endPage < this.totalPages - 1) {
        paginationHTML += '<span class="pagination-dots">...</span>';
      }
      paginationHTML += `<button class="pagination-btn" data-page="${this.totalPages}">${this.totalPages}</button>`;
    }

    // Next button
    paginationHTML += `
      <button class="pagination-btn ${this.currentPage === this.totalPages ? 'disabled' : ''}" 
              data-page="${this.currentPage + 1}" 
              ${this.currentPage === this.totalPages ? 'disabled' : ''}>
        Selanjutnya →
      </button>
    `;

    paginationHTML += '</div>';
    pagination.innerHTML = paginationHTML;

    // Bind pagination events
    pagination.querySelectorAll('.pagination-btn:not(.disabled)').forEach(btn => {
      btn.addEventListener('click', e => {
        const page = parseInt(e.target.dataset.page);
        if (page && page !== this.currentPage) {
          this.currentPage = page;
          this.loadPredictions();
        }
      });
    });
  }

  afterRender() {
    if (!authManager.requireAuth()) {
      return;
    }

    this.bindEvents();
    this.loadPredictions();
    this.loadStats();
  }

  bindEvents() {
    // Header actions
    const newPredictionBtn = document.getElementById('newPredictionBtn');
    const exportBtn = document.getElementById('exportBtn');

    newPredictionBtn?.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('navigate', { detail: '/' }));
    });

    exportBtn?.addEventListener('click', () => this.exportData());

    // Filters
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');

    applyFiltersBtn?.addEventListener('click', () => this.applyFilters());
    clearFiltersBtn?.addEventListener('click', () => this.clearFilters());

    // Modal
    const modal = document.getElementById('predictionModal');
    const modalClose = document.getElementById('modalClose');

    modalClose?.addEventListener('click', () => this.closeModal());
    modal?.addEventListener('click', e => {
      if (e.target === modal) {
        this.closeModal();
      }
    });

    // Dynamic events will be bound when content is loaded
  }

  bindDynamicEvents() {
    // Prediction card actions
    document.querySelectorAll('.btn-detail, .btn-view-detail').forEach(btn => {
      btn.addEventListener('click', e => {
        const id = e.target.dataset.id;
        this.showPredictionDetail(id);
      });
    });

    document.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', e => {
        const id = e.target.dataset.id;
        this.deletePrediction(id);
      });
    });

    // Empty state action
    const startPredictionBtn = document.getElementById('startPredictionBtn');
    startPredictionBtn?.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('navigate', { detail: '/' }));
    });
  }

  async loadPredictions() {
    try {
      this.setLoadingState(true);

      const params = {
        page: this.currentPage,
        limit: this.itemsPerPage,
        ...this.filters,
      };

      const response = await apiService.getPredictionHistory(params);

      this.predictions = response.data.predictions;
      this.totalPages = response.data.pagination.totalPages;

      this.renderPredictionList();
      this.renderPagination();
      this.bindDynamicEvents();
    } catch (error) {
      console.error('Error loading predictions:', error);
      window.dispatchEvent(
        new CustomEvent('showError', {
          detail: 'Gagal memuat riwayat prediksi',
        }),
      );
    } finally {
      this.setLoadingState(false);
    }
  }

  async loadStats() {
    try {
      // This would typically come from a dedicated stats endpoint
      // For now, we'll calculate from the current predictions
      const stats = this.calculateStats();
      this.updateStatsDisplay(stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }

  calculateStats() {
    if (!this.predictions || this.predictions.length === 0) {
      return {
        total: 0,
        healthy: 0,
        diseased: 0,
        avgConfidence: 0,
      };
    }

    const total = this.predictions.length;
    const healthy = this.predictions.filter(p =>
      p.predictedClass.toLowerCase().includes('healthy'),
    ).length;
    const diseased = total - healthy;
    const avgConfidence = this.predictions.reduce((sum, p) => sum + p.confidence, 0) / total;

    return { total, healthy, diseased, avgConfidence };
  }

  updateStatsDisplay(stats) {
    document.getElementById('totalPredictions').textContent = stats.total;
    document.getElementById('healthyPredictions').textContent = stats.healthy;
    document.getElementById('diseasedPredictions').textContent = stats.diseased;
    document.getElementById('avgConfidence').textContent = `${stats.avgConfidence}%`;
  }

  renderPredictionList() {
    const historyList = document.getElementById('historyList');
    if (historyList) {
      historyList.innerHTML = this.renderPredictions();
    }
  }

  setLoadingState(loading) {
    this.isLoading = loading;
    const historyList = document.getElementById('historyList');

    if (loading && historyList) {
      historyList.innerHTML = this.renderLoading();
    }
  }

  applyFilters() {
    this.filters = {
      predictedClass: document.getElementById('classFilter').value,
      startDate: document.getElementById('startDate').value,
      endDate: document.getElementById('endDate').value,
    };

    this.currentPage = 1;
    this.loadPredictions();
  }

  clearFilters() {
    document.getElementById('classFilter').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';

    this.filters = {
      predictedClass: '',
      startDate: '',
      endDate: '',
    };

    this.currentPage = 1;
    this.loadPredictions();
  }

  async showPredictionDetail(id) {
    try {
      window.dispatchEvent(
        new CustomEvent('showLoading', {
          detail: { message: 'Memuat detail prediksi...' },
        }),
      );

      const response = await apiService.getPredictionDetail(id);
      const prediction = response.data;

      this.renderPredictionDetail(prediction);
      this.openModal();
    } catch (error) {
      window.dispatchEvent(
        new CustomEvent('showError', {
          detail: 'Gagal memuat detail prediksi',
        }),
      );
    } finally {
      window.dispatchEvent(new CustomEvent('hideLoading'));
    }
  }

  renderPredictionDetail(prediction) {
    const modalBody = document.getElementById('modalBody');
    const date = new Date(prediction.createdAt).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    modalBody.innerHTML = `
      <div class="prediction-detail">
        <div class="detail-image">
          <img src="${prediction.imageUrl}" alt="Plant image">
        </div>
        
        <div class="detail-info">
          <div class="info-section">
            <h4>Hasil Prediksi</h4>
            <div class="prediction-result">
              <div class="result-main">
                <span class="disease-name">${this.formatDiseaseName(prediction.predictedClass)}</span>
                <span class="confidence-badge ${this.getConfidenceColor((prediction.confidence * 100).toFixed(2))}">
                  ${Math.round((prediction.confidence * 100).toFixed(2))}% Confidence
                </span>
              </div>
            </div>
          </div>
          
          ${
  prediction.allPredictions && prediction.allPredictions.length > 1
    ? `
            <div class="info-section">
              <h4>Semua Prediksi</h4>
              <div class="all-predictions">
                ${prediction.allPredictions
    .slice(0, 5)
    .map(
      pred => `
                  <div class="prediction-item">
                    <span class="pred-name">${this.formatDiseaseName(pred.class)}</span>
                    <span class="pred-confidence">${pred.confidence}%</span>
                  </div>
                `,
    )
    .join('')}
              </div>
            </div>
          `
    : ''
}
          
          <div class="info-section">
            <h4>Detail File</h4>
            <div class="file-details">
              <div class="detail-item">
                <span class="detail-label">Nama File:</span>
                <span class="detail-value">${prediction.imageName}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Tanggal Prediksi:</span>
                <span class="detail-value">${date}</span>
              </div>
              ${
  prediction.processingTime
    ? `
                <div class="detail-item">
                  <span class="detail-label">Waktu Proses:</span>
                  <span class="detail-value">${prediction.processingTime}</span>
                </div>
              `
    : ''
}
            </div>
          </div>
          
          ${
  prediction.notes
    ? `
            <div class="info-section">
              <h4>Catatan</h4>
              <p class="prediction-notes">${prediction.notes}</p>
            </div>
          `
    : ''
}
        </div>
      </div>
    `;
  }

  openModal() {
    const modal = document.getElementById('predictionModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    const modal = document.getElementById('predictionModal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }

  async deletePrediction(id) {
    const confirmed = confirm('Apakah Anda yakin ingin menghapus prediksi ini?');
    if (!confirmed) {
      return;
    }

    try {
      window.dispatchEvent(
        new CustomEvent('showLoading', {
          detail: { message: 'Menghapus prediksi...' },
        }),
      );

      await apiService.deletePrediction(id);

      window.dispatchEvent(
        new CustomEvent('showSuccess', {
          detail: 'Prediksi berhasil dihapus',
        }),
      );

      // Reload predictions
      this.loadPredictions();
      this.loadStats();
    } catch (error) {
      window.dispatchEvent(
        new CustomEvent('showError', {
          detail: 'Gagal menghapus prediksi',
        }),
      );
    } finally {
      window.dispatchEvent(new CustomEvent('hideLoading'));
    }
  }

  async exportData() {
    try {
      window.dispatchEvent(
        new CustomEvent('showLoading', {
          detail: { message: 'Mengekspor data...' },
        }),
      );

      // Get all predictions for export
      const response = await apiService.getPredictionHistory({
        limit: 1000, // Get more records for export
      });

      const csvData = this.convertToCSV(response.data.predictions);
      this.downloadCSV(csvData, 'prediction-history.csv');

      window.dispatchEvent(
        new CustomEvent('showSuccess', {
          detail: 'Data berhasil diekspor',
        }),
      );
    } catch (error) {
      window.dispatchEvent(
        new CustomEvent('showError', {
          detail: 'Gagal mengekspor data',
        }),
      );
    } finally {
      window.dispatchEvent(new CustomEvent('hideLoading'));
    }
  }

  convertToCSV(predictions) {
    if (!predictions || predictions.length === 0) {
      return '';
    }

    const headers = ['Tanggal', 'Nama File', 'Prediksi', 'Confidence (%)', 'Catatan'];
    const rows = predictions.map(pred => [
      new Date(pred.createdAt).toLocaleString('id-ID'),
      pred.imageName,
      this.formatDiseaseName(pred.predictedClass),
      Math.round(pred.confidence),
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
}
