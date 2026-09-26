---
title: "SparksLyse : on construit notre propre intelligence artificielle, de zéro"
pubDate: 2026-09-24
description: "Présentation du projet."
---

Chez SparksLyse, on aime comprendre et maîtriser ce qu'on utilise. Alors plutôt que de se contenter d'appeler une API tierce, on a décidé de se lancer dans un projet ambitieux : construire notre propre modèle de langage, **entièrement from scratch**, hébergé chez vous.

## Pourquoi partir de zéro ?

La plupart des projets IA aujourd'hui se contentent d'appeler GPT, Claude ou un autre modèle via une API. C'est efficace, mais ça veut dire dépendre d'un service externe, de ses tarifs, de ses limites, et de ses choix.

On a préféré une autre voie : entraîner nous-mêmes un modèle, en partant d'une page blanche. Pas de modèle pré-existant qu'on affine, pas de boîte noire : l'architecture, l'entraînement, les données, tout est fait **maison**.

## Le pari : petit, mais spécialisé

On n'a pas les moyens de rivaliser avec les géants du secteur sur un modèle généraliste de plusieurs centaines de milliards de paramètres. Notre modèle de base compte **336 millions de paramètres** volontairement compact, pensé pour tourner sur votre propre matériel plutôt que sur des fermes de serveurs.

Mais un petit modèle généraliste a ses limites. Notre solution : plutôt qu'un seul modèle qui essaie de tout faire moyennement bien, on construit un **système de modèles spécialistes**. Chacun sera entraîné pour exceller sur une tâche précise correction de texte, classification, génération de commandes structurées, etc. Un modèle central, notre chatbot, saura reconnaître quand une demande sort de son champ de compétence et ira automatiquement chercher le bon spécialiste pour y répondre. Un peu comme une équipe où chacun a son domaine d'expertise.

## Où on en est

Le modèle traverse actuellement sa phase de **pré-entraînement** : il apprend les bases de la langue française en lisant un très large volume de texte environ **19.2 Go** de données (pages web, Wikipédia). C'est l'étape la plus longue et la plus lourde en calcul — celle qui pose les fondations de tout le reste.

Une fois cette base solide posée, viendront :

- l'apprentissage de la conversation (pour qu'il sache discuter naturellement),
- la construction des premiers modèles spécialistes,
- puis l'intégration du système complet qui orchestre le tout.

## La suite

On documentera chaque grande étape ici, avec des points d'avancement réguliers. L'objectif : vous montrer concrètement ce que ça prend pour construire une IA de A à Z, et partager les coulisses d'un projet qu'on mène avec passion.

À très vite pour la suite.
