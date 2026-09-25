export default function progressPromise<T>(
  promises: Promise<T>[],
  tickCallback: (progress: number, total: number) => void
): Promise<T[]> {
  let progress = 0
  const total = promises.length

  function tick(promise: Promise<T>): Promise<T> {
    return promise
      .then((result) => {
        progress++
        tickCallback(progress, total)
        return result
      })
      .catch((reason) => {
        console.error(reason)
        throw reason
      })
  }

  return Promise.all(promises.map(tick))
}
