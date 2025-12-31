# 🏅 Olympic Games Dashboard

> Angular application displaying Olympic performance data by country with interactive charts and detailed statistics.

## 📋 Table of Contents

- [Overview](#-overview)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Features](#-features)
- [Technologies](#-technologies)
- [Architecture](#-architecture)

---

## 🎯 Overview

Web application built with Angular to visualize Olympic medals by country through:
- **main dashboard** with pie chart and global statistics
![Dashbord desktop](<Capture d’écran 2025-12-31 à 15.22.38.png>)
![Dashboard mobile](<Capture d’écran 2025-12-31 à 15.26.59.png>)
- **country detail page** with medal evolution over time
![Country details desktop](<Capture d’écran 2025-12-31 à 15.27.42.png>)
![Country details mobile](<Capture d’écran 2025-12-31 à 15.27.12.png>)
- **modular** and **accessible** architecture
---

## 📦 Prerequisites

Before you begin, ensure you have installed:

- **Node.js**: `v24.12` or higher
- **Angular CLI**: `v18.2.21`
- **npm**: `v10+`

Check your versions:
```bash
node --version
npm --version
ng version
```

---

## 🚀 Installation

```bash
# 1. Install dependencies
npm install
```

---

## ▶️ Getting Started

### Development mode
```bash
npm start
# or
ng serve
```
Open `http://localhost:4200` in your browser.

### Production build
```bash
npm run build
```
Compiled files will be in the `dist/` folder.

### Tests
```bash
npm test
```

### Watch mode (automatic rebuild)
```bash
npm run watch
```

---

## 📁 Project Structure

```
src/app/
├── core/                       # Core business features
│   ├── constants/              # Constants (colors, Chart.js config)
│   ├── models/                 # TypeScript interfaces
│   └── services/               # Singleton services (data, business logic)
│
├── pages/                      # Application pages (routes)
│   ├── home/                   # Main dashboard
│   ├── country/                # Country detail
│   └── not-found/              # 404 page
│
├── shared/                     # Reusable components
│   └── components/
│       ├── chart/              # Chart.js charts (pie/line)
│       ├── header/             # Header with title and stats
│       ├── spinner/            # Loading indicator
│       └── stat-card/          # Statistic card
│       └── page-state/         # Handle state: loading, error, empty data
│
├── app.routes.ts               # Routing configuration
└── app.config.ts               # Global configuration

assets/
└── mock/
    └── olympic.json            # Mock data
```

---

## ✨ Features

### 🏠 Main Dashboard (`/`)
- Interactive pie chart of medals by country
- Global statistics (number of countries, number of Olympic Games)
- Navigation to detail page on country click

### 🌍 Country Detail Page (`/country/:id`)
- Line chart showing medal evolution over time
- Country-specific statistics
- Back to dashboard button

### 🔍 404 Page (`/not-found`)
- Error page for non-existent routes
- Link back to home

### ♿ Accessibility
- Keyboard navigation
- ARIA labels and descriptions
- Visible focus states
- Text descriptions for charts

---

## 🛠️ Technologies

| Technology | Version | Usage |
|-----------|---------|-------|
| **Angular** | 18.0.6 | Main framework |
| **TypeScript** | 5.4.2 | Development language |
| **Chart.js** | 4.2.1 | Interactive charts |
| **RxJS** | 7.8.0 | Reactive programming |
| **Jasmine/Karma** | 5.1.0/6.4.0 | Unit testing |

---

## 🏗️ Architecture
### Adapted MVC Pattern and principles
- **Models**: TypeScript interfaces (`Olympic`, `Participation`, `Stat`)
- **Services**: Business logic and data access
- **Components**: Views and user interactions

### Services
- **DataService**: Data access facade (ready for REST API)
- **OlympicService**: Business logic (calculations, aggregations)

### Design Patterns
- **Singleton**: Services with `providedIn: 'root'`
- **Observer**: RxJS Observables for async operations
- **Facade**: DataService simplifies data access
- **Separation of Concerns**: Components, services, and models separated

### Data Flow
```
Component → OlympicService → DataService → HTTP → JSON/API
```

For more details, see [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## 🔧 Configuration

### Environment Variables
Data is currently loaded from `assets/mock/olympic.json`.
To migrate to a REST API, modify url in `data.service.ts`:

### Chart.js Constants
Configuration in `core/constants/chart.constants.ts`:
- Chart colors
- Aspect ratio (desktop/mobile)
- Responsive options

---

## 📝 Code Conventions

- ✅ **Standalone components** (Modern Angular)
- ✅ **Strict typing** TypeScript (no `any`)
- ✅ **Interfaces** for all data
- ✅ **takeUntilDestroyed** for subscriptions
- ✅ **English naming** convention
- ✅ **ARIA** for accessibility
- ✅ **CSS Variables** for theming
