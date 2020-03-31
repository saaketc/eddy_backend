const mongoose = require('mongoose');
const joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true, maxlength: 255 },
    password: { type: String, required: true, maxlength: 255, minlength: 6 },
   
    firstName: String,
    lastName: String,
    enrolledCourses:[String]
    
    
});
// user access token generation
// set key using config & env variable 

    userSchema.methods.generateToken = function () {
        const token = jwt.sign({ _id: this._id, firstName: this.firstName, lastName: this.lastName, notes: this.notes }, 'jwtKeyForThinkinLoop');
        return token;
    }    
                    const validateUser = (user) => {
                        const schema = {
                           
                            email: joi.string().required().max(255),
                            password: joi.string().min(6).max(255),
                        }
                        return joi.validate(user, schema);
}
                    
const User = mongoose.model('User', userSchema);


module.exports.User = User;
module.exports.validate = validateUser;