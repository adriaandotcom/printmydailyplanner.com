var authorized = getItem('authorized')
var authorizeButton = document.getElementById('authorize-button')
authorizeButton.textContent = (authorized ? 'Disconnect' : 'Import') + ' Google Calendar'
