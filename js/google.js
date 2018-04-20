// Client ID and API key from the Developer Console
var CLIENT_ID = '358838261347-e0l5kiqr0r1f1g8p4bekplo6tn8s9m6q.apps.googleusercontent.com';
var API_KEY = 'AIzaSyAF5u2boPEEF5aSrb3ziMOrQ95mgxtdmJM';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

// var authorizeButton = document.getElementById('authorize-button');
// var signoutButton = document.getElementById('signout-button');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAutorizeClick;
  });
}

function updateSigninStatus(isSignedIn) {
  authorizeButton.removeAttribute('disabled');
  setItem('authorized', isSignedIn)
  if (isSignedIn) {
    authorizeButton.textContent = 'Disconnect Google Calendar';
    listUpcomingEvents();
  } else {
    authorizeButton.textContent = 'Import Google Calendar';
  }
}

function handleAutorizeClick() {
  var isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get()
  if (isSignedIn) gapi.auth2.getAuthInstance().signOut()
  else gapi.auth2.getAuthInstance().signIn()
  setItem('authorized', !isSignedIn)
}

function listUpcomingEvents() {
  var start = new Date(new Date().setHours(0,0,0,0)).toISOString()
  var end = new Date(new Date().setHours(23, 59, 59, 999)).toISOString()
  gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': start,
    'timeMax': end,
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 20,
    'orderBy': 'startTime'
  }).then(function(response) {
    var events = response.result.items;
    var summary = response.result.summary;

    // Google sometimes returns an email address instead of a name, so we want to
    // grab the part before the email: `vilie` of `vilie@example.com`
    if (summary.indexOf('@') > -1) summary = summary.split('@')[0];

    // Save the name and update the title
    setName(summary);

    for (i = 0; i < events.length; i++) {
      var event = events[i];
      var whenStart = event.start.dateTime;
      if (!whenStart) whenStart = event.start.date;
      var whenEnd = event.end.dateTime;
      if (!whenEnd) whenEnd = event.end.date;
      createEventGoogle({
        summary: event.summary,
        start: new Date(whenStart),
        end: new Date(whenEnd)
      })
    }
  });
}
