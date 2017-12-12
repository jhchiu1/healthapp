var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

/* Information about a client, and dates this client's record was updated */

var userSchema = new mongoose.Schema({

    local: {
        username: String,
        password: String,
    },
    first: String,
    last: String,
    sex: {type: String, enum: ['Male', 'Female']
    },
    age: {
        type: Number,
        min: [5, 'Should be at least 5 years old'],
        max: [125, 'Should not be more than 125 years old.']
    },      // At least 5 years old, no more than 125 years old.
    height: {
        type: Number,
        min: [3, 'Should be at least 3 feet'],
        max: [10, 'Should not be more than 10 feet.']
    },    // At least 3 ft, no more than 10 ft.
    weight: {
        type: Number,
        min: [50, 'Should be at least 50 lbs.'],
        max: [700, 'Should not be more than 700 lbs.']
    },    // At least 50 lbs, no more than 700 lbs.
    heart: {
        type: Number,
        min: [30, 'Should be at least 30 bpm.'],
        max: [250, 'Should not be more than 250 bpm.']
    },    // At least 30 bpm, no more than 250 bpm
    notes: String,
    datesUpdate: {type: Date,
        required: true,
        default: Date.now,
        validate: {
            validator: function(d) {
                if (!d) { return false; }
                return d.getTime() <= Date.now();
            },
            message: 'Date must be a valid date. Date must be now or in the past.'
        }
    }  // An array of dates when client record was updated. Must be now, or in the past
});


userSchema.methods.generateHash = function(password) {
    // Create salted hash of plaintext password
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
}

userSchema.methods.validPassword = function(password) {
    // Compare password to stored password
    return bcrypt.compareSync(password, this.local.password);
}

var uniqueValidator = require('mongoose-unique-validator');
var User = mongoose.model('User', userSchema);
userSchema.plugin(uniqueValidator);


module.exports = User;