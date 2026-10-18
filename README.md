# Ashen Viduranga — Pixel UI Art Portfolio

Static DevOps intern portfolio. Single-page Vite + React + TypeScript app; `npm run build` emits a `dist/` folder you can host on **GitHub Pages**, **Vercel**, or **S3** with no server. The generated asset URLs are relative, so the site works on both the GitHub project path and a custom domain.

## Local

```bash
npm install
npm run dev
```

Open the printed localhost URL. Production build:

```bash
npm run build
npm run preview
```

## Deploy on Vercel

1. Push this repo to GitHub.
2. Import the project in [Vercel](https://vercel.com). Framework preset: **Vite**. Output directory: `dist`.
3. Deploy. `vercel.json` already rewrites unknown paths to `index.html`.

## Deploy on GitHub Pages

The repository workflow deploys the `gh-pages` branch to GitHub Pages. Enable GitHub Pages in the repository settings with **GitHub Actions** as the source, then push to `gh-pages` or run the workflow manually.

Or from the CLI:

```bash
npx vercel
```

## Deploy on S3

1. `npm run build`
2. Create a public website bucket (or use CloudFront in front of a private bucket).
3. Upload the contents of `dist/`:

```bash
aws s3 sync dist/ s3://YOUR_BUCKET_NAME --delete
```

4. Enable **Static website hosting** on the bucket. Index document: `index.html`.
5. No rewrite rules are required — the site is a single `index.html` with hash/anchor navigation.

## Content

Edit copy in [`src/data/content.ts`](src/data/content.ts). Replace [`public/Ashen_Viduranga_DevOps_Intern.pdf`](public/Ashen_Viduranga_DevOps_Intern.pdf) to update the downloadable CV.
