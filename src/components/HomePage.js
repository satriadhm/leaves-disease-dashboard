import CameraCapture from "./CameraCapture.js";
import FileUpload from "./FileUpload.js";

export default class HomePage {
	constructor() {
		this.user = JSON.parse(localStorage.getItem("user") || "{}");
		this.activeTab = "camera";
	}

	render() {
		return `
      <div class="home-container">
        <header class="header">
          <div class="header-content">
            <h1>Plant Disease Detection</h1>
            <div class="user-info">
              <span>Halo, ${this.user.name || "User"}</span>
              <button class="btn btn-secondary" id="logoutBtn">Keluar</button>
            </div>
          </div>
        </header>

        <main class="main-content">
          <div class="welcome-section">
            <h2>Deteksi Penyakit Tanaman</h2>
            <p>Gunakan kamera atau upload gambar untuk mendeteksi penyakit pada tanaman Anda</p>
          </div>

          <div class="detection-section">
            <div class="tab-navigation">
              <button class="tab-btn ${
								this.activeTab === "camera" ? "active" : ""
							}" data-tab="camera">
                📷 Kamera
              </button>
              <button class="tab-btn ${
								this.activeTab === "upload" ? "active" : ""
							}" data-tab="upload">
                📁 Upload File
              </button>
            </div>

            <div class="tab-content">
              <div class="tab-panel ${
								this.activeTab === "camera" ? "active" : ""
							}" id="cameraPanel">
                <div id="cameraComponent"></div>
              </div>
              <div class="tab-panel ${
								this.activeTab === "upload" ? "active" : ""
							}" id="uploadPanel">
                <div id="uploadComponent"></div>
              </div>
            </div>
          </div>

          <div class="results-section" id="resultsSection" style="display: none;">
            <h3>Hasil Deteksi</h3>
            <div class="result-card" id="resultCard">
              <!-- Results will be displayed here -->
            </div>
          </div>
        </main>
      </div>
    `;
	}

	afterRender() {
		this.bindEvents();
		this.initializeComponents();
	}

	bindEvents() {
		const logoutBtn = document.getElementById("logoutBtn");
		const tabBtns = document.querySelectorAll(".tab-btn");

		logoutBtn.addEventListener("click", () => this.handleLogout());

		tabBtns.forEach((btn) => {
			btn.addEventListener("click", (e) => this.handleTabSwitch(e));
		});

		// Listen for detection results
		window.addEventListener("detectionResult", (e) =>
			this.handleDetectionResult(e)
		);
	}

	initializeComponents() {
		// Initialize camera component
		const cameraComponent = new CameraCapture();
		document.getElementById("cameraComponent").innerHTML =
			cameraComponent.render();
		cameraComponent.afterRender();

		// Initialize upload component
		const uploadComponent = new FileUpload();
		document.getElementById("uploadComponent").innerHTML =
			uploadComponent.render();
		uploadComponent.afterRender();
	}

	handleTabSwitch(e) {
		const tab = e.target.dataset.tab;
		this.activeTab = tab;

		// Update tab buttons
		document.querySelectorAll(".tab-btn").forEach((btn) => {
			btn.classList.remove("active");
		});
		e.target.classList.add("active");

		// Update tab panels
		document.querySelectorAll(".tab-panel").forEach((panel) => {
			panel.classList.remove("active");
		});
		document.getElementById(tab + "Panel").classList.add("active");
	}

	handleDetectionResult(e) {
		const result = e.detail;
		const resultsSection = document.getElementById("resultsSection");
		const resultCard = document.getElementById("resultCard");

		resultCard.innerHTML = `
      <div class="result-image">
        <img src="${result.imageUrl}" alt="Analyzed plant" />
      </div>
      <div class="result-info">
        <h4>Hasil Analisis:</h4>
        <p><strong>Penyakit:</strong> ${
					result.disease || "Tidak terdeteksi penyakit"
				}</p>
        <p><strong>Tingkat Kepercayaan:</strong> ${
					result.confidence || "N/A"
				}%</p>
        <p><strong>Rekomendasi:</strong> ${
					result.recommendation || "Tanaman terlihat sehat"
				}</p>
      </div>
    `;

		resultsSection.style.display = "block";
		resultsSection.scrollIntoView({ behavior: "smooth" });
	}

	handleLogout() {
		localStorage.removeItem("authToken");
		localStorage.removeItem("user");
		window.dispatchEvent(new CustomEvent("navigate", { detail: "/login" }));
	}
}
