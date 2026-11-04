
export function initGlobalSearch() {
  const tools = [
    {
      name: 'JSON Formatter',
      category: 'Data',
      keywords: 'json format validate minify',
      target: '#json-formatter'
    },
    {
      name: 'Color Converter',
      category: 'Design',
      keywords: 'color hex rgb hsl palette',
      target: '#color-converter'
    },
    {
      name: 'Base64 Encoder',
      category: 'Text',
      keywords: 'base64 encode decode',
      target: '#base64-tool'
    },
    {
      name: 'Snippet Library',
      category: 'WordPress',
      keywords: 'php wordpress javascript css code snippets',
      target: '#snippet-library'
    },
    {
        name: 'WP_Query Generator',
        category: 'WordPress',
        keywords: 'wordpress wp query php posts products custom post type',
        target: '#wp-query-generator'
        }
  ];

  const overlay = document.querySelector('#global-search');
  const input = document.querySelector('#global-search-input');
  const searchTrigger = document.querySelector('#header-search-trigger');
  const results = document.querySelector('#global-search-results');

  if (!overlay || !input || !results) return;

  let activeIndex = 0;
  let filteredTools = [];

  function openSearch() {
    overlay.hidden = false;
    input.value = '';
    renderResults();
    input.focus();
  }

  function closeSearch() {
    overlay.hidden = true;
    input.value = '';
  }

  function renderResults() {
    const query = input.value.toLowerCase().trim();

    filteredTools = tools.filter(tool => {
      const searchable = [
        tool.name,
        tool.category,
        tool.keywords
      ].join(' ').toLowerCase();

      return searchable.includes(query);
    });

    activeIndex = 0;

    if (!filteredTools.length) {
      results.innerHTML = `
        <p class="global-search-empty">
          No matching tools found.
        </p>
      `;
      return;
    }

    results.innerHTML = filteredTools.map((tool, index) => `
      <button
        type="button"
        class="global-search-result ${index === 0 ? 'active' : ''}"
        data-index="${index}"
      >
        <span class="global-search-result-icon">⌘</span>
        <span class="global-search-result-info">
          <strong>${tool.name}</strong>
          <small>${tool.category}</small>
        </span>
        <span class="global-search-result-arrow">↗</span>
      </button>
    `).join('');
  }

  function updateActiveResult() {
    const items = results.querySelectorAll('.global-search-result');

    items.forEach((item, index) => {
      item.classList.toggle('active', index === activeIndex);
    });

    items[activeIndex]?.scrollIntoView({
      block: 'nearest'
    });
  }

  function openTool(index) {
    const tool = filteredTools[index];

    if (!tool) return;

    closeSearch();

    document.querySelector(tool.target)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

    history.replaceState(null, '', tool.target);
  }

  input.addEventListener('input', renderResults);
  searchTrigger?.addEventListener('click', openSearch);

  results.addEventListener('click', event => {
    const button = event.target.closest('.global-search-result');

    if (!button) return;

    openTool(Number(button.dataset.index));
  });

  input.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();

      activeIndex = Math.min(
        activeIndex + 1,
        filteredTools.length - 1
      );

      updateActiveResult();
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();

      activeIndex = Math.max(activeIndex - 1, 0);

      updateActiveResult();
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      openTool(activeIndex);
    }

    if (event.key === 'Escape') {
      closeSearch();
    }
  });

  document.addEventListener('keydown', event => {
    if (
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === 'k'
    ) {
      event.preventDefault();

      if (overlay.hidden) {
        openSearch();
      } else {
        closeSearch();
      }
    }

    if (event.key === 'Escape' && !overlay.hidden) {
      closeSearch();
    }
  });

  overlay.addEventListener('click', event => {
    if (event.target === overlay) {
      closeSearch();
    }
  });

  renderResults();
}
