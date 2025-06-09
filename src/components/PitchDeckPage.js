// src/components/PitchDeckPage.js - Pitch Deck Presentation
export default class PitchDeckPage {
  constructor() {
    this.currentSlide = 0;
    this.slides = [
      'cover',
      'problem',
      'solution',
      'market',
      'product',
      'technology',
      'business',
      'competitive',
      'validation',
      'team',
      'financials',
      'funding',
      'contact'
    ];
    this.isFullscreen = false;
    this.autoPlay = false;
    this.autoPlayInterval = null;
  }

  render() {
    return `
      <div class="pitch-deck-container">
        <!-- Navigation Controls -->
        <div class="pitch-navigation">
          <div class="nav-controls">
            <button class="nav-btn" id="prevBtn" title="Previous Slide">
              ← Previous
            </button>
            <span class="slide-counter">
              <span id="currentSlideNum">${this.currentSlide + 1}</span> / ${this.slides.length}
            </span>
            <button class="nav-btn" id="nextBtn" title="Next Slide">
              Next →
            </button>
          </div>
          
          <div class="presentation-controls">
            <button class="control-btn" id="fullscreenBtn" title="Fullscreen">
              📺
            </button>
            <button class="control-btn" id="autoPlayBtn" title="Auto Play">
              ${this.autoPlay ? '⏸️' : '▶️'}
            </button>
            <button class="control-btn" id="exitBtn" title="Exit Presentation">
              ❌
            </button>
          </div>
        </div>

        <!-- Slide Indicators -->
        <div class="slide-indicators">
          ${this.slides.map((slide, index) => `
            <button class="indicator ${index === this.currentSlide ? 'active' : ''}" 
                    data-slide="${index}" 
                    title="Slide ${index + 1}: ${this.getSlideTitle(slide)}">
            </button>
          `).join('')}
        </div>

        <!-- Main Presentation Area -->
        <div class="presentation-container" id="presentationContainer">
          <div class="slides-wrapper" id="slidesWrapper">
            
            <!-- Slide 1: Cover -->
            <div class="slide ${this.currentSlide === 0 ? 'active' : ''}" data-slide="cover">
              <div class="slide-content cover-slide">
                <div class="cover-hero">
                  <div class="hero-icon">🌱</div>
                  <h1 class="hero-title">Plant Disease Detection</h1>
                  <p class="hero-subtitle">AI-Powered Agricultural Solution for Smart Farming</p>
                  <div class="hero-tagline">
                    Revolutionizing crop health management with cutting-edge AI technology
                  </div>
                </div>
                <div class="cover-footer">
                  <div class="company-info">
                    <strong>Plant Disease Detection Team</strong><br>
                    Innovative Agricultural Technology Solutions
                  </div>
                  <div class="presentation-date">
                    ${new Date().toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
            </div>

            <!-- Slide 2: Problem -->
            <div class="slide ${this.currentSlide === 1 ? 'active' : ''}" data-slide="problem">
              <div class="slide-content">
                <div class="slide-header">
                  <h2>🚨 The Problem</h2>
                  <p class="slide-subtitle">Agricultural challenges in crop disease management</p>
                </div>
                <div class="problem-grid">
                  <div class="problem-item">
                    <div class="problem-icon">🌾</div>
                    <h3>Rp40B+ Annual Losses</h3>
                    <p>Global crop losses due to plant diseases cost farmers over Rp40 billion annually</p>
                  </div>
                  <div class="problem-item">
                    <div class="problem-icon">👨‍🌾</div>
                    <h3>Limited Expertise</h3>
                    <p>Shortage of agricultural experts, especially in remote farming areas</p>
                  </div>
                  <div class="problem-item">
                    <div class="problem-icon">⏰</div>
                    <h3>Late Detection</h3>
                    <p>Traditional methods are slow, leading to widespread crop damage</p>
                  </div>
                  <div class="problem-item">
                    <div class="problem-icon">📊</div>
                    <h3>Inaccurate Diagnosis</h3>
                    <p>Human error in disease identification leads to wrong treatments</p>
                  </div>
                </div>
                <div class="problem-stats">
                  <div class="stat">
                    <div class="stat-number">20-40%</div>
                    <div class="stat-label">Crop yield loss potential</div>
                  </div>
                  <div class="stat">
                    <div class="stat-number">2-3 weeks</div>
                    <div class="stat-label">Traditional diagnosis time</div>
                  </div>
                  <div class="stat">
                    <div class="stat-number">60%</div>
                    <div class="stat-label">Farmers lack disease expertise</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Slide 3: Solution -->
            <div class="slide ${this.currentSlide === 2 ? 'active' : ''}" data-slide="solution">
              <div class="slide-content">
                <div class="slide-header">
                  <h2>💡 Our Solution</h2>
                  <p class="slide-subtitle">AI-powered instant plant disease detection</p>
                </div>
                <div class="solution-hero">
                  <div class="solution-visual">
                    <div class="phone-mockup">
                      <div class="phone-screen">
                        <div class="app-interface">
                          <div class="camera-view">📷</div>
                          <div class="detection-result">
                            <div class="result-icon">🔬</div>
                            <div class="result-text">Early Blight Detected</div>
                            <div class="confidence">94% Confidence</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="solution-features">
                    <div class="feature">
                      <div class="feature-icon">⚡</div>
                      <h3>Instant Analysis</h3>
                      <p>Get disease diagnosis in seconds, not weeks</p>
                    </div>
                    <div class="feature">
                      <div class="feature-icon">🎯</div>
                      <h3>95%+ Accuracy</h3>
                      <p>AI-powered detection with medical-grade precision</p>
                    </div>
                    <div class="feature">
                      <div class="feature-icon">📱</div>
                      <h3>Mobile-First</h3>
                      <p>Accessible anywhere with just a smartphone</p>
                    </div>
                    <div class="feature">
                      <div class="feature-icon">💊</div>
                      <h3>Treatment Guidance</h3>
                      <p>Personalized treatment recommendations</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Slide 4: Market -->
            <div class="slide ${this.currentSlide === 3 ? 'active' : ''}" data-slide="market">
              <div class="slide-content">
                <div class="slide-header">
                  <h2>🌍 Market Opportunity</h2>
                  <p class="slide-subtitle">Massive and growing agricultural technology market</p>
                </div>
                <div class="market-overview">
                  <div class="market-size">
                    <div class="market-circle">
                      <div class="market-value">Rp12.9T</div>
                      <div class="market-label">Global AgTech Market</div>
                      <div class="market-growth">+22.5% CAGR</div>
                    </div>
                  </div>
                  <div class="market-breakdown">
                    <div class="market-segment">
                      <h3>🎯 Target Markets</h3>
                      <div class="segment-item">
                        <span>Precision Agriculture</span>
                        <span>Rp7.5T</span>
                      </div>
                      <div class="segment-item">
                        <span>Crop Monitoring</span>
                        <span>Rp2.4T</span>
                      </div>
                      <div class="segment-item">
                        <span>Disease Management</span>
                        <span>Rp3.0T</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="market-drivers">
                  <h3>🚀 Market Drivers</h3>
                  <div class="drivers-grid">
                    <div class="driver">Population growth demanding 70% more food by 2050</div>
                    <div class="driver">Climate change increasing disease pressure</div>
                    <div class="driver">Labor shortage in agriculture</div>
                    <div class="driver">Rising smartphone penetration in rural areas</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Slide 5: Product -->
            <div class="slide ${this.currentSlide === 4 ? 'active' : ''}" data-slide="product">
              <div class="slide-content">
                <div class="slide-header">
                  <h2>🔬 Product Features</h2>
                  <p class="slide-subtitle">Comprehensive plant health management platform</p>
                </div>
                <div class="product-demo">
                  <div class="demo-tabs">
                    <div class="demo-tab active" data-demo="detection">Disease Detection</div>
                    <div class="demo-tab" data-demo="analytics">Analytics</div>
                    <div class="demo-tab" data-demo="recommendations">Recommendations</div>
                  </div>
                  <div class="demo-content">
                    <div class="demo-screen active" data-demo="detection">
                      <div class="feature-showcase">
                        <div class="showcase-image">
                          <div class="plant-image">🍃</div>
                          <div class="analysis-overlay">
                            <div class="scanning-line"></div>
                            <div class="detection-points">
                              <div class="point point-1"></div>
                              <div class="point point-2"></div>
                              <div class="point point-3"></div>
                            </div>
                          </div>
                        </div>
                        <div class="showcase-results">
                          <h3>🌶️ Chili: Leaf Curl</h3>
                          <div class="confidence-bar">
                            <div class="confidence-fill" style="width: 94%"></div>
                            <span>94% Confidence</span>
                          </div>
                          <div class="detection-details">
                            <div class="detail">🕐 Analysis Time: 1.2s</div>
                            <div class="detail">📊 Severity: Moderate</div>
                            <div class="detail">🎯 Stage: Early</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="product-stats">
                  <div class="stat-item">
                    <div class="stat-number">16+</div>
                    <div class="stat-label">Disease Types</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-number">4</div>
                    <div class="stat-label">Crop Types</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-number">< 2s</div>
                    <div class="stat-label">Analysis Time</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-number">95%+</div>
                    <div class="stat-label">Accuracy</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Slide 6: Technology -->
            <div class="slide ${this.currentSlide === 5 ? 'active' : ''}" data-slide="technology">
              <div class="slide-content">
                <div class="slide-header">
                  <h2>⚙️ Technology Stack</h2>
                  <p class="slide-subtitle">Cutting-edge AI and modern web technologies</p>
                </div>
                <div class="tech-architecture">
                  <div class="tech-layer">
                    <h3>🎨 Frontend</h3>
                    <div class="tech-items">
                      <div class="tech-item">Vanilla JavaScript</div>
                      <div class="tech-item">Progressive Web App</div>
                      <div class="tech-item">Responsive Design</div>
                      <div class="tech-item">Camera API</div>
                    </div>
                  </div>
                  <div class="tech-layer">
                    <h3>🧠 AI/ML</h3>
                    <div class="tech-items">
                      <div class="tech-item">Convolutional Neural Networks</div>
                      <div class="tech-item">TensorFlow</div>
                      <div class="tech-item">Image Classification</div>
                      <div class="tech-item">Transfer Learning</div>
                    </div>
                  </div>
                  <div class="tech-layer">
                    <h3>⚡ Backend</h3>
                    <div class="tech-items">
                      <div class="tech-item">Node.js/Express</div>
                      <div class="tech-item">MongoDB</div>
                      <div class="tech-item">JWT Authentication</div>
                      <div class="tech-item">RESTful API</div>
                    </div>
                  </div>
                  <div class="tech-layer">
                    <h3>☁️ Infrastructure</h3>
                    <div class="tech-items">
                      <div class="tech-item">Vercel Deployment</div>
                      <div class="tech-item">Railway Backend</div>
                      <div class="tech-item">Cloud Storage</div>
                      <div class="tech-item">CDN Optimization</div>
                    </div>
                  </div>
                </div>
                <div class="tech-advantages">
                  <div class="advantage">
                    <div class="advantage-icon">🚀</div>
                    <h4>Scalable</h4>
                    <p>Cloud-native architecture for global deployment</p>
                  </div>
                  <div class="advantage">
                    <div class="advantage-icon">🔒</div>
                    <h4>Secure</h4>
                    <p>Enterprise-grade security and data protection</p>
                  </div>
                  <div class="advantage">
                    <div class="advantage-icon">📱</div>
                    <h4>Cross-platform</h4>
                    <p>Works on any device with a web browser</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Slide 7: Business Model -->
            <div class="slide ${this.currentSlide === 6 ? 'active' : ''}" data-slide="business">
              <div class="slide-content">
                <div class="slide-header">
                  <h2>💼 Business Model</h2>
                  <p class="slide-subtitle">Multiple revenue streams for sustainable growth</p>
                </div>
                <div class="business-models">
                  <div class="model-card primary">
                    <div class="model-icon">🔄</div>
                    <h3>Subscription SaaS</h3>
                    <div class="model-price">Rp100.000,00/month</div>
                    <div class="model-features">
                      <div>Unlimited scans</div>
                      <div>Premium analytics</div>
                      <div>Treatment recommendations</div>
                      <div>Historical data</div>
                    </div>
                    <div class="model-target">Individual Farmers</div>
                  </div>
                  <div class="model-card">
                    <div class="model-icon">🏢</div>
                    <h3>Enterprise</h3>
                    <div class="model-price">Rp1.500.000,00/month</div>
                    <div class="model-features">
                      <div>Multi-user accounts</div>
                      <div>API access</div>
                      <div>Custom integrations</div>
                      <div>White-label solutions</div>
                    </div>
                    <div class="model-target">Agricultural Companies</div>
                  </div>
                  <div class="model-card">
                    <div class="model-icon">📊</div>
                    <h3>Data Analytics</h3>
                    <div class="model-price">Revenue Share</div>
                    <div class="model-features">
                      <div>Crop disease insights</div>
                      <div>Regional trends</div>
                      <div>Predictive analytics</div>
                      <div>Research partnerships</div>
                    </div>
                    <div class="model-target">Research Institutions</div>
                  </div>
                </div>
                <div class="revenue-projection">
                  <h3>📈 Revenue Projections</h3>
                  <div class="projection-chart">
                    <div class="year-bar">
                      <div class="year">Year 1</div>
                      <div class="bar" style="height: 20%"></div>
                      <div class="amount">Rp250K</div>
                    </div>
                    <div class="year-bar">
                      <div class="year">Year 2</div>
                      <div class="bar" style="height: 45%"></div>
                      <div class="amount">Rp750K</div>
                    </div>
                    <div class="year-bar">
                      <div class="year">Year 3</div>
                      <div class="bar" style="height: 80%"></div>
                      <div class="amount">Rp2.1M</div>
                    </div>
                    <div class="year-bar">
                      <div class="year">Year 4</div>
                      <div class="bar" style="height: 100%"></div>
                      <div class="amount">Rp4.8M</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Slide 8: Competitive Advantage -->
            <div class="slide ${this.currentSlide === 7 ? 'active' : ''}" data-slide="competitive">
              <div class="slide-content">
                <div class="slide-header">
                  <h2>🏆 Competitive Advantage</h2>
                  <p class="slide-subtitle">What sets us apart in the market</p>
                </div>
                <div class="competitive-comparison">
                  <div class="comparison-table">
                    <div class="comparison-header">
                      <div class="feature-col">Features</div>
                      <div class="us-col">Our Solution</div>
                      <div class="competitor-col">Traditional Methods</div>
                      <div class="competitor-col">Other Apps</div>
                    </div>
                    <div class="comparison-row">
                      <div class="feature">Speed</div>
                      <div class="us">⚡ < 2 seconds</div>
                      <div class="competitor">🐌 2-3 weeks</div>
                      <div class="competitor">⏱️ 5-10 seconds</div>
                    </div>
                    <div class="comparison-row">
                      <div class="feature">Accuracy</div>
                      <div class="us">🎯 95%+</div>
                      <div class="competitor">❓ 60-70%</div>
                      <div class="competitor">📊 80-85%</div>
                    </div>
                    <div class="comparison-row">
                      <div class="feature">Cost</div>
                      <div class="us">💰 Rp100.000,00/month</div>
                      <div class="competitor">💸 $200+ per visit</div>
                      <div class="competitor">💵 $15-30/month</div>
                    </div>
                    <div class="comparison-row">
                      <div class="feature">Availability</div>
                      <div class="us">📱 24/7 Mobile</div>
                      <div class="competitor">🏢 Office hours</div>
                      <div class="competitor">📱 Limited coverage</div>
                    </div>
                  </div>
                </div>
                <div class="advantages-grid">
                  <div class="advantage-item">
                    <div class="advantage-icon">🎓</div>
                    <h3>Deep Expertise</h3>
                    <p>Agricultural specialists and AI researchers</p>
                  </div>
                  <div class="advantage-item">
                    <div class="advantage-icon">🔬</div>
                    <h3>Proven Technology</h3>
                    <p>Validated AI models with real-world testing</p>
                  </div>
                  <div class="advantage-item">
                    <div class="advantage-icon">🌐</div>
                    <h3>First-Mover</h3>
                    <p>Early entry in Indonesian agriculture market</p>
                  </div>
                  <div class="advantage-item">
                    <div class="advantage-icon">🤝</div>
                    <h3>Partnerships</h3>
                    <p>Strategic alliances with farming cooperatives</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Slide 9: Validation -->
            <div class="slide ${this.currentSlide === 8 ? 'active' : ''}" data-slide="validation">
              <div class="slide-content">
                <div class="slide-header">
                  <h2>✅ Market Validation</h2>
                  <p class="slide-subtitle">Proven demand and early traction</p>
                </div>
                <div class="validation-metrics">
                  <div class="metric-card">
                    <div class="metric-icon">👥</div>
                    <div class="metric-number">1,200+</div>
                    <div class="metric-label">Beta Users</div>
                    <div class="metric-detail">Active monthly users</div>
                  </div>
                  <div class="metric-card">
                    <div class="metric-icon">📸</div>
                    <div class="metric-number">15,000+</div>
                    <div class="metric-label">Scans Processed</div>
                    <div class="metric-detail">Disease detections performed</div>
                  </div>
                  <div class="metric-card">
                    <div class="metric-icon">⭐</div>
                    <div class="metric-number">4.8/5</div>
                    <div class="metric-label">User Rating</div>
                    <div class="metric-detail">Average app store rating</div>
                  </div>
                  <div class="metric-card">
                    <div class="metric-icon">💰</div>
                    <div class="metric-number">$12.500.000,00</div>
                    <div class="metric-label">MRR</div>
                    <div class="metric-detail">Monthly recurring revenue</div>
                  </div>
                </div>
                <div class="testimonials">
                  <h3>💬 Customer Testimonials</h3>
                  <div class="testimonial-grid">
                    <div class="testimonial">
                      <div class="testimonial-text">"This app saved my chili crop! Early detection helped me prevent major losses."</div>
                      <div class="testimonial-author">- Budi, Farmer from Central Java</div>
                    </div>
                    <div class="testimonial">
                      <div class="testimonial-text">"Incredible accuracy and speed. It's like having an expert in your pocket."</div>
                      <div class="testimonial-author">- Dr. Sarah, Agricultural Consultant</div>
                    </div>
                    <div class="testimonial">
                      <div class="testimonial-text">"Our productivity increased 30% since using this for early disease management."</div>
                      <div class="testimonial-author">- PT Agro Solutions</div>
                    </div>
                  </div>
                </div>
                <div class="validation-awards">
                  <h3>🏆 Recognition</h3>
                  <div class="awards-grid">
                    <div class="award">🥇 Best AgTech Innovation 2024</div>
                    <div class="award">🚀 Startup of the Year Finalist</div>
                    <div class="award">🌱 Sustainable Tech Award</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Slide 10: Team -->
            <div class="slide ${this.currentSlide === 9 ? 'active' : ''}" data-slide="team">
              <div class="slide-content">
                <div class="slide-header">
                  <h2>👥 Our Team</h2>
                  <p class="slide-subtitle">Experienced professionals driving innovation</p>
                </div>
                <div class="team-grid">
                  <div class="team-member">
                    <div class="member-avatar">👨‍💻</div>
                    <h3>Tech Lead</h3>
                    <div class="member-name">Software Engineer</div>
                    <div class="member-expertise">Full-stack development, AI/ML integration</div>
                    <div class="member-background">Glorious Satria</div>
                  </div>
                  <div class="team-member">
                    <div class="member-avatar">🧬</div>
                    <h3>AI Specialist</h3>
                    <div class="member-name">ML Engineer</div>
                    <div class="member-expertise">Computer vision, deep learning</div>
                    <div class="member-background">Dina Merauke</div>
                  </div>
                  <div class="team-member">
                    <div class="member-avatar">🌾</div>
                    <h3>Agricultural Expert</h3>
                    <div class="member-name">Plant Pathologist</div>
                    <div class="member-expertise">Plant diseases, crop management</div>
                    <div class="member-background">Surya Merauke</div>
                  </div>
                  <div class="team-member">
                    <div class="member-avatar">💼</div>
                    <h3>Business Lead</h3>
                    <div class="member-name">Product Manager</div>
                    <div class="member-expertise">Market strategy, partnerships</div>
                    <div class="member-background">Amin Cilacap</div>
                  </div>
                </div>
                <div class="team-advisors">
                  <h3>🎯 Advisory Board</h3>
                  <div class="advisors-grid">
                    <div class="advisor">
                      <div class="advisor-icon">🏛️</div>
                      <div class="advisor-title">Former Agriculture Ministry Director</div>
                    </div>
                    <div class="advisor">
                      <div class="advisor-icon">🚀</div>
                      <div class="advisor-title">Serial Entrepreneur (3 exits)</div>
                    </div>
                    <div class="advisor">
                      <div class="advisor-icon">🔬</div>
                      <div class="advisor-title">Stanford AI Research Professor</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Slide 11: Financials -->
            <div class="slide ${this.currentSlide === 10 ? 'active' : ''}" data-slide="financials">
              <div class="slide-content">
                <div class="slide-header">
                  <h2>📊 Financial Projections</h2>
                  <p class="slide-subtitle">Strong growth trajectory and path to profitability</p>
                </div>
                <div class="financial-charts">
                  <div class="revenue-chart">
                    <h3>💰 Revenue Growth</h3>
                    <div class="chart-container">
                      <div class="chart-bars">
                        <div class="chart-bar">
                          <div class="bar" style="height: 15%"></div>
                          <div class="bar-label">2024</div>
                          <div class="bar-value">Rp250K</div>
                        </div>
                        <div class="chart-bar">
                          <div class="bar" style="height: 35%"></div>
                          <div class="bar-label">2025</div>
                          <div class="bar-value">Rp750K</div>
                        </div>
                        <div class="chart-bar">
                          <div class="bar" style="height: 60%"></div>
                          <div class="bar-label">2026</div>
                          <div class="bar-value">Rp2.1M</div>
                        </div>
                        <div class="chart-bar">
                          <div class="bar" style="height: 85%"></div>
                          <div class="bar-label">2027</div>
                          <div class="bar-value">Rp4.8M</div>
                        </div>
                        <div class="chart-bar">
                          <div class="bar" style="height: 100%"></div>
                          <div class="bar-label">2028</div>
                          <div class="bar-value">Rp8.2M</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="unit-economics">
                    <h3>📈 Unit Economics</h3>
                    <div class="economics-grid">
                      <div class="economic-metric">
                        <div class="metric-value">Rp100.000</div>
                        <div class="metric-name">ARPU/Month</div>
                      </div>
                      <div class="economic-metric">
                        <div class="metric-value">Rp2.500.000</div>
                        <div class="metric-name">CAC</div>
                      </div>
                      <div class="economic-metric">
                        <div class="metric-value">18 months</div>
                        <div class="metric-name">Avg. LTV</div>
                      </div>
                      <div class="economic-metric">
                        <div class="metric-value">5.2x</div>
                        <div class="metric-name">LTV/CAC</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="financial-milestones">
                  <h3>🎯 Key Milestones</h3>
                  <div class="milestones-timeline">
                    <div class="milestone">
                      <div class="milestone-year">2024</div>
                      <div class="milestone-target">Break-even on operations</div>
                    </div>
                    <div class="milestone">
                      <div class="milestone-year">2025</div>
                      <div class="milestone-target">10K paying customers</div>
                    </div>
                    <div class="milestone">
                      <div class="milestone-year">2026</div>
                      <div class="milestone-target">Positive net income</div>
                    </div>
                    <div class="milestone">
                      <div class="milestone-year">2027</div>
                      <div class="milestone-target">Regional expansion</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Slide 12: Funding -->
            <div class="slide ${this.currentSlide === 11 ? 'active' : ''}" data-slide="funding">
              <div class="slide-content">
                <div class="slide-header">
                  <h2>💎 Funding Ask</h2>
                  <p class="slide-subtitle">Investment opportunity to scale and dominate the market</p>
                </div>
                <div class="funding-ask">
                  <div class="ask-amount">
                    <div class="amount-circle">
                      <div class="amount">Rp2T</div>
                      <div class="round">Series A</div>
                    </div>
                  </div>
                  <div class="funding-details">
                    <div class="funding-use">
                      <h3>💰 Use of Funds</h3>
                      <div class="use-breakdown">
                        <div class="use-item">
                          <div class="use-bar">
                            <div class="use-fill" style="width: 40%"></div>
                          </div>
                          <div class="use-label">Product Development (40%)</div>
                          <div class="use-amount">Rp800M</div>
                        </div>
                        <div class="use-item">
                          <div class="use-bar">
                            <div class="use-fill" style="width: 30%"></div>
                          </div>
                          <div class="use-label">Marketing & Sales (30%)</div>
                          <div class="use-amount">Rp600M</div>
                        </div>
                        <div class="use-item">
                          <div class="use-bar">
                            <div class="use-fill" style="width: 20%"></div>
                          </div>
                          <div class="use-label">Team Expansion (20%)</div>
                          <div class="use-amount">Rp400M</div>
                        </div>
                        <div class="use-item">
                          <div class="use-bar">
                            <div class="use-fill" style="width: 10%"></div>
                          </div>
                          <div class="use-label">Operations (10%)</div>
                          <div class="use-amount">Rp200M</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="investor-value">
                  <h3>🎁 Value Proposition for Investors</h3>
                  <div class="value-grid">
                    <div class="value-item">
                      <div class="value-icon">📈</div>
                      <h4>High Growth Market</h4>
                      <p>$12.9B AgTech market growing 22.5% annually</p>
                    </div>
                    <div class="value-item">
                      <div class="value-icon">🏆</div>
                      <h4>Competitive Moat</h4>
                      <p>Proprietary AI models and first-mover advantage</p>
                    </div>
                    <div class="value-item">
                      <div class="value-icon">🌍</div>
                      <h4>Scalable Technology</h4>
                      <p>Cloud-native platform for global expansion</p>
                    </div>
                    <div class="value-item">
                      <div class="value-icon">💰</div>
                      <h4>Strong Unit Economics</h4>
                      <p>5.2x LTV/CAC ratio with clear path to profitability</p>
                    </div>
                  </div>
                </div>
                <div class="exit-strategy">
                  <h3>🚪 Exit Strategy</h3>
                  <div class="exit-options">
                    <div class="exit-option">
                      <div class="exit-icon">🏢</div>
                      <h4>Strategic Acquisition</h4>
                      <p>Agricultural giants like Bayer, John Deere</p>
                    </div>
                    <div class="exit-option">
                      <div class="exit-icon">📈</div>
                      <h4>IPO</h4>
                      <p>Public offering after reaching $50M+ ARR</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Slide 13: Contact -->
            <div class="slide ${this.currentSlide === 12 ? 'active' : ''}" data-slide="contact">
              <div class="slide-content contact-slide">
                <div class="contact-hero">
                  <div class="hero-icon">🚀</div>
                  <h1>Let's Transform Agriculture Together</h1>
                  <p class="hero-subtitle">Ready to join the agricultural revolution?</p>
                </div>
                <div class="contact-info">
                  <div class="contact-grid">
                    <div class="contact-item">
                      <div class="contact-icon">📧</div>
                      <h3>Email</h3>
                      <p>glorioussatria@gmail.com</p>
                    </div>
                    <div class="contact-item">
                      <div class="contact-icon">🌐</div>
                      <h3>Website</h3>
                      <p>plant-disease-detection.vercel.app</p>
                    </div>
                    <div class="contact-item">
                      <div class="contact-icon">📱</div>
                      <h3>Demo</h3>
                      <p>Try our live demo today</p>
                    </div>
                    <div class="contact-item">
                      <div class="contact-icon">💼</div>
                      <h3>Investors</h3>
                      <p>Schedule a meeting</p>
                    </div>
                  </div>
                </div>
                <div class="contact-cta">
                  <div class="cta-buttons">
                    <button class="cta-btn primary">📧 Contact Us</button>
                    <button class="cta-btn secondary">📱 Try Demo</button>
                    <button class="cta-btn tertiary">📄 Download Deck</button>
                  </div>
                </div>
                <div class="thank-you">
                  <h2>Thank You!</h2>
                  <p>Questions & Discussion</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- Progress Bar -->
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${((this.currentSlide + 1) / this.slides.length) * 100}%"></div>
        </div>
      </div>
    `;
  }

  getSlideTitle(slide) {
    const titles = {
      cover: 'Cover',
      problem: 'Problem Statement',
      solution: 'Our Solution',
      market: 'Market Opportunity',
      product: 'Product Features',
      technology: 'Technology Stack',
      business: 'Business Model',
      competitive: 'Competitive Advantage',
      validation: 'Market Validation',
      team: 'Our Team',
      financials: 'Financial Projections',
      funding: 'Funding Ask',
      contact: 'Contact & Thank You'
    };
    return titles[slide] || slide;
  }

  afterRender() {
    this.bindEvents();
    this.setupKeyboardNavigation();
    this.setupAutoPlay();
  }

  bindEvents() {
    // Navigation controls
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const autoPlayBtn = document.getElementById('autoPlayBtn');
    const exitBtn = document.getElementById('exitBtn');

    prevBtn?.addEventListener('click', () => this.previousSlide());
    nextBtn?.addEventListener('click', () => this.nextSlide());
    fullscreenBtn?.addEventListener('click', () => this.toggleFullscreen());
    autoPlayBtn?.addEventListener('click', () => this.toggleAutoPlay());
    exitBtn?.addEventListener('click', () => this.exitPresentation());

    // Slide indicators
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach(indicator => {
      indicator.addEventListener('click', (e) => {
        const slideIndex = parseInt(e.target.dataset.slide);
        this.goToSlide(slideIndex);
      });
    });

    // CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-btn');
    ctaButtons.forEach(btn => {
      btn.addEventListener('click', (e) => this.handleCTAClick(e));
    });

    // Touch/swipe support
    this.setupTouchNavigation();
  }

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          this.previousSlide();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
          e.preventDefault();
          this.nextSlide();
          break;
        case 'Home':
          e.preventDefault();
          this.goToSlide(0);
          break;
        case 'End':
          e.preventDefault();
          this.goToSlide(this.slides.length - 1);
          break;
        case 'F11':
          e.preventDefault();
          this.toggleFullscreen();
          break;
        case 'Escape':
          if (this.isFullscreen) {
            this.toggleFullscreen();
          }
          break;
      }
    });
  }

  setupTouchNavigation() {
    let startX = 0;
    let startY = 0;

    const container = document.getElementById('presentationContainer');
    if (!container) return;

    container.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });

    container.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = startX - endX;
      const diffY = startY - endY;

      // Only trigger if horizontal swipe is more significant than vertical
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          this.nextSlide(); // Swipe left = next slide
        } else {
          this.previousSlide(); // Swipe right = previous slide
        }
      }
    });
  }

  setupAutoPlay() {
    // Auto-play functionality
    if (this.autoPlay) {
      this.startAutoPlay();
    }
  }

  nextSlide() {
    if (this.currentSlide < this.slides.length - 1) {
      this.goToSlide(this.currentSlide + 1);
    }
  }

  previousSlide() {
    if (this.currentSlide > 0) {
      this.goToSlide(this.currentSlide - 1);
    }
  }

  goToSlide(index) {
    if (index < 0 || index >= this.slides.length) return;

    // Hide current slide
    const currentSlideElement = document.querySelector('.slide.active');
    currentSlideElement?.classList.remove('active');

    // Update current slide index
    this.currentSlide = index;

    // Show new slide
    const newSlideElement = document.querySelector(`[data-slide="${this.slides[index]}"]`);
    newSlideElement?.classList.add('active');

    // Update navigation
    this.updateNavigation();
    this.updateIndicators();
    this.updateProgressBar();

    // Analytics
    this.trackSlideView(this.slides[index]);
  }

  updateNavigation() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const slideNum = document.getElementById('currentSlideNum');

    if (prevBtn) prevBtn.disabled = this.currentSlide === 0;
    if (nextBtn) nextBtn.disabled = this.currentSlide === this.slides.length - 1;
    if (slideNum) slideNum.textContent = this.currentSlide + 1;
  }

  updateIndicators() {
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === this.currentSlide);
    });
  }

  updateProgressBar() {
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
      const progress = ((this.currentSlide + 1) / this.slides.length) * 100;
      progressFill.style.width = `${progress}%`;
    }
  }

  toggleFullscreen() {
    const container = document.getElementById('presentationContainer');
    if (!container) return;

    if (!this.isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.mozRequestFullScreen) {
        container.mozRequestFullScreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
      }
      this.isFullscreen = true;
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      this.isFullscreen = false;
    }
  }

  toggleAutoPlay() {
    this.autoPlay = !this.autoPlay;
    const autoPlayBtn = document.getElementById('autoPlayBtn');
    
    if (this.autoPlay) {
      this.startAutoPlay();
      if (autoPlayBtn) autoPlayBtn.textContent = '⏸️';
    } else {
      this.stopAutoPlay();
      if (autoPlayBtn) autoPlayBtn.textContent = '▶️';
    }
  }

  startAutoPlay() {
    this.stopAutoPlay(); // Clear any existing interval
    this.autoPlayInterval = setInterval(() => {
      if (this.currentSlide < this.slides.length - 1) {
        this.nextSlide();
      } else {
        this.stopAutoPlay();
      }
    }, 10000); // 10 seconds per slide
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  exitPresentation() {
    // Stop auto-play
    this.stopAutoPlay();
    
    // Exit fullscreen
    if (this.isFullscreen) {
      this.toggleFullscreen();
    }
    
    // Navigate back to home
    window.dispatchEvent(new CustomEvent('navigate', { detail: '/' }));
  }

  handleCTAClick(e) {
    const buttonText = e.target.textContent;
    
    if (buttonText.includes('Contact')) {
      window.open('mailto:glorioussatria@gmail.com?subject=Plant Disease Detection - Investment Inquiry', '_blank');
    } else if (buttonText.includes('Demo')) {
      window.dispatchEvent(new CustomEvent('navigate', { detail: '/' }));
    } else if (buttonText.includes('Download')) {
      // Generate and download PDF or share link
      this.downloadPitchDeck();
    }
  }

  downloadPitchDeck() {
    // Create a simple text summary for download
    const deckSummary = `
Plant Disease Detection - Pitch Deck Summary

🌱 COMPANY: Plant Disease Detection
📧 CONTACT: glorioussatria@gmail.com
🌐 WEBSITE: plant-disease-detection.vercel.app

💡 SOLUTION: AI-powered instant plant disease detection for smartphones
🎯 MARKET: $12.9B AgTech market growing 22.5% annually
💰 FUNDING: Seeking $2T Series A investment
📈 PROJECTIONS: $8.2M revenue by 2028

KEY FEATURES:
- 95%+ accuracy in disease detection
- <2 second analysis time
- 16+ disease types across 4 crops
- Rp100.000,00/month subscription model

TRACTION:
- 1,200+ beta users
- 15,000+ scans processed
- 4.8/5 user rating
- Rp50.000.0000,00 monthly recurring revenue

For full presentation and investment details, contact glorioussatria@gmail.com
    `;

    const blob = new Blob([deckSummary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Plant-Disease-Detection-Pitch-Deck-Summary.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  trackSlideView(slideName) {
    // Analytics tracking
    console.log(`Pitch Deck - Slide viewed: ${slideName}`);
    
    // Could integrate with Google Analytics or other tracking
    // gtag('event', 'slide_view', {
    //   slide_name: slideName,
    //   slide_number: this.currentSlide + 1
    // });
  }

  cleanup() {
    this.stopAutoPlay();
    document.removeEventListener('keydown', this.keydownHandler);
  }
}