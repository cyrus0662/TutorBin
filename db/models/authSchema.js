const mongoose = require("../connection");

const authSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.String,
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    phoneNumber: { type: Number, required: true }
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('auth', authSchema);
