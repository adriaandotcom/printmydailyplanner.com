function convertDecimalToHours(decimal) {
  var minutes = 60 * (decimal % 1)
  if (minutes.toString().length === 1) minutes = '0' + minutes
  return Math.floor(decimal) + ':' + minutes
}

// Allow drag events on the calendar
var calendar = document.querySelector('.calendar')
var calHeight = calendar.clientHeight
var totalHours = calendar.querySelectorAll("li:not([class])").length - 1
var slotHeight = calHeight / (totalHours * 2)
var startYOffset, doCreateElement, listElement, calendarPlace

calendar.addEventListener('mousedown', function(event) {
  calendarPlace = calendar.getBoundingClientRect()
  startYOffset = event.pageY - calendarPlace.top - window.pageYOffset
  doCreateElement = event.target.className === ''
})

function createEventFromCursor(amountHours) {
  var startEvent = Math.floor(startYOffset / slotHeight)
  var top = 'calc(100% / ' + totalHours * 2 + ' * ' + startEvent + ' - 1px)'
  var height = 'calc(100 / ' + totalHours + ' * ' + amountHours + '% - 1px)'
  createEvent({ top: top, height: height })
}

function createEventFromFunction(startHours, hoursEnd, title) {
  var durationHours = (hoursEnd - 9) - (startHours - 9)
  var top = 'calc(100% / ' + totalHours + ' * ' + (startHours - 9) + ' - 1px)'
  var height = 'calc(100 / ' + totalHours + ' * ' + durationHours + '% - 1px)'
  var width = 'calc(100% - 40px)'
  var subtitle = convertDecimalToHours(startHours) + ' - ' + convertDecimalToHours(hoursEnd)
  createEvent({ top: top, height: height, width: width, removeElement: true, title: title, subtitle: subtitle })
}

function createEventGoogle(options) {
  var plannerStartHour = 9
  var plannerEndHour = 24
  var title = options.summary
  var start = options.start
  var startHours = start.getHours() + 1 / (60 / start.getMinutes())
  var end = options.end
  var endHours = end.getHours() + 1 / (60 / end.getMinutes())
  var hoursStart = (startHours <= plannerStartHour) ? plannerStartHour : startHours
  var hoursEnd = (endHours >= plannerEndHour) ? plannerEndHour : endHours
  if (hoursEnd < hoursStart) hoursEnd = plannerEndHour
  createEventFromFunction(hoursStart, hoursEnd, title)
}

function createEvent(options) {
  doCreateElement = false
  var startEvent = Math.floor(startYOffset / slotHeight)
  listElement = document.createElement('li')
  listElement.className = 'event'
  listElement.style.minHeight = (slotHeight - 1) + 'px'
  listElement.style.top = options.top
  listElement.style.height = options.height
  listElement.style.width = options.width || 'calc(100% - 20px)'

  if (options.title) {
    var heading = document.createElement('h3')
    heading.textContent = options.title
    listElement.appendChild(heading)
  }

  var p = document.createElement('p')
  p.textContent = options.subtitle || '00:00 - 00:00'
  listElement.appendChild(p)

  calendar.insertBefore(listElement, calendar.querySelectorAll('li')[1])
  if (options.removeElement) listElement = null
}

function resizeEvent(element, pageY) {
  document.body.style.cursor = 'ns-resize'
  var endYOffset = pageY - calendarPlace.top - window.pageYOffset
  var eventHeight = endYOffset - startYOffset
  var endEvent = Math.ceil(eventHeight / slotHeight)
  element.style.height = 'calc(100% / ' + totalHours * 2 + ' * ' + endEvent + ' - 1px)'
  calendar.insertBefore(listElement, calendar.querySelectorAll('li')[1])
}

document.addEventListener('mousemove', function(event) {
  if (!startYOffset) return
  if (doCreateElement) return createEventFromCursor(0.5)
  if (listElement) resizeEvent(listElement, event.pageY)
})

document.addEventListener('mouseup', function(event) {
  if (startYOffset && doCreateElement) createEventFromCursor(1)
  if (listElement) listElement.style.width = 'calc(100% - 40px)'
  document.body.style.cursor = 'inherit'
  startYOffset, listElement = null
})
