var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = new mongoose.Schema({
    local: {
        username: String,
        password: String
    }
});

var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

/* Information about a client, and dates this client's record was updated */

var userSchema = new mongoose.Schema({
    first: {
        type: String, required: [true, 'User FIRST name is required.'],
        unique: true,
        uniqueCaseInsensitive: true,
        validate: {
            validator: function (n) {
                return n.length >= 2;
            },
            message: '{VALUE} is not valid, user FIRST name must be at least 2 letters'
        }
    },             // Validation where unique client name required being at least 2 letters long.

    last: {
        type: String, required: [true, 'User LAST name is required.'],
        unique: true,
        uniqueCaseInsensitive: true,
        validate: {
            validator: function (n) {
                return n.length >= 2;
            },
            message: '{VALUE} is not valid, user LAST name must be at least 2 letters'
        }
    },
    sex: {type: String, enum: ['Male', 'Female']},
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

var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

/* Information about a client, and dates this client's record was updated */

var userSchema = new mongoose.Schema({
    first: {
        type: String, required: [true, 'User FIRST name is required.'],
        unique: true,
        uniqueCaseInsensitive: true,
        validate: {
            validator: function (n) {
                return n.length >= 2;
            },
            message: '{VALUE} is not valid, user FIRST name must be at least 2 letters'
        }
    },             // Validation where unique client name required being at least 2 letters long.

    last: {
        type: String, required: [true, 'User LAST name is required.'],
        unique: true,
        uniqueCaseInsensitive: true,
        validate: {
            validator: function (n) {
                return n.length >= 2;
            },
            message: '{VALUE} is not valid, user LAST name must be at least 2 letters'
        }
    },
    sex: {type: String, enum: ['Male', 'Female']},
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

var User = mongoose.model('User', userSchema);
userSchema.plugin(uniqueValidator);

module.exports = User;