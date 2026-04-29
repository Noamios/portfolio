# Noam's Portfolio

A collection of four small web projects, each in its own folder. All four are deployed live to GitHub Pages.

**Live index:** https://noamios.github.io/portfolio/

## Projects

| Project | Description | Live demo | Source |
| --- | --- | --- | --- |
| Personal Portfolio Site | Single-page site with intro, projects, and contact sections | [open](https://noamios.github.io/portfolio/personal-portfolio-site/) | [`personal-portfolio-site/`](./personal-portfolio-site) |
| Todo List App | Vanilla-JS task manager with filters and localStorage persistence | [open](https://noamios.github.io/portfolio/todo-list-app/) | [`todo-list-app/`](./todo-list-app) |
| Movie Finder App | Search movies via the OMDb API with posters and details | [open](https://noamios.github.io/portfolio/movie-finder-app/) | [`movie-finder-app/`](./movie-finder-app) |
| Recipe Finder App | React app for recipe search and favorites via TheMealDB | [open](https://noamios.github.io/portfolio/recipe-finder-app/) | [`recipe-finder-app/`](./recipe-finder-app) |

Each project folder has its own README with setup instructions.

## Run Locally

```bash
git clone https://github.com/Noamios/portfolio.git
cd portfolio
```

The three vanilla projects open straight from disk:

```bash
open personal-portfolio-site/index.html
open todo-list-app/index.html
open movie-finder-app/index.html      # prompts for an OMDb API key on first search
```

The React project needs a dev server:

```bash
cd recipe-finder-app
npm install
npm start
```

## Deployment

Pushes to `main` trigger [`.github/workflows/deploy-pages.yml`](./.github/workflows/deploy-pages.yml), which builds the React app, copies the three static projects as-is, generates a small index page, and publishes everything to GitHub Pages.
