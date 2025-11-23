import renderJSON from './renderJson.js';
import renderMD from './renderMarkdown.ts';

// const output = renderJSON({
//   title: 'Shopping list',
//   items: ['Bread', 'Milk', 'Coffee'],
//   sections: [
//     {
//       title: 'About me',
//       age: 37,
//       favoriteGames: ['Race for the Galaxy', 'Brass']
//     },
//     {
//       title: 'My wife',
//       age: 28,
//     }
//   ]
// })
//
// console.log(output)

const md = `# test

[link](https://to.place/path)

## subtitle

- a
- b
- c
`

console.log(renderMD(md))
