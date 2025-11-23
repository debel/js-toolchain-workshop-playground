export function setupCounter(element: HTMLButtonElement, initial: number) {
  let counter = initial;
  const setCounter = (count: number) => {
    counter = count
    element.innerHTML = `count is ${counter}`
  }
  element.addEventListener('click', () => setCounter(counter + 1))
  setCounter(initial)
}
