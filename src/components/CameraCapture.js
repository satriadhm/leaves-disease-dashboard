// src/components/CameraCapture.js
import apiService from '../services/api.js';

export default class CameraCapture {
  constructor() {
    this.stream = null;
    this.video = null;
    this.canvas = null;
    this.isCapturing = false;
    this.isAnalyzing = false;
    this.capturedImageBlob = null;
    this.facingMode = 'environment'; // Start with back camera
    this.constraints = {
      video: {
        width: { ideal: 1280, max: 1920 },
        height: { ideal: 720, max: 1080 },
        facingMode: this.facingMode
      }
    };
  }

  render() {
    return `
      <div class="camera-container">
        <div class="camera-preview" id="cameraPreview">
          <video id="cameraVideo" autoplay playsinline muted></video>
          <canvas id="cameraCanvas" style="display: none;"></canvas>
          
          <div class="camera-overlay">
            <div class="camera-frame">
              <div class="frame-corner top-left"></div>
              <div class="frame-corner top-right"></div>
              <div class="frame-corner bottom-left"></div>
              <div class="frame-corner bottom-right"></div>
            </div>
            <div class="camera-guide">
              <span class="guide-text">Arahkan kamera ke daun tanaman</span>
            </div>
          </div>
          
          <div class="camera-controls-overlay">
            <button class="control-btn flip-btn" id="flipCameraBtn" title="Ganti Kamera">
              <span class="btn-icon">🔄</span>
            </button>
            <button class="control-btn flash-btn" id="flashBtn" title="Flash (Coming Soon)" disabled>
              <span class="btn-icon">⚡</span>
            </button>
          </div>
        </div>
        
        <div class="camera-controls">
          <div class="control-group">
            <button class="btn btn-primary" id="startCameraBtn">
              <span class="btn-icon">📷</span>
              <span class="btn-text">Mulai Kamera</span>
            </button>
            <button class="btn btn-success capture-btn" id="captureBtn" style="display: none;">
              <span class="btn-icon">📸</span>
              <span class="btn-text">Ambil Foto</span>
            </button>
            <button class="btn btn-secondary" id="stopCameraBtn" style="display: none;">
              <span class="btn-icon">⏹️</span>
              <span class="btn-text">Hentikan</span>
            </button>
          </div>
        </div>
        
        <div class="camera-status" id="cameraStatus">
          <div class="status-content">
            <span class="status-icon">📷</span>
            <span class="status-text">Klik "Mulai Kamera" untuk memulai deteksi</span>
          </div>
        </div>
        
        <!-- Captured Image Preview -->
        <div class="captured-preview hidden" id="capturedPreview">
          <div class="preview-header">
            <h4>📷 Foto yang Diambil</h4>
            <button class="btn-close" id="discardBtn" title="Buang foto">×</button>
          </div>
          
          <div class="preview-content">
            <div class="preview-image-container">
              <img id="capturedImage" alt="Captured image" class="captured-image">
            </div>
            
            <div class="capture-details">
              <div class="analysis-options">
                <div class="form-group">
                  <label for="captureNotes">📝 Catatan (Opsional):</label>
                  <textarea 
                    id="captureNotes" 
                    placeholder="Tambahkan catatan tentang kondisi tanaman yang terlihat..."
                    rows="3"
                    maxlength="500"
                  ></textarea>
                  <div class="char-counter">
                    <span id="captureNotesCounter">0</span>/500 karakter
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="preview-actions">
            <button class="btn btn-success" id="analyzeCapturedBtn" ${this.isAnalyzing ? 'disabled' : ''}>
              ${this.isAnalyzing ? `
                <span class="btn-spinner"></span>
                <span class="btn-text">Menganalisis...</span>
              ` : `
                <span class="btn-icon">🔬</span>
                <span class="btn-text">Analisis Foto</span>
              `}
            </button>
            <button class="btn btn-secondary" id="retakeBtn">
              <span class="btn-icon">🔄</span>
              <span class="btn-text">Foto Ulang</span>
            </button>
            <button class="btn btn-outline" id="downloadBtn">
              <span class="btn-icon">💾</span>
              <span class="btn-text">Simpan Foto</span>
            </button>
          </div>
        </div>
        
        <div class="camera-tips">
          <h4>📸 Tips Foto yang Baik:</h4>
          <div class="tips-grid">
            <div class="tip-item">
              <span class="tip-icon">💡</span>
              <span class="tip-text">Pastikan pencahayaan cukup terang</span>
            </div>
            <div class="tip-item">
              <span class="tip-icon">🎯</span>
              <span class="tip-text">Fokus pada daun yang bermasalah</span>
            </div>
            <div class="tip-item">
              <span class="tip-icon">📐</span>
              <span class="tip-text">Posisi tegak lurus dengan daun</span>
            </div>
            <div class="tip-item">
              <span class="tip-icon">📏</span>
              <span class="tip-text">Jarak 10-20 cm dari objek</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  afterRender() {
    this.video = document.getElementById('cameraVideo');
    this.canvas = document.getElementById('cameraCanvas');
    this.bindEvents();
    this.bindResetListener();
  }

  bindEvents() {
    const startBtn = document.getElementById('startCameraBtn');
    const captureBtn = document.getElementById('captureBtn');
    const stopBtn = document.getElementById('stopCameraBtn');
    const flipBtn = document.getElementById('flipCameraBtn');
    const analyzeCapturedBtn = document.getElementById('analyzeCapturedBtn');
    const retakeBtn = document.getElementById('retakeBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const discardBtn = document.getElementById('discardBtn');
    const captureNotes = document.getElementById('captureNotes');

    // Camera controls
    startBtn?.addEventListener('click', () => this.startCamera());
    captureBtn?.addEventListener('click', () => this.capturePhoto());
    stopBtn?.addEventListener('click', () => this.stopCamera());
    flipBtn?.addEventListener('click', () => this.flipCamera());

    // Captured image actions
    analyzeCapturedBtn?.addEventListener('click', () => this.analyzeCapturedImage());
    retakeBtn?.addEventListener('click', () => this.retakePhoto());
    downloadBtn?.addEventListener('click', () => this.downloadCapturedImage());
    discardBtn?.addEventListener('click', () => this.discardCapturedImage());

    // Notes character counter
    captureNotes?.addEventListener('input', (e) => this.updateCharCounter(e));

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeydown(e));
  }

  bindResetListener() {
    window.addEventListener('resetComponents', () => {
      this.resetComponent();
    });

    window.addEventListener('stopCamera', () => {
      this.stopCamera();
    });
  }

  handleKeydown(e) {
    // Only handle shortcuts when camera is active
    if (!this.isCapturing) return;

    switch(e.code) {
      case 'Space':
        e.preventDefault();
        this.capturePhoto();
        break;
      case 'Escape':
        e.preventDefault();
        this.stopCamera();
        break;
    }
  }

  async startCamera() {
    try {
      this.updateStatus('info', 'Memulai kamera...');

      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Browser tidak mendukung akses kamera');
      }

      // Request camera permission
      this.stream = await navigator.mediaDevices.getUserMedia(this.constraints);
      
      if (!this.video) {
        throw new Error('Video element tidak ditemukan');
      }

      this.video.srcObject = this.stream;

      // Wait for video to load metadata
      await new Promise((resolve, reject) => {
        this.video.onloadedmetadata = () => {
          this.canvas.width = this.video.videoWidth;
          this.canvas.height = this.video.videoHeight;
          resolve();
        };
        this.video.onerror = reject;
      });

      await this.video.play();

      this.isCapturing = true;
      this.updateStatus('success', 'Kamera aktif. Tekan spasi atau klik tombol untuk mengambil foto.');
      this.toggleButtons(true);

    } catch (error) {
      console.error('Error accessing camera:', error);
      
      let errorMessage = 'Gagal mengakses kamera. ';
      
      if (error.name === 'NotAllowedError') {
        errorMessage += 'Izin kamera ditolak. Silakan izinkan akses kamera di pengaturan browser.';
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'Kamera tidak ditemukan. Pastikan perangkat memiliki kamera.';
      } else if (error.name === 'NotReadableError') {
        errorMessage += 'Kamera sedang digunakan oleh aplikasi lain.';
      } else if (error.name === 'OverconstrainedError') {
        errorMessage += 'Resolusi kamera tidak didukung.';
      } else {
        errorMessage += error.message || 'Terjadi kesalahan yang tidak dikenal.';
      }
      
      this.updateStatus('error', errorMessage);
    }
  }

  capturePhoto() {
    if (!this.video || !this.canvas || !this.isCapturing) return;

    try {
      const context = this.canvas.getContext('2d');
      
      // Draw video frame to canvas
      context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

      // Convert to blob
      this.canvas.toBlob(
        (blob) => {
          if (blob) {
            this.capturedImageBlob = blob;
            const imageUrl = URL.createObjectURL(blob);
            this.showCapturedImage(imageUrl);
            this.updateStatus('success', 'Foto berhasil diambil! Review dan analisis foto Anda.');
          } else {
            this.updateStatus('error', 'Gagal mengambil foto. Silakan coba lagi.');
          }
        },
        'image/jpeg',
        0.9
      );

    } catch (error) {
      console.error('Error capturing photo:', error);
      this.updateStatus('error', 'Gagal mengambil foto. Silakan coba lagi.');
    }
  }

  showCapturedImage(imageUrl) {
    const cameraPreview = document.getElementById('cameraPreview');
    const capturedPreview = document.getElementById('capturedPreview');
    const capturedImage = document.getElementById('capturedImage');

    // Hide camera, show captured image
    cameraPreview.style.display = 'none';
    capturedPreview.classList.remove('hidden');
    capturedImage.src = imageUrl;

    // Update controls
    this.toggleButtons(false);
  }

  retakePhoto() {
    const cameraPreview = document.getElementById('cameraPreview');
    const capturedPreview = document.getElementById('capturedPreview');
    const captureNotes = document.getElementById('captureNotes');

    // Clear captured data
    this.capturedImageBlob = null;
    
    // Reset UI
    cameraPreview.style.display = 'block';
    capturedPreview.classList.add('hidden');
    captureNotes.value = '';
    this.updateCharCounter({ target: captureNotes });

    // Restore camera controls
    this.toggleButtons(true);
    this.updateStatus('info', 'Siap mengambil foto baru.');
  }

  discardCapturedImage() {
    this.capturedImageBlob = null;
    this.retakePhoto();
  }

  async downloadCapturedImage() {
    if (!this.capturedImageBlob) return;

    try {
      const url = URL.createObjectURL(this.capturedImageBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `plant-photo-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      this.updateStatus('success', 'Foto berhasil disimpan ke perangkat.');
    } catch (error) {
      this.updateStatus('error', 'Gagal menyimpan foto.');
    }
  }

  async flipCamera() {
    if (!this.isCapturing) return;

    try {
      // Toggle facing mode
      this.facingMode = this.facingMode === 'user' ? 'environment' : 'user';
      this.constraints.video.facingMode = this.facingMode;

      // Stop current stream
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
      }

      // Start with new constraints
      await this.startCamera();
      
    } catch (error) {
      console.error('Error flipping camera:', error);
      this.updateStatus('warning', 'Gagal mengganti kamera. Menggunakan kamera default.');
      
      // Fallback to default constraints
      this.facingMode = 'environment';
      this.constraints.video.facingMode = this.facingMode;
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    if (this.video) {
      this.video.srcObject = null;
    }

    this.isCapturing = false;
    this.capturedImageBlob = null;

    // Reset UI
    const cameraPreview = document.getElementById('cameraPreview');
    const capturedPreview = document.getElementById('capturedPreview');
    
    cameraPreview.style.display = 'block';
    capturedPreview.classList.add('hidden');

    this.toggleButtons(false);
    this.updateStatus('info', 'Kamera dihentikan. Klik "Mulai Kamera" untuk memulai lagi.');
  }

  resetComponent() {
    this.stopCamera();
  }

  toggleButtons(cameraActive) {
    const startBtn = document.getElementById('startCameraBtn');
    const captureBtn = document.getElementById('captureBtn');
    const stopBtn = document.getElementById('stopCameraBtn');
    const flipBtn = document.getElementById('flipCameraBtn');

    if (cameraActive) {
      startBtn.style.display = 'none';
      captureBtn.style.display = 'inline-flex';
      stopBtn.style.display = 'inline-flex';
      flipBtn.style.display = 'inline-flex';
    } else {
      startBtn.style.display = 'inline-flex';
      captureBtn.style.display = 'none';
      stopBtn.style.display = 'none';
      flipBtn.style.display = 'none';
    }
  }

  updateCharCounter(e) {
    const counter = document.getElementById('captureNotesCounter');
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

  async analyzeCapturedImage() {
    if (!this.capturedImageBlob || this.isAnalyzing) return;

    try {
      this.setAnalyzingState(true);
      
      // Create FormData
      const formData = new FormData();
      formData.append('image', this.capturedImageBlob, 'camera-capture.jpg');
      
      // Add notes if provided
      const notes = document.getElementById('captureNotes')?.value.trim();
      if (notes) {
        formData.append('notes', notes);
      }

      this.updateStatus('info', 'Menganalisis foto...');

      // Call API
      const response = await apiService.predictDisease(formData);

      // Create result object for the event
      const result = {
        imageUrl: URL.createObjectURL(this.capturedImageBlob),
        disease: response.data.predictedClass,
        confidence: response.data.confidence,
        recommendation: this.getRecommendation(response.data.predictedClass),
        allPredictions: response.data.allPredictions,
        processingTime: response.data.processingTime,
        notes: notes
      };

      // Dispatch result event
      window.dispatchEvent(new CustomEvent('detectionResult', {
        detail: result
      }));

      this.updateStatus('success', 'Analisis selesai! Lihat hasil di bawah.');

    } catch (error) {
      console.error('Analysis error:', error);
      
      let errorMessage = 'Gagal menganalisis foto. ';
      
      if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage += 'Periksa koneksi internet Anda.';
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
      'healthy': 'Tanaman dalam kondisi sehat. Lanjutkan perawatan rutin.',
      
      // Chili diseases
      'chili__leaf_curl': 'Tingkatkan drainase tanah dan kurangi kelembaban. Gunakan mulsa untuk menjaga kelembaban tanah tetap stabil.',
      'chili__leaf_spot': 'Buang daun yang terinfeksi dan tingkatkan sirkulasi udara. Aplikasikan fungisida jika diperlukan.',
      'chili__whitefly': 'Gunakan perangkap kuning lengket dan aplikasikan insektisida ramah lingkungan.',
      
      // Corn diseases  
      'corn__common_rust': 'Aplikasikan fungisida preventif dan pastikan rotasi tanaman yang baik.',
      'corn__gray_leaf_spot': 'Tingkatkan jarak tanam untuk sirkulasi udara yang lebih baik dan gunakan varietas tahan.',
      'corn__northern_leaf_blight': 'Buang sisa tanaman yang terinfeksi dan aplikasikan fungisida sesuai kebutuhan.',
      
      // Rice diseases
      'rice__brown_spot': 'Perbaiki manajemen air dan nutrisi tanaman. Aplikasikan fungisida jika diperlukan.',
      'rice__leaf_blast': 'Kurangi nitrogen berlebih dan tingkatkan drainase sawah.',
      'rice__neck_blast': 'Gunakan varietas tahan dan aplikasikan fungisida pada tahap pembungaan.',
      
      // Tomato diseases
      'tomato__early_blight': 'Tingkatkan sirkulasi udara dan hindari penyiraman pada daun. Gunakan mulsa.',
      'tomato__late_blight': 'Aplikasikan fungisida preventif dan pastikan drainase yang baik.',
      'tomato__yellow_leaf_curl_virus': 'Kontrol kutu kebul sebagai vektor virus dan gunakan varietas tahan.'
    };

    const key = predictedClass?.toLowerCase().replace(/[^a-z_]/g, '');
    return recommendations[key] || 'Konsultasikan dengan ahli pertanian untuk penanganan yang tepat.';
  }

  setAnalyzingState(analyzing) {
    this.isAnalyzing = analyzing;
    const analyzeBtn = document.getElementById('analyzeCapturedBtn');
    const retakeBtn = document.getElementById('retakeBtn');
    
    if (analyzing) {
      analyzeBtn.disabled = true;
      analyzeBtn.innerHTML = `
        <span class="btn-spinner"></span>
        <span class="btn-text">Menganalisis...</span>
      `;
      retakeBtn.disabled = true;
    } else {
      analyzeBtn.disabled = false;
      analyzeBtn.innerHTML = `
        <span class="btn-icon">🔬</span>
        <span class="btn-text">Analisis Foto</span>
      `;
      retakeBtn.disabled = false;
    }
  }

  updateStatus(type, message) {
    const statusElement = document.getElementById('cameraStatus');
    if (!statusElement) return;

    const iconMap = {
      info: '📷',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    };

    statusElement.innerHTML = `
      <div class="status-content status-${type}">
        <span class="status-icon">${iconMap[type] || '📷'}</span>
        <span class="status-text">${message}</span>
      </div>
    `;
  }
}