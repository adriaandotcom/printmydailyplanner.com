function setItem(name, value) {
  if (!localStorage || !localStorage.getItem || typeof localStorage.getItem !== 'function') return
  localStorage.setItem(name, value)
}

// Get item form localStorage and convert to boolean when true or false
function getItem(name) {
  if (!localStorage || !localStorage.getItem || typeof localStorage.getItem !== 'function') return
  var item = localStorage.getItem(name)
  if (item === 'true' || item === 'false') return item === 'true'
  return item
}
