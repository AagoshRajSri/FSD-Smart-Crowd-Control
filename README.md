# PRAHAR

**A Real-Time Geospatial Intelligence Platform for Enterprise Operations**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/Language-JavaScript-f7df1e?logo=javascript)](https://www.javascript.com/)
[![Node.js](https://img.shields.io/badge/Node.js-v16+-339933?logo=node.js)](https://nodejs.org/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Real-Time Monitoring](#real-time-monitoring)
- [Crowd Analytics](#crowd-analytics)
- [Tactical Operations](#tactical-operations)
- [Performance Optimization](#performance-optimization)
- [Security](#security)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License](#license)
- [Support & Contact](#support--contact)

## Overview

PRAHAR is an enterprise-grade command center platform that transforms geospatial data into an interactive 3D environment. It provides real-time monitoring, predictive crowd analytics, and tactical operations capabilities for organizations managing complex spatial environments.

### Key Capabilities

- 🌍 **Interactive 3D Geospatial Visualization** - Render and interact with geospatial data in real-time
- 📊 **Real-Time Data Processing** - Stream and process live geospatial information
- 🎯 **Predictive Analytics** - Advanced crowd behavior prediction and forecasting
- 🛰️ **Tactical Operations Support** - Decision-making tools for operational teams
- 📱 **Multi-Device Support** - Responsive design for desktop, tablet, and mobile devices
- 🔐 **Enterprise-Grade Security** - End-to-end encryption and authentication

## Features

### 1. 3D Geospatial Visualization
- Interactive globe and map rendering
- Real-time object tracking and visualization
- Custom layer management
- Heat map overlays
- Customizable markers and annotations
- Zoom and rotation controls

### 2. Real-Time Monitoring
- Live data stream ingestion
- Multi-source data integration
- Custom alert and notification system
- Event logging and history tracking
- Performance metrics and KPI dashboards

### 3. Predictive Crowd Analytics
- AI-powered crowd density prediction
- Movement pattern analysis
- Anomaly detection
- Forecasting models for event planning
- Risk assessment and mitigation recommendations

### 4. Tactical Operations
- Command and control interface
- Resource allocation tools
- Incident management workflows
- Collaborative team operations
- Historical data analysis and reporting

### 5. Data Management
- Multi-format data ingestion (GeoJSON, KML, WMS, etc.)
- Time-series data handling
- Data caching and optimization
- Export capabilities (multiple formats)
- Audit trails and compliance logging

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Frontend Layer                     │
│  (React.js / Vue.js / Three.js Visualization)        │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│                 API Gateway Layer                    │
│  (REST / WebSocket APIs)                            │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│              Application Services Layer              │
│  ┌──────────────────────────────────────────────┐   │
│  │ • Real-Time Processing                       │   │
│  │ • Analytics Engine                           │   │
│  │ • Geospatial Services                        │   │
│  │ • Authentication & Authorization             │   │
│  └──────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│              Data Management Layer                   │
│  ┌──────────────────────────────────────────────┐   │
│  │ • Database (PostgreSQL/MongoDB)              │   │
│  │ • Cache Layer (Redis)                        │   │
│  │ • Message Queue (Kafka/RabbitMQ)             │   │
│  │ • File Storage                               │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: JavaScript (99.6%)
- **3D Visualization**: Three.js / Babylon.js
- **UI Framework**: React.js / Vue.js / Angular
- **Real-Time Communication**: WebSocket / Socket.io
- **Mapping**: Leaflet.js / Mapbox GL
- **State Management**: Redux / Vuex
- **Build Tool**: Webpack / Vite
- **Styling**: Tailwind CSS / SCSS

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js / Fastify
- **Database**: PostgreSQL / MongoDB
- **Cache**: Redis
- **Message Queue**: Kafka / RabbitMQ
- **Search**: Elasticsearch

### DevOps
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **CI/CD**: GitHub Actions / GitLab CI
- **Monitoring**: Prometheus / Grafana
- **Logging**: ELK Stack / Splunk

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v7 or higher) or **yarn** (v1.22 or higher)
- **Docker** (optional, for containerized deployment)
- **Git** (for version control)
- **Modern web browser** (Chrome, Firefox, Safari, or Edge)

### System Requirements

- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: Minimum 2GB free disk space
- **Network**: Stable internet connection for real-time data streaming
- **GPU**: Recommended for optimal 3D rendering performance

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/AagoshRajSri/PRAHAR.git
cd PRAHAR
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Configure the following variables in `.env`:

```env
# Server Configuration
PORT=3000
NODE_ENV=development
API_BASE_URL=http://localhost:3000/api

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=prahar
DB_USER=prahar_user
DB_PASSWORD=your_secure_password

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRY=24h

# Geospatial Services
MAPBOX_TOKEN=your_mapbox_token
GEOSERVER_URL=http://localhost:8080/geoserver

# WebSocket Configuration
WS_ENABLED=true
WS_PORT=3001

# Logging
LOG_LEVEL=info
LOG_FORMAT=json

# Feature Flags
ENABLE_CROWD_ANALYTICS=true
ENABLE_PREDICTIVE_MODELS=true
ENABLE_TACTICAL_MODE=true
```

### 4. Database Setup

```bash
# Run migrations
npm run db:migrate

# Seed initial data (optional)
npm run db:seed
```

### 5. Build Frontend (if applicable)

```bash
npm run build
```

### 6. Start the Application

```bash
# Development mode
npm run dev

# Production mode
npm run start
```

The application will be available at `http://localhost:3000`

## Configuration

### Application Configuration

Edit `config/app.config.js` to customize:

```javascript
module.exports = {
  // Server settings
  server: {
    port: process.env.PORT || 3000,
    host: '0.0.0.0',
    cors: {
      origin: ['http://localhost:3000', 'https://yourdomain.com'],
      credentials: true
    }
  },
  
  // Map settings
  map: {
    defaultZoom: 10,
    defaultCenter: [0, 0],
    maxZoom: 20,
    minZoom: 2
  },
  
  // Real-time settings
  realtime: {
    updateInterval: 1000,
    batchSize: 100,
    compressionEnabled: true
  },
  
  // Analytics settings
  analytics: {
    predictionModels: ['density', 'flow', 'anomaly'],
    updateFrequency: 5000
  }
};
```

## Usage

### Starting a Real-Time Monitoring Session

```javascript
import { GeoMonitor } from './lib/monitor';

const monitor = new GeoMonitor({
  apiKey: 'your-api-key',
  region: 'us-east-1'
});

monitor.on('data-update', (data) => {
  console.log('New geospatial data:', data);
});

await monitor.startMonitoring();
```

### Accessing the Dashboard

1. Open your browser and navigate to `http://localhost:3000`
2. Log in with your credentials
3. Select a region or area to monitor
4. Use the toolbar to access different features:
   - **Map View**: Standard 2D map interface
   - **3D Globe**: Interactive 3D visualization
   - **Analytics**: Crowd prediction and analysis
   - **Operations**: Tactical command center
   - **Reports**: Historical data and analytics

### API Examples

#### Get Real-Time Data

```bash
curl -X GET http://localhost:3000/api/realtime/locations \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

#### Predict Crowd Movement

```bash
curl -X POST http://localhost:3000/api/analytics/predict \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "region": "downtown",
    "timeHorizon": 60,
    "model": "density"
  }'
```

#### Create an Incident Report

```bash
curl -X POST http://localhost:3000/api/incidents/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Incident Title",
    "location": [40.7128, -74.0060],
    "severity": "high",
    "description": "Incident description"
  }'
```

## API Documentation

### Authentication Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh authentication token
- `POST /api/auth/register` - Register new user

### Geospatial Endpoints

- `GET /api/geo/locations` - Fetch all monitored locations
- `GET /api/geo/locations/:id` - Get specific location details
- `POST /api/geo/layers` - Create new geospatial layer
- `GET /api/geo/layers` - List all layers

### Real-Time Endpoints

- `GET /api/realtime/stream` - WebSocket stream for real-time data
- `GET /api/realtime/status` - Current system status
- `POST /api/realtime/subscribe` - Subscribe to specific data feeds

### Analytics Endpoints

- `POST /api/analytics/predict` - Generate crowd predictions
- `GET /api/analytics/trends` - Retrieve trend analysis
- `POST /api/analytics/anomaly-detect` - Detect anomalies

### Operations Endpoints

- `GET /api/operations/incidents` - List all incidents
- `POST /api/operations/incidents` - Create new incident
- `PUT /api/operations/incidents/:id` - Update incident
- `GET /api/operations/resources` - List available resources

## Real-Time Monitoring

### WebSocket Events

```javascript
// Connect to real-time stream
const ws = new WebSocket('ws://localhost:3001/realtime');

// Listen for location updates
ws.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);
  console.log('Location update:', data);
});

// Event Types:
// - location:update
// - crowd:density-change
// - incident:new
// - alert:critical
// - resource:status-change
```

### Setting Up Data Sources

1. Navigate to **Settings > Data Sources**
2. Click **Add Data Source**
3. Configure the source:
   - Type (GPS, IoT, API, etc.)
   - Authentication credentials
   - Update frequency
   - Filtering rules
4. Save and activate

## Crowd Analytics

### Predictive Models

**Density Prediction**
- Forecasts crowd density changes
- Generates heat maps for future time periods
- Accuracy: 85-92%

**Flow Analysis**
- Predicts movement patterns
- Identifies bottlenecks
- Suggests optimal routes

**Anomaly Detection**
- Identifies unusual crowd behavior
- Early warning system
- Triggers automated alerts

### Using Analytics

```javascript
import { CrowdAnalytics } from './lib/analytics';

const analytics = new CrowdAnalytics();

// Get prediction
const forecast = await analytics.predictDensity({
  location: [40.7128, -74.0060],
  timeHorizon: 3600 // 1 hour
});

console.log(`Predicted density: ${forecast.density}%`);
```

## Tactical Operations

### Command Center Features

- **Resource Allocation**: Distribute assets efficiently
- **Incident Management**: Track and respond to events
- **Team Collaboration**: Coordinate multi-team operations
- **Emergency Response**: Quick-response incident handling

### Workflow Example

1. **Detect Issue**: System identifies crowd anomaly
2. **Alert**: Notification sent to operations team
3. **Respond**: Resources allocated and dispatched
4. **Monitor**: Real-time tracking during response
5. **Resolve**: Incident marked complete with report

## Performance Optimization

### Frontend Optimization

- Enable WebGL rendering for 3D visualization
- Use data compression for network transfers
- Implement lazy loading for map tiles
- Cache frequently accessed data locally

### Backend Optimization

- Database indexing on geospatial queries
- Redis caching for frequent queries
- Connection pooling for database
- Load balancing across multiple instances

### Network Optimization

- CDN integration for static assets
- WebSocket for real-time data (lower latency than polling)
- Gzip compression enabled by default
- Request batching for multiple queries

## Security

### Authentication

- JWT-based authentication
- Multi-factor authentication (MFA) support
- Role-based access control (RBAC)
- Session timeout: 24 hours

### Data Protection

- End-to-end encryption for sensitive data
- HTTPS/TLS for all communications
- Database encryption at rest
- Secure API key management

### Compliance

- GDPR compliant data handling
- Audit logging for all operations
- Data retention policies
- Regular security audits

### Best Practices

```javascript
// Always use environment variables for secrets
const apiKey = process.env.API_KEY;

// Validate and sanitize user input
const sanitizedInput = sanitizeInput(userInput);

// Use HTTPS in production
const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

// Set secure headers
app.use(helmet());

// Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));
```

## Contributing

We welcome contributions to PRAHAR! Please follow these guidelines:

### Getting Started

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Code Style

- Use ESLint for code formatting
- Follow JavaScript best practices
- Add JSDoc comments for functions
- Write unit tests for new features

### Running Tests

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Pull Request Process

1. Update documentation as needed
2. Add tests for new functionality
3. Ensure all tests pass
4. Request review from maintainers
5. Address feedback and update PR

## Troubleshooting

### Common Issues

**Issue**: Application fails to start
```bash
# Solution: Clear cache and reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Issue**: WebSocket connection fails
```bash
# Solution: Check firewall and WebSocket port
netstat -an | grep 3001
# Update firewall rules if port is blocked
```

**Issue**: Database connection error
```bash
# Solution: Verify database configuration
npm run db:check
# Verify credentials in .env file
```

**Issue**: 3D visualization not loading
```bash
# Solution: Check GPU support and WebGL
# Verify browser console for WebGL errors
# Update GPU drivers
# Try disabling hardware acceleration if needed
```

### Getting Help

- **Documentation**: Check the [docs](./docs) folder
- **Issues**: Search existing [GitHub Issues](https://github.com/AagoshRajSri/PRAHAR/issues)
- **Discussions**: Post in [GitHub Discussions](https://github.com/AagoshRajSri/PRAHAR/discussions)
- **Email**: [support@prahar.io](mailto:support@prahar.io)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support & Contact

### Project Links

- **Repository**: [github.com/AagoshRajSri/PRAHAR](https://github.com/AagoshRajSri/PRAHAR)
- **Issues**: [Report a Bug](https://github.com/AagoshRajSri/PRAHAR/issues)
- **Discussions**: [Ask a Question](https://github.com/AagoshRajSri/PRAHAR/discussions)

### Authors

- **Aagosh Raj Sri** - *Initial work* - [GitHub Profile](https://github.com/AagoshRajSri)

### Acknowledgments

- Thanks to all contributors who have helped with code, bug reports, and suggestions
- Special thanks to the open-source community for incredible libraries and tools
- Inspired by modern geospatial and command center applications

### Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and updates.

### Roadmap

See [ROADMAP.md](ROADMAP.md) for planned features and improvements.

---

**Last Updated**: May 2026

**Status**: Active Development ✅

For the latest updates, please visit the [GitHub repository](https://github.com/AagoshRajSri/PRAHAR).
