'use strict'

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    body: { type: String, required: true },
    parentPost: { type: mongoose.Types.ObjectId, required: true, ref: "Post" },
    parentId: { type: mongoose.Types.ObjectId, ref: "Comment", default: null },
    author: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    likes: [{ type: mongoose.Types.ObjectId, required: true, ref: "User" }],
}, {
    timestamps: true
});

module.exports = mongoose.model("Comment", commentSchema);