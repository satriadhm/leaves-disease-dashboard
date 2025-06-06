export default class Router {
	constructor() {
		this.routes = {};
		this.currentRoute = null;
	}

	addRoute(path, component) {
		this.routes[path] = component;
	}

	navigate(path) {
		window.history.pushState({}, "", path);
		this.loadRoute(path);
	}

	loadRoute(path) {
		const Component = this.routes[path] || this.routes["/"];
		if (Component) {
			this.currentRoute = new Component();
			this.render();
		}
	}

	render() {
		const app = document.getElementById("app");
		if (this.currentRoute && this.currentRoute.render) {
			app.innerHTML = this.currentRoute.render();
			if (this.currentRoute.afterRender) {
				this.currentRoute.afterRender();
			}
		}
	}

	start() {
		window.addEventListener("popstate", () => {
			this.loadRoute(window.location.pathname);
		});
		this.loadRoute(window.location.pathname);
	}
}
