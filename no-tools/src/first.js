const jsonLisp = `
(object
  (pair "name" "Misho")
  (pair "favorite games" (array "RftG" "Brass"))
)
`;

const htmlLisp = `
(article
  (:class "fancy")
  (h1 "Hello World")
  (p "lisp as an alternative to html")
)
`;

const cssLisp = `
(rule ".fancy"
  (set "border" "1px solid blue")
  (set "padding" "10px")
)
`;

const app = document.querySelector('#app');

if (app) {
  app.innerHTML += `
    <h2>we could have had lisp</h2>
    <p>html, json, yaml and many others can be expressed as lisp s-expressions!</p>
    ${codeSample("JSON written as Lisp:", jsonLisp)}
    ${codeSample("HTML written as Lisp:", htmlLisp)}
    ${codeSample("CSS written as Lisp:", cssLisp)}
    <h2>a unified web-stack</h2>
    <p>imagine if the web was build on a single elegant language</p>
  `
}

function codeSample(title, sample) {
  return `<div>
    <p>${title}</p>
    <pre><code>${sample.trim()}</code></pre>
  </div>`
}
