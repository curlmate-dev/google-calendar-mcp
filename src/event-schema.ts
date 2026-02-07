export const EventSchema = {
  "summary": "string",
  "description": "string",
  "location": "string",
  "colorId": "string",

  "start": {
    "date": "YYYY-MM-DD",
    "dateTime": "RFC3339 timestamp",
    "timeZone": "IANA timezone"
  },

  "end": {
    "date": "YYYY-MM-DD",
    "dateTime": "RFC3339 timestamp",
    "timeZone": "IANA timezone"
  },

  "endTimeUnspecified": false,

  "recurrence": [
    "RRULE:FREQ=WEEKLY;COUNT=10"
  ],

  "attendees": [
    {
      "email": "string",
      "displayName": "string",
      "optional": false
    }
  ],

  "guestsCanInviteOthers": true,
  "guestsCanModify": false,
  "guestsCanSeeOtherGuests": true,
  "anyoneCanAddSelf": false,

  "visibility": "default | public | private",
  "transparency": "opaque | transparent",

  "reminders": {
    "useDefault": false,
    "overrides": [
      {
        "method": "email | popup",
        "minutes": 30
      }
    ]
  },

  "extendedProperties": {
    "private": {
      "key": "value"
    },
    "shared": {
      "key": "value"
    }
  },

  "conferenceData": {
    "createRequest": {
      "requestId": "string",
      "conferenceSolutionKey": {
        "type": "hangoutsMeet"
      }
    }
  },

  "attachments": [
    {
      "fileUrl": "string",
      "title": "string",
      "mimeType": "string"
    }
  ],

  "source": {
    "url": "string",
    "title": "string"
  },

  "eventType": "default | workingLocation | outOfOffice | focusTime"
}
