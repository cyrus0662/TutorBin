const mongoose = require("../connection");

const todoSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.String,
    userId: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    details: { type: String, required: true, trim: true },
    dueDate: { type: Date }
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('todo', todoSchema);
