const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { isValidPassword } = require('mongoose-custom-validators')

var userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: 'First name can\'t be empty'
    },
    lastName: {
        type: String,
        required: 'Last name can\'t be empty'
    },
    email: {
        type: String,
        required: 'Email can\'t be empty',
        unique: true
    },
    dateOfBirth: {
        type: Date,
        required: 'hey DoB can\'t be empty',
        validate: {
            validator: function(v) {
              v.setFullYear(v.getFullYear()+18)
              const currentTime = new Date();
              currentTime.setHours(0,0,0,0);
              return v.getTime() <= currentTime.getTime();
            },
            message: 'You must be 18 years old.'
          },
          required: true
        
    },
    password: {
        type: String,
        required: 'Password can\'t be empty',
        //minlength: [4, 'Password must be atleast 8 character long'],
        validate: {
            validator: isValidPassword,
            message: 'Password must be atleast 10 characters long. It must also have at least: 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.'
        }        
    },
    saltSecret: String
});

// Custom validation for email
userSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

// Events
userSchema.pre('save', function (next) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => {
            this.password = hash;
            this.saltSecret = salt;
            next();
        });
    });
});


// Methods
userSchema.methods.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateJwt = function () {
    return jwt.sign({ _id: this._id},
        process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_EXP
    });
}



mongoose.model('User', userSchema);