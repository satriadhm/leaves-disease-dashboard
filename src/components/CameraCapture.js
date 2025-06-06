export default class CameraCapture {
	constructor() {
		this.stream = null;
		this.video = null;
		this.canvas = null;
		this.isCapturing = false;
	}

	render() {
		return `
        <div class="camera-container">
          <div class="camera-preview">
            <video id="cameraVideo" autoplay playsinline></video>
            <canvas id="cameraCanvas" style="display: none;"></canvas>
          </div>
          <div class="camera-controls">
            <button class="btn btn-primary" id="startCameraBtn">Mulai Kamera</button>
            <button class="btn btn-success" id="captureBtn" style="display: none;">Ambil Foto</button>
            <button class="btn btn-secondary" id="stopCameraBtn" style="display: none;">Hentikan Kamera</button>
          </div>
          <div class="camera-status" id="cameraStatus">
            <p>Klik "Mulai Kamera" untuk memulai deteksi</p>
          </div>
        </div>
      `;
	}

	afterRender() {
		this.video = document.getElementById("cameraVideo");
		this.canvas = document.getElementById("cameraCanvas");
		this.bindEvents();
	}

	bindEvents() {
		const startBtn = document.getElementById("startCameraBtn");
		const captureBtn = document.getElementById("captureBtn");
		const stopBtn = document.getElementById("stopCameraBtn");

		startBtn.addEventListener("click", () => this.startCamera());
		captureBtn.addEventListener("click", () => this.capturePhoto());
		stopBtn.addEventListener("click", () => this.stopCamera());
	}

	async startCamera() {
		try {
			this.updateStatus("Memulai kamera...");

			const constraints = {
				video: {
					width: { ideal: 1280 },
					height: { ideal: 720 },
					facingMode: "environment", // Use back camera on mobile
				},
			};

			this.stream = await navigator.mediaDevices.getUserMedia(constraints);
			this.video.srcObject = this.stream;

			this.video.onloadedmetadata = () => {
				this.canvas.width = this.video.videoWidth;
				this.canvas.height = this.video.videoHeight;
			};

			this.updateStatus(
				"Kamera aktif. Arahkan ke tanaman yang ingin dianalisis."
			);
			this.toggleButtons(true);
		} catch (error) {
			console.error("Error accessing camera:", error);
			this.updateStatus(
				"Gagal mengakses kamera. Pastikan izin kamera telah diberikan."
			);
		}
	}

	capturePhoto() {
		if (!this.video || !this.canvas) return;

		const context = this.canvas.getContext("2d");
		context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

		this.canvas.toBlob(
			(blob) => {
				const imageUrl = URL.createObjectURL(blob);
				this.processImage(imageUrl, blob);
			},
			"image/jpeg",
			0.8
		);
	}

	stopCamera() {
		if (this.stream) {
			this.stream.getTracks().forEach((track) => track.stop());
			this.stream = null;
		}

		this.video.srcObject = null;
		this.updateStatus("Kamera dihentikan.");
		this.toggleButtons(false);
	}

	toggleButtons(cameraActive) {
		const startBtn = document.getElementById("startCameraBtn");
		const captureBtn = document.getElementById("captureBtn");
		const stopBtn = document.getElementById("stopCameraBtn");

		if (cameraActive) {
			startBtn.style.display = "none";
			captureBtn.style.display = "inline-block";
			stopBtn.style.display = "inline-block";
		} else {
			startBtn.style.display = "inline-block";
			captureBtn.style.display = "none";
			stopBtn.style.display = "none";
		}
	}

	updateStatus(message) {
		const status = document.getElementById("cameraStatus");
		status.innerHTML = `<p>${message}</p>`;
	}

	async processImage(imageUrl, blob) {
		this.updateStatus("Menganalisis gambar...");

		try {
			// Simulate API call to ML backend
			const result = await this.simulateDetection(blob);

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
			console.error("Error processing image:", error);
			this.updateStatus("Gagal menganalisis gambar. Silakan coba lagi.");
		}
	}

	simulateDetection(blob) {
		return new Promise((resolve) => {
			setTimeout(() => {
				// Simulate ML detection results
				const diseases = [
					{
						disease: "Blight",
						confidence: 85,
						recommendation: "Gunakan fungisida dan pastikan drainase yang baik",
					},
					{
						disease: "Leaf Spot",
						confidence: 78,
						recommendation:
							"Buang daun yang terinfeksi dan tingkatkan sirkulasi udara",
					},
					{
						disease: null,
						confidence: 92,
						recommendation: "Tanaman terlihat sehat, lanjutkan perawatan rutin",
					},
				];

				const randomResult =
					diseases[Math.floor(Math.random() * diseases.length)];
				resolve(randomResult);
			}, 2000);
		});
	}
}
