var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

/* Information about a client, and dates this client's record was updated */

var clientSchema = new mongoose.Schema({
    first: {
        type: String   },        // Validation where unique client name required being at least 2 letters long.

    last: {
        type: String
    },
    sex: {type: String },        // Client male or female? Defaults to unchecked to indicate female
    age: {
        type: Number
    },
    height: {
        type: Number
    },    // At least 24 inches, no more than 150 inches.
    weight: {
        type: Number

    },    // At least 50 lbs, no more than 700 lbs.
    heart: {
        type: Number

    },    // At least 30 bpm, no more than 250 bpm
    notes: String,
    //datesUpdate: {type: Date, default: Date.now},

    datesUpdate: [ {
        type: Date,

        default: Date.now
    } ],  // An array of dates when client record was updated. Must be now, or in the past
});

var Client = mongoose.model('Client', clientSchema);
clientSchema.plugin(uniqueValidator);

module.exports = Client;
