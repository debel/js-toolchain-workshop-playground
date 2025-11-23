import './style.css'

// @ts-ignore
import jsonLisp from 'code-preview:../assets/json.scm'
// @ts-ignore
import htmlLisp from 'code-preview:../assets/html.scm'
// @ts-ignore
import cssLisp from 'code-preview:../assets/css.scm'

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  app.innerHTML += `
    <h2>we could have had lisp</h2>
    <p>html, json, yaml and many others can be expressed as lisp s-expressions!</p>
  `
  app.appendChild(jsonLisp("JSON written as Lisp:"))
  app.appendChild(htmlLisp("HTML written as Lisp:"))
  app.appendChild(cssLisp("CSS written as Lisp:"))

  app.innerHTML += `
      <h2>a unified web-stack</h2>
      <p>imagine if the web was build on a single elegant language</p>
  `
}
