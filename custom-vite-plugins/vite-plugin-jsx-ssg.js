/*
 * Generated with the help of claude sonnet 4.5
 */

import fs from 'fs/promises';
import path from 'path';
import { createServer } from 'vite';

/**
 * Vite plugin for Static Site Generation
 * Pre-renders specified routes to static HTML at build time
 * 
 * @param {Object} options - Plugin options
 * @param {string[]} options.routes - Array of routes to pre-render (e.g., ['/about', '/contact'])
 * @param {string} options.entry - Path to the app entry file (default: '/src/main.jsx')
 * @param {Function} options.render - Custom render function (optional)
 */
export default function ssgPlugin(options = {}) {
  const {
    routes = ['/'],
    entry = '/src/main.jsx',
    render = null,
  } = options;

  let config;
  let isSSG = false;

  return {
    name: 'vite-plugin-ssg',

    configResolved(resolvedConfig) {
      config = resolvedConfig;
      // Only run SSG during build
      isSSG = config.command === 'build';
    },

    async closeBundle() {
      if (!isSSG) return;

      console.log('\n🔨 Starting static site generation...\n');

      const outDir = config.build.outDir;
      const root = config.root;

      try {
        // Create a Vite server for SSR
        const vite = await createServer({
          root,
          server: { middlewareMode: true },
          appType: 'custom',
        });

        // Load the entry module
        const entryPath = path.join(root, entry);
        const { render: appRender } = await vite.ssrLoadModule(entryPath);

        // Use custom render function or the one from entry
        const renderFn = render || appRender;

        if (!renderFn) {
          throw new Error(
            'No render function found. Export a "render" function from your entry file or provide one in plugin options.'
          );
        }

        // Read the built index.html template
        const templatePath = path.join(outDir, 'index.html');
        const template = await fs.readFile(templatePath, 'utf-8');

        // Pre-render each route
        for (const route of routes) {
          console.log(`  ✓ Rendering ${route}`);

          // Render the app for this route
          const appHtml = await renderFn(route);

          // Inject rendered content into template
          const html = template.replace(
            '<div id="app"></div>',
            `<div id="app">${appHtml}</div>`
          );

          // Determine output file path
          const filePath = getOutputPath(outDir, route);

          // Ensure directory exists
          await fs.mkdir(path.dirname(filePath), { recursive: true });

          // Write the pre-rendered HTML
          await fs.writeFile(filePath, html);
        }

        await vite.close();

        console.log(`\n✨ Successfully pre-rendered ${routes.length} routes\n`);
      } catch (error) {
        console.error('SSG Error:', error);
        throw error;
      }
    },
  };
}

/**
 * Convert route to file system path
 * / -> index.html
 * /about -> about/index.html
 * /blog/post -> blog/post/index.html
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
import preact from '@preact/preset-vite';
import ssgPlugin from './vite-plugin-ssg.js';

export default defineConfig({
  plugins: [
    preact(),
    ssgPlugin({
      routes: ['/', '/about', '/contact', '/blog'],
      entry: '/src/main.jsx',
    }),
  ],
});
*/

// Example src/main.jsx for Preact:
/*
import { h, render } from 'preact';
import { App } from './App';

// Client-side hydration
if (typeof window !== 'undefined') {
  render(<App />, document.getElementById('app'));
}

// Server-side render function for SSG
export async function render(url) {
  const { render: renderToString } = await import('preact-render-to-string');
  return renderToString(<App url={url} />);
}
*/

// Example src/App.jsx:
/*
import { h } from 'preact';
import { useState } from 'preact/hooks';

export function App({ url = '/' }) {
  const [count, setCount] = useState(0);

  // Simple router based on URL
  const getPageContent = () => {
    switch (url) {
      case '/':
        return (
          <div>
            <h1>Home Page</h1>
            <p>Welcome to the home page!</p>
          </div>
        );
      case '/about':
        return (
          <div>
            <h1>About Page</h1>
            <p>This is the about page.</p>
          </div>
        );
      case '/contact':
        return (
          <div>
            <h1>Contact Page</h1>
            <p>Get in touch with us!</p>
          </div>
        );
      default:
        return <div><h1>404 Not Found</h1></div>;
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <nav style={{ marginBottom: '20px' }}>
        <a href="/" style={{ marginRight: '10px' }}>Home</a>
        <a href="/about" style={{ marginRight: '10px' }}>About</a>
        <a href="/contact">Contact</a>
      </nav>

      {getPageContent()}

      <div style={{ marginTop: '40px' }}>
        <h3>Interactive Counter (for hydration test)</h3>
        <button onClick={() => setCount(count + 1)}>
          Count: {count}
        </button>
      </div>
    </div>
  );
}
*/

// Example for React (instead of Preact):
/*
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

// Client-side hydration
if (typeof window !== 'undefined') {
  ReactDOM.hydrateRoot(document.getElementById('app'), <App />);
}

// Server-side render function
export async function render(url) {
  const ReactDOMServer = await import('react-dom/server');
  return ReactDOMServer.renderToString(<App url={url} />);
}
*/

// Required dependencies:
/*
npm install -D preact preact-render-to-string
// OR
npm install -D react react-dom
*/
