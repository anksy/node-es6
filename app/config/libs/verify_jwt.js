'use strict';

const jwt 	= require('jsonwebtoken'),
	  PATH  = require('path'),
	  ERROR = require(PATH.resolve('./app/config/libs/error')),
	  env   = require(PATH.resolve(`./app/config/env/${process.env.NODE_ENV}`)),
	  SECRET= new Buffer(env.secret).toString('base64')

exports.run = (req, key, callback) => {
	let token = req.headers.authorization.replace('Bearer ', "");
	jwt.verify(token, key, function(err, decodedToekn){
		callback(decodedToekn);
	});
};

exports.verify = (req, res, callback) => {
	let token = req.headers.authorization.replace('Bearer ', "");
	jwt.verify(token, SECRET, (err, decodedToekn) => {
		let userId = req.body._id || req.query._id;
		if(!userId) return res.status(412).json({type:"error",message:ERROR.oops(),errors:["User id not provided."]});
		if(userId===decodedToekn._id){
			callback(decodedToekn);
		}else{
			return res.status(417).json({type:"error",message:"Invalid token",errors:[ERROR.jwt()]});
		}
	});
};