# 🩺 UBAQ Compliance – Gestion de conformité médicale

## 🎯 Objectif

UBAQ Compliance est une application fullstack permettant de suivre les événements impliquant des professionnels de santé (colloques, dîners, formations). Elle assure le respect des plafonds budgétaires, des obligations légales, et des contraintes internes en matière de conformité.

---

## ⚙️ Stack Technique

### Backend

- **Laravel 11**
- **Lighthouse GraphQL**
- **Sanctum** pour l'authentification API
- **PHP 8.2+**, **Composer**
- Middleware CORS & exclusions CSRF pour GraphQL configurés dans `bootstrap/app.php`
- Migrations :
  - `users`, `roles`, `events`, `doctors`, `laboratories`, `jobs`, `personal_access_tokens`

### Frontend

- **Vue.js 3** (Composition API)
- **TypeScript**
- **Apollo Client** pour les requêtes GraphQL
- **Tailwind CSS**
- **Vue Router** pour la navigation
- Pages créées :
  - `LoginView.vue`
  - `EventsView.vue`
  - `EventCreateView.vue`

---

## 🔐 Authentification

- Utilisation de **Sanctum** côté Laravel
- Résolution personnalisée via `Login.php` (GraphQL mutation)
- Token de connexion renvoyé dans `AuthPayload`
- Frontend configure automatiquement le header `Authorization: Bearer {token}` via Apollo

---

## 📐 Schéma GraphQL

### ✅ Types personnalisés

```graphql
scalar Date @scalar(class: "Nuwave\Lighthouse\Schema\Types\Scalars\Date")
scalar DateTime @scalar(class: "Nuwave\Lighthouse\Schema\Types\Scalars\DateTime")
```

### 📊 Queries

```graphql
user(id: ID, email: String): User @find
users(name: String): [User!]! @paginate
events: [Event!]! @all
doctors: [Doctor!]! @all
laboratories: [Laboratory!]! @all
```

### ✍️ Mutations

```graphql
createEvent(...) @create
createDoctor(...) @create
createLaboratory(...) @create
login(email: String!, password: String!): AuthPayload @field(resolver: ...)
logout: Boolean @auth
```

---

## 🚧 Fonctionnalités actuelles

- ✅ Connexion utilisateur avec token JWT
- ✅ Dashboard des événements (lecture via query)
- ⏳ Création d’événement (mutation présente, UI à compléter)
- ⏳ Suppression d’événement (non implémentée)
- ⏳ Statuts de validation (`pending`, `validated`, `rejected`) non implémentés

---

## 🛠 Installation

### 1. Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### 2. Frontend (Vue 3)

```bash
cd frontend
npm install
npm run dev
```

---

## 📁 Structure du projet

```txt
backend/
├── app/GraphQL/Mutations/
├── app/Models/
├── config/lighthouse.php
├── graphql/schema.graphql
├── database/migrations/
└── bootstrap/app.php

frontend/
├── src/graphql/
│   ├── queries.ts
│   ├── mutations.ts
├── src/pages/
│   ├── LoginView.vue
│   ├── EventsView.vue
│   └── EventCreateView.vue
├── src/router/
├── src/lib/apollo.ts
└── src/services/auth.service.ts
```

---

## 🧪 À venir

- [ ] Historique des validations (audit)
- [ ] Upload de justificatif (fichier)
- [ ] Alertes sur dépassement de budget (logique métier)
