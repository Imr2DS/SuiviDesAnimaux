# Pet Tracker App

Une application mobile pour suivre et gérer les animaux domestiques, développée avec React Native et Expo.

## Fonctionnalités

- 🔐 Authentification par scan de carte d'identité
- 🏠 Écran d'accueil avec liste des animaux
- 🐾 Gestion des animaux (ajout, modification, suppression)
- 🔍 Recherche d'animaux
- 📱 Interface utilisateur moderne
- 🌐 Backend Supabase pour la persistance des données
- 📷 Scan NFC pour l'identification des animaux
- 📄 OCR pour la lecture des cartes d'identité

## Prérequis

- Node.js (v14 ou supérieur)
- npm ou yarn
- Expo CLI
- Compte Supabase
- Appareil mobile avec NFC (pour les fonctionnalités de scan)

## Installation

1. Cloner le dépôt :

```bash
git clone https://github.com/votre-username/pet-tracker-app.git
cd pet-tracker-app
```

2. Installer les dépendances :

   ```bash
   npm install
# ou
yarn install
```

3. Configurer les variables d'environnement :
   Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```
EXPO_PUBLIC_SUPABASE_URL=votre_url_supabase
EXPO_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon_supabase
```

4. Lancer l'application :

   ```bash
   npx expo start
   ```

## Structure du Projet

```
pet-tracker-app/
├── app/                    # Dossier principal de l'application
│   ├── (app)/             # Routes de l'application (authentifié)
│   ├── (auth)/            # Routes d'authentification
│   └── _layout.tsx        # Layout principal
├── assets/                # Images et ressources
├── components/            # Composants réutilisables
├── constants/             # Constantes et thème
├── lib/                   # Utilitaires et configurations
└── types/                 # Types TypeScript
```

## Technologies Utilisées

- React Native
- Expo
- Supabase
- TypeScript
- Expo Router
- Expo NFC
- Expo Camera
- Expo Document Scanner

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## Licence

MIT
