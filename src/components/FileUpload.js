/* eslint-disable indent */
/* eslint-disable prettier/prettier */
// src/components/FileUpload.js
import apiService from '../services/api.js';

export default class FileUpload {
  constructor() {
    this.selectedFile = null;
    this.isDragging = false;
    this.isAnalyzing = false;
    this.maxFileSize = 5 * 1024 * 1024; // 5MB
    this.allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  }

  render() {
    return `
      <div class="upload-container">
        <div class="upload-area ${this.isDragging ? 'drag-over' : ''}" id="uploadArea">
          <div class="upload-content">
            <div class="upload-icon">
              <div class="icon-container">
                📁
                <div class="upload-animation"></div>
              </div>
            </div>
            <div class="upload-text">
              <h3>Upload Gambar Tanaman</h3>
              <p>Drag & drop gambar di sini atau klik untuk memilih file</p>
              <div class="upload-requirements">
                <span class="req-item">📸 Format: JPG, PNG, WebP</span>
                <span class="req-item">📏 Maksimal: 5MB</span>
                <span class="req-item">🎯 Resolusi: Min 224x224px</span>
              </div>
            </div>
            <input type="file" id="fileInput" accept="image/*" style="display: none;">
            <button class="btn btn-primary" id="selectFileBtn">
              <span class="btn-icon">📁</span>
              Pilih File
            </button>
          </div>
        </div>
        
        <div class="file-preview hidden" id="filePreview">
          <div class="preview-header">
            <h4>📷 Preview Gambar</h4>
            <button class="btn-close" id="removeFileBtn" title="Hapus file">×</button>
          </div>
          
          <div class="preview-content">
            <div class="preview-image-container">
              <img id="previewImage" alt="Preview" class="preview-image">
              <div class="image-overlay">
                <div class="image-info">
                  <span id="imageResolution"></span>
                </div>
              </div>
            </div>
            
            <div class="file-details">
              <div class="file-info">
                <div class="info-item">
                  <span class="info-label">📄 Nama File:</span>
                  <span class="info-value" id="fileName"></span>
                </div>
                <div class="info-item">
                  <span class="info-label">📦 Ukuran:</span>
                  <span class="info-value" id="fileSize"></span>
                </div>
                <div class="info-item">
                  <span class="info-label">🖼️ Tipe:</span>
                  <span class="info-value" id="fileType"></span>
                </div>
              </div>
              
              <div class="analysis-options">
                <div class="form-group">
                  <label for="imageNotes">📝 Catatan (Opsional):</label>
                  <textarea 
                    id="imageNotes" 
                    placeholder="Tambahkan catatan tentang kondisi tanaman, gejala yang terlihat, dll."
                    rows="3"
                    maxlength="500"
                  ></textarea>
                  <div class="char-counter">
                    <span id="notesCounter">0</span>/500 karakter
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="preview-actions">
            <button class="btn btn-success" id="analyzeBtn" ${this.isAnalyzing ? 'disabled' : ''}>
              ${this.isAnalyzing
        ? `
                <span class="btn-spinner"></span>
                <span class="btn-text">Menganalisis...</span>
              `
        : `
                <span class="btn-icon">🔬</span>
                <span class="btn-text">Analisis Gambar</span>
              `
      }
            </button>
            <button class="btn btn-secondary" id="cancelBtn">
              <span class="btn-icon">🗑️</span>
              <span class="btn-text">Batal</span>
            </button>
          </div>
        </div>
        
        <div class="upload-status" id="uploadStatus">
          <div class="status-content">
            <span class="status-icon">💡</span>
            <span class="status-text">Pilih gambar daun tanaman untuk analisis penyakit</span>
          </div>
        </div>
        
        <div class="upload-tips">
          <h4>💡 Tips untuk Hasil Terbaik:</h4>
          <div class="tips-grid">
            <div class="tip-item">
              <span class="tip-icon">📸</span>
              <span class="tip-text">Gunakan foto yang jelas dan fokus</span>
            </div>
            <div class="tip-item">
              <span class="tip-icon">💡</span>
              <span class="tip-text">Pastikan pencahayaan yang cukup</span>
            </div>
            <div class="tip-item">
              <span class="tip-icon">🎯</span>
              <span class="tip-text">Fokus pada daun yang bermasalah</span>
            </div>
            <div class="tip-item">
              <span class="tip-icon">📏</span>
              <span class="tip-text">Hindari foto yang terlalu jauh</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  afterRender() {
    this.bindEvents();
    this.bindResetListener();
  }

  bindEvents() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const selectFileBtn = document.getElementById('selectFileBtn');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const removeFileBtn = document.getElementById('removeFileBtn');
    const imageNotes = document.getElementById('imageNotes');

    // File selection events
    selectFileBtn?.addEventListener('click', () => fileInput?.click());
    fileInput?.addEventListener('change', e => this.handleFileSelect(e));

    // Drag and drop events
    uploadArea?.addEventListener('dragover', e => this.handleDragOver(e));
    uploadArea?.addEventListener('dragleave', e => this.handleDragLeave(e));
    uploadArea?.addEventListener('drop', e => this.handleDrop(e));
    uploadArea?.addEventListener('click', e => {
      if (e.target === uploadArea || e.target.closest('.upload-content')) {
        fileInput?.click();
      }
    });

    // Action buttons
    analyzeBtn?.addEventListener('click', () => this.analyzeImage());
    cancelBtn?.addEventListener('click', () => this.cancelSelection());
    removeFileBtn?.addEventListener('click', () => this.cancelSelection());

    // Notes character counter
    imageNotes?.addEventListener('input', e => this.updateCharCounter(e));
  }

  bindResetListener() {
    window.addEventListener('resetComponents', () => {
      this.resetComponent();
    });
  }

  handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!this.isDragging) {
      this.isDragging = true;
      const uploadArea = document.getElementById('uploadArea');
      uploadArea?.classList.add('drag-over');
    }
  }

  handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();

    // Only remove drag state if leaving the upload area completely
    const uploadArea = document.getElementById('uploadArea');
    if (!uploadArea?.contains(e.relatedTarget)) {
      this.isDragging = false;
      uploadArea?.classList.remove('drag-over');
    }
  }

  handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    this.isDragging = false;
    const uploadArea = document.getElementById('uploadArea');
    uploadArea?.classList.remove('drag-over');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      this.processFile(files[0]);
    }
  }

  handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
      this.processFile(file);
    }
  }

  processFile(file) {
    // Reset any previous state
    this.selectedFile = null;

    // Validate file type
    if (!this.allowedTypes.includes(file.type)) {
      this.updateStatus('error', 'Format file tidak didukung. Gunakan JPG, PNG, atau WebP.');
      return;
    }

    // Validate file size
    if (file.size > this.maxFileSize) {
      this.updateStatus(
        'error',
        `Ukuran file terlalu besar. Maksimal ${this.formatFileSize(this.maxFileSize)}.`,
      );
      return;
    }

    // Validate if it's actually an image
    const img = new Image();
    img.onload = () => {
      // Check minimum resolution
      if (img.width < 224 || img.height < 224) {
        this.updateStatus(
          'warning',
          'Resolusi gambar terlalu kecil. Minimal 224x224 pixel untuk hasil optimal.',
        );
        return;
      }

      this.selectedFile = file;
      this.showPreview(file, { width: img.width, height: img.height });
    };

    img.onerror = () => {
      this.updateStatus('error', 'File rusak atau bukan gambar yang valid.');
    };

    // Create object URL for validation
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;
  }

  showPreview(file, dimensions) {
    const reader = new FileReader();

    reader.onload = e => {
      const uploadArea = document.getElementById('uploadArea');
      const filePreview = document.getElementById('filePreview');
      const previewImage = document.getElementById('previewImage');
      const fileName = document.getElementById('fileName');
      const fileSize = document.getElementById('fileSize');
      const fileType = document.getElementById('fileType');
      const imageResolution = document.getElementById('imageResolution');

      // Update preview content
      previewImage.src = e.target.result;
      fileName.textContent = file.name;
      fileSize.textContent = this.formatFileSize(file.size);
      fileType.textContent = file.type;
      imageResolution.textContent = `${dimensions.width} × ${dimensions.height}px`;

      // Show preview, hide upload area
      uploadArea.style.display = 'none';
      filePreview.classList.remove('hidden');

      this.updateStatus('success', 'File siap untuk dianalisis');
    };

    reader.onerror = () => {
      this.updateStatus('error', 'Gagal membaca file');
    };

    reader.readAsDataURL(file);
  }

  cancelSelection() {
    this.selectedFile = null;
    this.isAnalyzing = false;

    const uploadArea = document.getElementById('uploadArea');
    const filePreview = document.getElementById('filePreview');
    const fileInput = document.getElementById('fileInput');
    const imageNotes = document.getElementById('imageNotes');

    // Reset UI
    uploadArea.style.display = 'block';
    filePreview.classList.add('hidden');
    fileInput.value = '';
    imageNotes.value = '';
    this.updateCharCounter({ target: imageNotes });

    this.updateStatus('info', 'Pilih gambar daun tanaman untuk analisis penyakit');
  }

  resetComponent() {
    this.cancelSelection();
  }

  updateCharCounter(e) {
    const counter = document.getElementById('notesCounter');
    const length = e.target.value.length;
    counter.textContent = length;

    // Update counter color based on length
    counter.className = '';
    if (length > 450) {
      counter.classList.add('text-danger');
    } else if (length > 350) {
      counter.classList.add('text-warning');
    }
  }

  async analyzeImage() {
    if (!this.selectedFile || this.isAnalyzing) {
      return;
    }

    try {
      this.setAnalyzingState(true);

      // Create FormData
      const formData = new FormData();
      formData.append('image', this.selectedFile);

      // Add notes if provided
      const notes = document.getElementById('imageNotes')?.value.trim();
      if (notes) {
        formData.append('notes', notes);
      }

      this.updateStatus('info', 'Mengunggah dan menganalisis gambar...');

      // Call API
      const response = await apiService.predictDisease(formData);

      // Create result object for the event
      const result = {
        imageUrl: URL.createObjectURL(this.selectedFile),
        disease: response.data.predictedClass,
        confidence: response.data.confidence,
        recommendation: this.getRecommendation(response.data.predictedClass),
        allPredictions: response.data.allPredictions,
        processingTime: response.data.processingTime,
        notes,
      };

      // Dispatch result event
      window.dispatchEvent(
        new CustomEvent('detectionResult', {
          detail: result,
        }),
      );

      this.updateStatus('success', 'Analisis selesai! Lihat hasil di bawah.');
    } catch (error) {
      console.error('Analysis error:', error);

      let errorMessage = 'Gagal menganalisis gambar. ';

      if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage += 'Periksa koneksi internet Anda.';
      } else if (error.message.includes('size') || error.message.includes('large')) {
        errorMessage += 'Ukuran file terlalu besar.';
      } else if (error.message.includes('format') || error.message.includes('type')) {
        errorMessage += 'Format file tidak didukung.';
      } else {
        errorMessage += 'Silakan coba lagi.';
      }

      this.updateStatus('error', errorMessage);
    } finally {
      this.setAnalyzingState(false);
    }
  }

  getRecommendation(predictedClass) {
    const recommendations = {
      // Healthy
      healthy: 'Tanaman dalam kondisi sehat. Lanjutkan perawatan rutin.',

      // Chili diseases
      chili__leaf_curl:
        'Tingkatkan drainase tanah dan kurangi kelembaban. Gunakan mulsa untuk menjaga kelembaban tanah tetap stabil.',
      chili__leaf_spot:
        'Buang daun yang terinfeksi dan tingkatkan sirkulasi udara. Aplikasikan fungisida jika diperlukan.',
      chili__whitefly:
        'Gunakan perangkap kuning lengket dan aplikasikan insektisida ramah lingkungan.',

      // Corn diseases
      corn__common_rust: 'Aplikasikan fungisida preventif dan pastikan rotasi tanaman yang baik.',
      corn__gray_leaf_spot:
        'Tingkatkan jarak tanam untuk sirkulasi udara yang lebih baik dan gunakan varietas tahan.',
      corn__northern_leaf_blight:
        'Buang sisa tanaman yang terinfeksi dan aplikasikan fungisida sesuai kebutuhan.',

      // Rice diseases
      rice__brown_spot:
        'Perbaiki manajemen air dan nutrisi tanaman. Aplikasikan fungisida jika diperlukan.',
      rice__leaf_blast: 'Kurangi nitrogen berlebih dan tingkatkan drainase sawah.',
      rice__neck_blast: 'Gunakan varietas tahan dan aplikasikan fungisida pada tahap pembungaan.',

      // Tomato diseases
      tomato__early_blight:
        'Tingkatkan sirkulasi udara dan hindari penyiraman pada daun. Gunakan mulsa.',
      tomato__late_blight: 'Aplikasikan fungisida preventif dan pastikan drainase yang baik.',
      tomato__yellow_leaf_curl_virus:
        'Kontrol kutu kebul sebagai vektor virus dan gunakan varietas tahan.',
    };

    const key = predictedClass?.toLowerCase().replace(/[^a-z_]/g, '');
    return (
      recommendations[key] || 'Konsultasikan dengan ahli pertanian untuk penanganan yang tepat.'
    );
  }

  setAnalyzingState(analyzing) {
    this.isAnalyzing = analyzing;
    const analyzeBtn = document.getElementById('analyzeBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    if (analyzing) {
      analyzeBtn.disabled = true;
      analyzeBtn.innerHTML = `
        <span class="btn-spinner"></span>
        <span class="btn-text">Menganalisis...</span>
      `;
      cancelBtn.disabled = true;
    } else {
      analyzeBtn.disabled = false;
      analyzeBtn.innerHTML = `
        <span class="btn-icon">🔬</span>
        <span class="btn-text">Analisis Gambar</span>
      `;
      cancelBtn.disabled = false;
    }
  }

  formatFileSize(bytes) {
    if (bytes === 0) {
      return '0 Bytes';
    }

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  updateStatus(type, message) {
    const statusElement = document.getElementById('uploadStatus');
    if (!statusElement) {
      return;
    }

    const iconMap = {
      info: '💡',
      success: '✅',
      warning: '⚠️',
      error: '❌',
    };

    statusElement.innerHTML = `
      <div class="status-content status-${type}">
        <span class="status-icon">${iconMap[type] || '💡'}</span>
        <span class="status-text">${message}</span>
      </div>
    `;
  }
}
