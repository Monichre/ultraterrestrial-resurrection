// Defines a debounce function to limit the rate at which a function can fire.
export const debounce = (
  func: { apply: (arg0: undefined, arg1: any[]) => void },
  delay: number | undefined
) => {
  let timerId: string | number | NodeJS.Timeout | undefined // Holds a reference to the timeout between calls.
  return (...args: any) => {
    clearTimeout(timerId) // Clears the current timeout, if any, to reset the debounce timer.
    timerId = setTimeout(() => {
      func.apply(this, args) // Calls the passed function after the specified delay with the correct context and arguments.
    }, delay)
  }
}
