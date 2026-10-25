# berten82's personal website

A small, responsive proof of concept for a personal website, intended for
https://berten82.github.io. The full website will be developed later.

This is an independent starter inspired by the academic website in the neighboring
example repository. It does not include that person's biography, papers, images,
domain, or build system.

## Preview and edit

Open `index.html` in your browser. No installation or build is required.

- `index.html`: page content and links.
- `style.css`: colors, fonts, spacing, and mobile layout.
- `.nojekyll`: tells GitHub Pages to publish the static files directly.

## First publication

1. Sign in to GitHub as **berten82** and create a **public** repository named
   **berten82.github.io**. Leave README, license, and .gitignore initialization off
   if pushing this local repository.
2. In the VS Code terminal, change to this folder:
   `cd C:\github\berten82.github.io`.
3. Configure your Git commit identity if needed:
   `git config user.name "Your Name"` and
   `git config user.email "Your GitHub verified or GitHub-provided noreply email"`.
   Find the noreply address in GitHub Settings > Emails.
4. Run `git add .`, then `git commit -m "Create personal website proof of concept"`,
   then `git push -u origin main`. Complete GitHub's sign-in if prompted.
5. In the GitHub repository, go to **Settings > Pages**. Set Source to
   **Deploy from a branch**, select **main** and **/ (root)**, and click **Save**.
6. Wait for the Pages deployment to finish, then visit https://berten82.github.io.

If using GitHub's browser upload instead, upload `index.html`, `style.css`, and
`.nojekyll` to the repository root, commit them to `main`, and follow step 5.

GitHub's instructions: https://docs.github.com/en/pages/quickstart

## Later updates

Edit the files, preview locally, commit, and push to `main`. GitHub Pages will
publish the changes. Keep this proof of concept simple until the full site's
content and structure are ready.
