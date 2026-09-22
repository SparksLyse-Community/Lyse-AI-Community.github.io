# Site web de SparkLyse

Site vitrine et prototype de chat pour SparkLyse, un projet autour de l'intelligence artificielle et de l'open source. Le dépôt contient principalement un export statique réalisé avec Framer, complété par quelques scripts JavaScript et un serveur Node.js minimal pour le développement local.

## État du projet

- La page d'accueil est disponible dans `[index.html](index.html)`.
- Le chat de démonstration est disponible dans `[chat.html](chat.html)`.
- Le chat fonctionne actuellement en **mode TEST** : il simule une réponse et n'est connecté à aucun modèle d'IA.
- Le mode PROD affiche un aperçu de la requête prévue. La connexion à une API réelle reste à finaliser dans `[scripts/modules/chat.js](scripts/modules/chat.js)`.



## Prérequis

- Node.js 18 ou une version plus récente recommandée
- npm



## Installation et démarrage

Installez les dépendances du projet, puis lancez le serveur local :

```bash
npm install
npm run serve
```

Le site sera ensuite accessible à l'adresse [http://localhost:3000](http://localhost:3000). Le port peut être changé avec la variable `PORT` :

```bash
PORT=4000 npm run serve
```

Le serveur est implémenté dans `[serve.js](serve.js)`. Il sert les fichiers statiques depuis la racine du projet, fournit une page 404 personnalisée et prend en charge les extensions courantes utilisées par l'export Framer.

Pour un aperçu rapide sans installer de dépendance, un serveur statique comme `npx serve` peut également être utilisé :

```bash
npx serve .
```



## Pages principales


| URL           | Fichier                                      | Description                                        |
| ------------- | -------------------------------------------- | -------------------------------------------------- |
| `/`           | `[index.html](index.html)`                   | Page d'accueil SparkLyse                           |
| `/chat.html`  | `[chat.html](chat.html)`                     | Interface de chat de démonstration                 |
| `/train.html` | `[subpages/train.html](subpages/train.html)` | Page secondaire exportée                           |
| `/404.html`   | `[subpages/404.html](subpages/404.html)`     | Page affichée lorsqu'une ressource est introuvable |


Avec le serveur Node fourni, les URL sans extension correspondent aux fichiers de même nom présents dans `subpages/`. Par exemple, `/train` sert `subpages/train.html`.

## Configuration du chat

Le script `[scripts/modules/chat.js](scripts/modules/chat.js)` tente de charger un fichier `.env` à la racine du site. Les variables reconnues sont :

```dotenv
APP_MODE=test
API_URL=
API_KEY=
API_MODEL=lyse-ai-v1
```

Le mode effectif est choisi dans cet ordre : `?mode=test` ou `?mode=prod` dans l'URL, un choix conservé dans `localStorage`, `APP_MODE`, puis `test` par défaut.

### Important : ne pas mettre de secret dans `.env` côté production

Ce fichier est chargé par le navigateur avec `fetch`. Toute valeur qui y figure est donc visible par les utilisateurs et peut être récupérée par un visiteur du site. `API_KEY` ne doit jamais contenir une clé privée en production. Un véritable appel à un modèle doit passer par un backend ou une fonction serveur qui protège les identifiants et applique les contrôles nécessaires.

## Structure du projet

```text
.
├── index.html                 # Page d'accueil exportée depuis Framer
├── chat.html                  # Interface du chat de démonstration
├── serve.js                   # Serveur HTTP local Node.js
├── package.json               # Scripts npm
├── assets/                    # Images, polices, vidéos et ressources Framer
├── scripts/
│   ├── modules/chat.js        # Configuration et logique du chat
│   └── vendor/                # Modules JavaScript générés ou externes
├── styles/                    # Feuilles de style du site et du chat
├── subpages/                  # Pages secondaires et page 404
└── data/                      # Données statiques du projet
```



## Scripts npm

Le projet expose actuellement les scripts suivants :

```bash
npm run serve  # démarre le serveur local
npm test       # vérification minimale, aucun test automatisé configuré
```

Il n'y a pas encore de scripts `dev`, `build`, `preview`, `lint` ou `format`. Le projet n'utilise pas actuellement SolidJS, Vite ou TypeScript : il s'agit d'un site statique exporté, servi directement par Node.js.

## Vérification avant contribution

1. Lancez `npm run serve`.
2. Ouvrez la page d'accueil et `/chat.html` dans un navigateur.
3. Vérifiez les liens, les ressources et le comportement responsive.



## Crédits

Projet Framer Export / SparkLyse v1 WEB.

Merci au projet [FramerExport](https://github.com/danbenba/FramerExport) pour l'outil de conversion de Framer vers du code statique, ainsi qu'à Arthur pour son template Framer.