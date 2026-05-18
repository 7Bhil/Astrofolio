# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.ts >> Astrofolio E2E Tests >> should show validation errors on contact form
- Location: tests/e2e.spec.ts:37:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('#name-error')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('#name-error')

```

```yaml
- banner:
  - link "Bhil$":
    - /url: "#home"
  - navigation:
    - list:
      - listitem:
        - link "Accueil":
          - /url: "#home"
      - listitem:
        - link "À propos":
          - /url: "#about"
      - listitem:
        - link "Projets":
          - /url: "#projects"
      - listitem:
        - link "Compétences":
          - /url: "#skills"
  - link "Toggle language":
    - /url: /en/
    - img
    - text: FR
  - button "Toggle theme":
    - img
  - link "Me contacter":
    - /url: "#contact"
  - link "FR":
    - /url: /en/
    - img
    - text: FR
  - button "Toggle theme":
    - img
  - list:
    - listitem:
      - link "Accueil":
        - /url: "#home"
    - listitem:
      - link "À propos":
        - /url: "#about"
    - listitem:
      - link "Projets":
        - /url: "#projects"
    - listitem:
      - link "Compétences":
        - /url: "#skills"
    - listitem:
      - link "Me contacter":
        - /url: "#contact"
- main:
  - heading "Salut, je suis Bhilal CHITOU Développeur Full-Stack & Mobile." [level=1]
  - paragraph: Basé à Porto-Novo, je conçois des applications web et mobiles modernes, robustes et évolutives avec React, Node.js, Laravel, Django et React Native.
  - link "Voir mes travaux":
    - /url: "#projects"
    - text: Voir mes travaux
    - img
  - link "Télécharger mon CV":
    - /url: /CV.pdf
    - text: Télécharger mon CV
    - img
  - link:
    - /url: https://github.com/7Bhil/
    - img
  - link:
    - /url: https://gitlab.com/7Bhil
    - img
  - link:
    - /url: https://www.linkedin.com/in/bhilal-chitou/
    - img
  - link:
    - /url: https://web.facebook.com/7Bhil
    - img
  - link:
    - /url: mailto:7bhilal.chitou7@gmail.com
    - img
  - img "Bhilal CHITOU"
  - heading "À propos" [level=2]
  - paragraph: "Basé à Porto-Novo (actuellement à Parakou), je suis curieux de nature et soucieux du détail. J'accorde autant d'importance à l'utilisabilité et à la performance qu'à la qualité du code. Mon objectif est simple : créer des produits numériques à la fois efficaces et significatifs."
  - paragraph: Expert dans l'écosystème React (React.js & React Native) et les technologies backend comme Node.js et Django, je livre des solutions complètes et évolutives de bout en bout.
  - text: "01"
  - heading "Expérience Professionnelle" [level=3]
  - text: 2025 — 2026
  - heading "Étudiant en Licence & Développeur" [level=4]
  - text: Formation & Freelance (Porto-Novo/Parakou)
  - paragraph: Préparation d'une Licence en Informatique tout en concevant des applications modernes avec React et Django.
  - text: 2023 — 2025
  - heading "Développeur Full-Stack (Freelance)" [level=4]
  - text: Clients divers
  - paragraph: Développement de bout en bout d'applications web et mobiles utilisant React, Django et React Native.
  - text: "02"
  - heading "Éducation" [level=3]
  - text: 2025 — 2026
  - heading "Licence en Informatique" [level=4]
  - text: Institut Universitaire de Technologie de Parakou, Benin
  - heading "Mes Compétences" [level=2]
  - paragraph: Les outils et technologies que j'utilise pour donner vie à vos idées.
  - img
  - heading "Développement Frontend" [level=3]
  - img "React"
  - text: React
  - img "Next.js"
  - text: Next.js
  - img "Electron"
  - text: Electron
  - img "JavaScript"
  - text: JavaScript
  - img "Tailwind CSS"
  - text: Tailwind CSS
  - img "HTML5"
  - text: HTML5
  - img "CSS3"
  - text: CSS3
  - img
  - heading "Backend & Base de données" [level=3]
  - img "Node.js"
  - text: Node.js
  - img "Express"
  - text: Express
  - img "Django"
  - text: Django
  - img "Laravel"
  - text: Laravel
  - img "PostgreSQL"
  - text: PostgreSQL
  - img "MongoDB"
  - text: MongoDB
  - img "Supabase"
  - text: Supabase
  - img "PHP"
  - text: PHP
  - img
  - heading "Développement Mobile" [level=3]
  - img "React Native"
  - text: React Native
  - img
  - heading "Cybersécurité & Outils" [level=3]
  - img "Kali Linux"
  - text: Kali Linux
  - img "Git"
  - text: Git
  - img "Docker"
  - text: Docker
  - img "Linux"
  - text: Linux
  - heading "Projets à la une" [level=2]
  - paragraph: Une sélection de mes meilleurs travaux sur plateformes web et mobiles.
  - img "Bhilal Language v1.2.0"
  - link "GitHub Repository":
    - /url: https://github.com/7Bhil/Language-Bhilal
    - img
  - link "Live Demo":
    - /url: https://bhil-documentations.netlify.app/
    - img
  - heading "Bhilal Language v1.2.0" [level=3]
  - paragraph: Un langage de programmation moderne avec outils de cybersécurité intégrés (Node.js + Go). Syntaxe épurée, POO complète, mode interactif (REPL), et fonctions de sécurité avancées comme le scan de ports et le bruteforce.
  - text: Node.js Go Cybersecurity Custom Language
  - img "Bhil Cours"
  - link "GitHub Repository":
    - /url: https://github.com/7Bhil/Cours-front
    - img
  - link "Live Demo":
    - /url: https://bhilcours.netlify.app/
    - img
  - heading "Bhil Cours" [level=3]
  - paragraph: Une plateforme d'apprentissage dédiée aux langages de programmation, permettant de réaliser des exercices pratiques en C, C++, JS, PHP, Python et Ruby.
  - text: React Django PostgreSQL
  - img "Bloc Républicain - Arrondissement"
  - link "GitHub Repository":
    - /url: https://github.com/7Bhil/Arrondissement
    - img
  - link "Live Demo":
    - /url: https://chef-d-arrondissement.netlify.app/
    - img
  - heading "Bloc Républicain - Arrondissement" [level=3]
  - paragraph: Un site vitrine développé en React pour le 'Bloc Républicain', un parti politique béninois majeur, destiné à présenter les initiatives et informations de l'arrondissement.
  - text: React UI/UX Political Party
  - img "Plateforme de Challenges"
  - link "GitHub Repository":
    - /url: https://github.com/7Bhil/Challenge-react
    - img
  - link "Live Demo":
    - /url: https://challenge-react-delta.vercel.app/
    - img
  - heading "Plateforme de Challenges" [level=3]
  - paragraph: Une plateforme interactive où les administrateurs proposent des challenges. Les participants soumettent leurs solutions pour être notées par un jury, avec des résultats affichés sur un classement en temps réel.
  - text: MERN Stack State Management Leaderboard
  - img "Interface Restaurant Premium"
  - link "GitHub Repository":
    - /url: https://github.com/7Bhil/Restaurant
    - img
  - link "Live Demo":
    - /url: https://restaurant-nine-tau.vercel.app/
    - img
  - heading "Interface Restaurant Premium" [level=3]
  - paragraph: Un frontend moderne et élégant pour un restaurant, développé avec React. Propose un menu responsive, des animations fluides et met l'accent sur une expérience utilisateur premium.
  - text: React Tailwind CSS Premium UI
  - img "Vitch (Démo)"
  - link "GitHub Repository":
    - /url: https://github.com/7Bhil/wallet-next
    - img
  - link "Live Demo":
    - /url: https://vitch.vercel.app/
    - img
  - heading "Vitch (Démo)" [level=3]
  - paragraph: "Un système qui permet d'acheter des cartes de crédit et de faire des paiements en ligne de manière sécurisée. Note : Il s'agit d'une version de démonstration."
  - text: React Fintech Online Payment
  - heading "Certifications" [level=2]
  - paragraph: Mes certifications techniques et accomplissements.
  - img "HTML & CSS"
  - heading "HTML & CSS" [level=3]
  - img
  - img "JavaScript"
  - heading "JavaScript" [level=3]
  - img
  - img "PHP & MySQL"
  - heading "PHP & MySQL" [level=3]
  - img
  - img "Python"
  - heading "Python" [level=3]
  - img
  - img "C Programming"
  - heading "C Programming" [level=3]
  - img
  - img "Linux"
  - heading "Linux" [level=3]
  - img
  - img "Networking Concepts"
  - heading "Networking Concepts" [level=3]
  - img
  - img "Advanced Networking"
  - heading "Advanced Networking" [level=3]
  - img
  - heading "Contactez-moi" [level=2]
  - paragraph: Vous avez un projet en tête ou souhaitez discuter d'opportunités ? Parlons-en.
  - heading "Informations de Contact" [level=3]
  - paragraph: N'hésitez pas à me contacter pour des collaborations ou simplement pour dire bonjour !
  - img
  - text: 7bhilal.chitou7@gmail.com
  - img
  - text: Remote / Full-time Nom Complet
  - textbox "Nom Complet"
  - text: Adresse E-mail
  - textbox "Adresse E-mail"
  - text: Parlez-moi de votre projet
  - textbox "Parlez-moi de votre projet"
  - text: 0 car.
  - button "Envoyer le message":
    - text: Envoyer le message
    - img
- contentinfo:
  - paragraph: © 2026 Bhilal CHITOU. All rights reserved.
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Astrofolio E2E Tests', () => {
  4  |   test('should load the home page in French', async ({ page }) => {
  5  |     await page.goto('/');
  6  |     await expect(page).toHaveTitle(/7Bhil/);
  7  |     await expect(page.getByRole('heading', { level: 1, name: /Bhilal CHITOU/i })).toBeVisible();
  8  |   });
  9  | 
  10 |   test('should toggle dark/light theme', async ({ page }) => {
  11 |     await page.goto('/');
  12 |     
  13 |     // Check initial theme
  14 |     const html = page.locator('html');
  15 |     await expect(html).toHaveAttribute('data-theme', 'dark');
  16 |     
  17 |     // Click theme toggle (using first() to avoid ambiguity if two buttons exist)
  18 |     await page.getByLabel('Toggle theme').first().click();
  19 |     await expect(html).toHaveAttribute('data-theme', 'light');
  20 |     
  21 |     // Click again to return to dark
  22 |     await page.getByLabel('Toggle theme').first().click();
  23 |     await expect(html).toHaveAttribute('data-theme', 'dark');
  24 |   });
  25 | 
  26 |   test('should switch language to English', async ({ page }) => {
  27 |     await page.goto('/');
  28 |     
  29 |     // Click language toggle
  30 |     await page.getByLabel('Toggle language').first().click();
  31 |     
  32 |     // Should be on /en/
  33 |     await expect(page).toHaveURL(/\/en\//);
  34 |     await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  35 |   });
  36 | 
  37 |   test('should show validation errors on contact form', async ({ page }) => {
  38 |     await page.goto('/#contact');
  39 |     
  40 |     // Wait for the button to be ready
  41 |     const submitBtn = page.locator('button[type="submit"]');
  42 |     await expect(submitBtn).toBeVisible();
  43 |     
  44 |     // Scroll and click
  45 |     await submitBtn.scrollIntoViewIfNeeded();
  46 |     await submitBtn.click();
  47 |     
  48 |     // Check for error messages (wait for them to appear)
> 49 |     await expect(page.locator('#name-error')).toBeVisible({ timeout: 10000 });
     |                                               ^ Error: expect(locator).toBeVisible() failed
  50 |     await expect(page.locator('#email-error')).toBeVisible({ timeout: 10000 });
  51 |     await expect(page.locator('#message-error')).toBeVisible({ timeout: 10000 });
  52 |   });
  53 | });
  54 | 
```