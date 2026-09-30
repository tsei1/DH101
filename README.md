# DH 101: Digital Humanities Portfolio

**Student:** Isabel Tse  
**Term:** Spring 2026  
**Course:** Introduction to Digital Humanities  
**Website:** [index.html](index.html)

---

## Portfolio Overview

This repository hosts the academic and studio portfolio for **DH 101**. The portfolio is built with a minimalist aesthetic and neutral color tones, featuring full dark mode support, client-side markdown parsing, and zero external build dependencies.

### Site Architecture & Tabs

1. **Overview (`#overview`)**: Introduction to the portfolio, research objectives, and quick links across course sections.
2. **Makes (`#makes`)**: 12 weekly digital humanities studio experiments, reverse-engineering projects, distant reading scripts, and critical artifacts. Includes search and category filtering.
3. **Pages (`#pages`)**: Core documentation and institutional reflections:
   - [About Me](pages/about.md)
   - [Accessibility Statement](pages/accessibility.md)
   - [How I Use AI](pages/how-i-use-ai.md)
   - [Sustainability & Ethics](pages/sustainability.md)
   - [Markdown Guide](pages/markdown-guide.md)
4. **Reflections (`#reflections`)**: 13 weekly philosophical responses to foundational inquiries on machine intelligence, authorship, labor, and ethics.
5. **CV (`#cv`)**: Dedicated academic and professional Curriculum Vitae for Isabel Tse, including coursework, research interests, technical tools, and a printable/exportable format.
6. **How I Use AI (`#how-i-use-ai`)**: Four core principles of critical AI engagement, coupled with an interactive, auditable AI usage log and log entry generator.

---

## Features & Design System

- **Timeless Beige with Rich Scholarly Maroon:** Natural warm ecru linen (`#F7F3EB`), soft sand (`#EBE4D5`), warm ivory pressed-paper cards (`#FCFAF6`), delicate hairline borders (`#E2DAC9`), and deep espresso ink (`#231E19`), complemented by deep scholarly maroon (`#6E1A29` oxblood/bordeaux) across active navigation tabs, week pills, buttons, card borders, and pull-quote accents. In dark mode: smoked dark walnut (`#141110`), warm dark roast (`#1C1816`), antique linen bone (`#EDE5D8`), and luminous garnet maroon (`#D0697D`).
- **Legible Cursive & Classical Typography:** Headings set in **Cormorant Garamond** (inspired by 16th-century French Claude Garamond punchcuts), accented with **Pinyon Script** and **Alex Brush** (exceptionally legible, graceful archival cursive scripts for category flourishes, section eyebrows, and signatures), balanced by **Plus Jakarta Sans** and **JetBrains Mono**.
- **Dark Mode Toggle:** Seamless light/dark switching with persistent state saved to `localStorage` and automatic detection of OS preference (`prefers-color-scheme`).
- **Zero-Dependency Architecture:** Runs directly in any modern browser by double-clicking `index.html` or deploying automatically to GitHub Pages.
- **Accessible & Responsive:** Meets WCAG 2.1 AA standards for color contrast, semantic HTML, keyboard focus rings, and mobile readability.
- **Printable CV:** Dedicated print stylesheet for producing clean physical or PDF copies without navigation elements.

---

## Local Preview & Development

To view the website locally:
1. Double-click [index.html](index.html) in your file explorer to open it in Chrome, Safari, or Firefox, OR
2. If using VS Code, use the **Live Server** extension or open with any local static HTTP server.

All markdown files in `/makes`, `/pages`, `/reflections`, and `/ai-log` are kept in sync with the web presentation.