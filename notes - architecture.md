# Notes - architecture

## **Exercice 1**

### **PROBLÈMES CRITIQUES**

### **1. Appels HTTP dans les composants / ANTI-PATTERN**

- **Fichiers :** `country.component.ts`, `home.component.ts`
- **Description :** `this.http.get()` directement dans les composants au lieu d'un service dédié
- **Impact :** Violation SRP, code non testable, duplication logique HTTP
- **Solution :** Créer `olympic.service.ts` et déplacer tous les appels HTTP

### **2. Absence de typage strict (abus de `any`)**

- **Fichiers :** `country.component.ts`, `home.component.ts`
- **Description :** Variables typées `any`, paramètres `(i: any)`, pas d'interfaces
- **Impact :** Perte sécurité TypeScript, bugs runtime non détectés, pas d'autocomplétion
- **Solution :** Créer interfaces `Olympic` et `Participation` dans `models/`

### **3. Memory leaks (subscriptions non gérées)**

- **Fichiers :** `country.component.ts`, `home.component.ts`
- **Description :** `subscribe()` sans `unsubscribe()` ou `takeUntil`
- **Impact :** Mémoire qui explose progressivement, app ralentit, risque de crash
- **Solution :** Utiliser `takeUntilDestroyed()` ou `async pipe`

### **4. Logique métier dans les composants / ANTI-PATTERN**

- **Fichiers :** `country.component.ts`, `home.component.ts`
- **Description :** Calculs complexes (`reduce`, `map`, `flat`) directement dans les composants
- **Impact :** Code non réutilisable, violation SRP, tests impossibles
- **Solution :** Déplacer tous les calculs dans `olympic.service.ts`

### **5. Architecture incomplète / ANTI-PATTERN**

- **Fichiers :** Toute l'application
- **Description :** Absence de dossiers `services/`, `models/`, `constants/`, `guards/`
- **Impact :** Structure non professionnelle, non maintenable, non scalable
- **Solution :** Créer l'arborescence `core/` avec services, models, constants

## **PROBLÈMES MOYENS**

### **6. Manipulation directe du DOM**

- **Fichiers :** `country.component.ts`, `home.component.ts`
- **Description :** `new Chart("countryChart", {...})` avec accès par ID
- **Impact :** Timing non garanti avec ngOnInit, tests impossibles
- **Solution :** Utiliser **ngAfterViewInit** avec`@ViewChild` avec `ElementRef`

### **7. `console.log` en production (syntaxe incorrecte)**

- **Fichiers :** `home.component.ts`
- **Description :** `console.log`erreur : ${error}``  (syntaxe incorrecte)
- **Impact :** Bug d'affichage, fuite données sensibles, pollution console
- **Solution :** Supprimer ou utiliser `logger.service.ts`

### **8. Code Chart.js dupliqué**

- **Fichiers :** `country.component.ts`, `home.component.ts`
- **Description :** Configuration Chart.js répétée dans les 2 composants
- **Impact :** Maintenance difficile, incohérence possible, code verbeux
- **Solution :** Créer composant `ChartComponent` réutilisable dans `shared/`

### **9. Gestion d'erreur insuffisante**

- **Fichiers :** `country.component.ts`, `home.component.ts`
- **Description :** Erreur stockée (`this.error = error.message`) mais jamais affichée
- **Impact :** Mauvaise UX, utilisateur bloqué sans feedback
- **Solution :** Afficher message d'erreur dans le template + redirection

### **10. Conversions inutiles (number→string→number)**

- **Fichiers :** `country.component.ts`
- **Description :** `.map(i => i.medalsCount.toString())` puis `parseInt(item)`
- **Impact :** Performance dégradée, code confus, risque de NaN
- **Solution :** Garder le type `number` directement sans conversion

### **11. Double subscription imbriquée**

- **Fichiers :** `country.component.ts`
- **Description :** `route.paramMap.subscribe()` puis `http.get().subscribe()`
- **Impact :** Code verbeux, difficile à maintenir, gestion erreur complexe
- **Solution :** Utiliser `switchMap` pour combiner les observables

### **12. Pas de vérification null/undefined**

- **Fichiers :** `country.component.ts`, `home.component.ts`
- **Description :** `this.titlePage = selectedCountry.country` sans vérifier si existe
- **Impact :** Crash si données manquantes, pas de fallback
- **Solution :** Vérifier avec `if (!selectedCountry)` et rediriger vers `/not-found`

### **13. Couleurs et configs en dur / ANTI-PATTERN**

- **Fichiers :** `country.component.ts`, `home.component.ts`
- **Description :** `backgroundColor: ['#0b868f', '#adc3de', ...]` directement dans le code
- **Impact :** Pas de centralisation, impossible à thématiser, limite à 6 couleurs
- **Solution :** Créer `chart.constants.ts` avec palette dynamique

## **PROBLÈMES MINEURS +**

### **14. Classes CSS trop génériques**

- **Fichiers :** Tous `.scss`
- **Description :** `.container`, `.center`, `.split` (noms trop génériques)
- **Impact :** Risque de conflit CSS avec librairies tierces
- **Solution :** Utiliser BEM : `.country-chart__container`

### **15. Structure HTML non sémantique**

- **Fichiers :** Tous `.html`
- **Description :** Divs imbriquées sans balises HTML5 (`<header>`, `<main>`, `<section>`) + abscence de `<h1>`
- **Impact :** SEO dégradé, accessibilité faible pour lecteurs d'écran
- **Solution :** Remplacer divs par balises sémantiques appropriées

### **16. Accessibilité insuffisante**

- **Fichiers :** Tous `.html`
- **Description :** Pas d'attributs ARIA, pas de `role`, pas de labels descriptifs
- **Impact :** Inaccessible aux utilisateurs avec handicap
- **Solution :** Ajouter `aria-label`, `role="img"`, etc.

### **17. Canvas avec interpolation incorrecte**

- **Fichiers :** `country.component.html`, `home.component.html`
- **Description :** `<canvas>{{ lineChart }}</canvas>` (syntaxe incorrecte pour canvas)
- **Impact :** Affichage inattendu, pas l'usage prévu d'un canvas
- **Solution :** Utiliser `<canvas #chartCanvas></canvas>`

### **18. Titre H2 au lieu de H1**

- **Fichiers :** `home.component.html`
- **Description :** `<h2>Olympic games app</h2>` comme titre principal de page
- **Impact :** Mauvais pour SEO et hiérarchie des titres
- **Solution :** Utiliser `<h1>` pour le titre principal

### **19. Balise `<hr/>` orpheline**

- **Fichiers :** `home.component.html`
- **Description :** `<hr/>` utilisée pour décoration visuelle
- **Impact :** Mauvaise sémantique, devrait être géré en CSS
- **Solution :** Supprimer et utiliser CSS pour la séparation visuelle

### **20. Texte peu clair**

- **Fichiers :** `home.component.html`
- **Description :** Abréviation "JOs" non explicite pour utilisateurs internationaux
- **Impact :** Confusion possible, mauvaise UX
- **Solution :** Écrire "Olympic Games" ou utiliser `<abbr>`

### **21. Variables déclarées mais inutilisées**

- **Fichiers :** `country.component.ts`, `home.component.ts`
- **Description :** `public error!: string;` déclaré mais jamais affiché
- **Impact :** Code mort, confusion pour les développeurs
- **Solution :** Supprimer ou rendre `private` si usage interne uniquement

### **22. Pipe vide sans opérateurs**

- **Fichiers :** `country.component.ts`
- **Description :** `.pipe().subscribe()` sans opérateurs RxJS
- **Impact :** Code inutile, confusion
- **Solution :** Supprimer `.pipe()`

### **23. Inconsistances de formatage**

- **Fichiers :** Plusieurs fichiers
- **Description :** Espaces avant `:`, quotes mixtes (simple/double), indentation variable
- **Impact :** Lisibilité réduite, code non professionnel
- **Solution :** Utiliser Prettier ou ESLint avec config stricte

### **24. Noms de variables non descriptifs**

- **Fichiers :** `country.component.ts`, `home.component.ts`
- **Description :** Variable `i` réutilisée 3 fois avec significations différentes
- **Impact :** Code difficile à comprendre
- **Solution :** Utiliser noms descriptifs : `country`, `participation`, `medalCount`

### **Exercice 2**

src/
└── app/
├── core/                                    
│   ├── services/
│   │   ├── olympic.service.ts               # Service principal (data access + business logic)
│   ├── models/
│   │   └── olympic.model.ts                 # TypeScript Interfaces (Olympic, Participation)
│   └── constants/
│       └── chart.constants.ts               #Constants (colors, configs Chart.js)
│
├── shared/                                  # Composants réutilisables
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

### **2. DESCRIPTION DES DOSSIERS**

### **`core/` - Fonctionnalités globales**

**Rôle :** Contient les services, models et constantes utilisés dans **toute l'application**

| Sous-dossier | Contenu | Responsabilité |
| --- | --- | --- |
| **`services/`** | `olympic.service.ts` | Appels HTTP + logique métier (calculs, agrégations) |
| **`models/`** | `olympic.model.ts` | Interfaces TypeScript (typage fort) |
| **`constants/`** | `chart.constants.ts` | Valeurs réutilisables (couleurs, configs) |

### **3. PRINCIPES ET DESIGN PATTERNS APPLIQUÉS**

### **Singleton Pattern (Services)**

**Problème résolu :** Éviter la duplication d'instances de services

### **Observer Pattern (RxJS Observables)**

RxJS **utilise** l’Observer Pattern

**Problème résolu :** Gestion asynchrone des données HTTP, /!\ gestion de l’unsubscribe

### **Facade Pattern**

**Problème résolu :** Simplifier l'accès aux données pour les composants tout en masquant la complexité interne, composants simplifiés (présentation uniquement), logique métier centralisée et **séparation des responsabilités (SoC)**

### **Separation of Concerns (SoC)**

**Problème résolu :** Mélange de responsabilités dans les composants

**Architecture en couches :**

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