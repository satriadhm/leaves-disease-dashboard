// src/main.js - Updated to include Pitch Deck route
import './styles/main.css';
import Router from './utils/router.js';
import LoginPage from './components/LoginPage.js';
import RegisterPage from './components/RegisterPage.js';
import HomePage from './components/HomePage.js';
import PredictionHistory from './components/PredictionHistory.js';
import ProfilePage from './components/ProfilePage.js';
import AdminDashboard from './components/AdminDashboard.js';
import PitchDeckPage from './components/PitchDeckPage.js'; // Add this import
import NotificationManager, { LoadingManager } from './components/NotificationManager.js';
import authManager from './utils/auth.js';

class App {
  constructor() {
    this.router = new Router();
    this.notificationManager = new NotificationManager();
    this.loadingManager = new LoadingManager();
    this.init();
  }

  init() {
    console.log('🌱 Initializing Plant Disease Detection App...');

    this.setupErrorHandling();
    this.setupRouter();
    this.setupGlobalEvents();
    this.initializeComponents();
    this.start();

    console.log('✅ App initialized successfully!');
  }

  setupErrorHandling() {
    window.addEventListener('error', e => {
      console.error('Global error:', e.error);
      this.handleError(e.error);
    });

    window.addEventListener('unhandledrejection', e => {
      console.error('Unhandled promise rejection:', e.reason);
      this.handleError(e.reason);
    });
  }

  setupRouter() {
    // Existing routes
    this.router.addRoute('/', HomePage, {
      title: 'Plant Disease Detection - Beranda',
      description: 'Deteksi penyakit tanaman dengan AI yang akurat dan mudah digunakan',
    });

    this.router.addRoute('/login', LoginPage, {
      title: 'Login - Plant Disease Detection',
      description: 'Masuk ke akun Plant Disease Detection Anda',
    });

    this.router.addRoute('/register', RegisterPage, {
      title: 'Daftar - Plant Disease Detection',
      description: 'Buat akun baru untuk mengakses fitur deteksi penyakit tanaman',
    });

    this.router.addRoute('/history', PredictionHistory, {
      requiresAuth: true,
      title: 'Riwayat Prediksi - Plant Disease Detection',
      description: 'Lihat riwayat semua prediksi penyakit tanaman Anda',
    });

    this.router.addRoute('/profile', ProfilePage, {
      requiresAuth: true,
      title: 'Profil - Plant Disease Detection',
      description: 'Kelola profil dan pengaturan akun Anda',
    });

    this.router.addRoute('/dashboard', AdminDashboard, {
      requiresAuth: true,
      requiresRole: 'admin',
      title: 'Admin Dashboard - Plant Disease Detection',
      description: 'Dashboard admin untuk mengelola sistem dan pengguna',
    });

    // Add Pitch Deck route
    this.router.addRoute('/pitch', PitchDeckPage, {
      title: 'Pitch Deck - Plant Disease Detection Investment Presentation',
      description: 'Investment presentation showcasing our AI-powered agricultural solution',
    });

    // Router configuration continues...
    this.router.setBeforeRouteChange((to, from) => {
      console.log(`🧭 Navigating from ${from} to ${to}`);

      const route = this.router.routes[to];
      if (route && route.requiresAuth) {
        if (!authManager.isAuthenticated()) {
          return true;
        }
      }

      return true;
    });

    this.router.setAfterRouteChange((to, _from) => {
      console.log(`✅ Navigation complete: ${to}`);
      this.trackPageView(to);
    });

    this.router.setNotFoundHandler(this.create404Component());

    this.router.setErrorHandler((error, path) => {
      console.error(`Router error on ${path}:`, error);
      window.dispatchEvent(
        new CustomEvent('showError', {
          detail: 'Terjadi kesalahan saat memuat halaman. Silakan refresh atau coba lagi.',
        }),
      );
    });
  }

  setupGlobalEvents() {
    window.addEventListener('online', () => {
      window.dispatchEvent(
        new CustomEvent('showSuccess', {
          detail: 'Koneksi internet kembali normal',
        }),
      );
    });

    window.addEventListener('offline', () => {
      window.dispatchEvent(
        new CustomEvent('showWarning', {
          detail: 'Koneksi internet terputus. Beberapa fitur mungkin tidak tersedia.',
        }),
      );
    });

    document.addEventListener('keydown', e => {
      this.handleKeyboardShortcuts(e);
    });

    window.addEventListener('authStateChanged', e => {
      const { isAuthenticated, user } = e.detail;
      console.log('Auth state changed:', { isAuthenticated, user });
      this.handleAuthStateChange(isAuthenticated, user);
    });

    if ('serviceWorker' in navigator) {
      this.registerServiceWorker();
    }
  }

  initializeComponents() {
    this.notificationManager = new NotificationManager();
    this.loadingManager = new LoadingManager();

    console.log('📢 Notification system initialized');
    console.log('⏳ Loading manager initialized');
  }

  start() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.startRouter();
      });
    } else {
      this.startRouter();
    }
  }

  startRouter() {
    this.router.start();
    this.showWelcomeMessage();
    this.checkForUpdates();
  }

  handleKeyboardShortcuts(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return;
    }

    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'k':
          e.preventDefault();
          this.focusSearch();
          break;
        case '/':
          e.preventDefault();
          this.showKeyboardShortcuts();
          break;
        case 'p':
          e.preventDefault();
          // Quick access to pitch deck
          this.router.navigate('/pitch');
          break;
      }
    }

    switch (e.key) {
      case 'h':
        if (!e.ctrlKey && !e.metaKey) {
          this.router.navigate('/');
        }
        break;
      case 'p':
        if (!e.ctrlKey && !e.metaKey && authManager.isAuthenticated()) {
          this.router.navigate('/profile');
        }
        break;
      case 'r':
        if (!e.ctrlKey && !e.metaKey && authManager.isAuthenticated()) {
          this.router.navigate('/history');
        }
        break;
      case 'd':
        if (!e.ctrlKey && !e.metaKey && authManager.isAdmin()) {
          this.router.navigate('/dashboard');
        }
        break;
      case 'i':
        if (!e.ctrlKey && !e.metaKey) {
          // Quick access to pitch deck with 'i' for investor
          this.router.navigate('/pitch');
        }
        break;
      case 'Escape':
        this.closeModalsAndNotifications();
        break;
    }
  }

  handleAuthStateChange(isAuthenticated, user) {
    if (isAuthenticated) {
      console.log(`👋 Welcome back, ${user.username}!`);

      const intendedPath = sessionStorage.getItem('intendedPath');
      if (intendedPath && intendedPath !== '/login' && intendedPath !== '/register') {
        sessionStorage.removeItem('intendedPath');
        this.router.navigate(intendedPath);
      }
    } else {
      console.log('👋 User logged out');

      const currentPath = this.router.getCurrentPath();
      if (currentPath !== '/' && currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/pitch') {
        sessionStorage.setItem('intendedPath', currentPath);
      }
    }
  }

  handleError(error) {
    console.error('App error:', error);

    let message = 'Terjadi kesalahan tidak terduga';

    if (error.message) {
      if (error.message.includes('network') || error.message.includes('fetch')) {
        message = 'Masalah koneksi jaringan. Periksa internet Anda.';
      } else if (error.message.includes('auth') || error.message.includes('unauthorized')) {
        message = 'Sesi Anda telah berakhir. Silakan login kembali.';
        authManager.logout();
      } else {
        message = error.message;
      }
    }

    window.dispatchEvent(
      new CustomEvent('showError', {
        detail: message,
      }),
    );
  }

  create404Component() {
    return class NotFoundPage {
      render() {
        return `
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
                <a href="/pitch" class="btn btn-outline">
                  📊 Lihat Pitch Deck
                </a>
              </div>
            </div>
          </div>
        `;
      }

      afterRender() {
        // Setup navigation for error page
        const homeLink = document.querySelector('a[href="/"]');
        const pitchLink = document.querySelector('a[href="/pitch"]');
        
        homeLink?.addEventListener('click', e => {
          e.preventDefault();
          window.dispatchEvent(new CustomEvent('navigate', { detail: '/' }));
        });
        
        pitchLink?.addEventListener('click', e => {
          e.preventDefault();
          window.dispatchEvent(new CustomEvent('navigate', { detail: '/pitch' }));
        });
      }
    };
  }

  showWelcomeMessage() {
    // Check if this is the first visit
    const isFirstVisit = !localStorage.getItem('hasVisited');

    if (isFirstVisit) {
      localStorage.setItem('hasVisited', 'true');

      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent('showInfo', {
            detail:
              '🌱 Selamat datang! Gunakan AI untuk mendeteksi penyakit pada tanaman cabai, jagung, padi, dan tomat. Tekan "I" untuk melihat pitch deck kami!',
          }),
        );
      }, 1000);
    }
  }

  checkForUpdates() {
    // Simple cache busting check
    const currentVersion = '2.0.0';
    const storedVersion = localStorage.getItem('appVersion');

    if (storedVersion && storedVersion !== currentVersion) {
      localStorage.setItem('appVersion', currentVersion);

      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent('showInfo', {
            detail: '🆕 Aplikasi telah diperbarui dengan fitur baru termasuk pitch deck!',
          }),
        );
      }, 2000);
    } else if (!storedVersion) {
      localStorage.setItem('appVersion', currentVersion);
    }
  }

  focusSearch() {
    // Focus search input if available
    const searchInput = document.querySelector('input[type="search"], input[placeholder*="cari"]');
    if (searchInput) {
      searchInput.focus();
    }
  }

  showKeyboardShortcuts() {
    const shortcuts = [
      { key: 'H', description: 'Ke Beranda' },
      { key: 'P', description: 'Ke Profil (jika login)' },
      { key: 'R', description: 'Ke Riwayat (jika login)' },
      { key: 'D', description: 'Ke Dashboard (jika admin)' },
      { key: 'I', description: 'Ke Pitch Deck' },
      { key: 'Ctrl/Cmd + P', description: 'Ke Pitch Deck' },
      { key: 'Ctrl/Cmd + K', description: 'Fokus Pencarian' },
      { key: 'Ctrl/Cmd + /', description: 'Tampilkan Shortcut' },
      { key: 'Escape', description: 'Tutup Modal/Notifikasi' },
    ];

    const shortcutList = shortcuts
      .map(
        s =>
          `<div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
        <span style="font-family: monospace; background: #f3f4f6; padding: 0.25rem 0.5rem; border-radius: 0.25rem;">${s.key}</span>
        <span>${s.description}</span>
      </div>`,
      )
      .join('');

    window.dispatchEvent(
      new CustomEvent('showInfo', {
        detail: `
        <div style="text-align: left;">
          <strong>⌨️ Keyboard Shortcuts:</strong><br><br>
          ${shortcutList}
        </div>
      `,
      }),
    );
  }

  closeModalsAndNotifications() {
    // Close any open modals
    const modals = document.querySelectorAll('.modal.show');
    modals.forEach(modal => {
      modal.classList.remove('show');
    });

    // Clear notifications
    this.notificationManager.clear();
  }

  trackPageView(path) {
    // Analytics tracking can be implemented here
    console.log(`📊 Page view: ${path}`);

    // Example: Google Analytics
    // if (typeof gtag !== 'undefined') {
    //   gtag('config', 'GA_MEASUREMENT_ID', {
    //     page_path: path
    //   });
    // }
  }

  async registerServiceWorker() {
    try {
      // ServiceWorker registration code
    } catch (error) {
      console.log('ServiceWorker registration failed:', error);
    }
  }

  getRouter() {
    return this.router;
  }

  getAuthManager() {
    return authManager;
  }

  showNotification(type, message) {
    window.dispatchEvent(
      new CustomEvent(`show${type.charAt(0).toUpperCase() + type.slice(1)}`, {
        detail: message,
      }),
    );
  }

  destroy() {
    this.router.stop();
    this.notificationManager.clear();
    console.log('🧹 App cleanup completed');
  }
}

let app;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    app = new App();
  });
} else {
  app = new App();
}

window.PlantDiseaseApp = app;

window.addEventListener('beforeunload', () => {
  if (app) {
    app.destroy();
  }
});

export default App;