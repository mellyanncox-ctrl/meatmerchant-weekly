# Meat Merchant Casuarina — Weekly Marketing Plans

A GitHub Pages site that hosts the weekly email marketing plans for Meat Merchant Casuarina. Matt and Harry get a single URL they can bookmark; every week the latest plan goes up alongside an archive of past weeks.

**Live site:** `https://mellyanncox-ctrl.github.io/meatmerchant-weekly/`

---

## Repo structure

```
meatmerchant-weekly/
├── index.html              ← Homepage. Lists all weeks, points to current.
├── README.md               ← This file.
├── assets/
│   └── site.css            ← Shared styling for the entire site.
├── _template/
│   └── index.html          ← Template you copy each week.
└── weeks/
    └── 2026-05-04/         ← One folder per week (Monday's date).
        ├── index.html      ← The week's planning page.
        ├── email-1.html    ← Drop the actual email HTML here.
        ├── email-2.html
        ├── creative-1a.jpg ← Drop the four creatives here.
        ├── creative-1b.jpg
        ├── creative-2a.jpg
        └── creative-2b.jpg
```

---

## First-time setup

```bash
# Create the repo on GitHub (mellyanncox-ctrl/meatmerchant-weekly)
# Then locally:

cd ~/APPS  # or wherever you keep client repos
git clone https://github.com/mellyanncox-ctrl/meatmerchant-weekly.git
cd meatmerchant-weekly
# (drop these files in)
git add .
git commit -m "Initial site"
git push origin main

# In GitHub repo settings:
# Settings → Pages → Source: "Deploy from a branch"
# Branch: main / root → Save
# Wait ~1 min, then visit:
# https://mellyanncox-ctrl.github.io/meatmerchant-weekly/
```

---

## Weekly publish workflow

### 1. Create the new week's folder

The folder is named after the **Monday of the week being planned**, in `YYYY-MM-DD` format.

```bash
cd meatmerchant-weekly
cp -r _template weeks/2026-05-11   # change to next Monday's date
```

### 2. Open the new `index.html` and edit it

Search the file for `EDIT:` comments. Replace placeholder text below each one. Specifically, you'll update:

- The week-commencing date in the header
- All five overview rows (Section 01)
- Email 1 and Email 2 metadata (subject, preview, segment, etc.)
- The website checklist notes
- The four creative direction blocks

### 3. Drop in the actual files

Save the email HTML and creative images directly into the new week's folder, with these exact filenames:

- `email-1.html`
- `email-2.html`
- `creative-1a.jpg`
- `creative-1b.jpg`
- `creative-2a.jpg`
- `creative-2b.jpg`

PNG works too — just change the `<img src="creative-1a.jpg">` to `.png` in the index.html.

The iframes and image tags already point to these filenames, so as soon as the files exist, they render.

### 4. Update the sidebar and homepage

Two places need to know about the new week:

**a) The homepage `/index.html`:**
- Add a new `<li>` at the top of the `.week-list` with `class="current"`
- Remove `class="current"` from last week's `<li>`
- Add a new `<a class="week-card current">` at the top of the `.week-grid`
- Remove `class="current"` from last week's card
- Update the hero CTA `href` to point at the new week

**b) The new week's `weeks/YYYY-MM-DD/index.html` sidebar:**
- Make sure the `.week-list` shows every week, with `class="current"` on this one

You can also do a quick find/replace across all weeks to add the new week to every sidebar:

```bash
# Optional: keep all sidebars in sync. Useful as the archive grows.
# (Or just leave old weeks' sidebars alone and only update the homepage.)
```

### 5. Commit and push

```bash
git add .
git commit -m "Week of 2026-05-11"
git push origin main
```

GitHub Pages rebuilds in ~30 seconds. Refresh the URL and the new week is live.

---

## How the approval buttons work

Every section has its own **Approve** and **Request changes** buttons. They use `mailto:` links — when Matt or Harry clicks one, their default email client opens with:

- **Subject** pre-filled (e.g. `APPROVED · Email 1 · Week of DD Month`)
- **Body** pre-filled with a template they fill in
- **To** set to `mel@theserviceedit.com`

Before going live, **search the template and every week's index.html for `mel@theserviceedit.com`** and confirm that's the address you want feedback sent to. (If you change it later, search/replace across the whole repo.)

The "Approve full week" button at the top of each plan covers everything in one click. The per-section buttons are there for the times when one email is fine but the other needs work.

### Why mailto: instead of a real form?

- **Zero infrastructure** — no backend, no Formspree account, no Netlify Forms, nothing to break.
- **Works offline** — the page doesn't need JavaScript to function.
- **Goes straight to your inbox** — same place all your other client comms live.
- **Audit trail** — every approval is an email, timestamped, in your sent folder, on both sides.

If you ever want a real form (with database storage, dashboards, etc.), Formspree drops in with a 5-line change.

---

## Customisation notes

### Email address
The `mailto:` links in `_template/index.html` and every `weeks/YYYY-MM-DD/index.html` point to `mel@theserviceedit.com`. Change in one place, then search/replace everywhere if needed.

### Brand colours
All in `assets/site.css` `:root` — `--red`, `--dark`, `--cream`, etc. Change once, propagates everywhere.

### Adding a new field to every plan
Edit `_template/index.html` to add the field. Future weeks pick it up automatically when you copy the template. Past weeks keep their original structure (which is correct — the archive should reflect what was actually shipped).

### Removing the iframe sandbox
The email iframes use `sandbox="allow-same-origin allow-popups"` so any tracking pixels, scripts, or unusual HTML in the email can't break out and affect the planner page. If an email needs more permissions to render correctly, adjust per iframe — don't loosen it globally.

---

## Mobile

Everything responds. The sidebar collapses to a top bar under 900px. The grid becomes a single column. The iframes shrink to a sensible height. Matt or Harry can review and approve from a phone.

---

## What this is NOT

- It's not a content management system — every change is a git commit.
- It's not a real-time collaboration tool — only one person edits at a time.
- It's not a database — old weeks live as static HTML forever, which is exactly what you want.

If those constraints ever start to bite, the upgrade path is Eleventy or Astro — both can read the same folder structure and add a CMS layer without rewriting anything.

---

**Built by The Service Edit · Email · Web · Creative**
