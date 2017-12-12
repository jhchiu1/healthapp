var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

//Define your schema: what fields will one exercise document will have
var taskSchema = new Schema( {
    text: String,
    dateCreated: Date,
    dateCompleted: Date,
    completed: Boolean,


user: { type: ObjectId, ref: 'User'}

});

// Compile taskSchema into Mongoose model object
var Task = mongoose.model('Task', taskSchema);


// And export the Task so our other code can use it
module.exports = Task;