import './style.css'
// @ts-ignore
import diagram from '../assets/sample.diagram';
// @ts-ignore
import { msg } from './piped.js';

// @ts-ignore
const googl = comptime(() =>
  Math.pow(10, 10)
)

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  app.innerHTML += `
    <h2>making things should be fun</h2>
    <p>regarless of the tools and frameworks you use - never forget that making things should be fun!</p>
    <hr />
    <p>This number was calculated at build time using a custom plugin: ${googl}</p>
    <p>This string is generated using pipes in JS: ${msg}</p>
    <p>Check the source code for this diagram in 'assets/sample.diagram':</p>
    ${diagram}
  `
}
