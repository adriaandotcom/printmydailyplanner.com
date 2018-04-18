var header = document.querySelector('.header h1 span')

function setName(name) {
  var title = getItem('title') || name.split(' ')[0] + "'s daily planner"
  if (!getItem('title')) setItem('title', title)
  header.textContent = title
}

header.addEventListener('blur', function(event) {
  setItem('title', event.target.textContent)
})

// Update title when saved
if (getItem('title')) setName(getItem('title'))
