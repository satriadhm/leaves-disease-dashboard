export default class RegisterPage {
	constructor() {
		this.formData = {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		};
	}

	render() {
		return `
        <div class="auth-container">
          <div class="auth-card">
            <div class="auth-header">
              <h1>Plant Disease Detection</h1>
              <h2>Buat Akun Baru</h2>
            </div>
            <form class="auth-form" id="registerForm">
              <div class="form-group">
                <label for="name">Nama Lengkap</label>
                <input type="text" id="name" name="name" required>
                <span class="error-message" id="nameError"></span>
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required>
                <span class="error-message" id="emailError"></span>
              </div>
              <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
                <span class="error-message" id="passwordError"></span>
              </div>
              <div class="form-group">
                <label for="confirmPassword">Konfirmasi Password</label>
                <input type="password" id="confirmPassword" name="confirmPassword" required>
                <span class="error-message" id="confirmPasswordError"></span>
              </div>
              <button type="submit" class="btn btn-primary">Daftar</button>
            </form>
            <div class="auth-footer">
              <p>Sudah punya akun? <a href="/login" class="link">Masuk di sini</a></p>
            </div>
          </div>
        </div>
      `;
	}

	afterRender() {
		this.bindEvents();
	}

	bindEvents() {
		const form = document.getElementById("registerForm");
		const loginLink = document.querySelector('a[href="/login"]');

		form.addEventListener("submit", (e) => this.handleSubmit(e));
		loginLink.addEventListener("click", (e) =>
			this.handleNavigation(e, "/login")
		);
	}

	handleSubmit(e) {
		e.preventDefault();
		const formData = new FormData(e.target);
		const name = formData.get("name");
		const email = formData.get("email");
		const password = formData.get("password");
		const confirmPassword = formData.get("confirmPassword");

		if (this.validateForm(name, email, password, confirmPassword)) {
			this.register(name, email, password);
		}
	}

	validateForm(name, email, password, confirmPassword) {
		let isValid = true;

		// Clear previous errors
		document.getElementById("nameError").textContent = "";
		document.getElementById("emailError").textContent = "";
		document.getElementById("passwordError").textContent = "";
		document.getElementById("confirmPasswordError").textContent = "";

		if (!name) {
			document.getElementById("nameError").textContent = "Nama harus diisi";
			isValid = false;
		}

		if (!email) {
			document.getElementById("emailError").textContent = "Email harus diisi";
			isValid = false;
		} else if (!this.isValidEmail(email)) {
			document.getElementById("emailError").textContent =
				"Format email tidak valid";
			isValid = false;
		}

		if (!password) {
			document.getElementById("passwordError").textContent =
				"Password harus diisi";
			isValid = false;
		} else if (password.length < 6) {
			document.getElementById("passwordError").textContent =
				"Password minimal 6 karakter";
			isValid = false;
		}

		if (!confirmPassword) {
			document.getElementById("confirmPasswordError").textContent =
				"Konfirmasi password harus diisi";
			isValid = false;
		} else if (password !== confirmPassword) {
			document.getElementById("confirmPasswordError").textContent =
				"Password tidak cocok";
			isValid = false;
		}

		return isValid;
	}

	isValidEmail(email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	async register(name, email, password) {
		try {
			const response = await this.simulateApiCall({
				name,
				email,
				password,
			});

			if (response.success) {
				alert("Registrasi berhasil! Silakan login.");
				this.handleNavigation(null, "/login");
			} else {
				alert("Registrasi gagal: " + response.message);
			}
		} catch (error) {
			alert("Terjadi kesalahan saat registrasi");
		}
	}

	simulateApiCall(data) {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve({
					success: true,
					message: "Registrasi berhasil",
				});
			}, 1000);
		});
	}

	handleNavigation(e, path) {
		if (e) e.preventDefault();
		window.dispatchEvent(new CustomEvent("navigate", { detail: path }));
	}
}
