export default class FileUpload {
	constructor() {
		this.selectedFile = null;
	}

	render() {
		return `
        <div class="upload-container">
          <div class="upload-area" id="uploadArea">
            <div class="upload-icon">📁</div>
            <h3>Upload Gambar Tanaman</h3>
            <p>Drag & drop gambar di sini atau klik untuk memilih file</p>
            <input type="file" id="fileInput" accept="image/*" style="display: none;">
            <button class="btn btn-primary" id="selectFileBtn">Pilih File</button>
          </div>
          
          <div class="file-preview" id="filePreview" style="display: none;">
            <img id="previewImage" alt="Preview">
            <div class="file-info">
              <p id="fileName"></p>
              <p id="fileSize"></p>
            </div>
            <div class="preview-actions">
              <button class="btn btn-success" id="analyzeBtn">Analisis Gambar</button>
              <button class="btn btn-secondary" id="cancelBtn">Batal</button>
            </div>
          </div>
          
          <div class="upload-status" id="uploadStatus">
            <p>Pilih gambar tanaman untuk dianalisis</p>
          </div>
        </div>
      `;
	}

	afterRender() {
		this.bindEvents();
	}

	bindEvents() {
		const uploadArea = document.getElementById("uploadArea");
		const fileInput = document.getElementById("fileInput");
		const selectFileBtn = document.getElementById("selectFileBtn");
		const analyzeBtn = document.getElementById("analyzeBtn");
		const cancelBtn = document.getElementById("cancelBtn");

		// File selection
		selectFileBtn.addEventListener("click", () => fileInput.click());
		fileInput.addEventListener("change", (e) => this.handleFileSelect(e));

		// Drag and drop
		uploadArea.addEventListener("dragover", (e) => this.handleDragOver(e));
		uploadArea.addEventListener("dragleave", (e) => this.handleDragLeave(e));
		uploadArea.addEventListener("drop", (e) => this.handleDrop(e));

		// Actions
		analyzeBtn.addEventListener("click", () => this.analyzeImage());
		cancelBtn.addEventListener("click", () => this.cancelSelection());
	}

	handleDragOver(e) {
		e.preventDefault();
		e.currentTarget.classList.add("drag-over");
	}

	handleDragLeave(e) {
		e.preventDefault();
		e.currentTarget.classList.remove("drag-over");
	}

	handleDrop(e) {
		e.preventDefault();
		e.currentTarget.classList.remove("drag-over");

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
		// Validate file type
		if (!file.type.startsWith("image/")) {
			this.updateStatus("File harus berupa gambar (JPG, PNG, dll.)");
			return;
		}

		// Validate file size (max 10MB)
		if (file.size > 10 * 1024 * 1024) {
			this.updateStatus("Ukuran file terlalu besar. Maksimal 10MB.");
			return;
		}

		this.selectedFile = file;
		this.showPreview(file);
	}

	showPreview(file) {
		const reader = new FileReader();

		reader.onload = (e) => {
			const uploadArea = document.getElementById("uploadArea");
			const filePreview = document.getElementById("filePreview");
			const previewImage = document.getElementById("previewImage");
			const fileName = document.getElementById("fileName");
			const fileSize = document.getElementById("fileSize");

			previewImage.src = e.target.result;
			fileName.textContent = file.name;
			fileSize.textContent = this.formatFileSize(file.size);

			uploadArea.style.display = "none";
			filePreview.style.display = "block";

			this.updateStatus("File siap untuk dianalisis");
		};

		reader.readAsDataURL(file);
	}

	cancelSelection() {
		this.selectedFile = null;

		const uploadArea = document.getElementById("uploadArea");
		const filePreview = document.getElementById("filePreview");
		const fileInput = document.getElementById("fileInput");

		uploadArea.style.display = "block";
		filePreview.style.display = "none";
		fileInput.value = "";

		this.updateStatus("Pilih gambar tanaman untuk dianalisis");
	}

	async analyzeImage() {
		if (!this.selectedFile) return;

		this.updateStatus("Menganalisis gambar...");

		try {
			// Create object URL for preview
			const imageUrl = URL.createObjectURL(this.selectedFile);

			// Simulate API call to ML backend
			const result = await this.simulateDetection(this.selectedFile);

			// Dispatch result event
			window.dispatchEvent(
				new CustomEvent("detectionResult", {
					detail: {
						imageUrl: imageUrl,
						disease: result.disease,
						confidence: result.confidence,
						recommendation: result.recommendation,
					},
				})
			);

			this.updateStatus("Analisis selesai. Lihat hasil di bawah.");
		} catch (error) {
			console.error("Error analyzing image:", error);
			this.updateStatus("Gagal menganalisis gambar. Silakan coba lagi.");
		}
	}

	simulateDetection(file) {
		return new Promise((resolve) => {
			setTimeout(() => {
				// Simulate ML detection results
				const diseases = [
					{
						disease: "Powdery Mildew",
						confidence: 89,
						recommendation: "Aplikasikan fungisida dan kurangi kelembaban",
					},
					{
						disease: "Rust",
						confidence: 76,
						recommendation:
							"Buang bagian yang terinfeksi dan tingkatkan ventilasi",
					},
					{
						disease: "Bacterial Wilt",
						confidence: 82,
						recommendation: "Isolasi tanaman dan gunakan bakterisida",
					},
					{
						disease: null,
						confidence: 94,
						recommendation: "Tanaman dalam kondisi sehat",
					},
				];

				const randomResult =
					diseases[Math.floor(Math.random() * diseases.length)];
				resolve(randomResult);
			}, 3000);
		});
	}

	formatFileSize(bytes) {
		if (bytes === 0) return "0 Bytes";

		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));

		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	}

	updateStatus(message) {
		const status = document.getElementById("uploadStatus");
		status.innerHTML = `<p>${message}</p>`;
	}
}
