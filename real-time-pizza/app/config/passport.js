const LocalStrategy = require('passport-local').Strategy

const bcrypt = require('bcrypt')

const User = require('../models/user')

function init(passport){

    passport.use(new LocalStrategy({ usernameField: 'email'}, async(email, password, done)=>{
        //Login
        //check if email exists
        const user = await User.findOne({ email: email })
        if(!user){
            return done(null, false, { message: 'No user with this email'})
        }

        bcrypt.compare(password, user.password).then(match => {
           if(match) {
               return done(null, user, {message: 'Logged in succesfully'})
           }
           return done(null, false, {message: 'Wrong username or password'})
        }).catch(arr =>{
            return done(null, false, {message: 'something went wrong!'})
        })
    }))

    passport.serializeUser((user,done) =>{
        done(null,user._id)
    })

    passport.deserializeUser((id, done)=>{
        User.findOne({ _id: id }, (err, user)=>{
            done(err, user)
        })
    })

}

module.exports = init