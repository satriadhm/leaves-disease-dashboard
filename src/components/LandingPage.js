// src/components/LandingPage.js - Professional Landing Page
import authManager from "../utils/auth.js";

export default class LandingPage {
	constructor() {
		this.currentTestimonial = 0;
		this.testimonials = [
			{
				name: "Dr. Sari Pertiwi",
				role: "Ahli Pertanian, IPB University",
				content:
					"Aplikasi ini sangat membantu dalam diagnosis cepat penyakit tanaman. Akurasi AI-nya mencapai 95% dan sangat mudah digunakan.",
				avatar: "SP",
				rating: 5,
			},
			{
				name: "Budi Santoso",
				role: "Petani Cabai, Jawa Barat",
				content:
					"Sejak menggunakan aplikasi ini, hasil panen cabai saya meningkat 40%. Deteksi dini penyakit sangat membantu.",
				avatar: "BS",
				rating: 5,
			},
			{
				name: "Prof. Ahmad Rahman",
				role: "Peneliti Agrikultur, UGM",
				content:
					"Teknologi AI yang digunakan sangat canggih. Ini adalah masa depan pertanian digital di Indonesia.",
				avatar: "AR",
				rating: 5,
			},
		];
	}

	render() {
		const isAuthenticated = authManager.isAuthenticated();

		return `
      <div class="landing-page">
        <!-- Navigation -->
        <nav class="landing-nav">
          <div class="nav-container">
            <div class="nav-brand">
              <span class="brand-icon">🌱</span>
              <span class="brand-text">Plant Desease Detection</span>
            </div>
            <div class="nav-menu">
              <a href="#features" class="nav-link">Fitur</a>
              <a href="#how-it-works" class="nav-link">Cara Kerja</a>
              <a href="#plants" class="nav-link">Tanaman</a>
              ${
								isAuthenticated
									? `<a href="/home" class="btn btn-primary">Dashboard</a>`
									: `
                  <a href="/login" class="btn btn-outline">Masuk</a>
                  <a href="/register" class="btn btn-primary">Daftar Sekarang</a>
                `
							}
            </div>
            <button class="mobile-menu-btn" id="mobileMenuBtn">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </nav>

        <!-- Hero Section -->
        <section class="hero-section">
          <div class="hero-container">
            <div class="hero-content">
              <div class="hero-badge">
                <span class="badge-icon">🚀</span>
                <span class="badge-text">AI-Powered Agriculture Solution</span>
              </div>
              <h1 class="hero-title">
                Deteksi Penyakit Tanaman Berbasis 
                <span class="gradient-text">Machine Learning</span>
              </h1>
              <p class="hero-subtitle">
                Tingkatkan hasil panen hingga 40% dengan teknologi AI terdepan. 
                Deteksi penyakit tanaman dalam hitungan detik dengan akurasi 95%+
              </p>
              <div class="hero-stats">
                <div class="stat-item">
                  <div class="stat-number">95%+</div>
                  <div class="stat-label">Akurasi AI</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">10K+</div>
                  <div class="stat-label">Petani Terbantu</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">4</div>
                  <div class="stat-label">Jenis Tanaman</div>
                </div>
              </div>
              <div class="hero-actions">
                ${
									isAuthenticated
										? `<a href="/home" class="btn btn-primary btn-large">Mulai Deteksi</a>`
										: `<a href="/register" class="btn btn-primary btn-large">Coba Gratis Sekarang</a>`
								}
              </div>
            </div>
            <div class="hero-visual">
              <div class="hero-image-container">
                <div class="floating-card card-1">
                  <div class="card-icon">🌶️</div>
                  <div class="card-content">
                    <div class="card-title">Cabai Sehat</div>
                    <div class="card-confidence">98% Confidence</div>
                  </div>
                </div>
                <div class="floating-card card-2">
                  <div class="card-icon">🌽</div>
                  <div class="card-content">
                    <div class="card-title">Jagung - Rust Disease</div>
                    <div class="card-confidence">94% Confidence</div>
                  </div>
                </div>
                <div class="floating-card card-3">
                  <div class="card-icon">🌾</div>
                  <div class="card-content">
                    <div class="card-title">Padi - Leaf Blast</div>
                    <div class="card-confidence">96% Confidence</div>
                  </div>
                </div>
                <div class="hero-phone">
                  <div class="phone-screen">
                    <div class="phone-header">
                      <div class="phone-camera"></div>
                      <div class="phone-speaker"></div>
                    </div>
                    <div class="phone-content">
                      <div class="scan-animation">
                        <div class="scan-line"></div>
                        <div class="scan-grid"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Features Section -->
        <section class="features-section" id="features">
          <div class="section-container">
            <div class="section-header">
              <h2 class="section-title">Mengapa Memilih PlantAI?</h2>
              <p class="section-subtitle">
                Teknologi yang dirancang khusus untuk petani Indonesia
              </p>
            </div>
            <div class="features-grid">
              <div class="feature-card">
                <div class="feature-icon">⚡</div>
                <h3 class="feature-title">Deteksi Instan</h3>
                <p class="feature-description">
                  Analisis penyakit tanaman dalam hitungan detik menggunakan kamera smartphone
                </p>
                <ul class="feature-list">
                  <li>Hasil dalam 3 detik</li>
                  <li>Tidak perlu koneksi internet</li>
                  <li>Bekerja di semua kondisi cahaya</li>
                </ul>
              </div>
              <div class="feature-card">
                <div class="feature-icon">💡</div>
                <h3 class="feature-title">Rekomendasi Cerdas</h3>
                <p class="feature-description">
                  Dapatkan saran pengobatan dan pencegahan yang tepat untuk setiap penyakit
                </p>
                <ul class="feature-list">
                  <li>Panduan pengobatan detail</li>
                  <li>Tips pencegahan</li>
                  <li>Rekomendasi produk</li>
                </ul>
              </div>
              <div class="feature-card">
                <div class="feature-icon">📊</div>
                <h3 class="feature-title">Tracking & Analytics</h3>
                <p class="feature-description">
                  Pantau kesehatan tanaman dari waktu ke waktu dengan dashboard lengkap
                </p>
                <ul class="feature-list">
                  <li>Riwayat deteksi lengkap</li>
                  <li>Grafik tren penyakit</li>
                  <li>Laporan bulanan</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <!-- How It Works Section -->
        <section class="how-it-works-section" id="how-it-works">
          <div class="section-container">
            <div class="section-header">
              <h2 class="section-title">Cara Kerja PlantAI</h2>
              <p class="section-subtitle">
                Tiga langkah sederhana untuk mendeteksi penyakit tanaman
              </p>
            </div>
            <div class="steps-container">
              <div class="step-item">
                <div class="step-number">1</div>
                <div class="step-content">
                  <div class="step-icon">📸</div>
                  <h3 class="step-title">Ambil Foto</h3>
                  <p class="step-description">
                    Foto daun tanaman yang ingin diperiksa menggunakan kamera smartphone
                  </p>
                </div>
              </div>
              <div class="step-arrow">→</div>
              <div class="step-item">
                <div class="step-number">2</div>
                <div class="step-content">
                  <div class="step-icon">🤖</div>
                  <h3 class="step-title">AI Analisis</h3>
                  <p class="step-description">
                    Sistem AI menganalisis foto dan mendeteksi penyakit dalam hitungan detik
                  </p>
                </div>
              </div>
              <div class="step-arrow">→</div>
              <div class="step-item">
                <div class="step-number">3</div>
                <div class="step-content">
                  <div class="step-icon">💊</div>
                  <h3 class="step-title">Dapatkan Solusi</h3>
                  <p class="step-description">
                    Terima diagnosis lengkap dengan rekomendasi pengobatan dan pencegahan
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Supported Plants Section -->
        <section class="plants-section" id="plants">
          <div class="section-container">
            <div class="section-header">
              <h2 class="section-title">Tanaman yang Didukung</h2>
              <p class="section-subtitle">
                Deteksi penyakit untuk 4 jenis tanaman utama dengan berbagai variasi penyakit
              </p>
            </div>
            <div class="plants-grid">
              <div class="plant-card">
                <div class="plant-image">🌶️</div>
                <h3 class="plant-name">Cabai</h3>
                <div class="plant-diseases">
                  <span class="disease-tag">Leaf Curl</span>
                  <span class="disease-tag">Leaf Spot</span>
                  <span class="disease-tag">Whitefly</span>
                  <span class="disease-tag">Healthy</span>
                </div>
                <div class="plant-stats">
                  <div class="stat">
                    <span class="stat-label">Akurasi:</span>
                    <span class="stat-value">96%</span>
                  </div>
                  <div class="stat">
                    <span class="stat-label">Penyakit:</span>
                    <span class="stat-value">3 Jenis</span>
                  </div>
                </div>
              </div>
              <div class="plant-card">
                <div class="plant-image">🌽</div>
                <h3 class="plant-name">Jagung</h3>
                <div class="plant-diseases">
                  <span class="disease-tag">Common Rust</span>
                  <span class="disease-tag">Gray Leaf Spot</span>
                  <span class="disease-tag">Northern Leaf Blight</span>
                  <span class="disease-tag">Healthy</span>
                </div>
                <div class="plant-stats">
                  <div class="stat">
                    <span class="stat-label">Akurasi:</span>
                    <span class="stat-value">94%</span>
                  </div>
                  <div class="stat">
                    <span class="stat-label">Penyakit:</span>
                    <span class="stat-value">3 Jenis</span>
                  </div>
                </div>
              </div>
              <div class="plant-card">
                <div class="plant-image">🌾</div>
                <h3 class="plant-name">Padi</h3>
                <div class="plant-diseases">
                  <span class="disease-tag">Brown Spot</span>
                  <span class="disease-tag">Leaf Blast</span>
                  <span class="disease-tag">Neck Blast</span>
                  <span class="disease-tag">Healthy</span>
                </div>
                <div class="plant-stats">
                  <div class="stat">
                    <span class="stat-label">Akurasi:</span>
                    <span class="stat-value">95%</span>
                  </div>
                  <div class="stat">
                    <span class="stat-label">Penyakit:</span>
                    <span class="stat-value">3 Jenis</span>
                  </div>
                </div>
              </div>
              <div class="plant-card">
                <div class="plant-image">🍅</div>
                <h3 class="plant-name">Tomat</h3>
                <div class="plant-diseases">
                  <span class="disease-tag">Early Blight</span>
                  <span class="disease-tag">Late Blight</span>
                  <span class="disease-tag">Yellow Leaf Curl</span>
                  <span class="disease-tag">Healthy</span>
                </div>
                <div class="plant-stats">
                  <div class="stat">
                    <span class="stat-label">Akurasi:</span>
                    <span class="stat-value">97%</span>
                  </div>
                  <div class="stat">
                    <span class="stat-label">Penyakit:</span>
                    <span class="stat-value">3 Jenis</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- CTA Section -->
        <section class="cta-section">
          <div class="section-container">
            <div class="cta-content">
              <h2 class="cta-title">Siap Meningkatkan Hasil Panen Anda?</h2>
              <div class="cta-actions">
                ${
									isAuthenticated
										? `<a href="/home" class="btn btn-primary btn-large">Mulai Deteksi</a>`
										: `<a href="/register" class="btn btn-primary btn-large">Daftar Gratis Sekarang</a>`
								}
                <a href="/pitch" class="btn btn-outline btn-large">Lihat Pitch Deck</a>
              </div>
            </div>
          </div>
        </section>

        <!-- Footer -->
        <footer class="landing-footer">
          <div class="footer-container">
            <div class="footer-content">
              <div class="footer-brand">
                <div class="footer-logo">
                  <span class="brand-icon">🌱</span>
                  <span class="brand-text">PlantAI</span>
                </div>
                <p class="footer-description">
                  Solusi AI terdepan untuk deteksi penyakit tanaman. 
                  Membantu petani Indonesia meningkatkan produktivitas dengan teknologi modern.
                </p>
                <div class="footer-social">
                  <a href="#" class="social-link">📧</a>
                  <a href="#" class="social-link">📱</a>
                  <a href="#" class="social-link">🐦</a>
                  <a href="#" class="social-link">📘</a>
                </div>
              </div>
              <div class="footer-links">
                <div class="footer-column">
                  <h4 class="footer-title">Produk</h4>
                  <ul class="footer-list">
                    <li><a href="#features">Fitur</a></li>
                    <li><a href="#pricing">Harga</a></li>
                    <li><a href="/pitch">Pitch Deck</a></li>
                    <li><a href="#plants">Tanaman</a></li>
                  </ul>
                </div>
                <div class="footer-column">
                  <h4 class="footer-title">Perusahaan</h4>
                  <ul class="footer-list">
                    <li><a href="#about">Tentang Kami</a></li>
                    <li><a href="#team">Tim</a></li>
                    <li><a href="#careers">Karir</a></li>
                    <li><a href="#contact">Kontak</a></li>
                  </ul>
                </div>
                <div class="footer-column">
                  <h4 class="footer-title">Dukungan</h4>
                  <ul class="footer-list">
                    <li><a href="#help">Bantuan</a></li>
                    <li><a href="#docs">Dokumentasi</a></li>
                    <li><a href="#community">Komunitas</a></li>
                    <li><a href="#status">Status</a></li>
                  </ul>
                </div>
                <div class="footer-column">
                  <h4 class="footer-title">Legal</h4>
                  <ul class="footer-list">
                    <li><a href="#privacy">Privasi</a></li>
                    <li><a href="#terms">Syarat</a></li>
                    <li><a href="#security">Keamanan</a></li>
                    <li><a href="#cookies">Cookies</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="footer-bottom">
              <p class="footer-copyright">
                © 2024 PlantAI. Semua hak dilindungi. Dibuat dengan ❤️ untuk petani Indonesia.
              </p>
            </div>
          </div>
        </footer>
      </div>
    `;
	}

	afterRender() {
		this.bindEvents();
		this.initializeAnimations();
		this.startTestimonialSlider();
	}

	bindEvents() {
		// Mobile menu toggle
		const mobileMenuBtn = document.getElementById("mobileMenuBtn");
		const navMenu = document.querySelector(".nav-menu");

		mobileMenuBtn?.addEventListener("click", () => {
			navMenu.classList.toggle("active");
			mobileMenuBtn.classList.toggle("active");
		});

		// Smooth scrolling for anchor links
		const anchorLinks = document.querySelectorAll('a[href^="#"]');
		anchorLinks.forEach((link) => {
			link.addEventListener("click", (e) => {
				e.preventDefault(); // Mencegah navigasi default
				const targetId = link.getAttribute("href").substring(1);
				const targetElement = document.getElementById(targetId);

				if (targetElement) {
					targetElement.scrollIntoView({
						behavior: "smooth",
					});
				}
			});
		});

		// Watch demo button
		const watchDemoBtn = document.getElementById("watchDemoBtn");
		watchDemoBtn?.addEventListener("click", () => {
			this.showDemo();
		});

		// Navigation buttons
		const navLinks = document.querySelectorAll(".nav-link, .btn[href^='/']");
		navLinks.forEach((link) => {
			link.addEventListener("click", (e) => {
				e.preventDefault();
				const path = link.getAttribute("href");
				window.dispatchEvent(new CustomEvent("navigate", { detail: path }));
			});
		});

		// CTA buttons
		const ctaButtons = document.querySelectorAll('.btn[href^="/"]');
		ctaButtons.forEach((btn) => {
			btn.addEventListener("click", (e) => {
				e.preventDefault();
				const path = btn.getAttribute("href");
				window.dispatchEvent(new CustomEvent("navigate", { detail: path }));
			});
		});

		// Testimonial controls
		const prevBtn = document.getElementById("prevTestimonial");
		const nextBtn = document.getElementById("nextTestimonial");
		const dots = document.querySelectorAll(".testimonial-dots .dot");

		prevBtn?.addEventListener("click", () => this.previousTestimonial());
		nextBtn?.addEventListener("click", () => this.nextTestimonial());

		dots.forEach((dot) => {
			dot.addEventListener("click", () => {
				const index = Number.parseInt(dot.dataset.index);
				this.showTestimonial(index);
			});
		});
	}

	initializeAnimations() {
		// Intersection Observer for scroll animations
		const observerOptions = {
			threshold: 0.1,
			rootMargin: "0px 0px -50px 0px",
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("animate-in");
				}
			});
		}, observerOptions);

		// Observe elements for animation
		const animateElements = document.querySelectorAll(
			".feature-card, .step-item, .plant-card, .testimonial-card, .pricing-card"
		);

		animateElements.forEach((el) => {
			observer.observe(el);
		});

		// Floating cards animation
		this.animateFloatingCards();
	}

	animateFloatingCards() {
		const cards = document.querySelectorAll(".floating-card");
		cards.forEach((card, index) => {
			const delay = index * 0.5;
			card.style.animationDelay = `${delay}s`;
		});
	}

	startTestimonialSlider() {
		// Auto-rotate testimonials every 5 seconds
		setInterval(() => {
			this.nextTestimonial();
		}, 5000);
	}

	showTestimonial(index) {
		const cards = document.querySelectorAll(".testimonial-card");
		const dots = document.querySelectorAll(".testimonial-dots .dot");

		// Remove active class from all
		cards.forEach((card) => card.classList.remove("active"));
		dots.forEach((dot) => dot.classList.remove("active"));

		// Add active class to current
		if (cards[index]) {
			cards[index].classList.add("active");
		}
		if (dots[index]) {
			dots[index].classList.add("active");
		}

		this.currentTestimonial = index;
	}

	nextTestimonial() {
		const nextIndex = (this.currentTestimonial + 1) % this.testimonials.length;
		this.showTestimonial(nextIndex);
	}

	previousTestimonial() {
		const prevIndex =
			this.currentTestimonial === 0
				? this.testimonials.length - 1
				: this.currentTestimonial - 1;
		this.showTestimonial(prevIndex);
	}

	showDemo() {
		// Create demo modal
		const modal = document.createElement("div");
		modal.className = "demo-modal";
		modal.innerHTML = `
      <div class="demo-modal-content">
        <div class="demo-modal-header">
          <h3>Demo PlantAI</h3>
          <button class="demo-close" id="demoClose">×</button>
        </div>
        <div class="demo-modal-body">
          <div class="demo-video">
            <div class="demo-placeholder">
              <div class="demo-play-icon">▶️</div>
              <p>Demo Video PlantAI</p>
              <p class="demo-description">
                Lihat bagaimana PlantAI bekerja dalam mendeteksi penyakit tanaman
              </p>
            </div>
          </div>
          <div class="demo-actions">
            <button class="btn btn-primary" id="tryNowBtn">Coba Sekarang</button>
            <button class="btn btn-outline" id="learnMoreBtn">Pelajari Lebih Lanjut</button>
          </div>
        </div>
      </div>
    `;

		document.body.appendChild(modal);

		// Bind modal events
		const closeBtn = document.getElementById("demoClose");
		const tryNowBtn = document.getElementById("tryNowBtn");
		const learnMoreBtn = document.getElementById("learnMoreBtn");

		closeBtn?.addEventListener("click", () => {
			document.body.removeChild(modal);
		});

		tryNowBtn?.addEventListener("click", () => {
			document.body.removeChild(modal);
			if (authManager.isAuthenticated()) {
				window.dispatchEvent(new CustomEvent("navigate", { detail: "/home" }));
			} else {
				window.dispatchEvent(
					new CustomEvent("navigate", { detail: "/register" })
				);
			}
		});

		learnMoreBtn?.addEventListener("click", () => {
			document.body.removeChild(modal);
			document.getElementById("features").scrollIntoView({
				behavior: "smooth",
			});
		});

		// Close on backdrop click
		modal.addEventListener("click", (e) => {
			if (e.target === modal) {
				document.body.removeChild(modal);
			}
		});
	}

	cleanup() {
		// Clean up any intervals or event listeners
		const modal = document.querySelector(".demo-modal");
		if (modal) {
			document.body.removeChild(modal);
		}
	}
}
