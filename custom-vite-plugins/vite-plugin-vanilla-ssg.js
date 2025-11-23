/*
 * Generated with the help of claude sonnet 4.5
 */

import fs from 'fs/promises';
import path from 'path';

/**
 * Vite plugin for Static Site Generation using plain JavaScript
 * No JSX, no React/Preact required - just vanilla JS and HTML templates
 * 
 * @param {Object} options - Plugin options
 * @param {Array} options.pages - Array of page configurations
 * @param {string} options.template - Path to HTML template (default: 'index.html')
 * @param {string} options.contentDir - Directory for content/data (default: 'src/content')
 */
export default function ssgVanillaPlugin(options = {}) {
  const {
    pages = [],
    template = 'index.html',
    contentDir = 'src/content',
  } = options;

  let config;
  let isSSG = false;

  return {
    name: 'vite-plugin-ssg-vanilla',

    configResolved(resolvedConfig) {
      config = resolvedConfig;
      isSSG = config.command === 'build';
    },

    async closeBundle() {
      if (!isSSG || pages.length === 0) return;

      console.log('\n🔨 Starting static site generation (vanilla JS)...\n');

      const outDir = config.build.outDir;
      const root = config.root;

      try {
        // Read the HTML template
        const templatePath = path.join(root, template);
        const templateHtml = await fs.readFile(templatePath, 'utf-8');

        // Generate each page
        for (const page of pages) {
          console.log(`  ✓ Generating ${page.route}`);

          // Render the page
          const html = await renderPage(templateHtml, page, root, contentDir);

          // Determine output path
          const outputPath = getOutputPath(outDir, page.route);

          // Ensure directory exists
          await fs.mkdir(path.dirname(outputPath), { recursive: true });

          // Write the generated HTML
          await fs.writeFile(outputPath, html);
        }

        console.log(`\n✨ Successfully generated ${pages.length} pages\n`);
      } catch (error) {
        console.error('SSG Error:', error);
        throw error;
      }
    },
  };
}

/**
 * Render a page by replacing placeholders in the template
 */
async function renderPage(template, page, root, contentDir) {
  const {
    route,
    title = 'My Site',
    meta = {},
    content = '',
    data = null,
    render = null,
  } = page;

  let html = template;

  // Replace title
  html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);

  // Add meta tags
  let metaTags = '';
  if (meta.description) {
    metaTags += `\n    <meta name="description" content="${meta.description}">`;
  }
  if (meta.keywords) {
    metaTags += `\n    <meta name="keywords" content="${meta.keywords}">`;
  }
  if (meta.author) {
    metaTags += `\n    <meta name="author" content="${meta.author}">`;
  }

  // Insert meta tags before closing </head>
  if (metaTags) {
    html = html.replace('</head>', `  ${metaTags}\n  </head>`);
  }

  // Generate page content
  let pageContent = '';

  if (render && typeof render === 'function') {
    // Use custom render function
    pageContent = await render({ route, data, root, contentDir });
  } else if (content) {
    // Use provided content string
    pageContent = content;
  } else if (data) {
    // Load data file and use default template
    const dataPath = path.join(root, contentDir, data);
    const dataContent = await fs.readFile(dataPath, 'utf-8');

    if (data.endsWith('.json')) {
      const jsonData = JSON.parse(dataContent);
      pageContent = renderJsonData(jsonData);
    } else if (data.endsWith('.md')) {
      pageContent = renderMarkdown(dataContent);
    } else {
      pageContent = dataContent;
    }
  }

  // Replace content placeholder
  html = html.replace(
    /<div id="app"><\/div>/,
    `<div id="app">${pageContent}</div>`
  );

  return html;
}

/**
 * Render JSON data to HTML
 */
function renderJsonData(data) {
  let html = '';

  if (data.title) {
    html += `<h1>${escapeHtml(data.title)}</h1>\n`;
  }

  if (data.description) {
    html += `<p>${escapeHtml(data.description)}</p>\n`;
  }

  if (data.content) {
    html += `<div class="content">${escapeHtml(data.content)}</div>\n`;
  }

  if (data.items && Array.isArray(data.items)) {
    html += '<ul>\n';
    for (const item of data.items) {
      html += `  <li>${escapeHtml(String(item))}</li>\n`;
    }
    html += '</ul>\n';
  }

  return html;
}

/**
 * Simple markdown to HTML converter
 */
function renderMarkdown(markdown) {
  let html = markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Paragraphs
    .split('\n\n')
    .map(p => p.trim() ? `<p>${p}</p>` : '')
    .join('\n');

  return html;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Convert route to file system path
 */
function getOutputPath(outDir, route) {
  if (route === '/') {
    return path.join(outDir, 'index.html');
  }

  const cleanRoute = route.replace(/^\/|\/$/g, '');
  return path.join(outDir, cleanRoute, 'index.html');
}

// Example vite.config.js:
/*
import { defineConfig } from 'vite';
import ssgVanillaPlugin from './vite-plugin-ssg-vanilla.js';

export default defineConfig({
  plugins: [
    ssgVanillaPlugin({
      pages: [
        // Simple page with inline content
        {
          route: '/',
          title: 'Home - My Site',
          meta: {
            description: 'Welcome to my site',
            keywords: 'home, welcome',
          },
          content: `
            <h1>Welcome Home</h1>
            <p>This is the home page content.</p>
          `,
        },
     
        // Page with JSON data
        {
          route: '/about',
          title: 'About Us',
          data: 'about.json',
        },
     
        // Page with markdown content
        {
          route: '/blog',
          title: 'Blog',
          data: 'blog.md',
        },
     
        // Page with custom render function
        {
          route: '/products',
          title: 'Products',
          render: async ({ root, contentDir }) => {
            // Load data from file
            const fs = await import('fs/promises');
            const path = await import('path');
            const dataPath = path.join(root, contentDir, 'products.json');
            const data = JSON.parse(await fs.readFile(dataPath, 'utf-8'));
         
            // Generate custom HTML
            let html = '<h1>Our Products</h1><div class="products">';
            for (const product of data.products) {
              html += `
                <div class="product">
                  <h2>${product.name}</h2>
                  <p>${product.description}</p>
                  <p class="price">$${product.price}</p>
                </div>
              `;
            }
            html += '</div>';
            return html;
          },
        },
      ],
    }),
  ],
});
*/

// Example src/content/about.json:
/*
{
  "title": "About Us",
  "description": "We are a company that builds great things.",
  "items": [
    "Founded in 2024",
    "10+ team members",
    "Based in San Francisco"
  ]
}
*/

// Example src/content/blog.md:
/*
# My Blog Post

This is a **simple** blog post written in *markdown*.

## Features

- Easy to write
- Converts to HTML
- Works great with SSG

[Read more](https://example.com)
*/

// Example src/content/products.json:
/*
{
  "products": [
    {
      "name": "Widget Pro",
      "description": "The best widget on the market",
      "price": 99.99
    },
    {
      "name": "Gadget Plus",
      "description": "A fantastic gadget for everyone",
      "price": 149.99
    }
  ]
}
*/

// Example index.html template:
/*
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Site</title>
  </head>
  <body>
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
      <a href="/blog">Blog</a>
      <a href="/products">Products</a>
    </nav>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
*/

// Example src/main.js (for client-side interactivity):
/*
// Add any client-side JavaScript here
console.log('Page loaded!');

// Example: Add click handlers after page loads
document.addEventListener('DOMContentLoaded', () => {
  // Your interactive code here
  const buttons = document.querySelectorAll('button');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      console.log('Button clicked!');
    });
  });
});
*/
