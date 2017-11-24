const path = require("path");

class App {

	constructor(){
		//console.log("from App cont. constructor");
		this.welcome = "Welcome to NodeJS ES6";
	}

	callme(){
		console.log("init app controler");
	}
}

module.exports = App;