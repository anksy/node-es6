const path = require("path"),
	  jwt  = require("jsonwebtoken"),
	  _    = require("lodash"),

	  /**/
	  env    = require(path.resolve(`./app/config/env/${process.env.NODE_ENV}`)),
	  error  = require(path.resolve(`./app/config/libs/error`)),
	  mailer  = require(path.resolve(`./app/config/libs/mailer`)),


	  App  = require(path.resolve("./app/controllers/frontend/AppController")),


	  User = require(path.resolve("./app/models/User"));
	  OTP  = require(path.resolve("./app/models/OTP"));


class UserController extends App {
	constructor(){
		super();

		/**/
		this.login = this.login.bind(this);
		this.sendOTP = this.sendOTP.bind(this);
	}

	__if_valid_email(email){
		let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	}

	__random(){
	  let string = "12346790";
	  let rand = string.split('');
	  let shuffle = _.shuffle(rand);
	  let num = _.slice(shuffle,0,6);
	  return num.join("");
	}

	/**
	 * authenticate user against passed credentials
	 */
	login(req, res){
		let obj = req.body, match = [];
		/*Build conditions for User Login*/
		
		if(this.__if_valid_email(obj.username)){
			match.push({isEmailActive : true, email : obj.username});
		}else{
			match.push({"misc.socialId" : obj.username});
		}

		User.findOne({$and:match},
			{email:1,name:1,auth:1,status:1,password:1},
			(err, user) => {
				if(err) res.json({type:"error",message:error.oops(),errors:error.pull(err)});
				if(user){
					if(!user.status){
						return res.json({type:"error",message:error.oops(),errors:["Your account has been blocked by administator."]});
					}else if(user.password !== User.getPassword(obj.password,user.auth)){
						return res.json({type:"error",message:error.oops(),errors:["Invalid Username or Password."]});
					}else{
						let _user = {_id:user._id, name:user.name, email:user.email};
						let token = jwt.sign(_user, env.secret, {expiresIn: '14 days'});
						return res.json({type:"success",message:"Your credentials have been verified.",data:_user,token:token});
					}
				}else{
					return res.json({type:"error",message:error.oops(),errors:["We couldn't found your account."]});
				}
			}
		);		
	}

	register(req, res){
		let obj = req.body;

		OTP.findOne({
			email : (obj.email || null),
			//action : (obj.action || null),
		},{otp:1},(err, result) => {
			if(err) res.json({type:"error",message:error.oops(),errors:error.pull(err)});
			if(result) {
				/*setup extra fields*/
				/*user will come through verify state so verify */
				if(result.otp===obj.otp){
					obj.isEmailActive = true;
					let newUser = User(obj);
					newUser.save()
					.then(result=>{
						let token = jwt.sign({_id:result._id, firstname:result.firstname, lastname:result.lastname, birthdate:result.birthdate, email:result.email}, env.secret, {expiresIn:"14m"});
						return res.json({type:"success",message:"You've been registered successfully.",data:result,token:token});
					})
					.catch(err=>res.json({type:"error",message:error.oops(),errors:error.pull(err)}));
				}else{
					return res.json({type:"error",message:error.oops(),errors:["You've entered incorrect OTP."]});
				}	

			}else{
				return res.json({type:"error",message:error.oops(),errors:["We couldn't validate your account."]});
			}
		});
	}

	sendOTP(req, res){
		let obj = req.query, hash = this.__random();

		User.count({
			email : (obj.username || null),
			isEmailActive : true
		}, (err, count) => {
			if(err) res.json({type:"error",message:error.oops(),errors:error.pull(err)});

			if(count<1){
				OTP.findOneAndUpdate({
					email : obj.username,
				},{
					otp : hash
				},{
					new : true,
					upsert : true
				},(err, result) => {
					if(err) res.json({type:"error",message:error.oops(),errors:error.pull(err)});

					mailer.Email(obj.username,'otp','app/views/',{body:{otp:hash},subject:"Verify Your Email Address"});
					return res.json({type:"success",message:"OTP has been sent to your email address."});
				});
			}else{
				return res.json({type:"error",message:error.oops(),errors:["This email address is already exists."]});
			}
		});
	}

}

module.exports = UserController;