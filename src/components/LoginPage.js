export default class LoginPage {
	constructor() {
		this.formData = {
			email: "",
			password: "",
		};
	}

	render() {
		return `
        <div class="auth-container">
          <div class="auth-card">
            <div class="auth-header">
              <h1>Plant Disease Detection</h1>
              <h2>Masuk ke Akun Anda</h2>
            </div>
            <form class="auth-form" id="loginForm">
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
              <button type="submit" class="btn btn-primary">Masuk</button>
            </form>
            <div class="auth-footer">
              <p>Belum punya akun? <a href="/register" class="link">Daftar di sini</a></p>
            </div>
          </div>
        </div>
      `;
	}

	afterRender() {
		this.bindEvents();
	}

	bindEvents() {
		const form = document.getElementById("loginForm");
		const registerLink = document.querySelector('a[href="/register"]');

		form.addEventListener("submit", (e) => this.handleSubmit(e));
		registerLink.addEventListener("click", (e) =>
			this.handleNavigation(e, "/register")
		);
	}

	handleSubmit(e) {
		e.preventDefault();
		const formData = new FormData(e.target);
		const email = formData.get("email");
		const password = formData.get("password");

		if (this.validateForm(email, password)) {
			// Simulate API call
			this.login(email, password);
		}
	}

	validateForm(email, password) {
		let isValid = true;

		// Clear previous errors
		document.getElementById("emailError").textContent = "";
		document.getElementById("passwordError").textContent = "";

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

		return isValid;
	}

	isValidEmail(email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	async login(email, password) {
		try {
			// Simulate API call
			const response = await this.simulateApiCall({
				email,
				password,
			});

			if (response.success) {
				localStorage.setItem("authToken", response.token);
				localStorage.setItem("user", JSON.stringify(response.user));
				this.handleNavigation(null, "/");
			} else {
				alert("Login gagal: " + response.message);
			}
		} catch (error) {
			alert("Terjadi kesalahan saat login");
		}
	}

	simulateApiCall(data) {
		return new Promise((resolve) => {
			setTimeout(() => {
				// Simulate successful login
				resolve({
					success: true,
					token: "fake-jwt-token-" + Date.now(),
					user: {
						id: 1,
						name: "User Test",
						email: data.email,
					},
				});
			}, 1000);
		});
	}

	handleNavigation(e, path) {
		if (e) e.preventDefault();
		window.dispatchEvent(new CustomEvent("navigate", { detail: path }));
	}
}
