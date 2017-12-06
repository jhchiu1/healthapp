var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

//Define your schema: what fields will one task document have
var taskSchema = new Schema( {
    text: String,
    dateCreated: Date,
    dateCompleted: Date,
    completed: Boolean,

    /* Reference to the user object who created this task
    Useful if we need to access info about the user from the task. */

    // Creator field added
    client: { type: ObjectId, ref: 'User'}
});

// Compile taskSchema into Mongoose model object
var Task = mongoose.model('Task', taskSchema);

// And export the Task so our other code can use it
module.exports = Task;
