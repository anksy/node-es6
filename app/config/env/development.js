'use strict';
const DS       = "/",
      PORT     = 5000,
      __DB     = "steward",
      base_url = "http://100.100.7.26:"+PORT+DS;

module.exports = {
  admin : {
    path : "/manager"
  },
  admin_base_url: base_url+"manager/",
  API : {
    site  : '/api/',
    admin : '/admin_api/' 
  },
  base_url: base_url,
  constants : {

  },
	db: {
    name : __DB,
		URL: "mongodb://localhost/"+__DB,
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
    from : "Steward",
    email : "no-reply@steward.com"
  },
  secret : new Buffer("@#$Ggf34#$Yfwv12&*_34sdVV5443g$#G$#TVS@#f3g2&^%JH#2fc2@@@@@^%f2f23f#@@#fg").toString('base64'),
  /*for sending emails*/
  sendgrid : {
    key : "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",
    username : "sandytasky",
    password : "flexsin1234567",
    emlUsed : "sandeep_singh@seologistics.com"
  },
  server: {
    PORT: PORT
  },
  MasterOTP : "FLEX",
  /*for Push notification*/
  APPLE : {
    production : false,
    key: "./key/ios/AuthKey_NZB5V74JF6.p8",
    keyId: "NZB5V74JF6",
    teamId: "6PECE4UB2Z",
    sound : "ping.aiff",
    topic : "com.Taskygig",
  },
  GOOGLE : {
    key : " AAAAEzeZww8:APA91bEaQm3ss-Ju_d_vF34TLxu_TIT9U_MZjzWpGITDaxQb43FHbkueAt4WR9TBhBJRIuKToraNbapkiuTn8vyHMOGpAR1QaR5DkhV15AC9yWnyEtNSP5vjqQ7bApp2BCgcTEvFqhbQ "
  }
};