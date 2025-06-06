// src/utils/router.js
export default class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.currentComponent = null;
    this.beforeRouteChange = null;
    this.afterRouteChange = null;
    this.notFoundHandler = null;
    this.errorHandler = null;
  }

  addRoute(path, component, options = {}) {
    this.routes[path] = {
      component,
      requiresAuth: options.requiresAuth || false,
      requiresRole: options.requiresRole || null,
      title: options.title || 'Plant Disease Detection',
      description: options.description || '',
    };
  }

  setBeforeRouteChange(callback) {
    this.beforeRouteChange = callback;
  }

  setAfterRouteChange(callback) {
    this.afterRouteChange = callback;
  }

  setNotFoundHandler(handler) {
    this.notFoundHandler = handler;
  }

  setErrorHandler(handler) {
    this.errorHandler = handler;
  }

  async navigate(path, options = {}) {
    try {
      // Normalize path
      path = this.normalizePath(path);

      // Check if route exists
      const route = this.routes[path];
      if (!route && !this.notFoundHandler) {
        console.warn(`Route not found: ${path}`);
        return;
      }

      // Call before route change hook
      if (this.beforeRouteChange) {
        const shouldContinue = await this.beforeRouteChange(path, this.currentRoute);
        if (shouldContinue === false) {
          return;
        }
      }

      // Update browser history if not a silent navigation
      if (!options.silent) {
        if (options.replace) {
          window.history.replaceState({ path }, '', path);
        } else {
          window.history.pushState({ path }, '', path);
        }
      }

      // Load the route
      await this.loadRoute(path, route);

      // Call after route change hook
      if (this.afterRouteChange) {
        await this.afterRouteChange(path, this.currentRoute);
      }

      this.currentRoute = path;
    } catch (error) {
      console.error('Navigation error:', error);
      if (this.errorHandler) {
        this.errorHandler(error, path);
      } else {
        this.showError('Terjadi kesalahan saat memuat halaman');
      }
    }
  }

  async loadRoute(path, route) {
    try {
      // Show loading state
      this.showLoading();

      // Handle 404
      if (!route) {
        if (this.notFoundHandler) {
          await this.renderComponent(this.notFoundHandler, path);
        } else {
          this.show404();
        }
        return;
      }

      // Check authentication requirements
      if (route.requiresAuth && !this.checkAuth()) {
        await this.navigate('/login', { replace: true, silent: true });
        return;
      }

      // Check role requirements
      if (route.requiresRole && !this.checkRole(route.requiresRole)) {
        this.showUnauthorized();
        return;
      }

      // Update page metadata
      this.updatePageMeta(route.title, route.description);

      // Render component
      await this.renderComponent(route.component, path);
    } catch (error) {
      throw error;
    } finally {
      this.hideLoading();
    }
  }

  async renderComponent(ComponentClass, path) {
    try {
      // Clean up previous component
      if (this.currentComponent && typeof this.currentComponent.cleanup === 'function') {
        this.currentComponent.cleanup();
      }

      // Create new component instance
      this.currentComponent = new ComponentClass();

      // Get app container
      const app = document.getElementById('app');
      if (!app) {
        throw new Error('App container not found');
      }

      // Render component
      const html = this.currentComponent.render();
      app.innerHTML = html;

      // Call afterRender if available
      if (typeof this.currentComponent.afterRender === 'function') {
        await this.currentComponent.afterRender();
      }

      // Scroll to top
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Component render error:', error);
      throw error;
    }
  }

  normalizePath(path) {
    // Remove trailing slashes except for root
    if (path !== '/' && path.endsWith('/')) {
      path = path.slice(0, -1);
    }

    // Ensure path starts with /
    if (!path.startsWith('/')) {
      path = `/${path}`;
    }

    return path;
  }

  getCurrentPath() {
    return window.location.pathname;
  }

  getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params) {
      result[key] = value;
    }
    return result;
  }

  updatePageMeta(title, description) {
    // Update page title
    document.title = title;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = description;

    // Update og:title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.content = title;

    // Update og:description
    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }
    ogDescription.content = description;
  }

  checkAuth() {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  checkRole(requiredRole) {
    if (!this.checkAuth()) {
      return false;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userRoles = user.roles || [];

      // Check if user has the required role
      return userRoles.some(role => role.includes(requiredRole.toUpperCase()));
    } catch {
      return false;
    }
  }

  showLoading() {
    window.dispatchEvent(
      new CustomEvent('showLoading', {
        detail: { message: 'Memuat halaman...' },
      })
    );
  }

  hideLoading() {
    window.dispatchEvent(new CustomEvent('hideLoading'));
  }

  showError(message) {
    window.dispatchEvent(
      new CustomEvent('showError', {
        detail: message,
      })
    );
  }

  show404() {
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = `
        <div class="error-page">
          <div class="error-content">
            <div class="error-icon">🔍</div>
            <h1>404 - Halaman Tidak Ditemukan</h1>
            <p>Maaf, halaman yang Anda cari tidak dapat ditemukan.</p>
            <div class="error-actions">
              <button class="btn btn-primary" onclick="history.back()">
                ← Kembali
              </button>
              <a href="/" class="btn btn-secondary">
                🏠 Beranda
              </a>
            </div>
          </div>
        </div>
      `;
    }
  }

  showUnauthorized() {
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = `
        <div class="error-page">
          <div class="error-content">
            <div class="error-icon">🚫</div>
            <h1>403 - Akses Ditolak</h1>
            <p>Anda tidak memiliki izin untuk mengakses halaman ini.</p>
            <div class="error-actions">
              <button class="btn btn-primary" onclick="history.back()">
                ← Kembali
              </button>
              <a href="/" class="btn btn-secondary">
                🏠 Beranda
              </a>
            </div>
          </div>
        </div>
      `;
    }
  }

  start() {
    // Listen for browser navigation
    window.addEventListener('popstate', e => {
      const path = e.state?.path || window.location.pathname;
      this.loadRoute(path, this.routes[path]);
    });

    // Listen for custom navigation events
    window.addEventListener('navigate', e => {
      this.navigate(e.detail);
    });

    // Load initial route
    const initialPath = this.getCurrentPath();
    this.navigate(initialPath, { silent: true });
  }

  stop() {
    // Clean up event listeners and current component
    if (this.currentComponent && typeof this.currentComponent.cleanup === 'function') {
      this.currentComponent.cleanup();
    }
  }

  // Utility methods for programmatic navigation
  goBack() {
    window.history.back();
  }

  goForward() {
    window.history.forward();
  }

  replace(path) {
    this.navigate(path, { replace: true });
  }

  reload() {
    this.navigate(this.getCurrentPath(), { silent: true });
  }

  // Route guards
  addGuard(guardFn) {
    const originalBeforeRouteChange = this.beforeRouteChange;
    this.beforeRouteChange = async (to, from) => {
      // Call original guard first
      if (originalBeforeRouteChange) {
        const result = await originalBeforeRouteChange(to, from);
        if (result === false) {
          return false;
        }
      }

      // Call new guard
      return await guardFn(to, from);
    };
  }

  // Route parameters (basic implementation)
  extractParams(routePath, actualPath) {
    const routeParts = routePath.split('/');
    const actualParts = actualPath.split('/');
    const params = {};

    for (let i = 0; i < routeParts.length; i++) {
      const routePart = routeParts[i];
      const actualPart = actualParts[i];

      if (routePart.startsWith(':')) {
        const paramName = routePart.slice(1);
        params[paramName] = actualPart;
      }
    }

    return params;
  }

  // Check if a path matches a route pattern
  matchRoute(routePattern, actualPath) {
    const routeParts = routePattern.split('/');
    const actualParts = actualPath.split('/');

    if (routeParts.length !== actualParts.length) {
      return false;
    }

    for (let i = 0; i < routeParts.length; i++) {
      const routePart = routeParts[i];
      const actualPart = actualParts[i];

      if (!routePart.startsWith(':') && routePart !== actualPart) {
        return false;
      }
    }

    return true;
  }
}
