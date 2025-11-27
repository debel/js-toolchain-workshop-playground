import { setupCounter } from './counter.js'

const app = document.querySelector('#app');

if (app) {
  app.innerHTML += `
      <h2>No tools</h2>
      <p>we are just getting started!</p>
      <p>explore the project, run it, and then check the network tab to better understand what's going on!</p>
      <p>an example button (of course):</p>
      <button id="counter" type="button"></button>
  `;

  setupCounter(document.querySelector('#counter'), 0)
}
