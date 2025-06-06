// src/components/NotificationManager.js
export default class NotificationManager {
  constructor() {
    this.init();
    this.bindEvents();
  }

  init() {
    // Create notification container if it doesn't exist
    if (!document.getElementById('notification-container')) {
      const container = document.createElement('div');
      container.id = 'notification-container';
      container.className = 'notification-container';
      document.body.appendChild(container);
    }
  }

  bindEvents() {
    // Listen for global notification events
    window.addEventListener('showSuccess', e => {
      this.showSuccess(e.detail);
    });

    window.addEventListener('showError', e => {
      this.showError(e.detail);
    });

    window.addEventListener('showWarning', e => {
      this.showWarning(e.detail);
    });

    window.addEventListener('showInfo', e => {
      this.showInfo(e.detail);
    });
  }

  showNotification(message, type = 'info', duration = 5000) {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    const icon = this.getIcon(type);

    notification.innerHTML = `
      <div class="notification-content">
        <div class="notification-icon">${icon}</div>
        <div class="notification-message">${message}</div>
        <button class="notification-close" aria-label="Close notification">&times;</button>
      </div>
    `;

    // Add to container
    container.appendChild(notification);

    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);

    // Set up close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => this.removeNotification(notification));

    // Auto remove
    if (duration > 0) {
      setTimeout(() => this.removeNotification(notification), duration);
    }

    return notification;
  }

  removeNotification(notification) {
    if (!notification || !notification.parentNode) {
      return;
    }

    notification.classList.add('hide');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }

  getIcon(type) {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
    };
    return icons[type] || icons.info;
  }

  showSuccess(message) {
    return this.showNotification(message, 'success');
  }

  showError(message) {
    return this.showNotification(message, 'error', 7000);
  }

  showWarning(message) {
    return this.showNotification(message, 'warning');
  }

  showInfo(message) {
    return this.showNotification(message, 'info');
  }

  clear() {
    const container = document.getElementById('notification-container');
    if (container) {
      container.innerHTML = '';
    }
  }
}

// Create global loading manager
export class LoadingManager {
  constructor() {
    this.init();
    this.bindEvents();
    this.loadingCount = 0;
  }

  init() {
    // Create loading overlay if it doesn't exist
    if (!document.getElementById('loading-overlay')) {
      const overlay = document.createElement('div');
      overlay.id = 'loading-overlay';
      overlay.className = 'loading-overlay hidden';
      overlay.innerHTML = `
        <div class="loading-content">
          <div class="loading-spinner"></div>
          <div class="loading-text">Loading...</div>
        </div>
      `;
      document.body.appendChild(overlay);
    }
  }

  bindEvents() {
    window.addEventListener('showLoading', e => {
      this.show(e.detail?.message);
    });

    window.addEventListener('hideLoading', () => {
      this.hide();
    });
  }

  show(message = 'Loading...') {
    this.loadingCount++;
    const overlay = document.getElementById('loading-overlay');
    const textElement = overlay.querySelector('.loading-text');

    if (textElement) {
      textElement.textContent = message;
    }

    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  hide() {
    this.loadingCount = Math.max(0, this.loadingCount - 1);

    if (this.loadingCount === 0) {
      const overlay = document.getElementById('loading-overlay');
      overlay.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  forceHide() {
    this.loadingCount = 0;
    this.hide();
  }
}
