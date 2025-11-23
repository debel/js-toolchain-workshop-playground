import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  app.innerHTML += `
      <h2>Vite + TypeScript</h2>
      <a href="https://vite.dev" target="_blank">
        <img src="${viteLogo}" class="logo" alt="Vite logo" />
      </a>
      <a href="https://www.typescriptlang.org/" target="_blank">
        <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
      </a>
      <p>we've migrated our demo site to vite!</p>
      <p>explore the project, run it, and then check the network tab to better understand what's going on!</p>
      <p>an example button (of course):</p>
      <button id="counter" type="button"></button>
  `;

  setupCounter(document.querySelector<HTMLButtonElement>('#counter')!, 0)
}
