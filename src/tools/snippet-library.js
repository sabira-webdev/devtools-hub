
const snippets = [
  {
    id: 1,
    title: 'Get WordPress Site URL',
    language: 'PHP',
    category: 'WordPress',
    description: 'Retrieve the current WordPress site URL.',
    code: `<?php
$site_url = get_site_url();
echo esc_url($site_url);
?>`
  },
  {
    id: 2,
    title: 'Register Custom Post Type',
    language: 'PHP',
    category: 'WordPress',
    description: 'Register a custom post type in WordPress.',
    code: `<?php
function register_custom_post_type() {
    register_post_type('portfolio', [
        'label' => 'Portfolio',
        'public' => true,
        'show_in_rest' => true,
        'supports' => ['title', 'editor', 'thumbnail']
    ]);
}
add_action('init', 'register_custom_post_type');
?>`
  },
  {
    id: 3,
    title: 'Fetch API Data',
    language: 'JavaScript',
    category: 'JavaScript',
    description: 'Fetch data from an API using async and await.',
    code: `async function fetchData() {
    try {
        const response = await fetch('/api/data');

        if (!response.ok) {
            throw new Error('Request failed');
        }

        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error(error);
    }
}

fetchData();`
  },
  {
    id: 4,
    title: 'Center a Container',
    language: 'CSS',
    category: 'CSS',
    description: 'Center an element horizontally and vertically.',
    code: `.container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}`
  },
  {
    id: 5,
    title: 'Get WooCommerce Cart Total',
    language: 'PHP',
    category: 'WooCommerce',
    description: 'Get the current WooCommerce cart subtotal.',
    code: `<?php
if ( WC()->cart ) {
    $subtotal = WC()->cart->get_subtotal();
    echo wc_price($subtotal);
}
?>`
  },
  {
    id: 6,
    title: 'Debounce Function',
    language: 'JavaScript',
    category: 'JavaScript',
    description: 'Delay function execution until user input stops.',
    code: `function debounce(callback, delay = 300) {
    let timer;

    return (...args) => {
        clearTimeout(timer);

        timer = setTimeout(() => {
            callback(...args);
        }, delay);
    };
}`
  }
];

export function initSnippetLibrary() {
  const library = document.querySelector('#snippet-library');

  if (!library) return;

  const searchInput = library.querySelector('#snippet-search');
  const filterButtons = library.querySelectorAll('.snippet-filter');
  const list = library.querySelector('#snippet-list');
  const count = library.querySelector('#snippet-count');

  let activeFilter = 'All';

  function renderSnippets() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    const filtered = snippets.filter(snippet => {
      const matchesFilter =
        activeFilter === 'All' ||
        snippet.language === activeFilter;

      const matchesSearch = [
        snippet.title,
        snippet.description,
        snippet.language,
        snippet.category,
        snippet.code
      ].join(' ').toLowerCase().includes(searchTerm);

      return matchesFilter && matchesSearch;
    });

    count.textContent = `${filtered.length} snippet${filtered.length === 1 ? '' : 's'} found`;

    if (!filtered.length) {
      list.innerHTML = '<p class="snippet-empty">No snippets found. Try another search.</p>';
      return;
    }

    list.innerHTML = filtered.map(snippet => `
      <article class="snippet-card">
        <div class="snippet-card-top">
          <span class="snippet-language">${snippet.language}</span>
          <span class="snippet-category">${snippet.category}</span>
        </div>

        <h3>${snippet.title}</h3>
        <p>${snippet.description}</p>

        <pre><code></code></pre>

        <button type="button" class="snippet-copy" data-snippet-id="${snippet.id}">
          Copy code
        </button>
      </article>
    `).join('');

    const codeElements = list.querySelectorAll('code');

    filtered.forEach((snippet, index) => {
      codeElements[index].textContent = snippet.code;
    });
  }

  searchInput.addEventListener('input', renderSnippets);

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter;

      filterButtons.forEach(item => {
        item.classList.toggle('active', item === button);
      });

      renderSnippets();
    });
  });

  list.addEventListener('click', async event => {
    const button = event.target.closest('.snippet-copy');

    if (!button) return;

    const snippet = snippets.find(
      item => item.id === Number(button.dataset.snippetId)
    );

    if (!snippet) return;

    try {
      await navigator.clipboard.writeText(snippet.code);

      button.textContent = 'Copied!';
      setTimeout(() => {
        button.textContent = 'Copy code';
      }, 1500);
    } catch {
      button.textContent = 'Copy failed';
    }
  });

  renderSnippets();
}
