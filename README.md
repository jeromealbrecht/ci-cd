# GitHub Stats Dashboard

![CI/CD](https://github.com/jeromealbrecht/ci-cd/actions/workflows/ci-cd.yml/badge.svg)

[View Live Demo](https://ci-cd-tau-one.vercel.app/)

![App Preview](/public/preview.png)

**GitHub Stats Dashboard** is a web application built with **Next.js** and **TypeScript**, designed to display public statistics from any GitHub profile along with their most active repositories.

This project implements a **modern architecture** with automated testing, a **CI/CD pipeline** using GitHub Actions, strict **ESLint configuration**, and efficient dependency management through `pnpm`.

---

## Features

- View GitHub profile (name, bio, join date, avatar)
- Display key stats: repositories, followers, following
- List of most recent public repositories
- Integration with the **GitHub REST API (v3)**
- **Automated CI/CD pipeline** (lint, test, build on each push)
- Scalable structure using **App Router (Next.js 14)**

---

## Tech Stack

- **Next.js 14**
- **TypeScript**
- **Tailwind CSS**
- **ESLint** (flat config)
- **GitHub Actions** (CI/CD)
- **pnpm**

---

## Installation

```bash
pnpm install
pnpm dev
