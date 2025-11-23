import { transform } from "@babel/core"

const jsRegex = /\.js$/;

export default function () {
  return {
    name: 'babel-in-dev-and-prod',
    enforce: "pre",
    transform: {
      filter: {
        id: jsRegex,
      },
      handler(code) {
        return transform(code, {
          plugins: [
            ['@babel/plugin-proposal-pipeline-operator',
              { proposal: 'hack', topicToken: '@@' },]
          ],
        })
      }
    }
  };
}
