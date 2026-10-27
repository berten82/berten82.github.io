# Bilge Erten's academic website

A local draft for https://berten82.github.io, with six navigation tabs:
CV, Research, Awards and Grants, Teaching, Policy Writing & Blogs, and NIH Project.
Research jumps to Working papers.
Nothing is automatically published
by building or opening these files.

## Preview

Open index.html in Chrome or Edge. All pages, navigation, portrait, and local PDF
links work directly from disk. No installation or server is needed to view it.

- index.html: biography, Featured research, working papers, publications, and work in progress.
- cv.html: downloadable and embedded CV.
- awards-grants.html: research grants, awards, and fellowships from the CV.
- teaching.html: teaching history.
- policy-writing.html: policy and blog links collected from the old website.
- nih-project.html: original NIH project summary and three related papers; edit data/nih-project.json to update it.
- style.css: shared styling and responsive layout.
- files/: imported PDFs and replication ZIP.
- images/: portrait and favicon.

## Edit and rebuild

Generated HTML is committed to the repository so GitHub Pages needs no build step.
To update structured content, edit data/research.json, data/awards.json, or
data/work-in-progress.json. The Scholar link is in data/profile.json.
Coauthor websites and name aliases are maintained in data/coauthors.json and
applied consistently on Research, work in progress, and the NIH project page.
Names without a confirmed website currently remain plain text: Catarina Meneses,
Oliver Schwank, and Shawn Ratcliff. Personal sites are preferred; official
institutional profiles are used where an individual site was not identified.
Abstracts and their sources are in data/abstracts.json;
each paper has an expandable Abstract + disclosure. The biography, teaching history, featured choices,
and page templates are in scripts/build-site.mjs.

With Node.js installed, rebuild from this directory:

    node scripts/build-site.mjs
    node scripts/verify-site.mjs

These scripts use only Node's built-in modules; npm install is unnecessary.
The site itself does not run JavaScript. Browser-native PDF display varies by
browser; the direct CV download remains available.

Migration archives and one-time import tools are retained locally and excluded
from Git by .gitignore. The site and its build script do not need those archives.

## Publication, when ready

The remote repository already exists at https://github.com/berten82/berten82.github.io.
Review the local draft before committing and pushing. When ready, enable GitHub
Pages in Settings > Pages using Deploy from a branch, main, and / (root).
The .nojekyll file tells GitHub Pages to serve these static files directly.

Files required to display the website:

- index.html, cv.html, awards-grants.html, teaching.html, policy-writing.html, nih-project.html
- style.css
- images/ and files/ (portrait, favicon, CV, papers, appendices, replication ZIP)
- .nojekyll

Also keep data/, scripts/build-site.mjs, scripts/verify-site.mjs, README.md, and
.gitignore in GitHub so future edits can be rebuilt and checked. They are source
and maintenance files, not migration archives.

From this directory, stage only this website and its maintained sources:

    git add .gitignore .nojekyll README.md index.html cv.html awards-grants.html teaching.html policy-writing.html nih-project.html style.css images files data scripts/build-site.mjs scripts/verify-site.mjs
    git diff --cached --stat
    git commit -m "Build academic website"
    git push origin main

The explicit file list excludes migration/. Keep Pages disabled until ready to
publish; pushing commits and enabling public hosting are separate steps.

GitHub instructions: https://docs.github.com/en/pages/quickstart
