"use strict";

const express = require("express");
const bodyParser = require("body-parser");

/* chirayu add */
const grocerystat = 644;
const gasstat = 386;
const elecstat = 100;
const waterstat = 83;
var mgasstat = 0;
var mgrocerystat = 0;
var melecstat = 0;
var mwaterstat = 0;
var subject1;
var date1;
var subject2;
var date2;
var priority1, priority2;
var occasion;
var event_date;
var totalprice = 0;
var income;
var recurring;
var budget;
var savings;
var negsavings;
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
// If modifying these scopes, delete token.json.
//const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';



/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(auth) {
  const calendar = google.calendar({version: 'v3', auth});
  calendar.events.list({
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const events = res.data.items;
    if (events.length) {
      console.log('Upcoming 10 events:');
      events.map((event, i) => {
        const start = event.start.dateTime || event.start.date;
        console.log(`${start} - ${event.summary}`);
      });
    } else {
      console.log('No upcoming events found.');
    }
  });
}

function writeEvents(auth) {
  const calendar = google.calendar({version: 'v3', auth});
  var event = {
  'summary': occasion,
  'location': '800 Howard St., San Francisco, CA 94103',
  'description': 'A chance to hear more about Google\'s developer products.',
  'start': {
    'dateTime': event_date,
    'timeZone': 'America/New_York',
  },
  'end': {
    'dateTime': event_date,
    'timeZone': 'America/New_York', 
  },
  'recurrence': [
    'RRULE:FREQ=DAILY;COUNT=1'
  ],
  'attendees': [
    {'email': 'lpage@example.com'},
    {'email': 'sbrin@example.com'},
  ],
  'reminders': {
    'useDefault': false,
    'overrides': [
      {'method': 'email', 'minutes': 24 * 60},
      {'method': 'popup', 'minutes': 10},
    ],
  },
}; 

calendar.events.insert({
  auth: auth,
  calendarId: 'primary',
  resource: event,
}, function(err, event) {
  if (err) {
    console.log('There was an error contacting the Calendar service: ' + err);
    return;
  }
  console.log('Event created: %s', event.htmlLink);
});
}

/* chirayu add */

const restService = express();

class Assignment{
  constructor(subject, date, type){
    this.subject = subject; 
    this.date = date;
    this.type = type;
    var priority = 4 * date;
  }
  
}

restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);

restService.use(bodyParser.json());

restService.post("/money", function(req, res) {
  var item = req.body.queryResult.parameters.Item;
  var price = req.body.queryResult.parameters.Price;
  if(price == undefined){
    price = 0
  }
  totalprice = totalprice + price;
  console.log("at least we got here");
  mgasstat = req.body.queryResult.parameters.stat_gas;
  mgrocerystat = req.body.queryResult.parameters.stat_grocery;
  melecstat = req.body.queryResult.parameters.stat_electricity;
  mwaterstat = req.body.queryResult.parameters.stat_water;
  var savinggoal = req.body.queryResult.parameters.Savings_goal;
  if(mgasstat == undefined){
  if(totalprice == 0){
  income = req.body.queryResult.parameters.Income;
  occasion = req.body.queryResult.parameters.Occasion;
  budget = req.body.queryResult.parameters.Budget;
  event_date = req.body.queryResult.parameters.Event_Date;
  recurring = req.body.queryResult.parameters.Recurring_Expenses;
  savings = income - (recurring + budget);
  negsavings = -1 * savings;
  if(savings < 0){
  var speech =
    req.body.queryResult &&
    req.body.queryResult.parameters &&
    req.body.queryResult.parameters.income
      ? "good morning"
      : "Your events have been saved to your calendar and managed your financials for the week! You have lost $" + negsavings + ". Watch your budget next week. Your income is $" + income;
  }
  else{
  if(savings<savinggoal){
    var frag5 = " You weren't able to beat your saving goal! Try again next week.";
  }
  else{
    var frag5 = " You beat your savings goal successfully! Good job!";
  }
  var speech =
    req.body.queryResult &&
    req.body.queryResult.parameters &&
    req.body.queryResult.parameters.income
      ? "good morning"
      : "Your events have been saved to your calendar and managed your financials for the week! Your savings for this week are $" + savings + ". Your income is $" + income + "." + frag5;
  }
  }
  else{
     if(savings - totalprice > savinggoal){
      var speech =
      req.body.queryResult &&
      req.body.queryResult.parameters &&
      req.body.queryResult.parameters.income
        ? "good morning"
        : "You can buy this. Your savings are now $" + (savings - totalprice);
     }
     else{
     var speech =
      req.body.queryResult &&
      req.body.queryResult.parameters &&
      req.body.queryResult.parameters.income
        ? "good morning"
        : "This purchase is not recommended. Your savings, if you choose to buy it, would be $" + (savings - totalprice);
     }
  }
  }
  else{
    console.log("We've escaped orbit. Probe being destroyed. The world is about to end. This is the error to end all errors. Goodbye.")
    if(mgasstat>gasstat){
      var frag1 = " Your gas spending is above average. Try to reduce.";
    }
    else{
      var frag1 = " Your gas spending is below average. You're doing fine.";
    }
    if(mgrocerystat>grocerystat){
      var frag2 = " Your food spending is above average. Try to reduce.";
    }
    else{
      var frag2 = " Your food spending is below average. You're doing fine.";
    }
    if(melecstat>elecstat){
      var frag3 = " Your electricity spending is above average. Try to reduce.";
    }
    else{
      var frag3 = " Your electricity spending is below average. You're doing fine.";
    }
    if(mwaterstat>waterstat){
      var frag4 = " Your water spending is above average. Try to reduce.";
    }
    else{
      var frag4 = " Your water spending is below average. You're doing fine.";
    }
    var speech =
      req.body.queryResult &&
      req.body.queryResult.parameters &&
      req.body.queryResult.parameters.income
        ? "good morning"
        : frag1 + frag2 + frag3 + frag4;
  }
   
   
   
    
     
     
  // Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Calendar API.
 
  //authorize(JSON.parse(content), listEvents);

  authorize(JSON.parse(content), writeEvents);
});
  
/*chirayu add */
  
  
  return res.json({
    fulfillmentText: speech,
    source: "webhook-echo-sample"
  });
});

restService.post("/echo", function(req, res) {
  var speech =
    req.body.queryResult &&
    req.body.queryResult.parameters &&
    req.body.queryResult.parameters.firstName 
      ? req.body.queryResult.parameters.firstName + " " + req.body.queryResult.parameters.lastName
      : "Seems like some problem. Speak again.";
  
  /*** chirayu add */
  // Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // a client with credentials, then call the Google Calendar API.
 
  //authorize(JSON.parse(content), listEvents);

  authorize(JSON.parse(content), writeEvents);
});
  
/*chirayu add */
  
  return res.json({
    fulfillmentText: speech,
    source: "webhook-echo-sample"
  });
});

restService.post("/audio", function(req, res) {
  var speech = "";
  switch (req.body.result.parameters.AudioSample.toLowerCase()) {
    //Speech Synthesis Markup Language 
    case "music one":
      speech =
        '<speak><audio src="https://actions.google.com/sounds/v1/cartoon/slide_whistle.ogg">did not get your audio file</audio></speak>';
      break;
    case "music two":
      speech =
        '<speak><audio clipBegin="1s" clipEnd="3s" src="https://actions.google.com/sounds/v1/cartoon/slide_whistle.ogg">did not get your audio file</audio></speak>';
      break;
    case "music three":
      speech =
        '<speak><audio repeatCount="2" soundLevel="-15db" src="https://actions.google.com/sounds/v1/cartoon/slide_whistle.ogg">did not get your audio file</audio></speak>';
      break;
    case "music four":
      speech =
        '<speak><audio speed="200%" src="https://actions.google.com/sounds/v1/cartoon/slide_whistle.ogg">did not get your audio file</audio></speak>';
      break;
    case "music five":
      speech =
        '<audio src="https://actions.google.com/sounds/v1/cartoon/slide_whistle.ogg">did not get your audio file</audio>';
      break;
    case "delay":
      speech =
        '<speak>Let me take a break for 3 seconds. <break time="3s"/> I am back again.</speak>';
      break;
    //https://www.w3.org/TR/speech-synthesis/#S3.2.3
    case "cardinal":
      speech = '<speak><say-as interpret-as="cardinal">12345</say-as></speak>';
      break;
    case "ordinal":
      speech =
        '<speak>I stood <say-as interpret-as="ordinal">10</say-as> in the class exams.</speak>';
      break;
    case "characters":
      speech =
        '<speak>Hello is spelled as <say-as interpret-as="characters">Hello</say-as></speak>';
      break;
    case "fraction":
      speech =
        '<speak>Rather than saying 24+3/4, I should say <say-as interpret-as="fraction">24+3/4</say-as></speak>';
      break;
    case "bleep":
      speech =
        '<speak>I do not want to say <say-as interpret-as="bleep">F&%$#</say-as> word</speak>';
      break;
    case "unit":
      speech =
        '<speak>This road is <say-as interpret-as="unit">50 foot</say-as> wide</speak>';
      break;
    case "verbatim":
      speech =
        '<speak>You spell HELLO as <say-as interpret-as="verbatim">hello</say-as></speak>';
      break;
    case "date one":
      speech =
        '<speak>Today is <say-as interpret-as="date" format="yyyymmdd" detail="1">2017-12-16</say-as></speak>';
      break;
    case "date two":
      speech =
        '<speak>Today is <say-as interpret-as="date" format="dm" detail="1">16-12</say-as></speak>';
      break;
    case "date three":
      speech =
        '<speak>Today is <say-as interpret-as="date" format="dmy" detail="1">16-12-2017</say-as></speak>';
      break;
    case "time":
      speech =
        '<speak>It is <say-as interpret-as="time" format="hms12">2:30pm</say-as> now</speak>';
      break;
    case "telephone one":
      speech =
        '<speak><say-as interpret-as="telephone" format="91">09012345678</say-as> </speak>';
      break;
    case "telephone two":
      speech =
        '<speak><say-as interpret-as="telephone" format="1">(781) 771-7777</say-as> </speak>';
      break;
    // https://www.w3.org/TR/2005/NOTE-ssml-sayas-20050526/#S3.3
    case "alternate":
      speech =
        '<speak>IPL stands for <sub alias="indian premier league">IPL</sub></speak>';
      break;
  }
  return res.json({
    speech: speech,
    displayText: speech,
    source: "webhook-echo-sample"
  });
});

restService.post("/video", function(req, res) {
  return res.json({
    speech:
      '<speak>  <audio src="https://www.youtube.com/watch?v=VX7SSnvpj-8">did not get your MP3 audio file</audio></speak>',
    displayText:
      '<speak>  <audio src="https://www.youtube.com/watch?v=VX7SSnvpj-8">did not get your MP3 audio file</audio></speak>',
    source: "webhook-echo-sample"
  });
});

restService.post("/slack-test", function(req, res) {
  var slack_message = {
    text: "Details of JIRA board for Browse and Commerce",
    attachments: [
      {
        title: "JIRA Board",
        title_link: "http://www.google.com",
        color: "#36a64f",

        fields: [
          {
            title: "Epic Count",
            value: "50",
            short: "false"
          },
          {
            title: "Story Count",
            value: "40",
            short: "false"
          }
        ],

        thumb_url:
          "https://stiltsoft.com/blog/wp-content/uploads/2016/01/5.jira_.png"
      },
      {
        title: "Story status count",
        title_link: "http://www.google.com",
        color: "#f49e42",

        fields: [
          {
            title: "Not started",
            value: "50",
            short: "false"
          },
          {
            title: "Development",
            value: "40",
            short: "false"
          },
          {
            title: "Development",
            value: "40",
            short: "false"
          },
          {
            title: "Development",
            value: "40",
            short: "false"
          }
        ]
      }
    ]
  };
  return res.json({
    speech: "speech",
    displayText: "speech",
    source: "webhook-echo-sample",
    data: {
      slack: slack_message
    }
  });
});

restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});
