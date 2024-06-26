'use strict';

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    receiver: { type: Schema.Types.ObjectId, ref: "User" },
    post: { type: Schema.Types.ObjectId, ref: "Post" },
    comment: { type: Schema.Types.ObjectId, ref: "Comment" },
    notificationType: { type: String, enum: ["like", "comment", "follow"] },
    read: { type: Boolean, default: false },
}, {
    timestamps: true
});

module.exports = mongoose.model("Notification", notificationSchema); 