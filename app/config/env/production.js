'use strict';
const DS       = "/",
      PORT     = 8018,
      base_url = "http://158.85.76.204:"+PORT+DS;

module.exports = {
  admin : {
    path : "/web-console"
  },
  admin_base_url: base_url+"web-console/",
  API : {
    site  : '/api/',
    admin : '/admin_api/' 
  },
  base_url: base_url,
  constants : {
    defaults : {
      usertype : "appraiser"
    },
    providers : ["company","individual"],
    freelancers : ["appraiser","inspector","trainee","apprentice"],
    mentors : ["appraiser","inspector"],
    trainees : ["trainee","apprentice"],
    radius:60,
    hour1 : 3600000
  },
  db: {
    URL: "mongodb://localhost/vern",
    options: {
      user: '',
      pass: ''
    }
  },
  debug_mongo: true,
  DS: "/",
  image_destination: 'uploads',
  image_dstn_w_slash : "./uploads/",
  image_extensions : {
    'image/jpeg' : '.jpg',
    'image/jpg' : '.jpg',
    'image/png' : '.png',
    'image/gif' : '.gif'
  },
  listing : {
    limit : 10
  },
  mail : {
    from : "TaskyGiG",
    email : "no-reply@taskygig.com"
  },
  secret : "Up4K5-1>l'9EvgBz9X/pT~]'MmLB@PHx`X}5_1`u=oye*on!dYrbJpRuTJ6Ar(r",
  /*for sending emails*/
  sendgrid : {
    key : "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",
    username : "sandytasky",
    password : "flexsin1234567",
    emlUsed : "sandeep_singh@seologistics.com"
  },
  server: {
    PORT: PORT,
    IO  : 8025
  },
  /*for sending messages*/
  twilio : {
    account : "AC9aba5be3870b30a5cfe129339cecf976",
    token   : "2df33f5ebe7d071ec93d5aa1441a69d5",
    number  : "+14243737791",
    code    : "+91",
    oneMore : "+14243737791@gaurav_varshney@seologistics.com"
  },
  /*for zestimate*/
  zillow : {
    //apiName: "GetDeepSearch-API",
    endpoint : "https://www.zillow.com/webservice/GetDeepSearchResults.htm",
    zid : "X1-ZWz1fzsxleq9l7_29gz1"
  },
  MAPKEY : "AIzaSyADmpwQx0N5RadyvDUpzVk_7Q05uk-chHg",
  MasterOTP : "FLEX",
  /*for dropbox upload*/
  dropbox : {
    accessKey : "hbwoua1ovcoryah",
    //created : "bhupendra_singh@seologistics.com"
  },
  /*for google drive upload*/
  googleDrive : {
    //created : "appraiserkumar@gmail.com",
    client : "82537202447-pl1r7fn2ju624l1stk2b3kis0p70oecf.apps.googleusercontent.com",
    secret : "RgPP93gQv_TFFODIS-Y_Zagj"
  },
  /*for Push notification*/
  APPLE : {
    production : false,
    key: "./key/ios/AuthKey_NZB5V74JF6.p8",
    keyId: "NZB5V74JF6",
    teamId: "6PECE4UB2Z",
    sound : "ping.aiff",
    topic : "com.Taskygig"
  },
  GOOGLE : {
    key : "GOOGLE_KEY_HERE"
  }
};