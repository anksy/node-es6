'use strict';
const path 	 		= require('path'),
	async 	 		= require('async'),
	_ 				= require('lodash'),
	fs 				= require('fs'),
	mongoose 		= require('mongoose'),
	slugify			= require('slugify'),
	OS              = require('os'),
    iplocation      = require('iplocation'),
    browser 		= require('detect-browser'),
    MAILER          = require(path.resolve('./config/libs/mailer')),
    DATE            = require(path.resolve('./config/libs/date')),
    User            = require(path.resolve('./app/models/users')),
	ObjectId		= require("mongoose").Types.ObjectId,
  	config 			= require(path.resolve(`./config/env/${process.env.NODE_ENV}`));


let noTrailingSlash = function noTrailing(string){
	//return string.replace(/\/$/, "");
	return string;
}

let IMG = function IMG(file){
	return (file)?noTrailingSlash(config.base_url)+file:"";
}

let image = function image(file){
	return (file)?(config.base_url.replace(/\/+$/, ''))+file:"";
}


let IPCleanUP = function IPCleanUP(IP){
	return _.replace(IP,"::ffff:","");
}

let noUploads = function noUploads(path){
	return _.replace(path,"./uploads/","");
}

module.exports = {
	IMG : (file) => {
		return IMG(file);
	},
	image : (file) => {
		return image(file);
	},
	replaceBase : (uri) => {
		if(!uri) return "";
		return uri.replace(config.base_url,"");
	},
	IPCleanUP : (IP) => {
		return IPCleanUP(IP);
	},
	noUploads : (path) => {
		return noUploads(path);
	},
	onOffToggle : (ID, online) => {
		User.findOneAndUpdate({
			_id : new ObjectId(ID)
		},{
			online : online
		},(err, result)=>{
			if(result) return true; else return false;
		});
	},
	CallUserForLocationIfNew : (IP, ID) => {
		return new Promise((resolve, reject)=>{
			User.findOne({
				_id : new ObjectId(ID),
			},{
				name : 1,
				email : 1,
				isEmailActive : 1,
				usedIPs : 1,
				image : 1
			}, (err, user) => {
				if(user){
					resolve(user);
				}else{
					reject("No User Found");
				}
			});
		})
		.then(user=>{
			if(user.usedIPs && user.usedIPs.indexOf(IPCleanUP(IP)) < 0){
				User.update({
					_id : new ObjectId(ID),
				},{
					$push : {
						usedIPs : IPCleanUP(IP)
					}
				},(err, result) => {
					if(result.ok===1){
						if(user.isEmailActive && user.email){
							iplocation(IP)
							.then(result => {
								let mainContent = {
									name : user.name,
									os   : OS.type(),
									email : user.email,
									image : IMG(result.image),
									date  : DATE.format("MMMM Do YYYY, h:mm:ss a"),
									browser : browser.name
								};
								let all = _.merge(mainContent, result);
								MAILER.Email(user.email,'new_device','public/template',{body:all,subject:"Taskygig - Sign In from new device"});
							});
						}
						return true;
					}else{
						return false;
					}
				});
			}
		})
		.catch(err=>false);
	},

	reportTypes : () => {
		let reports = [
			{id:41888, title:"Appraisal Update/Form 1004D"},
			{id:38381, title:"Conventional Full Appraisal - SFR "},
	        {id:61509, title:"RUSH FEE"},
	        {id:38382, title:"FHA Appraisal - SFR - (Form 1004 and 1004MC)"},
	        {id:54723, title:"Condominium Appraisal (FHA) (Form 1073 and 1004MC)"},
	        {id:52621, title:"FHA Appraisal-Rent Schedule(Form 1004, 1004MC,1007)"},
	        {id:40253, title:"USDA - (Form 1004 and 1004MC) USDA verbiage"},
	        {id:38387, title:"Condominium Appraisal (Conventional) (Form 1073 and 1004MC)"},
	        {id:36401, title:"Investment Property - Conv - (Form 1004, 216,1007 and 1004MC)"},
	        {id:54888, title:"Condominium (Investment) - Conv - (Form 1073, 1004MC, 216,1007)"},
	        {id:38384, title:"Final Inspection Report (Form 1004D) by Appraiser"},
	        {id:56179, title:"Fannie Mae  Homestyle Conventional Renovation- UAD - (Form 1004 and 1004MC)"},
	        {id:40004, title:"FHA Final Inspection by HUD Fee Inspector (form 92051)"},
	        {id:61473, title:"Conv Jumbo Appraisal (1004 &amp; 1004MC)"},
	        {id:49929, title:"203K Appraisal and Addenda (FHA)  (Form 1004 and 1004MC)"},
	        {id:38383, title:"Exterior Only Appraisal (Form 2055)"},
	        {id:56513, title:"Revovation Loan - Draw Inspection"},
	        {id:38385, title:"Drive-by Summary (Form 2075)"},
	        {id:41118, title:"Small Residential Income Property -Conv-(Form 1025, 1004MC) 2-4 Family"},
	        {id:50545, title:"AVM"},
	        {id:38386, title:"Lot Only Appraisal - (Land Form)"},
	        {id:38388, title:"Field Review Report (Form 2000)"},
	        {id:38389, title:"Appraisal Desk Review [06/13] Form DRF3"},
	        {id:54918, title:"Disaster Area Inspection Report (Form DAIR)"},
	        {id:38390, title:"Multifamily -(From 1025, 1004MC)- Triplex/Fourplex"},
	        {id:56833, title:"1004D Final Inspection (Form 1004D)"},
	        {id:54912, title:"Comparable Rent Schedule (Form 1007)"},
	        {id:54954, title:"Conv - Manufactured Home Appraisal (Form 1004C and 1004MC)"},
	        {id:55828, title:"Draw Inspection"},
	        {id:54955, title:"FHA - Manufactured Home (Form 1004C and 1004MC)"}
		];

		return reports;
	},

	loanType : () => {
		let loanTypes = [
			{id:33,title:"Asset Valuation"},
	        {id:32,title:"Cash-out"},
	        {id:9,title:"Conventional"},
	        {id:86,title:"Conventional Insured"},
	        {id:88,title:"Conventional Uninsured"},
	        {id:12,title:"FHA"},
	        {id:85,title:"FMHA"},
	        {id:90,title:"HARP"},
	        {id:62,title:"LTV"},
	        {id:34,title:"N/A"},
	        {id:87,title:"No Loan"},
	        {id:4, title:"Other"},
	        {id:27,title:"Reverse Mortgage"},
	        {id:29,title:"USDA"},
	        {id:13,title:"VA"}
		];

		return loanTypes;
	},

	intendedUse : () => {
		let intended = [
			{id:1,title:"Market Value"},
	        {id:2,title:"Purchase"},
	        {id:3,title:"Refinance"},
	        {id:4,title:"Other"},
	        {id:5,title:"Market Value for Lender Purposes"},
	        {id:6,title:"Lease Hold Value"},
	        {id:7,title:"Lease Fee"},
	        {id:8,title:"Market Value Subject To"},
	        {id:9,title:"Conventional"},
	        {id:10,title:"Home Equity Line of Credit"},
	        {id:11,title:"Line of Credit"},
	        {id:12,title:"FHA"},
	        {id:13,title:"VA"},
	        {id:14,title:"CMHC"},
	        {id:15,title:"Foreclosure"},
	        {id:16,title:"REO"},
	        {id:17,title:"Relocation/Anticipated Sales Price"},
	        {id:18,title:"Divorce"},
	        {id:19,title:"Pre-Sale Buyer"},
	        {id:20,title:"Pre-Sale Seller"},
	        {id:21,title:"Estate Valuation"},
	        {id:22,title:"Auction"},
	        {id:23,title:"HELOC"},
	        {id:24,title:"Loan Mod"},
	        {id:25,title:"New Construction"},
	        {id:26,title:"No Equity Loan"},
	        {id:27,title:"Reverse Mortgage"},
	        {id:28,title:"Construction to Permanent"},
	        {id:29,title:"USDA"},
	        {id:30,title:"Tax Appeal"},
	        {id:31,title:"USDA Rural"},
	        {id:32,title:"Cash-out"},
	        {id:33,title:"Asset Valuation"},
	        {id:34,title:"N/A"},
	        {id:35,title:"Market Value and Liquidation Value"},
	        {id:36,title:"FHA 203k"},
	        {id:37,title:"Short Sale Assessment"},
	        {id:38,title:"Portfolio Analysis"},
	        {id:39,title:"List Price Determination"},
	        {id:40,title:"Accuracy of Value (QC)"},
	        {id:58,title:"Investment Property"},
	        {id:59,title:"Retrospective Value"},
	        {id:62,title:"LTV"},
	        {id:77,title:"Construction"},
	        {id:78,title:"Renewal"},
	        {id:79,title:"Short-term Extension"},
	        {id:80,title:"Modification"},
	        {id:81,title:"Collateral Monitoring"},
	        {id:85,title:"FMHA"},
	        {id:86,title:"Conventional Insured"},
	        {id:87,title:"No Loan"},
	        {id:88,title:"Conventional Uninsured"},
	        {id:90,title:"HARP"}
		];

		return intended;
	},

	appraiserType : () => {
		let appraiserType = [
			{id:4,title:"Certified General Appraiser"},
	        {id:3,title:"Certified Residential Appraiser"},
	        {id:2,title:"Residential Licensed Appraiser"}
		];
		return appraiserType;
	},


	propertyType : () => {
		let propertyType = [
			{id:1,title:"Condo"},
	        {id:2,title:"Manufactured"},
	        {id:3,title:"Mobile Home"},
	        {id:4,title:"Multi-Family"},
	        {id:5,title:"SFR"},
	        {id:6,title:"Single Family Attached"},
	        {id:7,title:"Single Family Detached"},
	        {id:8,title:"Vacation Home"}
		];

		return propertyType;
	},

	dueDate : () => {
		let dueDate = [
			{id:1,title:"Within 24 Hours"},
	        {id:7,title:"Within 1 week"},
	        {id:14,title:"Within 2 weeks"}
		];

		return dueDate;
	},

	occupancy : () => {
		let occupancy = [
		   {id:1,title:"Primary Residence"},
	       {id:2,title:"Second Home"},
	       {id:3,title:"Rental (non-owner occupied)"},
	       {id:4,title:"Owner"},
	       {id:5,title:"Vacant"},
	       {id:6,title:"Tenant"},
	       {id:7,title:"Unknown"},
	       {id:8,title:"Mixed"},
	       {id:9,title:"Investment"},
	       {id:10,title:"Abandoned"},
	       {id:11,title:"Adverse Occupied"},
	       {id:12,title:"Removed or Destroyed"},
	       {id:13,title:"Other"},
	       {id:14,title:"Tenant - Single"},
	       {id:15,title:"Tenant - Multi"},
	       {id:16,title:"None"},
	       {id:17,title:"Investor"},
	       {id:18,title:"100% Owner Occupied"},
	       {id:19,title:"<= 50% Owner Occupied"},
	       {id:20,title:"> 50% Owner Occupied"},
	       {id:21,title:"Tenant Occupied - 100%"},
	       {id:22,title:"Owner &amp; Tenant Occupied"}
		];

		return occupancy;
	},

	squareFootage : () => {
		let sqrt = [
		   {id:1,title:"Less than 1,000 sq ft"},
	       {id:2,title:"1,000 - 2,000 sq ft"},
	       {id:3,title:"2,000 - 3,000 sq ft"},
	       {id:4,title:"3,000 - 4,000 sq ft"},
	       {id:5,title:"4,000 - 5,000 sq ft"},
	       {id:6,title:"More than 5,000 sq ft"}
		];

		return sqrt;
	},

	status : () => {
		let status = [
		   {id:1,title:"Active"},
	       {id:2,title:"Inactive"}
		];
		
		return status;
	},

	AQB : () => {
		let aqb = [
		   {id:1,title:"Yes"},
	       {id:2,title:"No"}
		];
		
		return aqb;
	},

	disciplinaryAction : () => {
		let disciplinaryAction = [
			{id:1,title:"Yes"},
	        {id:2,title:"No"}
		];		
		return disciplinaryAction;
	},

	docType : () => {
		let docType = [
			{id:1,title:"Driving License"},
	        {id:2,title:"Passport"}
		];
		return docType;
	},

	inspectionType : () => {
		let inspectionType = [
			{id:1,title:"Inspection 1"},
	        {id:2,title:"Inspection 2"},
	        {id:3,title:"Inspection 3"},
	        {id:4,title:"Inspection 4"}
		];
		return inspectionType;
	},

	yourself : () => {
		let yourself = [
			{id:3,title:"Buyer Agent"},
			{id:1,title:"Customer"},
			{id:4,title:"Relocation co."},
	        {id:2,title:"Seller Agent"},
	        {id:5,title:"Other"}
		];
		return yourself;
	},

	states : () => {
		let states = [
					    {
					    	"id" : 1,
					        "name": "Alabama",
					        "abberv": "AL"
					    },
					    {
					    	"id" : 2,
					        "name": "Alaska",
					        "abberv": "AK"
					    },
					    {
					    	"id" : 3,
					        "name": "American Samoa",
					        "abberv": "AS"
					    },
					    {
					    	"id" : 4,
					        "name": "Arizona",
					        "abberv": "AZ"
					    },
					    {
					    	"id" : 5,
					        "name": "Arkansas",
					        "abberv": "AR"
					    },
					    {
					    	"id" : 6,
					        "name": "California",
					        "abberv": "CA"
					    },
					    {
					    	"id" : 7,
					        "name": "Colorado",
					        "abberv": "CO"
					    },
					    {
					    	"id" : 8,
					        "name": "Connecticut",
					        "abberv": "CT"
					    },
					    {
					    	"id" : 9,
					        "name": "Delaware",
					        "abberv": "DE"
					    },
					    {
					    	"id" : 10,
					        "name": "District Of Columbia",
					        "abberv": "DC"
					    },
					    {
					    	"id" : 11,
					        "name": "Federated States Of Micronesia",
					        "abberv": "FM"
					    },
					    {
					    	"id" : 12,
					        "name": "Florida",
					        "abberv": "FL"
					    },
					    {
					    	"id" : 13,
					        "name": "Georgia",
					        "abberv": "GA"
					    },
					    {
					    	"id" : 14,
					        "name": "Guam",
					        "abberv": "GU"
					    },
					    {
					    	"id" : 15,
					        "name": "Hawaii",
					        "abberv": "HI"
					    },
					    {
					    	"id" : 16,
					        "name": "Idaho",
					        "abberv": "ID"
					    },
					    {
					    	"id" : 17,
					        "name": "Illinois",
					        "abberv": "IL"
					    },
					    {
					    	"id" : 18,
					        "name": "Indiana",
					        "abberv": "IN"
					    },
					    {
					    	"id" : 19,
					        "name": "Iowa",
					        "abberv": "IA"
					    },
					    {
					    	"id" : 20,
					        "name": "Kansas",
					        "abberv": "KS"
					    },
					    {
					    	"id" : 21,
					        "name": "Kentucky",
					        "abberv": "KY"
					    },
					    {
					    	"id" : 22,
					        "name": "Louisiana",
					        "abberv": "LA"
					    },
					    {
					    	"id" : 23,
					        "name": "Maine",
					        "abberv": "ME"
					    },
					    {
					    	"id" : 24,
					        "name": "Marshall Islands",
					        "abberv": "MH"
					    },
					    {
					    	"id" : 25,
					        "name": "Maryland",
					        "abberv": "MD"
					    },
					    {
					    	"id" : 26,
					        "name": "Massachusetts",
					        "abberv": "MA"
					    },
					    {
					    	"id" : 27,
					        "name": "Michigan",
					        "abberv": "MI"
					    },
					    {
					    	"id" : 28,
					        "name": "Minnesota",
					        "abberv": "MN"
					    },
					    {
					    	"id" : 29,
					        "name": "Mississippi",
					        "abberv": "MS"
					    },
					    {
					    	"id" : 30,
					        "name": "Missouri",
					        "abberv": "MO"
					    },
					    {
					    	"id" : 31,
					        "name": "Montana",
					        "abberv": "MT"
					    },
					    {
					    	"id" : 32,
					        "name": "Nebraska",
					        "abberv": "NE"
					    },
					    {
					    	"id" : 33,
					        "name": "Nevada",
					        "abberv": "NV"
					    },
					    {
					    	"id" : 34,
					        "name": "New Hampshire",
					        "abberv": "NH"
					    },
					    {
					    	"id" : 35,
					        "name": "New Jersey",
					        "abberv": "NJ"
					    },
					    {
					    	"id" : 36,
					        "name": "New Mexico",
					        "abberv": "NM"
					    },
					    {
					    	"id" : 37,
					        "name": "New York",
					        "abberv": "NY"
					    },
					    {
					    	"id" : 38,
					        "name": "North Carolina",
					        "abberv": "NC"
					    },
					    {
					    	"id" : 39,
					        "name": "North Dakota",
					        "abberv": "ND"
					    },
					    {
					    	"id" : 40,
					        "name": "Northern Mariana Islands",
					        "abberv": "MP"
					    },
					    {
					    	"id" : 41,
					        "name": "Ohio",
					        "abberv": "OH"
					    },
					    {
					    	"id" : 42,
					        "name": "Oklahoma",
					        "abberv": "OK"
					    },
					    {
					    	"id" : 43,
					        "name": "Oregon",
					        "abberv": "OR"
					    },
					    {
					    	"id" : 44,
					        "name": "Palau",
					        "abberv": "PW"
					    },
					    {
					    	"id" : 45,
					        "name": "Pennsylvania",
					        "abberv": "PA"
					    },
					    {
					    	"id" : 46,
					        "name": "Puerto Rico",
					        "abberv": "PR"
					    },
					    {
					    	"id" : 47,
					        "name": "Rhode Island",
					        "abberv": "RI"
					    },
					    {
					    	"id" : 48,
					        "name": "South Carolina",
					        "abberv": "SC"
					    },
					    {
					    	"id" : 49,
					        "name": "South Dakota",
					        "abberv": "SD"
					    },
					    {
					    	"id" : 50,
					        "name": "Tennessee",
					        "abberv": "TN"
					    },
					    {
					    	"id" : 51,
					        "name": "Texas",
					        "abberv": "TX"
					    },
					    {
					    	"id" : 52,
					        "name": "Utah",
					        "abberv": "UT"
					    },
					    {
					    	"id" : 53,
					        "name": "Vermont",
					        "abberv": "VT"
					    },
					    {
					    	"id" : 54,
					        "name": "Virgin Islands",
					        "abberv": "VI"
					    },
					    {
					    	"id" : 55,
					        "name": "Virginia",
					        "abberv": "VA"
					    },
					    {
					    	"id" : 56,
					        "name": "Washington",
					        "abberv": "WA"
					    },
					    {
					    	"id" : 57,
					        "name": "West Virginia",
					        "abberv": "WV"
					    },
					    {
					    	"id" : 58,
					        "name": "Wisconsin",
					        "abberv": "WI"
					    },
					    {
					    	"id" : 59,
					        "name": "Wyoming",
					        "abberv": "WY"
					    }
					];
		return states;
	},

	building : () => {
		return {
			"buildingTypes" : [
				{ "id" : 1, "title" : "Office"},
				{ "id" : 2, "title" : "Retail"},
				{ "id" : 3, "title" : "Industrial"},
				{ "id" : 4, "title" : "Multifamily"},
				{ "id" : 5, "title" : "Hotel"},
				{ "id" : 6, "title" : "Special Purpose"}
			],
			"stories" : Array.from(Array(50), (_,x) => (x+1)),
			"rooms" : Array.from(Array(10), (_,x) => (x+1)),
			"bedrooms" : Array.from(Array(10), (_,x) => (x+1)),
		};
	},

	reasons : () => {
		return {
			"freelancer" : [
				{ "title" : "Fee related issue with client"},
				{ "title" : "Client was non-operative enough"},
				{ "title" : "No response from client. Zero Communication."}
			],
		};
	}
};