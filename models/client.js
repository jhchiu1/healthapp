var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

/* Information about a client, and dates this client's record was updated */

var clientSchema = new mongoose.Schema({
    first: { type: String, required: [true, 'Client FIRST name is required.'],
        unique: true,
        uniqueCaseInsensitive: true,
        validate: {
            validator: function(n) {
                return n.length >= 2;
            },
            message: '{VALUE} is not valid, client FIRST name must be at least 2 letters'
        }
    },             // Validation where unique client name required being at least 2 letters long.

    last: { type: String, required: [true, 'Client LAST name is required.'],
        unique: true,
        uniqueCaseInsensitive: true,
        validate: {
            validator: function(n) {
                return n.length >= 2;
            },
            message: '{VALUE} is not valid, client LAST name must be at least 2 letters'
        }
    },
    first: String,
    last: String,
    Male: { type: Boolean, default: false},        // Client male or female? Defaults to unchecked to indicate female

    height: {
        type: Number,
        min: [2, 'Should be at least 2 feet'],
        max: [10, 'Should not be more than 10 feet.'] },    // At least 24 inches, no more than 150 inches.
    weight: {
        type: Number,
        min: [50, 'Should be at least 50 lbs.'],
        max: [700, 'Should not be more than 700 lbs.'] },    // At least 50 lbs, no more than 700 lbs.
    heart: {
        type: Number,
        min: [30, 'Should be at least 30 bpm.'],
        max: [250, 'Should not be more than 250 bpm.'] },    // At least 30 bpm, no more than 250 bpm
    notes: String,
    datesUpdate: [ {
        type: Date,
        required: true,
        validate: {
            validator: function(d) {
                if (!d) { return false; }
                return d.getTime() <= Date.now();
            },
            message: 'Date must be a valid date. Date must be now or in the past.'
        }
    } ],  // An array of dates when client record was updated. Must be now, or in the past
});

var Client = mongoose.model('Client', clientSchema);
clientSchema.plugin(uniqueValidator);

module.exports = Client;

