/*
 * Generated with the help of claude sonnet 4.5
 */

import { transformSync } from '@babel/core';

export default function comptimePlugin() {
  return {
    name: 'vite-plugin-comptime',

    transform(code, id) {
      // Only process JavaScript/TypeScript files
      if (!/\.[jt]sx?$/.test(id)) return null;

      // Check if code contains 'comptime' keyword
      if (!code.includes('comptime')) return null;

      try {
        const result = transformSync(code, {
          plugins: [comptimeBabelPlugin],
          filename: id,
          sourceMaps: true,
        });

        return {
          code: result.code,
          map: result.map,
        };
      } catch (error) {
        this.error(`Comptime transformation failed: ${error.message}`);
      }
    },
  };
}

function comptimeBabelPlugin({ types: t }) {
  return {
    visitor: {
      CallExpression(path) {
        if (!t.isIdentifier(path.node.callee, { name: 'comptime' })) {
          return;
        }

        const arg = path.node.arguments[0];

        if (!t.isArrowFunctionExpression(arg) && !t.isFunctionExpression(arg)) {
          throw path.buildCodeFrameError(
            'comptime() expects an arrow function as its argument'
          );
        }

        try {
          const fnCode = extractFunctionCode(arg);
          const result = evaluateComptime(fnCode);

          const resultNode = createLiteralNode(t, result);
          path.replaceWith(resultNode);
        } catch (error) {
          throw path.buildCodeFrameError(
            `Failed to evaluate comptime function: ${error.message}`
          );
        }
      },
    },
  };
}

function extractFunctionCode(fnNode) {
  // For arrow functions with expression body: () => expr
  if (fnNode.type === 'ArrowFunctionExpression' && fnNode.expression) {
    return `(${fnNode.body.type === 'Identifier'
      ? fnNode.body.name
      : generateCode(fnNode.body)})`;
  }

  // For arrow functions with block body: () => { return expr; }
  const body = fnNode.body;
  if (body.type === 'BlockStatement') {
    const statements = body.body.map(stmt => generateCode(stmt)).join('\n');
    return `(function() { ${statements} })()`;
  }

  return generateCode(body);
}

function generateCode(node) {
  switch (node.type) {
    case 'StringLiteral':
      return JSON.stringify(node.value);
    case 'NumericLiteral':
      return String(node.value);
    case 'BooleanLiteral':
      return String(node.value);
    case 'NullLiteral':
      return 'null';
    case 'Identifier':
      return node.name;
    case 'BinaryExpression':
      return `(${generateCode(node.left)} ${node.operator} ${generateCode(node.right)})`;
    case 'CallExpression':
      const callee = generateCode(node.callee);
      const args = node.arguments.map(generateCode).join(', ');
      return `${callee}(${args})`;
    case 'MemberExpression':
      const obj = generateCode(node.object);
      const prop = node.computed
        ? `[${generateCode(node.property)}]`
        : `.${node.property.name}`;
      return `${obj}${prop}`;
    case 'ReturnStatement':
      return `return ${generateCode(node.argument)}`;
    case 'ObjectExpression':
      const props = node.properties.map(p =>
        `${p.key.name}: ${generateCode(p.value)}`
      ).join(', ');
      return `{ ${props} }`;
    case 'ArrayExpression':
      const elements = node.elements.map(generateCode).join(', ');
      return `[${elements}]`;
    default:
      throw new Error(`Unsupported node type: ${node.type}`);
  }
}

function evaluateComptime(code) {
  // Provide safe built-in APIs for comptime execution
  const context = {
    Date,
    Math,
    JSON,
    String,
    Number,
    Boolean,
    Array,
    Object,
    console,
  };

  // Create function with controlled scope
  const fn = new Function(
    ...Object.keys(context),
    `return ${code};`
  );

  // Execute with context
  return fn(...Object.values(context));
}

function createLiteralNode(t, value) {
  if (value === null) return t.nullLiteral();
  if (value === undefined) return t.identifier('undefined');

  switch (typeof value) {
    case 'string':
      return t.stringLiteral(value);
    case 'number':
      return t.numericLiteral(value);
    case 'boolean':
      return t.booleanLiteral(value);
    case 'object':
      if (Array.isArray(value)) {
        return t.arrayExpression(value.map(v => createLiteralNode(t, v)));
      }
      const properties = Object.entries(value).map(([key, val]) =>
        t.objectProperty(t.identifier(key), createLiteralNode(t, val))
      );
      return t.objectExpression(properties);
    default:
      throw new Error(`Cannot convert ${typeof value} to AST node`);
  }
}

// Example vite.config.js usage:
/*
import { defineConfig } from 'vite';
import comptimePlugin from './vite-plugin-comptime.js';

export default defineConfig({
  plugins: [comptimePlugin()],
});
*/

// Example usage in your code:
/*
// Build timestamp
const buildTime = comptime(() => new Date().toISOString());

// Computed constants
const apiVersion = comptime(() => '1.0.' + Math.floor(Date.now() / 1000));

// Environment-based config
const isProd = comptime(() => process.env.NODE_ENV === 'production');

// Complex computations
const config = comptime(() => ({
  version: '2.0.0',
  build: Date.now(),
  features: ['auth', 'api', 'ui']
}));

console.log('Built at:', buildTime);
*/
