const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');

const User = mongoose.model('User');

//handles the resquest from client side
//registers user for an account
module.exports.register = (req, res, next) => {
    var user = new User();
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.password = req.body.password;
    user.dateOfBirth = req.body.dateOfBirth;

    user.save((err, doc) => {
        if (!err)
            res.send(doc);
        else {
            if (err.code == 11000)
                res.status(422).send(['Duplicate email address found.']);
            else
                return next(err);
        }

    });
}

//implements authorisation using web tokens
module.exports.authenticate = (req, res, next) => {
    // call for passport authentication
    passport.authenticate('local', (err, user, info) => {       
        // error from passport middleware
        if (err) return res.status(400).json(err);
        // registered user
        else if (user) return res.status(200).json({ "token": user.generateJwt() });
        // unknown user or wrong password
        else return res.status(404).json(info);
    })(req, res);
}

//retrieves user account
module.exports.userProfile = (req, res, next) =>{
    User.findOne({ _id: req._id },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                return res.status(200).json({ status: true, user : _.pick(user,['_id','firstName','lastName','email','dateOfBirth']) });
        }
    );
}

//Updates user account
module.exports.updateUserAccount = (req, res, next) =>{
    User.findByIdAndUpdate(req.params.id, req.body, 
        (err, user) => {
            if (err) {
                return res.status(500).send({error: "Problem with Updating the User account"})
            };
        res.send({success: "User account updated successfull"});
        })
  }

//Deletes user profile
module.exports.deleteUserAccount = (req, res, next) =>{

    User.findByIdAndDelete(req.params.id, (err, user) => {
        if(err){
          return res.status(500).send({error: "Problem with Deleting the User account"})
        }
        res.send({success: 'User account deleted successfully'})
      })

}
