# Accessibility Statement

Universal access is a foundational value of the Digital Humanities. Digital artifacts and scholarly portfolios must be accessible to people of all abilities, operating environments, and assistive technologies.

## Core Design Principles

In developing this website and the weekly artifacts for DH 101, I adhere to the **Web Content Accessibility Guidelines (WCAG 2.1 AA standards)** through the following intentional design decisions:

### 1. Minimalist Neutral Palette & High Contrast
- Both the light and dark color schemes have been calibrated to maintain contrast ratios well exceeding the WCAG AA minimum of **4.5:1** for body text and **3:1** for large headings and UI controls.
- The neutral palette deliberately avoids harsh saturated colors, reducing visual strain and glare while supporting users with photosensitivity or color-vision deficiencies.

### 2. Semantic HTML & Screen Reader Support
- All layout elements use semantic HTML5 structures (`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`).
- Navigational tabs include descriptive ARIA labels (`aria-selected`, `aria-controls`, `role="tab"`) to ensure assistive technologies can parse navigation state accurately.
- Heading hierarchies (`#`, `##`, `###`) are maintained in sequential order without skipping levels.

### 3. Alternative Text & Media Descriptions
- Every image, diagram, and visual artifact includes descriptive `alt` text explaining both the visual composition and the rhetorical significance of the image.
- Decorative elements are explicitly marked or implemented via CSS to avoid cluttering screen reader narration.

### 4. Keyboard Navigation & Focus Indicators
- The entire site is navigable using only a keyboard (`Tab`, `Shift + Tab`, `Enter`, and `Space`).
- Interactive controls and tab switches feature clearly defined, high-contrast focus rings.

### 5. Responsive & Resilient Typography
- Layouts are built using fluid relative units (`rem`, `ch`, `%`) rather than fixed pixels, allowing readers to scale browser zoom up to 200% without breaking text flow or overlapping content.
- Clean system typography ensures fast loading times and native readability across diverse operating systems and devices.

### Continuous Improvement
If you encounter any accessibility barriers while navigating this portfolio, please reach out so I can remediate the issue promptly.