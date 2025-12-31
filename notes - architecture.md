# Notes - Architecture
## **Exercise 1**

### **CRITICAL ISSUES**

### **1. HTTP calls in components / ANTI-PATTERN**

- **Files:** `country.component.ts` (l.27), `home.component.ts` (l.22)
- **Description:** `this.http.get()` directly in components instead of dedicated service
- **Impact:** SRP violation, untestable code, HTTP logic duplication
- **Solution:** Create `olympic.service.ts` and move all HTTP calls

### **2. Lack of strict typing (abuse of `any`)**

- **Files:** `country.component.ts`, `home.component.ts`
- **Description:** Variables typed as `any`, parameters `(i: any)`, no interfaces
- **Impact:** Loss of TypeScript safety, undetected runtime bugs, no autocomplete
- **Solution:** Create `Olympic` and `Participation` interfaces in `models/`

### **3. Memory leaks (unmanaged subscriptions)**

- **Files:** `country.component.ts` (l.27), `home.component.ts` (l.22)
- **Description:** `subscribe()` without `unsubscribe()` or `takeUntil`
- **Impact:** Memory explodes progressively, app slows down, crash risk
- **Solution:** Use `takeUntilDestroyed()` or `async pipe`

### **4. Business logic in components / ANTI-PATTERN**

- **Files:** `country.component.ts` (l.30-l.39), `home.component.ts` (l.25-l.31)
- **Description:** Complex calculations (`reduce`, `map`, `flat`) directly in components
- **Impact:** Non-reusable code, SRP violation, impossible to test
- **Solution:** Move all calculations to `olympic.service.ts`

### **5. Incomplete architecture / ANTI-PATTERN**

- **Files:** Entire application
- **Description:** Missing `services/`, `models/`, `constants/`, `guards/` folders
- **Impact:** Unprofessional structure, not maintainable, not scalable
- **Solution:** Create `core/` folder structure with services, models, constants

## **MEDIUM ISSUES**

### **6. Direct DOM manipulation**

- **Files:** `country.component.ts`(l.48), `home.component.ts` (l.41)
- **Description:** `new Chart("countryChart", {...})` with ID access
- **Impact:** Timing not guaranteed with ngOnInit, impossible to test
- **Solution:** Use **ngAfterViewInit** with `@ViewChild` and `ElementRef`

### **7. Duplicated Chart.js code**

- **Files:** `country.component.ts`(l.48), `home.component.ts` (l.41)
- **Description:** Chart.js configuration repeated in both components
- **Impact:** Difficult maintenance, possible inconsistency, verbose code
- **Solution:** Create reusable `ChartComponent` in `shared/`

### **8. Insufficient error handling**

- **Files:** `country.component.ts` (l.43), `home.component.ts` (l.35)
- **Description:** Error stored (`this.error = error.message`) but never displayed
- **Impact:** Poor UX, user blocked without feedback
- **Solution:** Display error message in template + redirection

### **9. Unnecessary conversions (number→string→number)**

- **Files:** `country.component.ts` (l.30 -l.39)
- **Description:** `.map(i => i.medalsCount.toString())` then `parseInt(item)`
- **Impact:** Degraded performance, confusing code, NaN risk
- **Solution:** Keep `number` type directly without conversion

### **10. Double subscription with race condition**

- **Files:** `country.component.ts`
- **Description:** `route.paramMap.subscribe()` then `http.get().subscribe()` but second uses variable assigned in first
- **Impact:** Potential bug (attempt to access country with `countryName = null`)
- **Solution:** Use `switchMap` to combine observables

### **11. No null/undefined checks**

- **Files:** `country.component.ts` (l.31), `home.component.ts`
- **Description:** `this.titlePage = selectedCountry.country` without checking if `selectedCountry` exists
- **Impact:** Crash if data missing, no fallback
- **Solution:** Check with `if (!selectedCountry)` and redirect to `/not-found`

### **12. Hardcoded colors and configs / ANTI-PATTERN**

- **Files:** `country.component.ts` (l.39), `home.component.ts` (l.49)
- **Description:** `backgroundColor: ['#0b868f', '#adc3de', ...]` directly in code
- **Impact:** No centralization, impossible to theme, limited to 6 colors
- **Solution:** Create `chart.constants.ts` with dynamic palette

## **MINOR ISSUES**

### **13. Too generic CSS classes**

- **Files:** All `.scss`
- **Description:** `.container`, `.center`, `.split` (too generic names)
- **Impact:** CSS conflict risk with third-party libraries
- **Solution:** Use BEM: `.country-chart__container`

### **14. Non-semantic HTML structure**

- **Files:** All `.html`
- **Description:** Nested divs without HTML5 tags (`<header>`, `<main>`, `<section>`) + missing `<h1>`
- **Impact:** Degraded SEO, poor accessibility for screen readers
- **Solution:** Replace divs with appropriate semantic tags

### **15. Insufficient accessibility**

- **Files:** All `.html`
- **Description:** No ARIA attributes, no `role`, no descriptive labels
- **Impact:** Inaccessible to users with disabilities
- **Solution:** Add `aria-label`, `role="img"`, etc.

### **16. Canvas with incorrect interpolation**

- **Files:** `country.component.html`, `home.component.html`
- **Description:** `<canvas>{{ lineChart }}</canvas>` (incorrect syntax for canvas)
- **Impact:** Unexpected display, not intended canvas usage
- **Solution:** Use `<canvas #chartCanvas></canvas>`

### **17. H2 title instead of H1**

- **Files:** `home.component.html`
- **Description:** `<h2>Olympic games app</h2>` as main page title
- **Impact:** Bad for SEO and title hierarchy
- **Solution:** Use `<h1>` for main title

### **18. Orphan `<hr/>` tag**

- **Files:** `home.component.html`
- **Description:** `<hr/>` used for visual decoration
- **Impact:** Poor semantics, should be handled in CSS
- **Solution:** Remove and use CSS for visual separation

### **19. Unclear text**

- **Files:** `home.component.html`
- **Description:** "JOs" abbreviation not explicit for international users
- **Impact:** Possible confusion, poor UX
- **Solution:** Write "Olympic Games" or use `<abbr>`

### **20. Declared but unused variables**

- **Files:** `country.component.ts`, `home.component.ts`
- **Description:** `public error!: string;` declared but never displayed
- **Impact:** Dead code, developer confusion
- **Solution:** Remove, display, or make `private` if internal use only

### **21. Empty pipe without operators**

- **Files:** `country.component.ts` (l.22)
- **Description:** `.pipe().subscribe()` without RxJS operators
- **Impact:** Useless code, confusion
- **Solution:** Remove `.pipe()`

### **22. Formatting inconsistencies**

- **Files:** Multiple files (e.g., `home.component.ts`)
- **Description:** Spaces before `:`, mixed quotes (single/double), variable indentation
- **Impact:** Reduced readability, unprofessional code
- **Solution:** Use Prettier or ESLint with strict config

### **23. Non-descriptive variable names**

- **Files:** `country.component.ts` (l.30), `home.component.ts`(l.29)
- **Description:** Variable `i` reused 3 times with different meanings
- **Impact:** Difficult to understand code
- **Solution:** Use descriptive names: `country`, `participation`, `medalCount`

---

## **Exercise 2**

### **1. PROPOSED FILE STRUCTURE**

```
src/
└── app/
    ├── core/
    │   ├── services/
    │   │   ├── olympic.service.ts               # Main service (data access + business logic)
    │   ├── models/
    │   │   └── olympic.model.ts                 # TypeScript Interfaces (Olympic, Participation)
    │   └── constants/
    │       └── chart.constants.ts               # Constants (colors, Chart.js configs)
    │
    ├── shared/                                  # Reusable components
    │   ├── components/
    │   │   ├── chart/
    │   │   │   ├── chart.component.ts
    │   │   │   ├── chart.component.html
    │   │   │   └── chart.component.scss
    │   │   ├── page-header/
    │   │   │   ├── page-header.component.ts
    │   │   │   ├── page-header.component.html
    │   │   │   └── page-header.component.scss
    │   │   └── stat-card/
    │   │       ├── stat-card.component.ts
    │   │       ├── stat-card.component.html
    │   │       └── stat-card.component.scss
    │   └── shared.module.ts
    ├── pages/
    │   ├── home/
    │   │   ├── home.component.ts
    │   │   ├── home.component.html
    │   │   └── home.component.scss
    │   ├── country/
    │   │   ├── country.component.ts
    │   │   ├── country.component.html
    │   │   └── country.component.scss
    │   └── not-found/
    │       ├── not-found.component.ts
    │       ├── not-found.component.html
    │       └── not-found.component.scss
    │
    ├── app.component.ts
    ├── app.component.html
    ├── app.component.scss
    ├── app.module.ts
    └── app-routing.module.ts

```

### **2. FOLDER DESCRIPTIONS**

### **`core/` - Global features**

**Role:** Contains services, models and constants used throughout **the entire application**

| Subfolder | Content | Responsibility |
| --- | --- | --- |
| **`services/`** | `olympic.service.ts` | HTTP calls + business logic (calculations, aggregations) |
| **`models/`** | `olympic.model.ts` | TypeScript interfaces (strong typing) |
| **`constants/`** | `chart.constants.ts` | Reusable values (colors, configs) |

### **3. PRINCIPLES AND DESIGN PATTERNS APPLIED**

### **Singleton Pattern (Services)**

**Problem solved:** Avoid duplication of service instances

### **Observer Pattern (RxJS Observables)**

RxJS **uses** the Observer Pattern

**Problem solved:** Asynchronous HTTP data management, /!\ unsubscribe management

### **Facade Pattern**

**Problem solved:** Simplify data access for components while hiding internal complexity, simplified components (presentation only), centralized business logic and **Separation of Concerns (SoC)**

### **Separation of Concerns (SoC)**

**Problem solved:** Mixed responsibilities in components

**Layered architecture:**

```
┌─────────────────────────────────────┐
│  PRESENTATION (Components)          │
│  home.component, country.component  │
└─────────────────────────────────────┘
              ↓ Use
┌─────────────────────────────────────┐
│  BUSINESS LOGIC (Services)          │
│  olympic.service                    │
└─────────────────────────────────────┘
              ↓ Use
┌─────────────────────────────────────┐
│  DATA ACCESS (HttpClient)           │
│  HTTP calls                         │
└─────────────────────────────────────┘
              ↓ Read
┌─────────────────────────────────────┐
│  DATA SOURCE (JSON / API)           │
│  olympic.json                       │
└─────────────────────────────────────┘

```