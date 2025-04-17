# GitHub Stats Dashboard

![CI/CD](https://github.com/jeromealbrecht/ci-cd/actions/workflows/ci-cd.yml/badge.svg)

[Voir la démo en ligne](https://ci-cd-tau-one.vercel.app/)

![Aperçu de l'application](/public/preview.png)

GitHub Stats Dashboard est une application web développée avec Next.js et TypeScript permettant de visualiser les statistiques publiques d'un profil GitHub, ainsi que ses dépôts les plus actifs.

Ce projet met en œuvre une architecture moderne avec des tests automatisés, un pipeline CI/CD via GitHub Actions, une configuration ESLint stricte et un usage optimisé de `pnpm` pour la gestion des dépendances.

## Fonctionnalités

- Consultation du profil GitHub (nom, bio, date d'inscription, avatar)
- Statistiques principales : nombre de dépôts, followers, following
- Liste des dépôts publics les plus récents
- Intégration avec l'API GitHub (v3)
- Pipeline CI/CD : lint, test, build automatisé à chaque push
- Structure évolutive basée sur App Router (Next.js)

## Stack technique

- Next.js 14
- TypeScript
- Tailwind CSS
- ESLint (flat config)
- GitHub Actions (CI/CD)
- pnpm

## Installation

```bash
pnpm install
pnpm dev
```

## Lint et tests

```bash
pnpm lint        # Analyse du code
pnpm lint:fix    # Correction automatique
pnpm test        # Tests unitaires
```

## Déploiement

Ce projet peut être déployé sur Vercel, Netlify ou toute plateforme supportant Next.js.
