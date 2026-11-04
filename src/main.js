
import './style.css';
import { initColorConverter } from './tools/color-converter.js';
import { initBase64Tool } from './tools/base64.js';
import { initSnippetLibrary } from './tools/snippet-library.js';
import { initGlobalSearch } from './tools/global-search.js';
import { initWPQueryGenerator } from './tools/wp-query-generator.js';

// ========================================
// 1. TOOL SEARCH AND CATEGORY FILTERING
// ========================================

const searchInput = document.querySelector('#tool-search');
const toolCards = [...document.querySelectorAll('.tool-card')];
const filterButtons = document.querySelectorAll('.filter-button');
const noResults = document.querySelector('#no-results');

let activeFilter = 'all';

function filterTools() {
  const query = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  toolCards.forEach((card) => {
    const category = card.dataset.category || '';
    const searchText = card.dataset.search || card.textContent;

    const matchesCategory =
      activeFilter === 'all' || category === activeFilter;

    const matchesSearch =
      searchText.toLowerCase().includes(query) ||
      card.textContent.toLowerCase().includes(query);

    const visible = matchesCategory && matchesSearch;

    card.hidden = !visible;

    if (visible) visibleCount++;
  });

  noResults.hidden = visibleCount !== 0;
}

searchInput?.addEventListener('input', filterTools);

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;

    filterButtons.forEach((item) => {
      item.classList.remove('is-active');
    });

    button.classList.add('is-active');

    filterTools();
  });
});

// Press "/" to focus the search field.
document.addEventListener('keydown', (event) => {
  if (
    event.key === '/' &&
    !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)
  ) {
    event.preventDefault();
    searchInput?.focus();
  }
});

// ========================================
// 2. MOBILE NAVIGATION
// ========================================

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.primary-navigation');

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';

  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  navigation?.classList.toggle('is-open', !isOpen);
});

navigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

// ========================================
// 3. JSON FORMATTER ELEMENTS
// ========================================

const jsonInput = document.querySelector('#json-input');
const jsonOutput = document.querySelector('#json-output code');
const inputCount = document.querySelector('#input-count');
const jsonStatus = document.querySelector('#json-status');

const formatButton = document.querySelector('#format-json');
const minifyButton = document.querySelector('#minify-json');
const validateButton = document.querySelector('#validate-json');

const clearButton = document.querySelector('#clear-json');
const exampleButton = document.querySelector('#load-example');
const copyButton = document.querySelector('#copy-json');

let latestOutput = '';

const exampleJSON = {
  name: 'DevTools Hub',
  purpose: 'Make development simpler',
  features: ['format', 'validate', 'build'],
  active: true,
  version: '1.0.0'
};

function updateCharacterCount() {
  if (!jsonInput || !inputCount) return;

  inputCount.textContent =
    `${jsonInput.value.length} characters`;
}

function setStatus(message, type = 'normal') {
  if (!jsonStatus) return;

  jsonStatus.textContent = message;
  jsonStatus.dataset.type = type;
}

function showOutput(value) {
  if (!jsonOutput) return;

  // textContent prevents user-supplied JSON from being interpreted as HTML.
  jsonOutput.textContent = value;
  latestOutput = value;

  if (copyButton) {
    copyButton.disabled = !value;
  }
}

function parseJSON() {
  const rawValue = jsonInput?.value.trim();

  if (!rawValue) {
    throw new Error('Please enter some JSON first.');
  }

  return JSON.parse(rawValue);
}

// ========================================
// 4. FORMAT JSON
// ========================================

formatButton?.addEventListener('click', () => {
  try {
    const data = parseJSON();
    const formatted = JSON.stringify(data, null, 2);

    showOutput(formatted);
    setStatus('Valid JSON · Formatting successful', 'success');
  } catch (error) {
    showOutput(error.message);
    setStatus('Invalid JSON', 'error');
  }
});

// ========================================
// 5. MINIFY JSON
// ========================================

minifyButton?.addEventListener('click', () => {
  try {
    const data = parseJSON();
    const minified = JSON.stringify(data);

    showOutput(minified);
    setStatus('JSON minified successfully', 'success');
  } catch (error) {
    showOutput(error.message);
    setStatus('Invalid JSON', 'error');
  }
});

// ========================================
// 6. VALIDATE JSON
// ========================================

validateButton?.addEventListener('click', () => {
  try {
    parseJSON();

    showOutput('✓ Your JSON is valid.');
    setStatus('Validation successful', 'success');
  } catch (error) {
    showOutput(error.message);
    setStatus('JSON validation failed', 'error');
  }
});

// ========================================
// 7. LOAD EXAMPLE
// ========================================

exampleButton?.addEventListener('click', () => {
  jsonInput.value = JSON.stringify(exampleJSON, null, 2);

  updateCharacterCount();
  showOutput('Your formatted JSON will appear here.');
  setStatus('Example loaded. Ready to format.');
});

// ========================================
// 8. CLEAR INPUT
// ========================================

clearButton?.addEventListener('click', () => {
  jsonInput.value = '';

  updateCharacterCount();
  showOutput('Your formatted JSON will appear here.');
  setStatus('Waiting for input');
});

// ========================================
// 9. COPY OUTPUT
// ========================================

copyButton?.addEventListener('click', async () => {
  if (!latestOutput) return;

  try {
    await navigator.clipboard.writeText(latestOutput);

    setStatus('Output copied to clipboard', 'success');

    copyButton.innerHTML = 'Copied ✓';

    setTimeout(() => {
      copyButton.innerHTML = 'Copy output <span>↗</span>';
    }, 1500);
  } catch {
    setStatus(
      'Unable to copy. Check browser clipboard permissions.',
      'error'
    );
  }
});

// ========================================
// 10. INPUT CHARACTER COUNTER
// ========================================

jsonInput?.addEventListener('input', () => {
  updateCharacterCount();
  setStatus('Input changed. Ready to process.');
});

// Initial state
updateCharacterCount();
filterTools();

console.log('DevTools Hub initialized successfully.');
initColorConverter();
initBase64Tool();
initSnippetLibrary();
initGlobalSearch();
initWPQueryGenerator();