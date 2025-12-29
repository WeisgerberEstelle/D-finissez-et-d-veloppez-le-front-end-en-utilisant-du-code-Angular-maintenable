# ARCHITECTURE - TéléSport Olympic App

## 📋 Table des matières
- [Vue d'ensemble](#vue-densemble)
- [Arborescence des dossiers](#arborescence-des-dossiers)
- [Composants](#composants)
- [Services](#services)
- [Models et Types](#models-et-types)
- [Flux de données](#flux-de-données)
- [Préparation API](#préparation-api)
---

## 🎯 Vue d'ensemble

Cette application Angular affiche les performances des pays aux Jeux Olympiques avec :
- Un **dashboard** présentant un graphique pie et des statistiques globales
- Une **page détail** pour chaque pays avec un graphique line et des statistiques spécifiques
- Une architecture modulaire, scalable et prête pour l'intégration d'une API REST

### Technologies
- **Angular 18** (standalone components)
- **Chart.js** pour les graphiques
- **RxJS** pour la gestion de l'asynchrone
- **TypeScript** pour le typage strict
---

## 📁 Arborescence des dossiers
```
src/app/
├── core/                           
│   ├── services/                   # Fonctionnalités singleton (chargées une seule fois)
│   │   └── olympic.service.ts      # Gestion logique métier
│   │   └── data.service.ts         # Gestion données
│   ├── models/
│   │   └── olympic.model.ts        # Interfaces TypeScript (Olympic, Participation, Stat)
│   └── constants/
│       └── chart.constants.ts      # Constantes (couleurs, configs Chart.js)
│
├── shared/                         # Composants/directives réutilisables
│   └── components/
│       ├── chart/                  # Composant Chart.js réutilisable (pie/line)
│       ├── header/                 # En-tête de page avec titre et stats
│       └── spinner/                # Indicateur de chargement
│
├── pages/                          # Pages de l'application (routes)
│   ├── home/                       # Dashboard avec graphique pie
│   ├── country/                    # Détails d'un pays avec graphique line
│   └── not-found/                  # Page 404
│
├── app.component.ts                # Composant racine avec header global
├── app.config.ts                   # Configuration de l'application
└── app.routes.ts                   # Configuration du routing

assets/
└── mock/
    └── olympic.json                # Données mockées (remplacé par API en production)
```
---

## 🧩 Composants

### **Pages (Routes)**

#### **HomeComponent** (`pages/home/`)
- **Route :** `/`
- **Rôle :** Affiche le dashboard principal

#### **CountryComponent** (`pages/country/`)
- **Route :** `/country/:countryName`
- **Rôle :** Affiche les détails d'un pays spécifique

#### **NotFoundComponent** (`pages/not-found/`)
- **Route :** `/not-found` et `**` (wildcard)
- **Rôle :** Affiche une page 404
---

### **Composants partagés (Shared)**

#### **HeaderComponent** (`shared/components/header/`)
- **Sélecteur :** `<app-header>`
- **Rôle :** Affiche un titre et une liste de statistiques

#### **ChartComponent** (`shared/components/chart/`)
- **Sélecteur :** `<app-chart>`
- **Rôle :** Composant Chart.js réutilisable (pie ou line)
- **Fonctionnalités :**
  - Gestion du cycle de vie (AfterViewInit, OnDestroy)
  - Destruction du graphique pour éviter les memory leaks
  - Responsive (détection mobile)

#### **SpinnerComponent** (`shared/components/spinner/`)
- **Sélecteur :** `<app-spinner>`
- **Rôle :** Indicateur de chargement animé
---

## 🔧 Services

### **DataService** (`services/data.service.ts`)
- **Rôle :** Façade d'accès aux données (couche d'abstraction)
- **Responsabilité :** Point d'entrée unique pour les composants
- **Provider :** `providedIn: 'root'` (Singleton)
- **Méthodes principales :**
  - `getOlympics(): Observable<Olympic[]>` - Récupère toutes les données

**Pourquoi cette couche ?**
- Abstraction : Les composants ne connaissent pas la source des données
- Futur : Facile de remplacer par des appels API réels
- Testabilité : Facile à mocker dans les tests

### **OlympicService** (`core/services/olympic.service.ts`)
- **Rôle :** Gestion des données olympiques et logique métier
- **Responsabilité :**
  - Logique métier (calculs, agrégations, transformations)
- **Provider :** `providedIn: 'root'` (Singleton)
- **Méthodes principales :**
  - `getOlympics(): Observable<Olympic[]>` - Charge les données depuis DataService
  - `calculateTotalMedals()` - Calcule le total de médailles
  - `calculateTotalAthletes()` - Calcule le total d'athlètes
  - `getTotalEntries()` - Compte le nombre de participations

## 🔄 Flux de données

### **Scénario : Affichage du dashboard (Home)**
```
1. HomeComponent.ngOnInit()
   ↓
2. OlympicService.getOlympics()
   ↓
3. DataService.getOlympics()
   ↓
4. HttpClient.get('assets/mock/olympic.json')
   ↓
5. Retour Observable<Olympic[]>
   ↓
6. HomeComponent.handleOlympicData(data)
   ↓
7. Mise à jour des propriétés (chartLabels, chartData, stats)
   ↓
8. Rendu du template (HeaderComponent, ChartComponent)
```

## 🚀 Préparation API

### **Migration vers une API REST (futur)**

L'architecture actuelle facilite la migration vers une API :

#### **Changements nécessaires (minimes) :**

**1. Modifier l'URL dans DataService :**
```typescript
// AVANT (JSON local)
private apiUrl = './assets/mock/olympic.json';

// APRÈS (API REST)
private apiUrl = 'https://api.example.com/olympics';
```

**2. Les composants n'ont AUCUN changement à faire** ✅
- Ils passent toujours par les services
- La source de données (JSON ou API) est transparente

**Avantages :**
- ✅ Séparation des responsabilités (SoC)
- ✅ Testabilité (mock facile du DataService)
- ✅ Scalabilité
---

## 🏗️ Design Patterns appliqués

### **1. Singleton Pattern**
- Services avec `providedIn: 'root'`
- Une seule instance partagée dans toute l'application

### **2. Observer Pattern**
- Utilisation de RxJS Observables pour les données asynchrones
- Gestion des subscriptions avec `takeUntilDestroyed()`

### **3. Facade Pattern**
- `DataService` comme façade simplifiant l'accès aux données
- Composants ne connaissent pas la complexité interne

### **4. Separation of Concerns**
- Composants : Affichage uniquement
- Services : Logique métier et accès données
- Models : Typage et structure des données
---

### **Comment démarrer ?**
```bash
# Installer les dépendances
npm install

# Lancer l'application
ng serve

# Ouvrir dans le navigateur
http://localhost:4200
```

### **Conventions de code :**
- ✅ Typage strict TypeScript (pas de `any`)
- ✅ Interfaces pour toutes les données
- ✅ Gestion des subscriptions (takeUntilDestroyed)
- ✅ Nommage en anglais
- ✅ Composants standalone
---

## 📚 Ressources

- [Angular Documentation](https://angular.dev)
- [Chart.js Documentation](https://www.chartjs.org)
- [RxJS Documentation](https://rxjs.dev)
---

**Date de dernière mise à jour :** 28/12/2024  
**Version de l'application :** 1.0.0 