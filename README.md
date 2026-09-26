# Site web de SparksLyse

Site vitrine et prototype de chat pour SparksLyse, un projet autour de l'intelligence artificielle et de l'open source. Le dépôt contient principalement un export statique réalisé avec Framer, complété par quelques scripts JavaScript et un serveur Node.js minimal pour le développement local.

## Prérequis

- Node.js 18 ou une version plus récente recommandée
- pnpm

## Installation et démarrage

Installez les dépendances du projet, puis lancez le serveur local :

```bash
pnpm install
pnpm dev
```

Le site sera ensuite accessible à l'adresse [http://localhost:4321](http://localhost:4321).

## Pages principales

| URL | Fichier | Description |
| --- | --- | --- |
| `/` | [`src/pages/index.astro`](src/pages/index.astro) | Page d'accueil SparksLyse |
| `/chat` | [`src/pages/chat.astro`](src/pages/chat.astro) | Interface de chat de démonstration |
| `/train` | [`src/pages/train.astro`](src/pages/train.astro) | Page secondaire exportée |
| `/404` | [`src/pages/404.astro`](src/pages/404.astro) | Page affichée lorsqu'une ressource est introuvable |

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
