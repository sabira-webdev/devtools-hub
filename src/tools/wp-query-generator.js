
export function initWPQueryGenerator() {
  const tool = document.querySelector('#wp-query-generator');

  if (!tool) return;

  const form = tool.querySelector('#wp-query-form');
  const output = tool.querySelector('#wp-query-output');
  const copyButton = tool.querySelector('#wp-query-copy');
  const status = tool.querySelector('#wp-query-status');

  const fields = {
    postType: tool.querySelector('#wp-post-type'),
    postsPerPage: tool.querySelector('#wp-posts-per-page'),
    category: tool.querySelector('#wp-category'),
    postStatus: tool.querySelector('#wp-post-status'),
    orderBy: tool.querySelector('#wp-order-by'),
    order: tool.querySelector('#wp-order'),
    pagination: tool.querySelector('#wp-pagination')
  };

  function generateCode() {
    const postType = fields.postType.value.trim();
    const postsPerPage = Number(fields.postsPerPage.value);
    const category = fields.category.value.trim();
    const postStatus = fields.postStatus.value;
    const orderBy = fields.orderBy.value;
    const order = fields.order.value;
    const pagination = fields.pagination.checked;

    if (!/^[a-z0-9_-]+$/i.test(postType)) {
      status.textContent = 'Enter a valid post type.';
      status.className = 'wp-query-status error';
      return;
    }

    if (
      !Number.isInteger(postsPerPage) ||
      postsPerPage < 1 ||
      postsPerPage > 100
    ) {
      status.textContent = 'Posts per page must be between 1 and 100.';
      status.className = 'wp-query-status error';
      return;
    }

    const args = [
      `'post_type'      => '${postType}'`,
      `'posts_per_page' => ${postsPerPage}`,
      `'post_status'    => '${postStatus}'`,
      `'orderby'        => '${orderBy}'`,
      `'order'          => '${order}'`
    ];

    if (category) {
      args.push(`'category_name' => '${category}'`);
    }

    if (pagination) {
      args.push(`'paged'          => get_query_var('paged') ? get_query_var('paged') : 1`);
    }

    const code = `$args = [
    ${args.join(',\n    ')}
];

$query = new WP_Query($args);

if ($query->have_posts()) {
    while ($query->have_posts()) {
        $query->the_post();

        // Display your post content here.
        the_title('<h2>', '</h2>');
        the_excerpt();
    }

    ${pagination ? 'the_posts_pagination();' : ''}
} else {
    echo '<p>No posts found.</p>';
}

wp_reset_postdata();`;

    output.textContent = code;

    status.textContent = 'PHP code generated successfully.';
    status.className = 'wp-query-status success';
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    generateCode();
  });

  form.addEventListener('input', generateCode);
  form.addEventListener('change', generateCode);

  copyButton.addEventListener('click', async () => {
    const code = output.textContent;

    if (!code.trim()) {
      status.textContent = 'Generate code before copying.';
      status.className = 'wp-query-status error';
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      status.textContent = 'PHP code copied successfully!';
      status.className = 'wp-query-status success';
    } catch {
      status.textContent = 'Unable to copy. Please copy manually.';
      status.className = 'wp-query-status error';
    }
  });

  generateCode();
}
