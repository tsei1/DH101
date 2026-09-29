/**
 * DH101 Portfolio Application Logic
 * Author: Isabel Tse
 * Minimalist, Accessible, Offline-Ready Architecture
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // Lightweight Zero-Dependency Markdown Parser
  // --------------------------------------------------------------------------
  function parseMarkdown(md) {
    if (!md) return '';
    
    // Normalize newlines
    let src = md.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    // Escape HTML special characters inside code fences first
    const codeBlocks = [];
    src = src.replace(/```([a-z0-9_-]*)\n([\s\S]*?)```/gi, (match, lang, code) => {
      const id = `__CODE_BLOCK_${codeBlocks.length}__`;
      const escapedCode = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      codeBlocks.push(`<pre><code class="language-${lang || 'plaintext'}">${escapedCode}</code></pre>`);
      return id;
    });

    // Escape inline code
    const inlineCodes = [];
    src = src.replace(/`([^`]+)`/g, (match, code) => {
      const id = `__INLINE_CODE_${inlineCodes.length}__`;
      const escaped = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      inlineCodes.push(`<code>${escaped}</code>`);
      return id;
    });

    // Tables
    src = src.replace(/(?:^|\n)(\|.+?\|\n\|[-:| ]+\|\n(?:\|.+?\|\n?)+)/g, (match, tableText) => {
      const rows = tableText.trim().split('\n');
      if (rows.length < 2) return match;
      
      const headerRow = rows[0].replace(/^\||\|$/g, '').split('|').map(c => `<th>${c.trim()}</th>`).join('');
      let tbody = '';
      
      for (let i = 2; i < rows.length; i++) {
        if (!rows[i].trim()) continue;
        const cols = rows[i].replace(/^\||\|$/g, '').split('|').map(c => `<td>${c.trim()}</td>`).join('');
        tbody += `<tr>${cols}</tr>`;
      }
      return `\n<table><thead><tr>${headerRow}</tr></thead><tbody>${tbody}</tbody></table>\n`;
    });

    // Blockquotes
    src = src.replace(/(?:^|\n)>[ ]?([\s\S]*?)(?=\n\n|\n[^\t >]|$)/g, (match, quoteText) => {
      const cleanText = quoteText.replace(/\n>[ ]?/g, '\n');
      return `\n<blockquote><p>${cleanText.trim().replace(/\n/g, '<br>')}</p></blockquote>\n`;
    });

    // Headings
    src = src.replace(/^#### (.*?)$/gm, '<h4>$1</h4>');
    src = src.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    src = src.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    src = src.replace(/^# (.*?)$/gm, '<h1>$1</h1>');

    // Horizontal Rule
    src = src.replace(/^(?:---|\*\*\*|___)$/gm, '<hr>');

    // Unordered lists & Task lists
    src = src.replace(/(?:^|\n)((?:[-*] .*\n?)+)/g, (match, list) => {
      const items = list.trim().split('\n').map(line => {
        let content = line.replace(/^[-*] /, '');
        // Task checkboxes
        if (/^\[x\] /i.test(content)) {
          content = `<input type="checkbox" checked disabled> ` + content.slice(4);
        } else if (/^\[ \] /i.test(content)) {
          content = `<input type="checkbox" disabled> ` + content.slice(4);
        }
        return `<li>${content}</li>`;
      }).join('');
      return `\n<ul>${items}</ul>\n`;
    });

    // Ordered lists
    src = src.replace(/(?:^|\n)((?:\d+\. .*\n?)+)/g, (match, list) => {
      const items = list.trim().split('\n').map(line => {
        const content = line.replace(/^\d+\. /, '');
        return `<li>${content}</li>`;
      }).join('');
      return `\n<ol>${items}</ol>\n`;
    });

    // Bold & Italics
    src = src.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
    src = src.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    src = src.replace(/\*(.*?)\*/g, '<em>$1</em>');
    src = src.replace(/_([^_]+)_/g, '<em>$1</em>');

    // Images & Links
    src = src.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
    src = src.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="inline-link" target="_blank" rel="noopener">$1</a>');

    // Paragraphs: split by double newlines
    const parts = src.split(/\n{2,}/);
    const html = parts.map(part => {
      const trimmed = part.trim();
      if (!trimmed) return '';
      // Don't wrap already block-level elements
      if (/^(<h[1-6]|<ul|<ol|<table|<blockquote|<pre|<hr|__CODE_BLOCK_)/i.test(trimmed)) {
        return trimmed;
      }
      return `<p>${trimmed.replace(/\n/g, '<br>')}</p>`;
    }).join('\n');

    // Restore inline codes & code blocks
    let output = html;
    inlineCodes.forEach((code, idx) => {
      output = output.replace(`__INLINE_CODE_${idx}__`, code);
    });
    codeBlocks.forEach((block, idx) => {
      output = output.replace(`__CODE_BLOCK_${idx}__`, block);
    });

    return output;
  }

  // --------------------------------------------------------------------------
  // Theme Management (Light / Dark Mode)
  // --------------------------------------------------------------------------
  const ThemeManager = {
    STORAGE_KEY: 'dh101-theme',
    
    init() {
      const savedTheme = localStorage.getItem(this.STORAGE_KEY);
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = savedTheme || (prefersDark ? 'dark' : 'light');
      this.applyTheme(theme);

      const toggleBtn = document.getElementById('theme-toggle-btn');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => this.toggleTheme());
      }

      // Listen for OS scheme changes if user hasn't set an explicit preference
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
          this.applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    },

    applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      const label = document.getElementById('theme-toggle-label');
      const icon = document.getElementById('theme-icon');
      
      if (theme === 'dark') {
        if (label) label.textContent = 'Light';
        if (icon) {
          icon.innerHTML = `<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
        }
      } else {
        if (label) label.textContent = 'Dark';
        if (icon) {
          icon.innerHTML = `<path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" stroke="currentColor" stroke-width="1.8" fill="none"/>`;
        }
      }
    },

    toggleTheme() {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      this.applyTheme(next);
      localStorage.setItem(this.STORAGE_KEY, next);
    }
  };

  // --------------------------------------------------------------------------
  // Navigation & Tab Controller
  // --------------------------------------------------------------------------
  const NavigationController = {
    tabs: ['overview', 'makes', 'pages', 'reflections', 'cv', 'how-i-use-ai'],
    currentTab: 'overview',

    init() {
      // Tab click events
      document.querySelectorAll('.nav-tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const tab = btn.getAttribute('data-tab');
          if (tab) {
            this.switchTab(tab);
            window.location.hash = tab;
          }
        });
      });

      // Quick-action buttons with data-navigate
      document.addEventListener('click', (e) => {
        const target = e.target.closest('[data-navigate]');
        if (target) {
          e.preventDefault();
          const route = target.getAttribute('data-navigate');
          this.navigateTo(route);
        }
      });

      // Handle direct hash navigation and back/forward browser navigation
      window.addEventListener('hashchange', () => this.handleHashRoute());
      this.handleHashRoute();
    },

    handleHashRoute() {
      const hash = window.location.hash.replace(/^#/, '');
      if (!hash) {
        this.switchTab('overview', false);
        return;
      }

      const parts = hash.split('/');
      const primary = parts[0];
      const sub = parts[1];

      if (this.tabs.includes(primary)) {
        this.switchTab(primary, false);

        // Sub-routes for deep links (e.g. #makes/week01, #reflections/week03, #pages/about)
        if (primary === 'makes' && sub) {
          const make = SITE_CONTENT.makes.find(m => m.id === sub || `week${m.weekNumber}` === sub);
          if (make) {
            ReaderModal.open(`Make: Week ${make.weekNumber} – ${make.title}`, make.markdown);
          }
        } else if (primary === 'reflections' && sub) {
          const ref = SITE_CONTENT.reflections.find(r => `week${r.weekNumber}` === sub || `week0${r.weekNumber}` === sub);
          if (ref) {
            ReaderModal.open(`Reflection: Week ${ref.weekNumber}`, ref.markdown);
          }
        } else if (primary === 'pages' && sub) {
          PagesManager.selectPage(sub);
        }
      } else {
        this.switchTab('overview', false);
      }
    },

    switchTab(tabId, updateHash = true) {
      if (!this.tabs.includes(tabId)) return;
      this.currentTab = tabId;

      // Update Tab Buttons
      document.querySelectorAll('.nav-tab-btn').forEach(btn => {
        const isActive = btn.getAttribute('data-tab') === tabId;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      // Update Tab Panels
      document.querySelectorAll('.tab-content-panel').forEach(panel => {
        const isActive = panel.id === `tab-panel-${tabId}`;
        panel.classList.toggle('active', isActive);
      });

      if (updateHash) {
        window.location.hash = tabId;
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    navigateTo(route) {
      window.location.hash = route;
    }
  };

  // --------------------------------------------------------------------------
  // Reader View Modal Controller
  // --------------------------------------------------------------------------
  const ReaderModal = {
    overlay: null,
    titleEl: null,
    bodyEl: null,
    copyBtn: null,
    currentRawMarkdown: '',

    init() {
      this.overlay = document.getElementById('reader-modal-overlay');
      this.titleEl = document.getElementById('reader-modal-title');
      this.bodyEl = document.getElementById('reader-modal-body');
      const closeBtn = document.getElementById('reader-modal-close');
      this.copyBtn = document.getElementById('reader-modal-copy');

      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.close());
      }

      if (this.copyBtn) {
        this.copyBtn.addEventListener('click', () => this.copyMarkdown());
      }

      if (this.overlay) {
        this.overlay.addEventListener('click', (e) => {
          if (e.target === this.overlay) {
            this.close();
          }
        });
      }

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.overlay && this.overlay.classList.contains('active')) {
          this.close();
        }
      });
    },

    open(title, markdown) {
      if (!this.overlay) return;
      this.currentRawMarkdown = markdown;
      if (this.titleEl) this.titleEl.textContent = title;
      if (this.bodyEl) {
        this.bodyEl.innerHTML = `<div class="markdown-content">${parseMarkdown(markdown)}</div>`;
      }
      this.overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    },

    close() {
      if (!this.overlay) return;
      this.overlay.classList.remove('active');
      document.body.style.overflow = '';
      if (this.copyBtn) this.copyBtn.textContent = 'Copy Markdown';
    },

    copyMarkdown() {
      if (!this.currentRawMarkdown) return;
      navigator.clipboard.writeText(this.currentRawMarkdown).then(() => {
        if (this.copyBtn) {
          const original = this.copyBtn.textContent;
          this.copyBtn.textContent = 'Copied!';
          setTimeout(() => {
            this.copyBtn.textContent = original;
          }, 2000);
        }
      });
    }
  };

  // --------------------------------------------------------------------------
  // Makes Section Controller
  // --------------------------------------------------------------------------
  const MakesManager = {
    currentCategory: 'All',
    searchQuery: '',

    init() {
      this.renderFilterChips();
      this.renderMakes();

      const searchInput = document.getElementById('makes-search-input');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this.searchQuery = e.target.value.toLowerCase().trim();
          this.renderMakes();
        });
      }
    },

    renderFilterChips() {
      const container = document.getElementById('makes-filter-chips');
      if (!container) return;

      const categories = ['All', ...new Set(SITE_CONTENT.makes.map(m => m.category))];
      container.innerHTML = categories.map(cat => `
        <button class="chip ${cat === this.currentCategory ? 'active' : ''}" data-category="${cat}">
          ${cat}
        </button>
      `).join('');

      container.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
          this.currentCategory = chip.getAttribute('data-category');
          container.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          this.renderMakes();
        });
      });
    },

    renderMakes() {
      const container = document.getElementById('makes-grid');
      if (!container) return;

      const filtered = SITE_CONTENT.makes.filter(item => {
        const matchesCategory = this.currentCategory === 'All' || item.category === this.currentCategory;
        const query = this.searchQuery;
        const matchesQuery = !query || 
          item.title.toLowerCase().includes(query) ||
          item.summary.toLowerCase().includes(query) ||
          item.tags.some(t => t.toLowerCase().includes(query)) ||
          item.markdown.toLowerCase().includes(query);

        return matchesCategory && matchesQuery;
      });

      if (filtered.length === 0) {
        container.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-tertiary);">
            No makes found matching "${this.searchQuery}". Try a different keyword or filter.
          </div>
        `;
        return;
      }

      container.innerHTML = filtered.map(make => `
        <article class="item-card" data-make-id="${make.id}">
          <div class="item-card-top">
            <div class="item-card-meta">
              <span class="week-pill">Week ${String(make.weekNumber).padStart(2, '0')}</span>
              <span class="status-badge">${make.category}</span>
            </div>
            <h3 class="item-card-title">${make.title}</h3>
            <p class="item-card-snippet">${make.summary}</p>
          </div>
          <div class="item-card-footer">
            <div class="item-card-tags">
              ${make.tags.map(tag => `<span class="mini-tag">#${tag}</span>`).join('')}
            </div>
            <span class="read-more-btn">
              Read Artifact →
            </span>
          </div>
        </article>
      `).join('');

      // Click to open make in modal
      container.querySelectorAll('.item-card').forEach(card => {
        card.addEventListener('click', () => {
          const makeId = card.getAttribute('data-make-id');
          const make = SITE_CONTENT.makes.find(m => m.id === makeId);
          if (make) {
            window.location.hash = `makes/${make.id}`;
            ReaderModal.open(`Week ${make.weekNumber}: ${make.title}`, make.markdown);
          }
        });
      });
    }
  };

  // --------------------------------------------------------------------------
  // Pages Section Controller
  // --------------------------------------------------------------------------
  const PagesManager = {
    currentPageSlug: 'about',
    pagesData: {},

    init() {
      // Map markdown from site content
      this.pagesData = {
        about: {
          title: "About Me",
          category: "Course Introduction",
          markdown: `# About Me\n\nHello! I am **Isabel Tse**, a student in **DH 101: Digital Humanities** for Spring 2026.\n\nMy work in this course investigates the intersections of digital humanities, critical computational making, and artificial intelligence. I am interested in how emerging technologies reshape traditional humanistic questions: What does it mean to create? How do algorithmic systems encode cultural assumptions, history, and labor? And how can we develop ethical, critical frameworks for collaborating with generative tools rather than passively consuming them?\n\n## Academic Interests & Focus\n- **Critical Making & Creative Technologies**: Exploring how physical and digital artifacts embody cultural narratives and computational logic.\n- **Distant Reading & Cultural Analytics**: Applying computational text analysis, corpus linguistics, and visualization to literary and historical archives.\n- **Human-AI Interaction & Ethics**: Investigating labor practices, environmental footprints, algorithmic biases, and transparency in machine learning.\n- **Accessible Design & Public Humanities**: Building digital tools and web spaces that prioritize universal access, clarity, and open scholarship.\n\n## About This Portfolio\nThis website serves as my semester-long working portfolio, studio log, and critical research journal for DH 101. Feel free to explore the makes, reflections, and my AI workflow.`
        },
        accessibility: {
          title: "Accessibility Statement",
          category: "Commitment & Standards",
          markdown: `# Accessibility Statement\n\nUniversal access is a foundational value of the Digital Humanities. Digital artifacts and scholarly portfolios must be accessible to people of all abilities, operating environments, and assistive technologies.\n\n## Core Design Principles\nIn developing this website and the weekly artifacts for DH 101, I adhere to the **Web Content Accessibility Guidelines (WCAG 2.1 AA standards)** through the following intentional design decisions:\n\n### 1. Minimalist Neutral Palette & High Contrast\n- Both the light and dark color schemes have been calibrated to maintain contrast ratios well exceeding the WCAG AA minimum of **4.5:1** for body text and **3:1** for large headings and UI controls.\n- The neutral palette deliberately avoids harsh saturated colors, reducing visual strain and glare while supporting users with photosensitivity or color-vision deficiencies.\n\n### 2. Semantic HTML & Screen Reader Support\n- All layout elements use semantic HTML5 structures (\`<header>\`, \`<nav>\`, \`<main>\`, \`<article>\`, \`<section>\`, \`<footer>\`).\n- Navigational tabs include descriptive ARIA labels (\`aria-selected\`, \`aria-controls\`, \`role="tab"\`).\n\n### 3. Alternative Text & Media Descriptions\n- Every image and diagram includes descriptive \`alt\` text explaining both the visual composition and the rhetorical significance of the image.\n\n### 4. Keyboard Navigation & Focus Indicators\n- The entire site is navigable using only a keyboard (\`Tab\`, \`Shift + Tab\`, \`Enter\`, and \`Space\`).`
        },
        'how-i-use-ai': {
          title: "How I Use AI: Principles & Framework",
          category: "Course Ethics",
          markdown: `# How I Use AI: Methodology & Principles\n\nIn DH 101, artificial intelligence is neither treated as an infallible oracle nor as a shortcut to bypass original thought. Instead, I treat generative AI as an **experimental research instrument, critical foil, and interlocutor** that must be rigorously audited, contextualized, and cited.\n\n---\n\n## The Four Core Principles\n\n### 1. Critical Inquiry Over Passive Acceptance\nLarge language models are probabilistic text predictors, not repositories of verified truth. When consulting an AI:\n- I fact-check all empirical claims, citations, and historical assertions.\n- I examine what biases and assumptions the model embeds in its prose.\n\n### 2. Full Attribution & Auditable Logs\nTransparency is essential to scholarly integrity. Every instance of AI assistance in this portfolio is accompanied by:\n- The specific tool and model version.\n- The exact prompt and framing.\n- The specific delta: what was machine-generated versus what was authored or refuted by me.\n\n### 3. Primacy of Human Voice & Intellectual Ownership\nThe central thesis, critical analysis, personal voice, and ethical conclusions of every make and reflection are entirely my own.\n\n### 4. Continuous Reflection on Power & Ecology\nEvery computational project prompts meta-reflection on compute consumption, carbon footprint, and the invisible labor behind training datasets.`
        },
        sustainability: {
          title: "Sustainability & Ethics",
          category: "Environmental Framework",
          markdown: `# Sustainability & Ethics\n\nAs digital humanists engaging with artificial intelligence, we cannot view computation as an abstract, ethereal cloud. Every generative query, neural model training cycle, and algorithmic prediction relies on physical infrastructure: massive data centers, cooling systems, mineral extraction, and thousands of gallons of freshwater.\n\n## The Environmental Cost of Generative AI\n- **Energy & Carbon Intensity**: Large language models consume gigawatt-hours of electrical power during training and inference.\n- **Water Consumption**: Hyperscale server farms require evaporative cooling, often drawing from drought-stressed municipal watersheds.\n- **Hardware Lifecycle & E-Waste**: Specialized AI accelerators fuel mineral extraction (lithium, cobalt) and generate hazardous e-waste.\n\n## Human Labor in the AI Supply Chain\nThe illusion of machine intelligence rests on low-wage workers across the Global South who label training data, verify synthetic outputs, and moderate traumatic content.`
        },
        'markdown-guide': {
          title: "Markdown Reference Guide",
          category: "Technical Manual",
          markdown: `# Markdown Guide\n\nQuick reference for writing course pages, makes, and weekly reflections.\n\n## Headings\nUse \`#\` for titles and smaller headings.\n\n\`\`\`markdown\n# Page Title\n## Section\n### Subsection\n\`\`\`\n\n## Formatting Text\n- **Bold:** \`**bold text**\`\n- *Italic:* \`*italic text*\`\n- Code: \`\` \`inline code\` \`\`\n- Blockquote: \`> quote text\`\n\n## Lists & Tables\n- Unordered list: \`- item\`\n- Ordered list: \`1. item\`\n- Tables use pipes \`|\` and dashes \`---\`.\n\n## Images & Relative Links\n\`\`\`markdown\n[Week 01 Make](../makes/week01.md)\n![Alt text](path/to/image.png)\n\`\`\``
        }
      };

      this.renderSidebar();
      this.selectPage(this.currentPageSlug, false);
    },

    renderSidebar() {
      const container = document.getElementById('pages-sidebar-list');
      if (!container) return;

      container.innerHTML = SITE_CONTENT.pages.map(page => `
        <li class="pages-nav-item">
          <button class="${page.slug === this.currentPageSlug ? 'active' : ''}" data-page-slug="${page.slug}">
            <span>${page.title}</span>
            <span class="mini-tag">${page.category}</span>
          </button>
        </li>
      `).join('');

      container.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
          const slug = btn.getAttribute('data-page-slug');
          this.selectPage(slug);
        });
      });
    },

    selectPage(slug, updateHash = true) {
      if (!this.pagesData[slug]) return;
      this.currentPageSlug = slug;

      // Update active state in sidebar
      const container = document.getElementById('pages-sidebar-list');
      if (container) {
        container.querySelectorAll('button').forEach(btn => {
          btn.classList.toggle('active', btn.getAttribute('data-page-slug') === slug);
        });
      }

      // Render content
      const displayArea = document.getElementById('pages-content-display');
      if (displayArea) {
        const page = this.pagesData[slug];
        displayArea.innerHTML = `
          <div class="section-tag" style="margin-bottom: 0.5rem;">${page.category}</div>
          <div class="markdown-content">
            ${parseMarkdown(page.markdown)}
          </div>
        `;
      }

      if (updateHash) {
        window.location.hash = `pages/${slug}`;
      }
    }
  };

  // --------------------------------------------------------------------------
  // Reflections Section Controller
  // --------------------------------------------------------------------------
  const ReflectionsManager = {
    searchQuery: '',

    init() {
      this.renderReflections();

      const searchInput = document.getElementById('reflections-search-input');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this.searchQuery = e.target.value.toLowerCase().trim();
          this.renderReflections();
        });
      }
    },

    renderReflections() {
      const container = document.getElementById('reflections-grid');
      if (!container) return;

      const filtered = SITE_CONTENT.reflections.filter(item => {
        const query = this.searchQuery;
        if (!query) return true;
        return (
          item.title.toLowerCase().includes(query) ||
          item.prompt.toLowerCase().includes(query) ||
          item.markdown.toLowerCase().includes(query)
        );
      });

      if (filtered.length === 0) {
        container.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-tertiary);">
            No reflections found matching "${this.searchQuery}".
          </div>
        `;
        return;
      }

      container.innerHTML = filtered.map(ref => `
        <article class="item-card" data-ref-id="week${ref.weekNumber}">
          <div class="item-card-top">
            <div class="item-card-meta">
              <span class="week-pill">Week ${String(ref.weekNumber).padStart(2, '0')}</span>
              <span class="status-badge">${ref.status}</span>
            </div>
            <h3 class="item-card-title">${ref.title}</h3>
            <p class="item-card-snippet">${ref.prompt}</p>
          </div>
          <div class="item-card-footer">
            <span class="mini-tag">Prompt Response</span>
            <span class="read-more-btn">
              Read Essay →
            </span>
          </div>
        </article>
      `).join('');

      container.querySelectorAll('.item-card').forEach(card => {
        card.addEventListener('click', () => {
          const refId = card.getAttribute('data-ref-id');
          const weekNum = parseInt(refId.replace('week', ''), 10);
          const ref = SITE_CONTENT.reflections.find(r => r.weekNumber === weekNum);
          if (ref) {
            window.location.hash = `reflections/week${ref.weekNumber}`;
            ReaderModal.open(`Week ${ref.weekNumber} Reflection: ${ref.title}`, ref.markdown);
          }
        });
      });
    }
  };

  // --------------------------------------------------------------------------
  // Curriculum Vitae (CV) Controller
  // --------------------------------------------------------------------------
  const CVManager = {
    init() {
      const printBtn = document.getElementById('cv-print-btn');
      if (printBtn) {
        printBtn.addEventListener('click', () => {
          window.print();
        });
      }

      const copyBtn = document.getElementById('cv-copy-btn');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          const cvText = document.getElementById('cv-body-content').innerText;
          navigator.clipboard.writeText(cvText).then(() => {
            const original = copyBtn.textContent;
            copyBtn.textContent = 'Copied to Clipboard!';
            setTimeout(() => {
              copyBtn.textContent = original;
            }, 2000);
          });
        });
      }
    }
  };

  // --------------------------------------------------------------------------
  // "How I Use AI" Section Controller (Interactive Principles & Log)
  // --------------------------------------------------------------------------
  const AILogManager = {
    STORAGE_KEY: 'dh101-user-ai-logs',

    init() {
      this.renderLogs();

      const form = document.getElementById('add-ai-log-form');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleAddLog(form);
        });
      }

      const copyTemplateBtn = document.getElementById('copy-ai-template-btn');
      if (copyTemplateBtn) {
        copyTemplateBtn.addEventListener('click', () => {
          const template = `# AI Use Log\n\n**Date:** ${new Date().toISOString().split('T')[0]}\n\n**Tool Used:** \n\n**Task / Prompt:** \n\n**What the AI Suggested:** \n\n**What I Accepted, Changed, or Rejected:** \n\n**Why:** \n`;
          navigator.clipboard.writeText(template).then(() => {
            const orig = copyTemplateBtn.textContent;
            copyTemplateBtn.textContent = 'Template Copied!';
            setTimeout(() => copyTemplateBtn.textContent = orig, 2000);
          });
        });
      }
    },

    getAllLogs() {
      const customLogs = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
      return [...customLogs, ...SITE_CONTENT.aiLogs];
    },

    renderLogs() {
      const container = document.getElementById('ai-logs-container');
      if (!container) return;

      const logs = this.getAllLogs();
      container.innerHTML = logs.map(log => `
        <div class="log-entry-item">
          <div class="log-entry-top">
            <span class="log-entry-tool">${log.tool}</span>
            <span class="log-entry-date">${log.date}</span>
          </div>
          <div class="log-row">
            <div class="log-row-label">Task / Prompt</div>
            <div class="log-row-val">“${log.task}”</div>
          </div>
          <div class="log-row">
            <div class="log-row-label">What the AI Suggested</div>
            <div class="log-row-val">${log.suggested}</div>
          </div>
          <div class="log-row">
            <div class="log-row-label">Decision & Modifications</div>
            <div class="log-row-val">${log.decision}</div>
          </div>
          <div class="log-row" style="margin-bottom: 0;">
            <div class="log-row-label">Critical Rationale / Why</div>
            <div class="log-row-val">${log.why}</div>
          </div>
        </div>
      `).join('');
    },

    handleAddLog(form) {
      const tool = form.elements['log-tool'].value.trim();
      const date = form.elements['log-date'].value || new Date().toISOString().split('T')[0];
      const task = form.elements['log-task'].value.trim();
      const suggested = form.elements['log-suggested'].value.trim();
      const decision = form.elements['log-decision'].value.trim();
      const why = form.elements['log-why'].value.trim();

      if (!tool || !task || !decision) {
        alert('Please fill out the Tool, Task/Prompt, and Decision fields.');
        return;
      }

      const newEntry = {
        id: 'custom-' + Date.now(),
        date,
        tool,
        task,
        suggested,
        decision,
        why
      };

      const customLogs = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
      customLogs.unshift(newEntry);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(customLogs));

      this.renderLogs();
      form.reset();

      // Set default date to today
      const dateInput = form.elements['log-date'];
      if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];

      // Format markdown snippet to clipboard
      const markdownFormat = `### Entry: ${task.slice(0, 40)}...\n- **Date:** ${date}\n- **Tool Used:** ${tool}\n- **Task / Prompt:** "${task}"\n- **What the AI Suggested:** ${suggested}\n- **What I Accepted, Changed, or Rejected:** ${decision}\n- **Why:** ${why}\n`;
      navigator.clipboard.writeText(markdownFormat).then(() => {
        alert('Log entry saved locally and copied to clipboard as Markdown!');
      });
    }
  };

  // --------------------------------------------------------------------------
  // App Initialization
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    ReaderModal.init();
    NavigationController.init();
    MakesManager.init();
    PagesManager.init();
    ReflectionsManager.init();
    CVManager.init();
    AILogManager.init();

    // Default today's date in AI Log Form
    const dateInput = document.getElementById('log-date-input');
    if (dateInput) {
      dateInput.value = new Date().toISOString().split('T')[0];
    }
  });

})();
