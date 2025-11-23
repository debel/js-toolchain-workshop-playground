/*
 * Generated with the help of claude sonnet 4.5
 */

import { normalizePath } from 'vite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const codePreviewPrefix = 'code-preview:';

// NOTE: this doesn't work because vite already exptects
// transformed code
// function renderToJsx(code, ext) {
//   return `
// export default function CodePreview({ title = "" } = {}) {
//   return (
//     <div className="code-preview">
//       {title && <p>{title}</p>}
//       <pre>
//         <code className="language-${ext}">${code}</code>
//       </pre>
//     </div>
//   );
// }
//   `;
// }

function renderToJsx(code, ext) {
  return `
import React from 'react';

export default function CodePreview({ title = "" } = {}) {
  return React.createElement('div', { className: 'code-preview' },
    title && React.createElement('p', null, title),
    React.createElement('pre', null,
      React.createElement('code', { 
        className: 'language-${ext}',
        dangerouslySetInnerHTML: { __html: ${JSON.stringify(code)} }
      })
    )
  );
}
  `;
}

function renderToHtmlNode(code, ext) {
  return `
export default function createCodePreview(title) {
  const container = document.createElement('div');
  container.className = 'code-preview';

  if (title) {
    const titleNode = document.createElement('p');
    titleNode.textContent = title;
    container.appendChild(titleNode);
  }

  const pre = document.createElement('pre');
  const code = document.createElement('code');
  code.className = 'language-${ext}';
  code.textContent = ${JSON.stringify(code)};

  pre.appendChild(code);
  container.appendChild(pre);

  return container;
}
  `;
}

function escapeHtml(code) {
  return code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default function codePreviewPlugin(options = {}) {
  const { output = 'html' } = options;

  return {
    name: 'vite-plugin-code-preview',
    enforce: 'pre',

    configureServer(server) {
      server.watcher.on('change', (file) => {
        const normalizedFile = normalizePath(file);

        const virtId = '\0' + codePreviewPrefix + normalizedFile;
        // Find virtual modules that reference this file
        const mod = server.moduleGraph.getModuleById(virtId);
        if (mod) {
          // Invalidate the virtual module and all its importers
          server.moduleGraph.invalidateModule(mod);

          // Force importers to reload
          mod.importers.forEach(importer => {
            server.moduleGraph.invalidateModule(importer);
          });

          // Trigger full reload
          server.ws.send({
            type: 'full-reload',
            path: '*'
          });
        }
      });
    },

    resolveId(id, importer) {
      if (id.startsWith(codePreviewPrefix)) {
        const filePath = id.slice(codePreviewPrefix.length);
        const realPath = importer
          ? resolve(importer, '..', filePath)
          : resolve(filePath)

        const virtId = '\0' + codePreviewPrefix + realPath;

        return virtId;
      }

      return null;
    },

    load(id) {
      if (!id.startsWith('\0' + codePreviewPrefix)) return null;

      const filePath = id.slice(codePreviewPrefix.length + 1);

      const fileContent = readFileSync(filePath, 'utf-8');
      const escapedCode = escapeHtml(fileContent);
      const ext = filePath.split('.').pop();

      if (output === 'jsx') {
        return {
          code: renderToJsx(escapedCode, ext),
          meta: { vite: { lang: 'jsx' } },
          map: null,
        };
      } else {

        return {
          code: renderToHtmlNode(fileContent, ext),
          map: null,
        };
      }
    },

    handleHotUpdate({ file, server }) {
      const normalizedFile = normalizePath(file);

      const virtualId = '\0' + codePreviewPrefix + normalizedFile;
      const mod = server.moduleGraph.getModuleById(virtualId);
      if (!mod) return;

      const modules = [mod];
      mod.importers.forEach(importer => modules.push(importer));

      return modules;
    },
  };
}

// Usage in vite.config.js:
// import codePreview from './vite-plugin-code-preview.js';
// 
// export default {
//   plugins: [
//     codePreview({ framework: 'html' }) // or 'jsx'/'react'
//   ]
// }
//
// Then import like:
// import CodePreview from 'code-preview:./myfile.js'
