# RuhunaFind — Campus Lost & Found Web Platform

**University of Ruhuna · Department of Computer Science**  
*Group 11 — Collaborative Web Development Project*

RuhunaFind is a lightweight, mobile-responsive lost-and-found web platform engineered specifically for students, academic staff, and visitors across the University of Ruhuna campuses. The platform enables community members to search verified items found on university grounds, submit lost property reports, verify ownership through privacy-first precautions, and coordinate safe property handovers.

---

## 👥 5-Member Engineering & Ownership Matrix

To maintain clean modular architecture and adhere strictly to industry-standard Git collaboration, each view and its corresponding stylesheet was developed and maintained by a designated team member:

| Member # | Contributor Name | Role & Core Responsibilities | Assigned Files | Feature Branch | Tracking Issue |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **01** | **K.L. Dulaksha Harith Bandara** *(Team Leader)* | Project Architecture, Shared Design Tokens, & Home Showcase | `index.html`<br>`css/base.css`<br>`css/home.css` | `main` | **Issue #1** |
| **02** | **S.D. Liyanapathirana** | Interactive Search, Real-Time Filters, & Categorized Board View | `browse.html`<br>`css/browse.css` | `feature/browse-page` | **Issue #2** |
| **03** | **M.T.N. Wijerathna** | Multi-Step Reporting Form, Validation, & Confirmation View | `report.html`<br>`css/report.css` | `feature/report-page` | **Issue #3** |
| **04** | **H.A.S. Gunathilaka** | Detailed Item Inspector, Claim Verification, & Proof View | `details.html`<br>`css/details.css` | `feature/details-page` | **Issue #4** |
| **05** | **M.M.N.V. Moradeniya** | Contact Channels, 4-Step Process Guide, & Campus Safety FAQ | `contact.html`<br>`css/contact.css` | `feature/contact-page` | **Issue #5** |

---

## 📁 Repository Architecture

```text
RuhunaFind/
├── index.html              # Member 1 (Lead): Landing page, live counters, hero showcase
├── browse.html             # Member 2: Interactive search & category filter board
├── report.html             # Member 3: Multi-step report form with photo upload
├── details.html            # Member 4: Standalone item detail view & claim verification
├── contact.html            # Member 5: Contact form, 4-step walkthrough, campus safety & FAQ
├── 404.html                # Custom error fallback page
├── css/
│   ├── base.css            # Shared tokens, reset, typography, navbar & footer (Leader)
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
└── README.md               # Repository documentation and teamwork breakdown
```

---

## 🚀 Running the Application Locally

The project is engineered using modern, native web standards with zero dependencies, build steps, or bundlers required:

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/KL-Dulaksha/RuhunaFind-Group11.git
   cd RuhunaFind-Group11
   ```
2. Open `index.html` in any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).
3. Alternatively, launch with a local static server (e.g., VS Code Live Server or Python):
   ```bash
   python -m http.server 8000
   ```
   Navigate to `http://localhost:8000`.

---

## 🌿 Collaborative Git & GitHub Workflow

This project was built following professional GitHub Flow practices to demonstrate authentic teamwork and incremental development:

1. **Strict Modular Isolation:** Every contributor developed their assigned page and page-specific stylesheet independently, preventing cross-file merge bottlenecks.
2. **Feature Branch Strategy:** All new features were developed on dedicated feature branches (`feature/<page-name>`) and merged via Pull Requests into `main`.
3. **Incremental Development Cycles:** Each feature page was developed systematically across 4 distinct phases:
   - **Phase 1 (Skeleton & Navigation):** Semantic page boilerplate, shared header, navigation landmarks, and initial hero presentation.
   - **Phase 2 (Core Content Architecture):** Primary layout, search controls, form fieldsets, or data inspection cards.
   - **Phase 3 (Interactivity & State Management):** Dynamic filtering, custom radio cards, modal views, upload preview zones, and validation states.
   - **Phase 4 (Responsive Polish):** Fine-tuning layout flow across tablet and mobile viewports.
4. **Code Reviews & Merge Conflicts:** Pull Requests were peer-reviewed and merged into `main`. Concurrent branch modifications on shared landmarks were systematically resolved using Git merge tools, ensuring full data integrity.

---

## 📞 Project Support & Campus Contact

- **Item Claims & Verification:** H.A.S. Gunathilaka (`details-lead@ruhuna.ac.lk`)
- **Campus Inquiries & Helpdesk:** M.M.N.V. Moradeniya (`contact-lead@ruhuna.ac.lk`)
- **Project Lead & Inquiries:** K.L. Dulaksha Harith Bandara (`lead@ruhuna.ac.lk`)
