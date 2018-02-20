


export function prettyKeys (string) {
  const capitalized = string.charAt(0).toUpperCase() + string.slice(1);
  return capitalized.replace(/-/g, ' ')
}



export function debounce (func, m, timeout) {
  if(timeout) {
    clearTimeout(timeout)
  }

  timeout = setTimeout(func, m)
}