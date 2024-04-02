'use strict'

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tagSchema = new Schema({
    name: { type: String, required: true },
    posts: [{ type: mongoose.Types.ObjectId, required: true, ref: "Post" }],
    followers: [{ type: mongoose.Types.ObjectId, ref: "User" }],
}, {
    timestamps: true
});

module.exports = mongoose.model("Tag", tagSchema); 