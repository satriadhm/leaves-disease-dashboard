import "./styles/main.css";
import Router from "./utils/router.js";
import LoginPage from "./components/LoginPage.js";
import RegisterPage from "./components/RegisterPage.js";
import HomePage from "./components/HomePage.js";

class App {
	constructor() {
		this.router = new Router();
		this.init();
	}

	init() {
		// Register routes
		this.router.addRoute("/", HomePage);
		this.router.addRoute("/login", LoginPage);
		this.router.addRoute("/register", RegisterPage);

		// Start router
		this.router.start();

		// Check authentication status
		this.checkAuth();
	}

	checkAuth() {
		const token = localStorage.getItem("authToken");
		if (
			!token &&
			window.location.pathname !== "/login" &&
			window.location.pathname !== "/register"
		) {
			this.router.navigate("/login");
		}
	}
}

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
	new App();
});
