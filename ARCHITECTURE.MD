# ARCHITECTURE - TéléSport Olympic App

## 📋 Table of Contents
- [Overview](#overview)
- [Folder Structure](#folder-structure)
- [Components](#components)
- [Services](#services)
- [Models and Types](#models-and-types)
- [Data Flow](#data-flow)
- [API Preparation](#api-preparation)
---

## 🎯 Overview

This Angular application displays Olympic performance data by country with:
- A **dashboard** featuring a pie chart and global statistics
- A **detail page** for each country with a line chart and specific statistics
- A modular, scalable architecture ready for REST API integration

### Technologies
- **Angular 18** (standalone components)
- **Chart.js** for charts
- **RxJS** for asynchronous management
- **TypeScript** for strict typing
---

## 📁 Folder Structure
```
src/app/
├── core/                           
│   ├── services/                   # Singleton features (loaded once)
│   │   ├── olympic.service.ts      # Business logic management
│   │   └── data.service.ts         # Data management
│   ├── models/
│   │   ├── olympic.model.ts        # TypeScript interfaces (Olympic, Participation, Stat)
│   │   └── page-state.model.ts     # Page state type
│   └── constants/
│       └── chart.constants.ts      # Constants (colors, Chart.js configs)
│
├── shared/                         # Reusable components/directives
│   └── components/
│       ├── chart/                  # Reusable Chart.js component (pie/line)
│       ├── header/                 # Page header with title and stats
│       ├── spinner/                # Loading indicator
│       ├── stat-card/              # Statistics card
│       └── page-state/             # Page states (loading/error/empty)
│
├── pages/                          # Application pages (routes)
│   ├── home/                       # Dashboard with pie chart
│   ├── country/                    # Country details with line chart
│   └── not-found/                  # 404 page
│
├── app.component.ts                # Root component with global header
├── app.config.ts                   # Application configuration
└── app.routes.ts                   # Routing configuration

assets/
└── mock/
    └── olympic.json                # Mock data (replaced by API in production)
```
---

## 🧩 Components

### **Pages (Routes)**

#### **HomeComponent** (`pages/home/`)
- **Route:** `/`
- **Role:** Displays the main dashboard

#### **CountryComponent** (`pages/country/`)
- **Route:** `/country/:id`
- **Role:** Displays details for a specific country

#### **NotFoundComponent** (`pages/not-found/`)
- **Route:** `/not-found` and `**` (wildcard)
- **Role:** Displays a 404 page
---

### **Shared Components**

#### **HeaderComponent** (`shared/components/header/`)
- **Selector:** `<app-header>`
- **Role:** Displays a title and a list of statistics

#### **ChartComponent** (`shared/components/chart/`)
- **Selector:** `<app-chart>`
- **Role:** Reusable Chart.js component (pie or line)
- **Features:**
  - Lifecycle management (AfterViewInit, OnDestroy)
  - Chart destruction to prevent memory leaks
  - Responsive (mobile detection)

#### **SpinnerComponent** (`shared/components/spinner/`)
- **Selector:** `<app-spinner>`
- **Role:** Animated loading indicator

#### **StatCardComponent** (`shared/components/stat-card/`)
- **Selector:** `<app-stat-card>`
- **Role:** Displays a single statistic card

#### **PageStateComponent** (`shared/components/page-state/`)
- **Selector:** `<app-page-state>`
- **Role:** Manages page states (loading, error, empty data)
- **Features:**
  - Centralized state management
  - Consistent error handling across pages
  - ARIA live regions for accessibility
---

## 🔧 Services

### **DataService** (`services/data.service.ts`)
- **Role:** Data access facade (abstraction layer)
- **Responsibility:** Single entry point for components
- **Provider:** `providedIn: 'root'` (Singleton)
- **Main Methods:**
  - `getOlympics(): Observable<Olympic[]>` - Fetches all data

**Why this layer?**
- Abstraction: Components don't know the data source
- Future-proof: Easy to replace with real API calls
- Testability: Easy to mock in tests

### **OlympicService** (`core/services/olympic.service.ts`)
- **Role:** Olympic data management and business logic
- **Responsibility:**
  - Business logic (calculations, aggregations, transformations)
- **Provider:** `providedIn: 'root'` (Singleton)
- **Main Methods:**
  - `getOlympics(): Observable<Olympic[]>` - Loads data from DataService
  - `calculateTotalMedals()` - Calculates total medals
  - `calculateTotalAthletes()` - Calculates total athletes
  - `getUniqueYears()` - Returns unique Olympic years

## 🔄 Data Flow

### **Scenario: Dashboard Display (Home)**
```
1. HomeComponent.ngOnInit()
   ↓
2. OlympicService.getOlympics()
   ↓
3. DataService.getOlympics()
   ↓
4. HttpClient.get('assets/mock/olympic.json')
   ↓
5. Return Observable<Olympic[]>
   ↓
6. HomeComponent.handleOlympicData(data)
   ↓
7. Update properties (chartLabels, chartData, stats)
   ↓
8. Template rendering (HeaderComponent, ChartComponent)
```

## 🚀 API Preparation

### **Migration to REST API (future)**

The current architecture facilitates migration to an API:

#### **Required Changes (minimal):**

**1. Modify URL in DataService:**
```typescript
// BEFORE (local JSON)
private apiUrl = './assets/mock/olympic.json';

// AFTER (REST API)
private apiUrl = 'https://api.example.com/olympics';
```

**2. Components require NO changes** ✅
- They always go through services
- Data source (JSON or API) is transparent
---

## 🏗️ Applied Design Patterns

### **1. Singleton Pattern**
- Services with `providedIn: 'root'`
- Single instance shared throughout the application

### **2. Observer Pattern**
- Use of RxJS Observables for asynchronous data
- Subscription management with `takeUntilDestroyed()`

### **3. Facade Pattern**
- `DataService` as a facade simplifying data access
- Components don't know internal complexity

### **4. Separation of Concerns**
- Components: Display only
- Services: Business logic and data access
- Models: Typing and data structure

### **5. Component Composition**
- Reusable components (`ChartComponent`, `PageStateComponent`)
- Single Responsibility Principle applied
- Promotes code reuse and maintainability
---

### **Implemented Features**
- ✅ **Semantic HTML**: `<main>`, `<header>`, `<figure>`, `<figcaption>`
- ✅ **ARIA attributes**: `role`, `aria-label`, `aria-live`, `aria-describedby`
- ✅ **Keyboard navigation**: All interactive elements accessible via Tab
- ✅ **Visible focus states**: Clear outline on focused elements
- ✅ **Screen reader support**: Descriptive text for charts and states
- ✅ **Color contrast**: AA compliant (minimum 4.5:1)

---

### **Getting Started**
```bash
# Install dependencies
npm install

# Run the application
ng serve

# Open in browser
http://localhost:4200
```

### **Code Conventions**
- ✅ Strict TypeScript typing (no `any`)
- ✅ Interfaces for all data
- ✅ Subscription management (takeUntilDestroyed)
- ✅ English naming
- ✅ Standalone components
---

## 📚 Resources

- [Angular Documentation](https://angular.dev)
- [Chart.js Documentation](https://www.chartjs.org)
- [RxJS Documentation](https://rxjs.dev)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
---

**Last Updated:** December 30, 2025  
**Application Version:** 1.0.0