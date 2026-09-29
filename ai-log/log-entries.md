# AI Use Log: Entries & Fieldwork

This log documents all interactions with generative AI systems throughout the course, following the required format.

---

### Entry 01: Reverse Engineering & Artifact Concept
- **Date:** 2026-09-12
- **Tool Used:** Claude 3.5 Sonnet
- **Task / Prompt:** "I am preparing a reverse-engineering digital humanities project for Week 1. Can you suggest three ways to deconstruct an algorithmic feed or social media interface into its computational and ideological components?"
- **What the AI Suggested:**
  1. Tracking algorithmic recommendation cascades based on engagement metrics.
  2. Diagramming the UI affordances (infinite scroll, pull-to-refresh) and cognitive nudges.
  3. Auditing sponsored content density vs. organic chronological posts.
- **What I Accepted, Changed, or Rejected:**
  - *Accepted:* The breakdown of UI cognitive nudges and recommendation cascading.
  - *Rejected:* A pure focus on engagement metrics, shifting instead to how algorithmic curation flattens temporal context and historical memory.
- **Why:** In digital humanities, we are interested not only in marketing mechanics but in cultural epistemology: how the platform shapes human perception of time and memory.

---

### Entry 02: Minimalist Portfolio Architecture & Dark Mode CSS
- **Date:** 2026-09-29
- **Tool Used:** Antigravity / Gemini
- **Task / Prompt:** "Generate a CSS design system for a minimalist digital humanities portfolio using neutral tones (warm alabaster and deep obsidian) with full WCAG AA contrast compliance and smooth theme switching."
- **What the AI Suggested:**
  - CSS custom properties for light (`#faf9f6`, `#1c1c1a`) and dark (`#121211`, `#edece8`) themes.
  - Smooth transitions on surface properties and semantic typography hierarchy.
  - Data-attribute toggle logic using `[data-theme="dark"]`.
- **What I Accepted, Changed, or Rejected:**
  - *Accepted:* The CSS variables, semantic token naming, and localStorage persistence logic.
  - *Refined:* Adjusted contrast ratios for secondary metadata text to guarantee 5:1 contrast against both dark and light backgrounds. Added clean focus ring outlines for keyboard accessibility.
- **Why:** The portfolio must balance high-end minimalist aesthetics with strict universal accessibility standards.

---

### Entry 03: Distant Reading Corpus Cleaning
- **Date:** 2026-10-14
- **Tool Used:** GPT-4o
- **Task / Prompt:** "Write a Python script using NLTK and regex to clean Project Gutenberg text files by removing header/footer licensing metadata and tokenizing the corpus by chapters."
- **What the AI Suggested:**
  - A regex pattern searching for `*** START OF THE PROJECT GUTENBERG EBOOK` and chapter heading matching.
- **What I Accepted, Changed, or Rejected:**
  - *Accepted:* The regex anchor logic for Gutenberg metadata stripping.
  - *Modified:* The chapter tokenizer failed on roman numerals with periods (e.g. `CHAPTER IV.`); I rewrote the regex pattern to capture diverse roman and numerical headings and added exception handling for preface and appendix sections.
- **Why:** Automated regex often oversimplifies historical typesetting quirks; human inspection of edge cases is mandatory in literary corpus work.

