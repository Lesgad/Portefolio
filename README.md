## /!\ Précisions

Dans le projet, les textes des avis dans les témoignages sont générés par IA, à
des fins de démonstration. Les photos
proviennent de [pravatar.cc](https://pravatar.cc) (photos libres de droits).
Ce contenu peut être modifié ou supprimé à tout moment depuis
`/admin/testimonials`.

# Portefolio

Ce projet est notre portfolio, fait en binôme dans le cadre du challenge
front-end de l'école (React + TypeScript + Tailwind). L'objectif c'est de
présenter nos projets, notre parcours, et de permettre aux gens de nous
contacter facilement, tout en ayant une petite interface d'administration
pour gérer le contenu sans avoir à toucher au code à chaque fois.

## Stack technique et pourquoi ces choix

- **React 18 + TypeScript (strict)** : demandé par le cahier des charges, et
  ça permet d'éviter pas mal d'erreurs bêtes grâce au typage, même si au
  début ça m'a pris un peu de temps de m'habituer à devoir tout typer
  correctement (surtout avec `strict: true` qui n'autorise pas le `any`).
- **Vite** : pour le serveur de dev et le build, parce que c'est rapide et
  que la config est plus simple qu'avec Webpack.
- **Tailwind CSS** : pour certains éléments (la navbar par exemple), même si
  finalement nous avons utilisé beaucoup de styles inline aussi pour
  respecter precisement les couleurs et tailles du design Figma. Avec le
  recul nous aurions peut-être dû choisir une seule approche dès le début,
  mais ça fonctionne quand même.
- **react-router-dom v7** : pour la navigation entre les pages (Accueil,
  Contact, détails d'un projet, pages admin...) et pour le code splitting
  avec `React.lazy` + `Suspense`, qui est obligatoire dans le cahier des
  charges.
- **Zod** : pour valider les formulaires (contact, projets, témoignages)
  avant d'envoyer les données. Ça évite d'envoyer n'importe quoi à Firestore
  et ça permet d'afficher des messages d'erreur clairs sous les champs.
- **useReducer + useContext** : toute la gestion d'état (auth, formulaires
  admin, etc.) passe par des reducers, comme demandé dans les contraintes du
  projet, pour éviter le prop drilling et avoir un état bien centralisé même
  si parfois ça fait beaucoup d'actions à écrire pour des choses simples.

## Pourquoi Firebase

Nous avons choisi Firebase (Authentication + Firestore) parce que c'était la
solution qui nous permettait d'avoir un vrai backend fonctionnel sans avoir à
écrire et héberger un serveur nous-mêmes, ce qui n'était clairement pas le
sujet du challenge (le sujet c'est le front-end).

- **Firebase Authentication (Google)** sert à protéger les routes `/admin/*`.
  Seules les personnes connectées avec un compte Google peuvent accéder au
  tableau de bord, ajouter/modifier/supprimer des projets, lire les messages
  de contact, etc. C'est géré via `AuthContext` (un `useReducer` qui écoute
  `onAuthStateChanged`) et un composant `RequireAuth` qui redirige vers
  `/login` si on n'est pas connecté.
- **Firestore** sert de base de données pour trois collections :
  - `projects` : les projets affichés sur la page d'accueil et sur les
    pages de détail.
  - `testimonials` : les témoignages affichés sur la page d'accueil.
  - `contacts` : les messages envoyés depuis le formulaire de contact.

  Les pages publiques font des lectures simples (`fetchCollection`,
  `fetchDocument` dans `src/services/firestore.ts`), et l'admin fait les
  opérations CRUD complètes via `src/services/projects.ts`,
  `src/services/testimonials.ts` et `src/services/contacts.ts`.

Petit point important si vous clonez le projet : Firestore doit être créé
côté Firebase Console (sinon l'API renvoie une erreur "API non activée"), et
les règles de sécurité doivent autoriser la lecture publique de `projects` et
`testimonials`, la création publique sur `contacts`, et le reste uniquement
pour les utilisateurs connectés. Sinon tout reste bloqué et les pages
affichent juste "aucun projet" ou "impossible de charger" sans message
d'erreur très explicite, ce qui nous a pas mal fait galérer au début
honnêtement.

## Accès à l'administration

Pour simplifier la connexion (et ne pas avoir à gérer un système d'invitation
pour ce projet étudiant), **n'importe quel compte Google** peut se connecter
via `/login` et accéder aux pages `/admin/*` : il n'y a pas de vérification
d'adresse e-mail dans `RequireAuth`, ni dans les règles de sécurité Firestore.
Le seul critère, c'est d'être authentifié.

Dans un vrai contexte de production, nous aurions plutôt mis en place une liste
blanche d'adresses e-mail autorisées (ou un rôle stocké dans Firestore),
vérifiée côté client et dans les règles de sécurité Firestore, avec une
invitation des nouveaux administrateurs plutôt qu'un accès libre à toute
personne possédant un compte Google.

## Pourquoi EmailJS

Le formulaire de contact enregistre déjà le message dans Firestore (visible
depuis `/admin/contacts`), mais ça veut dire qu'il faut aller vérifier
l'admin régulièrement pour voir si quelqu'un a écrit. Nous avons donc ajouté
**EmailJS** (`@emailjs/browser`) pour qu'un vrai email soit envoyé
directement à notre adresse dès qu'un visiteur envoie le formulaire.

L'intérêt d'EmailJS c'est que ça envoie l'email directement depuis le
navigateur, sans avoir besoin d'un serveur ou d'une fonction backend (ce
qu'on n'a pas dans ce projet, qui est purement front + Firebase). Il suffit
de créer un compte EmailJS, de relier sa boîte Gmail, de créer un template
d'email, et de mettre les identifiants (Service ID, Template ID, Public Key)
dans le `.env`. C'est sûrement pas la solution la plus "professionnelle"
niveau sécurité (la clé publique se retrouve dans le code côté client), mais
pour un portfolio étudiant nous trouvons que ça fait largement le travail.

## Structure du projet

```
src/
  components/   composants réutilisables (Navbar, Hero, Projects, Contact, ...)
  pages/        pages routées (Home, Contact, ProjectDetails, Login, 404, admin/...)
  layouts/      RootLayout (site public) et AdminLayout (dashboard)
  context/      AuthContext (état d'authentification global)
  hooks/        hooks personnalisés (useAuth, useFirestoreCollection, useFirestoreDoc)
  services/     accès Firebase/Firestore/EmailJS (firebase, firestore, projects,
                testimonials, contacts, email)
  schemas/      schémas de validation Zod (project, testimonial, contact)
  types/        types TypeScript partagés (Project, Testimonial, ContactMessage)
scripts/        petits scripts Node ponctuels (seed de projets dans Firestore, etc.)
```

## Pages et routes

- `/` : page d'accueil (Hero, À propos, Projets, Témoignages)
- `/projects/:id` : détail d'un projet
- `/contact` : formulaire de contact (Firestore + email via EmailJS)
- `/login` : connexion Google
- `/admin` : tableau de bord (statistiques)
- `/admin/projects` : gestion des projets (CRUD complet, tags, aperçu en direct)
- `/admin/contacts` : messages reçus
- `/admin/testimonials` : gestion des témoignages

Toutes les routes `/admin/*` sont protégées par `RequireAuth` et nécessitent
une connexion Google.

## Installation et configuration

```bash
npm install
```

Créer un fichier `.env` à la racine avec les variables suivantes (à
récupérer dans la console Firebase et dans EmailJS) :

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

Puis lancer le serveur de dev :

```bash
npm run dev
```

## Scripts disponibles

- `npm run dev` : serveur de développement Vite
- `npm run build` : build de production (avec vérification TypeScript)
- `npm run preview` : prévisualiser le build de production

## Limites connues / pistes d'amélioration

- L'upload d'image n'est pas implémenté (Firebase Storage non configuré),
  donc les images de projets sont des URL externes.
- La clé publique EmailJS est exposée côté client, ce qui est normal pour ce
  service mais reste à garder en tête.
- Le bundle JS principal dépasse 500 kB après build (avertissement Vite), ça
  pourrait être amélioré avec un découpage plus fin des chunks, mais ce
  n'était pas la priorité pour ce projet.
