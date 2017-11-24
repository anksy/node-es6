const mongoose            =   require('mongoose'),
      path                =   require('path'),
      config              =   require(path.resolve(`./app/config/env/${process.env.NODE_ENV}`)),
      crypto              =   require('crypto'),
      _                   =   require('lodash'),
      ObjectId            =   mongoose.Types.ObjectId,
      uniqueValidator     =   require('mongoose-unique-validator'),
      schema              =   mongoose.Schema;

var userSchema = new schema({
    auth: String,
    firstname: String,
    lastname: String,
    name: String,
    email: {
        type : String,
        lowercase: true,
        trim : true,
        required: "Email address is required.", 
        unique: "This email address is already exists."
    },
    password: String,
    mobile: {
        type : String,
        trim : true,
        required: "Mobile number is required.", 
        unique: "This mobile number is already exists."
    },
    birthdate : String,
    status : {
        type : Boolean,
        default : true
    },
    isEmailActive : {
        type : Boolean,
        default : false
    },
    misc : {
        device : Array,
        source : {
            type : String,
            default : "web"
        },
        socialId : String
    }
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'         
    }
});

/**
 * Pre-Save Hook
 * Used to generate Private Key & Passwords
 * when new user created
 */
userSchema.pre('save', (next) => {
    this.name     = [this.firstname, this.lastname].join();
    this.auth     = crypto.randomBytes(16).toString('hex');
    this.password = this.encryptPassword(this.password, this.auth);
    next();
});

/**
 * encryptPassword - encrypt password 
 * by using crypto and mongoose methods
 * @param  {String} password [user password]
 * @param  {String} secret   [private key to encrypt data]
 * @return {[type]}          [encrypted password using user's Private key]
 */
userSchema.methods.encryptPassword = function(password, secret) {
    return crypto.createHmac('sha512', secret).update(password).digest('base64');
};


/* match password by using crypto and mongoose methods*/
userSchema.methods.matchPassword = function(password) {
    return this.password === this.encryptPassword(password);
};

/* encrypt password by using crypto and mongoose methods*/
userSchema.statics.getPassword = function(password, secret) {
    return crypto.createHmac('sha512', secret).update(password).digest('base64');
};

/* to update user device and token for push notification*/
userSchema.statics._device = function(_id, device){
    this.findOneAndUpdate({
        _id : _id
    },{
        $addToSet : {
            "device" : {
                type : device.type,
                token : device.token
            }
        }
    },(err, result) => {
        /*add device type and token*/
    });
}

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('user', userSchema);