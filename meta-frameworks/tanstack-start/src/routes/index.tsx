import { createFileRoute } from '@tanstack/react-router'

// @ts-ignore
import diagram from '../../../../vite-vanilla/assets/sample.diagram'

// @ts-ignore
import LispHTML from 'code-preview:../../../../vite-vanilla/assets/html.scm'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="p-2">
      <h3>Welcome Home!!!</h3>
      <div dangerouslySetInnerHTML={{ __html: diagram }} />
      <LispHTML title="imagine if html was lisp" />
    </div>
  )
}
