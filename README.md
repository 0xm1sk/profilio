# 0xm1sk / profilio

> Personal technical portfolio and research archive focused on offensive security.

**Live:** [0xm1sk.github.io/profilio](https://0xm1sk.github.io/profilio/)

---

## About

`profilio` is my personal technical portfolio for documenting what I learn, build, and investigate across offensive security.

Content lives in five collections, with a few standalone pages alongside them:

* **Research** — security investigations, experiments, and technical analysis
* **Writeups** — CTFs, labs, and exploitation walkthroughs
* **Projects** — tools and security-related projects
* **Notes** — technical references and learning notes (filterable by tag)
* **Tools** — tools used for analysis, reconnaissance, and exploitation

The `/progress` page tracks the offensive and defensive learning roadmap.

The goal is to document the **process and reasoning**, not just the final result.

---

## Focus

Current areas of study include:

* x86-64 & Linux internals
* Binary exploitation
* Reverse engineering
* Memory corruption
* Web & API security
* Active Directory
* Detection engineering (Sigma, KQL, SIEM query craft)
* Incident response & blue-team methodology
* Security research

---

## Tech Stack

* [Astro](https://astro.build/)
* [Tailwind CSS](https://tailwindcss.com/)
* TypeScript
* GitHub Actions
* GitHub Pages

---

## Development

### Requirements

* Node.js
* npm

### Run locally

```bash
git clone https://github.com/0xm1sk/profilio.git
cd profilio

npm install
npm run dev
```

The development server will be available at the local address shown by Astro.

### Build

```bash
npm run build
```

---

## Structure

```text
src/
├── content/        # Collection schemas + notes, writeups, research, projects, tools
│   └── templates/  # Frontmatter templates for new entries
├── layouts/        # Page layouts
├── pages/          # Routes (including dynamic [...slug] pages)
├── styles/         # Global styles
└── utils/          # Base-aware URL helpers
public/             # Static assets (favicon)
```

---

## Deployment

The site is deployed to **GitHub Pages** through GitHub Actions.

Every push to `main` is built and deployed automatically by the single workflow in `.github/workflows/astro.yml`. Build output (`dist/`) is generated in CI and is intentionally not committed.

---

## License

This repository contains my personal portfolio and research material.

Unless otherwise stated, the content is © 0xm1sk.
