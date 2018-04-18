function setDate() {
  var locale = 'en-US'
  var date = new Intl.DateTimeFormat(locale, { weekday: "long", month: "long", year: "numeric", day: "numeric" }).format()
  document.querySelector('.today').innerHTML = date
}

document.querySelector('.clear').addEventListener('click', function() {
  if (window.confirm('Do you really want to clear the daily planner?')) {
    var inputs = document.querySelectorAll('p[contenteditable]')
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].innerHTML = ''
    }
    setDate()
  }
})

setDate()
