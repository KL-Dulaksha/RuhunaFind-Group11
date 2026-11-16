# RuhunaFind — Campus Lost & Found Web Platform

**University of Ruhuna · Department of Computer Science**  
*5-Member Collaborative Web Development Project*

RuhunaFind is a campus-wide, peer-to-peer lost-and-found web platform built specifically for students, academic staff, and campus visitors at the University of Ruhuna. It enables community members to search items found across campus, post lost belongings, verify ownership with privacy-first precautions, and coordinate safe property returns.

---

## 👥 5-Member Contributor & Responsibility Matrix

To adhere to industry-standard Git collaboration, feature-branch workflows, and zero-conflict repository modularization, each page and its corresponding stylesheet is strictly isolated and owned by a dedicated team member:

| Member # | Contributor Name | Role & Responsibility | Assigned Files | Feature Branch | Tracking Issue |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **01** | **K.L. Dulaksha Harith Bandara** *(Team Leader)* | Project Architecture, Global Design System & Home Showcase | `index.html`<br>`css/base.css`<br>`css/home.css` | `main` | **Issue #1** |
| **02** | **S.D. Liyanapathirana** | Search, Real-Time Filters & Categorized Board View | `browse.html`<br>`css/browse.css` | `feature/browse-page` | **Issue #2** |
| **03** | **M.T.N. Wijerathna** | Multi-Step Reporting Form, Validation & Confirmation | `report.html`<br>`css/report.css` | `feature/report-page` | **Issue #3** |
| **04** | **H.A.S. Gunathilaka** | Detailed Item Inspector, Claim Verification & Proof View | `details.html`<br>`css/details.css` | `feature/details-page` | **Issue #4** |
| **05** | **M.M.N.V. Moradeniya** | Contact Channels, 4-Step Process Guide & Campus Safety FAQ | `contact.html`<br>`css/contact.css` | `feature/contact-page` | **Issue #5** |

---

## 📁 Modular Repository Structure

```text
RuhunaFind/
├── index.html              # Member 1 (Lead): Landing page, live counters, hero showcase
├── browse.html             # Member 2: Interactive search & category filter board
├── report.html             # Member 3: Multi-step report form with photo upload
├── details.html            # Member 4: Standalone item detail view & claim verification
├── contact.html            # Member 5: Contact form, 4-step walkthrough, campus safety & FAQ
├── about.html              # Supplementary: Full campus walkthrough
├── safety.html             # Supplementary: Campus safety regulations
├── 404.html                # Error page: Clean fallback
├── css/
│   ├── base.css            # Shared tokens, reset, typography, navbar, footer (Leader ONLY)
│   ├── home.css            # Member 1: Hero, live stats counters, marquee, CTA
│   ├── browse.css          # Member 2: Filter bar, segmented buttons, results grid, empty state
│   ├── report.css          # Member 3: 2-column report layout, radio choices, upload dropzone
│   ├── details.css         # Member 4: Item showcase, metadata facts table, claim card
│   └── contact.css         # Member 5: Contact grid, 4-step rows, safety rules, FAQ accordion
├── js/
│   └── script.js           # Shared interactive controller, local storage & DOM handlers
├── assets/                 # Centralized project assets & item imagery
│   ├── items/              # Sample item photographs (earbuds, wallet, tote-bag, headphones)
│   ├── logo.png            # Main RuhunaFind brand logo
│   ├── logo-white.png      # Footer inverted logo
│   ├── favicon.png         # Browser favicon
│   └── apple-touch-icon.png
├── fonts/                  # Self-hosted web fonts (Archivo & IBM Plex Mono)
├── TEAMMATE_COMMIT_PACKETS.md # Copy-paste progressive commit guide for 4 teammates
└── README.md               # Repository documentation and teamwork breakdown
```

---

## 🚀 Running the Project Locally

No build step, Node.js installation, or bundler is required. The project is built using semantic HTML5, modern CSS3 variables, and vanilla JavaScript.

### Option A: VS Code Live Server (Recommended)
1. Open the project root folder in **Visual Studio Code**.
2. Right-click on `index.html` and select **"Open with Live Server"**.
3. The site will launch automatically at `http://127.0.0.1:5500/index.html`.

### Option B: Python HTTP Server
Open your terminal in this directory and execute:
```bash
# Python 3
python -m http.server 8000
```
Then visit `http://localhost:8000` in any web browser.

### Option C: Direct File Access
Simply double-click `index.html` to open it in Google Chrome, Microsoft Edge, or Mozilla Firefox.

---

## 🌿 GitHub Collaboration & Feature Branch Workflow

This project strictly follows the GitHub Flow collaboration standard to prove incremental development and teamwork to evaluators:

1. **Strict File Isolation:** Team members only edit their assigned page and page-specific stylesheet. Under no circumstances should members edit another teammate's stylesheet or `css/base.css`.
2. **Branch Naming Standard:** All work happens on isolated branches:
   - `feature/browse-page` (Member 2)
   - `feature/report-page` (Member 3)
   - `feature/details-page` (Member 4)
   - `feature/contact-page` (Member 5)
3. **4-Stage Progressive Commit History:** Each member commits their feature page across 4 sequential stages:
   - **Commit 1:** Skeleton boilerplate, shared navigation, header, and footer.
   - **Commit 2:** Primary content structure and core layout styling.
   - **Commit 3:** Secondary sections, interactive states, badges, and forms.
   - **Commit 4:** Responsive breakpoints (tablet/mobile) and polish.
4. **Pull Requests & Code Review:**
   - Members push their feature branch to GitHub and open a Pull Request targeting `main`.
   - PR descriptions link the issue with `Closes #<issue_number>`.
   - The Team Leader reviews and merges the PR with zero merge conflicts.

> Refer to [TEAMMATE_COMMIT_PACKETS.md](TEAMMATE_COMMIT_PACKETS.md) for step-by-step copy-paste commit guides prepared for Members 2, 3, 4, and 5.
