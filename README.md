# 🌱 Plant Disease Detection Dashboard

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
- **Dark/Light Mode**: Tema yang dapat disesuaikan
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
npm run build

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
│   ├── styles/             # Stylesheets
│   │   └── main.css        # Main CSS file
│   └── main.js             # Application entry point
├── dist/                   # Built files
├── webpack.config.js       # Webpack configuration
├── package.json
└── README.md
```

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

## 🎯 API Integration

Dashboard ini berintegrasi dengan [Plant Disease API](https://github.com/satriadhm/plant-disease-prediction-api):

### 🔗 Endpoints yang Digunakan

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/api/auth/signin` | Login pengguna |
| `POST` | `/api/auth/signup` | Registrasi pengguna |
| `POST` | `/api/predict` | Prediksi penyakit tanaman |
| `GET` | `/api/predictions/history` | Riwayat prediksi |
| `GET` | `/api/user/profile` | Data profil pengguna |
| `GET` | `/api/admin/users` | Data pengguna (admin) |

### 🔐 Authentication Flow

```javascript
// Login process
const credentials = { username, password };
const response = await apiService.login(credentials);

// Auto-stored in localStorage
localStorage.setItem('authToken', response.accessToken);
localStorage.setItem('user', JSON.stringify(response.user));
```

## 📱 Features Detail

### 🖼️ Image Upload & Camera
- **Drag & Drop**: Intuitive file upload
- **Real-time Preview**: Preview sebelum analisis
- **Image Validation**: Format dan ukuran file
- **Camera Integration**: Akses kamera device
- **Multiple Sources**: File system atau camera capture

### 🔍 AI Analysis
- **Real-time Processing**: Analisis menggunakan TensorFlow.js
- **Confidence Metrics**: Tingkat kepercayaan prediksi
- **Multiple Predictions**: Top 5 kemungkinan hasil
- **Disease Information**: Detail penyakit dan treatment

### 📊 Data Visualization
- **Charts & Graphs**: Visualisasi data prediksi
- **Statistics Dashboard**: Analisis penggunaan
- **Export Functions**: Download data dalam berbagai format
- **Real-time Updates**: Data yang selalu up-to-date

### 👨‍💼 Admin Features
- **User Management**: CRUD operasi pengguna
- **System Monitoring**: Health checks dan performance
- **Data Analytics**: Insight dari data penggunaan
- **Bulk Operations**: Operasi massal pada data

## 🎨 Theming & Customization

### CSS Custom Properties
```css
:root {
  --primary-500: #3b82f6;
  --success-500: #10b981;
  --error-500: #ef4444;
  --gray-50: #f9fafb;
  /* ... more variables */
}
```

### Component Styling
Setiap komponen memiliki styling modular yang dapat disesuaikan:

```css
.upload-container {
  /* Component-specific styles */
}

.upload-container.dark-theme {
  /* Dark theme overrides */
}
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
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

## 📈 Performance Optimization

### Code Splitting
```javascript
// Lazy loading components
const AdminDashboard = () => import('./components/AdminDashboard.js');
```

### Asset Optimization
- **Image Compression**: Otomatis compress gambar
- **CSS Purging**: Remove unused CSS
- **JS Minification**: Minify JavaScript production
- **Caching Strategy**: Browser caching untuk assets

### Bundle Analysis
```bash
# Analyze bundle size
npm run analyze
```

## 🔒 Security Features

### Input Validation
- **File Type Validation**: Hanya accept image files
- **File Size Limits**: Maksimal 5MB per file
- **XSS Protection**: Sanitize user inputs
- **CSRF Protection**: Token-based protection

### Authentication Security
- **JWT Tokens**: Secure token-based auth
- **Token Expiration**: Auto-expire sessions
- **Role-based Access**: Granular permissions
- **Password Strength**: Enforce strong passwords

## 🌐 Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

### Feature Support
- **ES6+ Features**: Modern JavaScript
- **CSS Grid & Flexbox**: Modern layouts
- **WebRTC**: Camera access
- **File API**: File handling
- **Fetch API**: HTTP requests

## 📱 Mobile Optimization

### Responsive Design
- **Mobile-first**: Optimized untuk mobile
- **Touch Gestures**: Support touch interactions
- **Viewport Optimization**: Optimal di semua ukuran screen
- **Performance**: Fast loading pada mobile networks

### PWA Features
- **Service Worker**: Offline functionality
- **App Manifest**: Installable app
- **Push Notifications**: Real-time updates
- **Background Sync**: Sync data ketika online

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify

```bash
# Build command
npm run build

# Publish directory
dist
```

### Docker

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🛠️ Development Tools

### Code Quality
- **ESLint**: JavaScript linting
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **Lint-staged**: Pre-commit checks

### Development Workflow
```bash
# Linting
npm run lint
npm run lint:fix

# Formatting
npm run format

# Type checking (if using TypeScript)
npm run type-check
```

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

## 📝 Changelog

### Version 2.0.0
- ✅ Complete UI/UX redesign
- ✅ Modern component architecture
- ✅ Enhanced mobile experience
- ✅ Admin dashboard
- ✅ Real-time notifications
- ✅ Performance optimizations

### Version 1.0.0
- ✅ Basic plant disease detection
- ✅ User authentication
- ✅ File upload functionality
- ✅ Prediction history

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
- **Inter Font**: Typography
- **Heroicons**: Icon system
- **Plant Disease API**: Backend services

## 🔮 Roadmap

### Q1 2024
- [ ] **Offline Mode**: PWA offline functionality
- [ ] **Multi-language**: Internationalization support
- [ ] **Advanced Analytics**: More detailed insights
- [ ] **Mobile App**: React Native version

### Q2 2024
- [ ] **API v3**: Enhanced prediction accuracy
- [ ] **Real-time Collaboration**: Share results
- [ ] **Integration APIs**: Third-party integrations
- [ ] **Premium Features**: Advanced analysis tools

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/satriadhm">G. Satria</a>
</p>

<p align="center">
  <a href="#top">🔝 Back to Top</a>
</p>