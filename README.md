# 🌱 Plant Disease Detection Dashboard

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsatriadhm%2Fleaves-disease-dashboard)
[![CI/CD](https://github.com/satriadhm/leaves-disease-dashboard/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/satriadhm/leaves-disease-dashboard/actions/workflows/ci-cd.yml)
[![codecov](https://codecov.io/gh/satriadhm/leaves-disease-dashboard/branch/main/graph/badge.svg)](https://codecov.io/gh/satriadhm/leaves-disease-dashboard)

Aplikasi web modern untuk deteksi penyakit tanaman menggunakan AI dengan antarmuka yang responsif dan intuitif. Dashboard ini terintegrasi dengan API Plant Disease Detection untuk memberikan analisis yang akurat pada tanaman cabai, jagung, padi, dan tomat.

![Plant Disease Detection](https://img.shields.io/badge/Plant%20Disease-Detection-green)
![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-yellow)

## ✨ Fitur Utama

### 🔬 Deteksi AI yang Akurat
- **Multi-platform**: Upload file atau gunakan kamera langsung
- **16+ Jenis Penyakit**: Deteksi berbagai penyakit pada 4 jenis tanaman
- **Confidence Score**: Tingkat kepercayaan analisis AI
- **Rekomendasi Treatment**: Saran penanganan berdasarkan hasil deteksi

### 👥 Manajemen Pengguna
- **Authentication System**: Login/register dengan JWT
- **Role-based Access**: User, Admin, Moderator
- **Profile Management**: Kelola informasi profil dan keamanan
- **Activity Tracking**: Riwayat aktivitas pengguna

### 📊 Dashboard & Analytics
- **Admin Dashboard**: Monitor pengguna dan sistem
- **Statistics**: Analisis data prediksi dan pengguna
- **Export Data**: Download laporan dalam format CSV/JSON
- **Real-time Monitoring**: Status sistem dan health checks

### 🎨 Modern UI/UX
- **Responsive Design**: Optimal di desktop, tablet, dan mobile
- **Modular CSS**: Struktur CSS yang terorganisir dan mudah maintain
- **Accessibility**: Mendukung keyboard navigation dan screen readers
- **Progressive Web App**: Installable dan offline-capable

## 🚀 Quick Start

### Prerequisites

```bash
Node.js >= 16.0.0
npm >= 8.0.0
```

### 📦 Installation

```bash
# Clone repository
git clone https://github.com/satriadhm/leaves-disease-dashboard.git
cd leaves-disease-dashboard

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
```

### ⚙️ Environment Configuration

Buat file `.env` di root directory:

```env
# API Configuration
API_URL=https://leaves-disease-api.vercel.app
NODE_ENV=development

# Optional: Analytics
GOOGLE_ANALYTICS_ID=your_ga_id

# Optional: Sentry Error Tracking
SENTRY_DSN=your_sentry_dsn
```

### 🏃‍♂️ Development

```bash
# Start development server
npm run dev

# Open browser
# http://localhost:3000
```

### 🏗️ Production Build

```bash
# Build for production
npm run build:prod

# Preview production build
npm run preview
```

## 📁 Project Structure

```
leaves-disease-dashboard/
├── src/
│   ├── components/           # React-like components
│   │   ├── LoginPage.js     # Authentication pages
│   │   ├── RegisterPage.js
│   │   ├── HomePage.js      # Main dashboard
│   │   ├── FileUpload.js    # Upload component
│   │   ├── CameraCapture.js # Camera component
│   │   ├── PredictionHistory.js
│   │   ├── ProfilePage.js
│   │   ├── AdminDashboard.js
│   │   └── NotificationManager.js
│   ├── services/            # API services
│   │   └── api.js          # API service layer
│   ├── utils/              # Utilities
│   │   ├── auth.js         # Authentication manager
│   │   └── router.js       # Client-side router
│   ├── styles/             # Modular CSS
│   │   ├── base/           # Base styles & variables
│   │   ├── components/     # Component styles
│   │   ├── layouts/        # Layout styles
│   │   ├── pages/          # Page-specific styles
│   │   ├── utilities/      # Utility classes
│   │   └── main.css        # Main CSS entry point
│   └── main.js             # Application entry point
├── public/                 # Static assets
│   ├── manifest.json       # PWA manifest
│   ├── sw.js              # Service worker
│   └── icons/             # PWA icons
├── .github/workflows/      # GitHub Actions
├── dist/                  # Built files
├── webpack.config.js      # Webpack configuration
├── vercel.json           # Vercel deployment config
├── package.json
└── README.md
```

## 🎨 CSS Architecture

Struktur CSS yang modular dan mudah maintain:

```
src/styles/
├── base/
│   ├── variables.css      # CSS custom properties
│   └── reset.css          # CSS reset & base styles
├── components/
│   ├── buttons.css        # Button components
│   ├── forms.css          # Form components
│   ├── notifications.css  # Notification & loading
│   ├── upload-camera.css  # Upload & camera specific
│   └── states.css         # Empty & error states
├── layouts/
│   ├── layout.css         # General layout
│   └── auth.css           # Authentication layout
├── pages/
│   └── home.css           # Home page specific
├── utilities/
│   └── utilities.css      # Utility classes
└── main.css               # Main entry point
```

### Manfaat Modular CSS:
- **Maintainability**: Mudah mencari dan mengubah style specific
- **Reusability**: Component styles dapat digunakan kembali
- **Performance**: CSS yang tidak terpakai dapat dihapus
- **Organization**: Struktur yang jelas dan terorganisir
- **Scalability**: Mudah menambah style baru tanpa konflik

## 🔧 Architecture

### Component System
Dashboard menggunakan sistem komponen modular vanilla JavaScript yang mirip dengan React:

```javascript
// Example component structure
class MyComponent {
  constructor() {
    this.state = {};
  }
  
  render() {
    return `<div>Component HTML</div>`;
  }
  
  afterRender() {
    this.bindEvents();
  }
  
  bindEvents() {
    // Event listeners
  }
}
```

### API Integration
Semua komunikasi dengan backend menggunakan service layer:

```javascript
import apiService from './services/api.js';

// Example usage
const result = await apiService.predictDisease(formData);
const history = await apiService.getPredictionHistory();
```

### Routing System
Client-side routing dengan dukungan authentication guards:

```javascript
router.addRoute('/admin', AdminDashboard, {
  requiresAuth: true,
  requiresRole: 'admin'
});
```

## 🚀 Deployment

### Deploy ke Vercel (Recommended)

#### Option 1: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsatriadhm%2Fleaves-disease-dashboard)

#### Option 2: Manual Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Login ke Vercel
vercel login

# Deploy
vercel --prod
```

#### Option 3: GitHub Integration

1. Connect repository ke Vercel
2. Set environment variables di Vercel dashboard
3. Auto-deploy on push to main branch

### Environment Variables untuk Vercel

```bash
# Required
API_URL=https://leaves-disease-api.vercel.app
NODE_ENV=production

# Optional
GOOGLE_ANALYTICS_ID=your_ga_id
SENTRY_DSN=your_sentry_dsn
```

### Custom Domain

```bash
# Add custom domain
vercel domains add yourdomain.com
```

## 🔧 Development Tools

### Code Quality
- **ESLint**: JavaScript linting dengan aturan modern
- **Prettier**: Code formatting yang konsisten
- **Husky**: Git hooks untuk quality checks
- **Lint-staged**: Pre-commit checks

### Build & Bundle
- **Webpack 5**: Modern module bundling
- **Babel**: JavaScript transpilation
- **PostCSS**: CSS processing dengan autoprefixer
- **Terser**: JavaScript minification
- **CSS Minimizer**: CSS optimization

### Testing
- **Jest**: Unit testing framework
- **Coverage**: Code coverage reporting
- **Lighthouse CI**: Performance & accessibility testing

### Development Workflow

```bash
# Linting
npm run lint
npm run lint:fix

# Formatting
npm run format
npm run format:check

# Testing
npm run test
npm run test:watch
npm run test:coverage

# Build analysis
npm run build:analyze
```

## 📊 Performance

### Optimizations
- **Code Splitting**: Automatic code splitting dengan Webpack
- **Asset Optimization**: Image compression dan lazy loading
- **CSS Purging**: Remove unused CSS di production
- **Caching Strategy**: Browser caching untuk static assets
- **Bundle Analysis**: Bundle size monitoring

### PWA Features
- **Service Worker**: Offline functionality
- **App Manifest**: Installable app
- **Responsive Design**: Mobile-first approach
- **Fast Loading**: Optimized untuk mobile networks

## 🔒 Security

### Security Headers
- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Referrer Policy

### Input Validation
- File type validation
- File size limits
- XSS protection
- CSRF protection

### Authentication
- JWT tokens
- Role-based access control
- Session management

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Structure
```
tests/
├── components/      # Component tests
├── services/        # Service tests
├── utils/          # Utility tests
└── integration/    # Integration tests
```

## 📱 Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

## 🤝 Contributing

### Development Setup
1. Fork repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Code Standards
- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features
- Update documentation
- Follow CSS BEM methodology untuk naming

### Commit Convention
```bash
# Format: type(scope): description
feat(upload): add drag and drop functionality
fix(auth): resolve login redirect issue
docs(readme): update deployment instructions
style(css): reorganize component styles
```

## 📝 Changelog

### Version 2.0.0
- ✅ Modular CSS architecture
- ✅ Vercel deployment optimization
- ✅ Enhanced build configuration
- ✅ CI/CD pipeline dengan GitHub Actions
- ✅ PWA functionality
- ✅ Performance optimizations
- ✅ Security improvements

### Version 1.0.0
- ✅ Basic plant disease detection
- ✅ User authentication
- ✅ File upload functionality
- ✅ Prediction history

## 🔮 Roadmap

### Q1 2024
- [ ] **Advanced PWA**: Enhanced offline functionality
- [ ] **Multi-language**: Internationalization support
- [ ] **Advanced Analytics**: Detailed insights dashboard
- [ ] **Mobile App**: React Native version

### Q2 2024
- [ ] **API v3**: Enhanced prediction accuracy
- [ ] **Real-time Collaboration**: Share results
- [ ] **Integration APIs**: Third-party integrations
- [ ] **Premium Features**: Advanced analysis tools

## 📞 Support

- 📧 **Email**: glorioussatria@gmail.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/satriadhm/leaves-disease-dashboard/issues)
- 📖 **Documentation**: [Wiki](https://github.com/satriadhm/leaves-disease-dashboard/wiki)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/satriadhm/leaves-disease-dashboard/discussions)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **TensorFlow.js**: AI model inference
- **Webpack**: Module bundling
- **Vercel**: Deployment platform
- **Inter Font**: Typography
- **Plant Disease API**: Backend services

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/satriadhm">G. Satria</a>
</p>

<p align="center">
  <a href="#top">🔝 Back to Top</a>
</p>