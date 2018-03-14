


export function prettyKeys (string) {
  const capitalized = string.charAt(0).toUpperCase() + string.slice(1);
  return capitalized.replace(/-/g, ' ')
}



export function debounce (func, m, timeoutContainer, timeoutKey = 'timeout') {
  if(timeoutContainer[timeoutKey]) {
    clearTimeout(timeoutContainer[timeoutKey])
  }

  timeoutContainer[timeoutKey] = setTimeout(func, m)
}



export function elipsize (text, length) {
  if(text.length > length) {
    return text.substr(0, length) + '...'
  } else {
    return text
  }
}